// Supabase Edge Function: ebook-download
// Public GET endpoint the storefront calls once an order shows PAID.
// Re-checks the order's status server-side (never trusts the client) and,
// only if it is PAID, mints a short-lived signed URL against the private
// `ebooks` Storage bucket. Nothing about the file is ever public.
//
// Accepts ?orderId=<uuid> or ?ref=<checkout_request_id>, mirroring the
// order-status function's lookup so the frontend can reuse whichever
// identifier it already has in state.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'
import { corsHeaders, handleOptions, jsonResponse } from '../_shared/cors.ts'

const BASE_URL = Deno.env.get('BASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('BASE_SERVICE_ROLE_KEY')!

// Where the ebook file lives inside the private `ebooks` bucket. Override
// via secret if you name/organize the file differently.
const EBOOK_BUCKET = Deno.env.get('EBOOK_BUCKET') || 'ebooks'
const EBOOK_FILE_PATH =
  Deno.env.get('EBOOK_FILE_PATH') || 'rising-without-losing-yourself.pdf'

// How long the signed link stays valid. Kept short since a fresh one is
// minted on every legitimate request.
const SIGNED_URL_TTL_SECONDS = 60 * 10

const supabase = createClient(BASE_URL, SERVICE_ROLE_KEY)

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

  const query = supabase.from('orders').select('id, status').limit(1)
  const { data: orders, error } = orderId
    ? await query.eq('id', orderId)
    : await query.eq('checkout_request_id', ref)

  if (error || !orders || orders.length === 0) {
    return jsonResponse({ error: 'Order not found' }, 404)
  }

  const order = orders[0]

  if (order.status !== 'PAID') {
    return jsonResponse(
      { error: 'This order has not been marked as paid yet.' },
      403,
    )
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(EBOOK_BUCKET)
    .createSignedUrl(EBOOK_FILE_PATH, SIGNED_URL_TTL_SECONDS)

  if (signError || !signed) {
    console.error('Signed URL creation failed', signError)
    return jsonResponse(
      { error: 'Could not prepare your download right now. Please try again shortly.' },
      500,
    )
  }

  return jsonResponse({
    url: signed.signedUrl,
    expiresIn: SIGNED_URL_TTL_SECONDS,
  })
})