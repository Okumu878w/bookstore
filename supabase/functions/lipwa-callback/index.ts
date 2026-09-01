// Supabase Edge Function: lipwa-callback
// Public webhook that Lipwa Hub calls with payment.success / payment.failed
// events. This is the ONLY thing allowed to mark an order PAID — a
// customer-supplied M-Pesa code is never treated as proof of payment.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { corsHeaders, handleOptions, jsonResponse } from '../_shared/cors.ts'

const BASE_URL = Deno.env.get('BASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('BASE_SERVICE_ROLE_KEY')!
// Optional: if Lipwa signs callbacks with a shared secret/header, set this
// and verify it below before trusting the payload.
const LIPWA_WEBHOOK_SECRET = Deno.env.get('LIPWA_WEBHOOK_SECRET')

const supabase = createClient(BASE_URL, SERVICE_ROLE_KEY)

interface LipwaCallbackPayload {
  event: 'payment.success' | 'payment.failed' | string
  api_ref?: string
  checkout_id?: string
  checkout_request_id?: string
  mpesa_receipt?: string
  amount?: number
  reason?: string
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  if (LIPWA_WEBHOOK_SECRET) {
    const signature = req.headers.get('x-lipwa-signature')
    if (signature !== LIPWA_WEBHOOK_SECRET) {
      return jsonResponse({ error: 'Invalid signature' }, 401)
    }
  }

  let payload: LipwaCallbackPayload
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const orderRef = payload.api_ref
  const checkoutId = payload.checkout_id || payload.checkout_request_id

  if (!orderRef && !checkoutId) {
    return jsonResponse({ error: 'Missing api_ref or checkout_id' }, 400)
  }

  const query = supabase.from('orders').select('*').limit(1)
  const { data: orders, error: findError } = orderRef
    ? await query.eq('order_ref', orderRef)
    : await query.eq('checkout_request_id', checkoutId)

  if (findError || !orders || orders.length === 0) {
    console.error('Callback: order not found', { orderRef, checkoutId, findError })
    // Respond 200 so Lipwa doesn't retry indefinitely for an order we'll
    // never find, but log it for manual investigation.
    return jsonResponse({ received: true, matched: false })
  }

  const order = orders[0]

  // Idempotency: a webhook that arrives twice (or after the order already
  // reached a terminal state) should not re-process.
  if (order.status === 'PAID' || order.status === 'DISPATCHED' || order.status === 'DELIVERED') {
    return jsonResponse({ received: true, matched: true, alreadyProcessed: true })
  }

  if (payload.event === 'payment.success') {
    if (typeof payload.amount === 'number' && Number(payload.amount) !== Number(order.amount)) {
      console.error('Callback amount mismatch', {
        orderRef: order.order_ref,
        expected: order.amount,
        received: payload.amount,
      })
      await supabase
        .from('orders')
        .update({ status: 'FAILED' })
        .eq('id', order.id)
        .eq('status', order.status) // guard against a race with another callback
      return jsonResponse({ received: true, matched: true, amountMismatch: true })
    }

    await supabase
      .from('orders')
      .update({
        status: 'PAID',
        mpesa_receipt: payload.mpesa_receipt || null,
      })
      .eq('id', order.id)
      .eq('status', order.status)

    return jsonResponse({ received: true, matched: true })
  }

  if (payload.event === 'payment.failed') {
    await supabase
      .from('orders')
      .update({ status: 'FAILED' })
      .eq('id', order.id)
      .eq('status', order.status)

    return jsonResponse({ received: true, matched: true })
  }

  return jsonResponse({ received: true, matched: true, ignored: true })
})
