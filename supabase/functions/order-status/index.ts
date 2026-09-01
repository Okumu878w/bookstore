// Supabase Edge Function: order-status
// Public GET endpoint the storefront polls while waiting for the Lipwa
// webhook. Reads via the service role key (public client has no direct
// table access) and returns only the minimal fields the UI needs.
//
// Accepts either ?orderId=<uuid> or ?ref=<checkout_request_id>, matching
// the build spec's `GET /api/status?ref={checkout_id}` fallback endpoint.
// If the order has been sitting in PAYMENT_INITIATED for a while and the
// webhook hasn't arrived, this also checks Lipwa's transaction status API
// directly and reconciles the order if a final result is available.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { corsHeaders, handleOptions, jsonResponse } from '../_shared/cors.ts'

const BASE_URL = Deno.env.get('BASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('BASE_SERVICE_ROLE_KEY')!
const LIPWA_API_KEY = Deno.env.get('LIPWA_API_KEY')!

const supabase = createClient(BASE_URL, SERVICE_ROLE_KEY)

const STALE_MS = 20_000 // only bother checking Lipwa directly after this long

Deno.serve(async (req) => {
  const preflight = handleOptions(req)
  if (preflight) return preflight

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const url = new URL(req.url)
  const orderId = url.searchParams.get('orderId')
  const ref = url.searchParams.get('ref') // checkout_request_id

  if (!orderId && !ref) {
    return jsonResponse({ error: 'Provide orderId or ref' }, 400)
  }

  const query = supabase.from('orders').select('*').limit(1)
  const { data: orders, error } = orderId
    ? await query.eq('id', orderId)
    : await query.eq('checkout_request_id', ref)

  if (error || !orders || orders.length === 0) {
    return jsonResponse({ error: 'Order not found' }, 404)
  }

  let order = orders[0]

  const isStale =
    order.status === 'PAYMENT_INITIATED' &&
    order.checkout_request_id &&
    Date.now() - new Date(order.updated_at).getTime() > STALE_MS

  if (isStale) {
    try {
      const statusRes = await fetch(
        `https://pay.lipwa.app/api/payments/${encodeURIComponent(order.checkout_request_id)}`,
        { headers: { Authorization: `Bearer ${LIPWA_API_KEY}` } },
      )
      if (statusRes.ok) {
        const statusData = await statusRes.json()
        const resultStatus: string | undefined = statusData.status ?? statusData.result

        if (resultStatus === 'success' || resultStatus === 'completed') {
          const { data: updated } = await supabase
            .from('orders')
            .update({ status: 'PAID', mpesa_receipt: statusData.mpesa_receipt || null })
            .eq('id', order.id)
            .eq('status', 'PAYMENT_INITIATED')
            .select()
            .single()
          if (updated) order = updated
        } else if (resultStatus === 'failed' || resultStatus === 'cancelled') {
          const { data: updated } = await supabase
            .from('orders')
            .update({ status: 'FAILED' })
            .eq('id', order.id)
            .eq('status', 'PAYMENT_INITIATED')
            .select()
            .single()
          if (updated) order = updated
        }
      }
    } catch (err) {
      // Non-fatal — the webhook may still land, or the client will retry.
      console.error('Lipwa status check failed', err)
    }
  }

  return jsonResponse({
    status: order.status,
    orderRef: order.order_ref,
  })
})
