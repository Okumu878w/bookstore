// Supabase Edge Function: create-order
// Public endpoint. Runs with the service role key server-side only — the
// service role key never reaches the browser. Validates the order, writes
// it to Postgres, and (for STK orders) triggers a Lipwa Hub STK push.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { corsHeaders, handleOptions, jsonResponse } from '../_shared/cors.ts'
import { normalizeKenyanPhone } from '../_shared/phone.ts'

const PRICE_PER_COPY = 1000
const MAX_QUANTITY = 50

const BASE_URL = Deno.env.get('BASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('BASE_SERVICE_ROLE_KEY')!
const LIPWA_API_KEY = Deno.env.get('LIPWA_API_KEY')!
const LIPWA_CHANNEL_ID = Deno.env.get('LIPWA_CHANNEL_ID')!
const LIPWA_CALLBACK_URL = Deno.env.get('LIPWA_CALLBACK_URL')!

const supabase = createClient(BASE_URL, SERVICE_ROLE_KEY)

interface CreateOrderBody {
  name?: string
  phone?: string
  quantity?: number
  location?: string
  paymentMethod?: 'stk' | 'till_manual'
  mpesaCodeSubmitted?: string
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  let body: CreateOrderBody
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const name = (body.name || '').trim()
  const location = (body.location || '').trim()
  const quantity = Number(body.quantity) || 1
  const paymentMethod = body.paymentMethod === 'till_manual' ? 'till_manual' : 'stk'

  if (name.length < 2) {
    return jsonResponse({ error: 'Please provide your full name.' }, 400)
  }
  if (location.length < 2) {
    return jsonResponse({ error: 'Please provide a delivery or collection location.' }, 400)
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    return jsonResponse({ error: `Quantity must be between 1 and ${MAX_QUANTITY}.` }, 400)
  }

  const normalizedPhone = normalizeKenyanPhone(body.phone || '')
  if (!normalizedPhone) {
    return jsonResponse(
      { error: 'Please provide a valid Safaricom number (07XX, 01XX, or 2547XX).' },
      400,
    )
  }

  const amount = PRICE_PER_COPY * quantity

  const { data: order, error: insertError } = await supabase
    .from('orders')
    .insert({
      name,
      phone: normalizedPhone,
      quantity,
      location,
      amount,
      payment_method: paymentMethod,
      status: 'PENDING',
      mpesa_code_submitted: body.mpesaCodeSubmitted || null,
    })
    .select()
    .single()

  if (insertError || !order) {
    console.error('Order insert failed', insertError)
    return jsonResponse({ error: 'Could not create your order. Please try again.' }, 500)
  }

  // Till-fallback orders don't trigger an STK push — they wait for a human
  // to reconcile the manually-paid transaction against the Till number.
  if (paymentMethod === 'till_manual') {
    return jsonResponse({
      message: 'Order received. We will confirm your payment shortly.',
      orderId: order.id,
      orderRef: order.order_ref,
    })
  }

  try {
    const lipwaRes = await fetch('https://pay.lipwa.app/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LIPWA_API_KEY}`,
      },
      body: JSON.stringify({
        amount,
        phone_number: normalizedPhone,
        channel_id: LIPWA_CHANNEL_ID,
        callback_url: LIPWA_CALLBACK_URL,
        api_ref: order.order_ref,
      }),
    })

    const lipwaData = await lipwaRes.json()

    if (!lipwaRes.ok) {
      await supabase.from('orders').update({ status: 'FAILED' }).eq('id', order.id)
      console.error('Lipwa STK push failed', lipwaData)
      return jsonResponse(
        { error: 'Could not start the M-Pesa payment. Please try again or use Till 8731216.' },
        502,
      )
    }

    const checkoutRequestId = lipwaData.checkout_request_id ?? lipwaData.CheckoutRequestID ?? null
    const merchantRequestId = lipwaData.merchant_request_id ?? lipwaData.MerchantRequestID ?? null

    await supabase
      .from('orders')
      .update({
        status: 'PAYMENT_INITIATED',
        checkout_request_id: checkoutRequestId,
        merchant_request_id: merchantRequestId,
      })
      .eq('id', order.id)

    return jsonResponse({
      message: 'Check your phone for the M-PESA prompt.',
      orderId: order.id,
      orderRef: order.order_ref,
      checkoutRequestId,
    })
  } catch (err) {
    console.error('Lipwa request error', err)
    await supabase.from('orders').update({ status: 'FAILED' }).eq('id', order.id)
    return jsonResponse(
      { error: 'Could not reach the payment provider. Please try again shortly.' },
      502,
    )
  }
})
