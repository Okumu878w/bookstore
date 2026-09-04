import { useEffect, useRef, useState } from 'react'
import { EDGE_FUNCTIONS_URL } from '../lib/supabaseClient'
import { isLikelyKenyanPhone, formatPhoneHint } from '../lib/phone'
import { getCurrentPrice, getCurrentTier, getTierLabel } from '../lib/pricing'
import type { CreateOrderResponse, OrderStatus } from '../types'

const PRICE = getCurrentPrice()
const TIER = getCurrentTier()
const TIER_LABEL = getTierLabel(TIER)

const TILL_NUMBER = '8731216'

type PaymentMethod = 'stk' | 'till_manual'
type FlowState = 'form' | 'submitting' | 'awaiting-pin' | 'till-submitted' | 'paid' | 'failed'

const statusCopy: Record<string, string> = {
  PENDING: 'Order created. Sending the payment prompt…',
  PAYMENT_INITIATED: 'Check your phone and enter your M-Pesa PIN.',
  PAID: 'Payment received. Thank you — your order is confirmed.',
  FAILED: "That payment didn't go through.",
  CANCELLED: 'The payment prompt was cancelled.',
}

export default function GetYourCopy() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stk')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [location, setLocation] = useState('')
  const [mpesaCode, setMpesaCode] = useState('')
  const [flow, setFlow] = useState<FlowState>('form')
  const [error, setError] = useState<string | null>(null)
  const [orderRef, setOrderRef] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  async function pollStatus(id: string) {
    let attempts = 0
    pollRef.current = setInterval(async () => {
      attempts += 1
      try {
        const res = await fetch(
          `${EDGE_FUNCTIONS_URL}/order-status?orderId=${encodeURIComponent(id)}`,
          {
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
            },
          },
        )
        if (res.ok) {
          const data: { status: OrderStatus } = await res.json()
          if (data.status === 'PAID') {
            setFlow('paid')
            stopPolling()
            return
          }
          if (data.status === 'FAILED' || data.status === 'CANCELLED') {
            setFlow('failed')
            setError(statusCopy[data.status])
            stopPolling()
            return
          }
        }
      } catch {
        // Network hiccup mid-poll — keep trying until timeout below.
      }
      // Stop after ~2 minutes (24 attempts * 5s) and let the customer fall
      // back to the Till option; the webhook may still resolve it later.
      if (attempts >= 24) {
        stopPolling()
        setFlow('failed')
        setError(
          `This is taking longer than expected. If you completed the M-Pesa prompt, your order will still be marked paid shortly — otherwise, try again or switch to Till ${TILL_NUMBER} above.`,
        )
      }
    }, 5000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }
    if (!isLikelyKenyanPhone(phone)) {
      setError(`Enter a valid M-Pesa phone number (${formatPhoneHint()}).`)
      return
    }
    if (location.trim().length < 2) {
      setError('Let us know a delivery or collection location.')
      return
    }

    setFlow('submitting')
    try {
      const res = await fetch(`${EDGE_FUNCTIONS_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
        },
        body: JSON.stringify({
          name,
          phone,
          quantity,
          location,
          paymentMethod,
          ...(paymentMethod === 'till_manual'
            ? { mpesaCodeSubmitted: mpesaCode || undefined }
            : {}),
        }),
      })

      const data: CreateOrderResponse & { error?: string } = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Could not submit your order. Please try again.')
      }

      setOrderRef(data.orderRef)

      if (paymentMethod === 'till_manual') {
        setFlow('till-submitted')
      } else {
        setFlow('awaiting-pin')
        pollStatus(data.orderId)
      }
    } catch (err) {
      setFlow('failed')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  function resetForm() {
    stopPolling()
    setFlow('form')
    setError(null)
    setOrderRef(null)
    setMpesaCode('')
  }

  const total = PRICE * quantity

  return (
    <section id="copy" className="border-t border-line/70 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label mb-5">Pre-Order Your Copy</p>
 <h2 className="max-w-sm font-serif text-3xl leading-tight text-ink sm:text-4xl">
   Pre-Order Your Copy
 </h2>
 {TIER === 'early-bird' && (
    <p className="mt-4 inline-block border border-gold/50 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-dark">

     {TIER_LABEL} — Ends 15 Sept 2026
    </p>
  )}
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink/70">
              {TIER_LABEL}: KSh {PRICE.toLocaleString()} per copy. Pay instantly
              with an M-Pesa prompt, or pay directly to our Till and confirm
              below.
              Please note that Transport/delivery fees are not included in the price and will be charged separately.
            </p>
          </div>

          <div className="max-w-lg border border-line bg-cream p-8 sm:p-10">
            {flow === 'form' || flow === 'submitting' ? (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Payment method
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stk')}
                      className={`border px-3 py-2.5 text-sm font-semibold transition-colors ${
                        paymentMethod === 'stk'
                          ? 'border-ink bg-ink text-cream'
                          : 'border-line bg-white text-ink/70 hover:border-ink/40'
                      }`}
                    >
                      M-Pesa prompt
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('till_manual')}
                      className={`border px-3 py-2.5 text-sm font-semibold transition-colors ${
                        paymentMethod === 'till_manual'
                          ? 'border-ink bg-ink text-cream'
                          : 'border-line bg-white text-ink/70 hover:border-ink/40'
                      }`}
                    >
                      Pay via Till
                    </button>
                  </div>
                </div>

                <Field label="Full name">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    placeholder="Jane Wanjiru"
                    required
                  />
                </Field>
                <Field label="M-Pesa phone number">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                    placeholder={formatPhoneHint()}
                    required
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Quantity">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Math.min(20, Number(e.target.value) || 1)))
                      }
                      className="input"
                      required
                    />
                  </Field>
                  <Field label="Total">
                    <div className="input flex items-center bg-ink/5 font-semibold text-ink">
                      KSh {total.toLocaleString()}
                    </div>
                  </Field>
                </div>
                <Field label="Delivery or collection location">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="input"
                    placeholder="e.g. Nairobi CBD, or a pickup point"
                    required
                  />
                </Field>

                {paymentMethod === 'till_manual' && (
                  <>
                    <div className="border border-gold/50 bg-gold/10 px-5 py-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-muted">
                        Buy Goods Till Number
                      </span>
                      <p className="mt-1 font-serif text-2xl text-ink">{TILL_NUMBER}</p>
                      <p className="mt-2 text-xs text-ink/60">
                        Pay KSh {total.toLocaleString()} to the Till above, then
                        submit this form so we can match your payment to your
                        order.
                      </p>
                    </div>
                    <Field label="M-Pesa message code (optional)">
                      <input
                        type="text"
                        value={mpesaCode}
                        onChange={(e) => setMpesaCode(e.target.value)}
                        className="input"
                        placeholder="e.g. QCX7Y2AB4C"
                      />
                      <span className="mt-1.5 block text-xs text-ink/45">
                        This helps our team reconcile faster — orders are only
                        marked paid once we've verified the transaction.
                      </span>
                    </Field>
                  </>
                )}

                {error && (
                  <p className="text-sm text-red-700" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-gold w-full" disabled={flow === 'submitting'}>
                  {flow === 'submitting'
                    ? paymentMethod === 'stk'
                      ? 'Starting payment…'
                      : 'Submitting…'
                    : paymentMethod === 'stk'
                      ? `Pay KSh ${total.toLocaleString()} with M-Pesa`
                      : 'Submit order for reconciliation'}
                </button>
              </form>
            ) : (
              <StatusPanel
                flow={flow}
                orderRef={orderRef}
                error={error}
                onReset={resetForm}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-muted">
        {label}
      </span>
      {children}
    </label>
  )
}

function StatusPanel({
  flow,
  orderRef,
  error,
  onReset,
}: {
  flow: FlowState
  orderRef: string | null
  error: string | null
  onReset: () => void
}) {
  if (flow === 'paid') {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-gold" />
        <h3 className="font-serif text-xl text-ink">Order confirmed</h3>
        <p className="mt-2 text-sm text-ink/70">
          Reference <span className="font-semibold">{orderRef}</span>. We'll be
          in touch about delivery or collection.
        </p>
        <button onClick={onReset} className="btn-outline mt-6">
          Place another order
        </button>
      </div>
    )
  }

  if (flow === 'till-submitted') {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 h-10 w-10 rounded-full border-2 border-gold" />
        <h3 className="font-serif text-xl text-ink">Thanks — we've got it</h3>
        <p className="mt-2 text-sm text-ink/70">
          Reference <span className="font-semibold">{orderRef}</span>. Our team
          will reconcile your payment against the Till and confirm your order
          shortly.
        </p>
        <button onClick={onReset} className="btn-outline mt-6">
          Place another order
        </button>
      </div>
    )
  }

  if (flow === 'failed') {
    return (
      <div className="py-6 text-center">
        <h3 className="font-serif text-xl text-ink">We couldn't confirm payment</h3>
        <p className="mt-2 text-sm text-ink/70">{error}</p>
        {orderRef && (
          <p className="mt-1 text-xs text-ink/50">Reference {orderRef}</p>
        )}
        <button onClick={onReset} className="btn-gold mt-6">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full border-2 border-gold" />
      <h3 className="font-serif text-xl text-ink">Check your phone</h3>
      <p className="mt-2 text-sm text-ink/70">
        We've sent an M-Pesa prompt to complete your order
        {orderRef ? ` (${orderRef})` : ''}. Enter your PIN to finish.
      </p>
      <p className="mt-4 text-xs text-ink/50">This page updates automatically.</p>
    </div>
  )
}