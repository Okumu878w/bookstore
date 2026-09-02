import { useEffect, useRef, useState } from 'react'
import { EDGE_FUNCTIONS_URL } from '../lib/supabaseClient'
import { isLikelyKenyanPhone, formatPhoneHint } from '../lib/phone'
import type { CreateOrderResponse, OrderStatus } from '../types'

const PRICE = 800

type FlowState = 'form' | 'submitting' | 'awaiting-pin' | 'polling' | 'paid' | 'failed'

const statusCopy: Record<string, string> = {
  PENDING: 'Order created. Sending the payment prompt…',
  PAYMENT_INITIATED: 'Check your phone and enter your M-Pesa PIN.',
  PAID: 'Payment received. Thank you — your order is confirmed.',
  FAILED: "That payment didn't go through.",
  CANCELLED: 'The payment prompt was cancelled.',
}

export default function GetYourCopy() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [location, setLocation] = useState('')
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
          "This is taking longer than expected. If you completed the M-Pesa prompt, your order will still be marked paid shortly — otherwise, try again or use Till 8731216 below.",
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
        body: JSON.stringify({ name, phone, quantity, location }),
      })

      const data: CreateOrderResponse & { error?: string } = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Could not start the payment. Please try again.')
      }

      setOrderRef(data.orderRef)
      setFlow('awaiting-pin')
      pollStatus(data.orderId)
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
  }

  const total = PRICE * quantity

  return (
    <section id="copy" className="border-t border-line/70 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label mb-5">Get Your Copy</p>
            <h2 className="max-w-sm font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Order a copy, delivered or ready for collection
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/70">
              KSh {PRICE.toLocaleString()} per copy. Pay by M-Pesa — you'll get
              a prompt on your phone the moment you submit the form.
            </p>
          </div>

          <div className="max-w-lg border border-line bg-cream p-8 sm:p-10">
            {flow === 'form' || flow === 'submitting' ? (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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

                {error && (
                  <p className="text-sm text-red-700" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-gold w-full" disabled={flow === 'submitting'}>
                  {flow === 'submitting' ? 'Starting payment…' : `Pay KSh ${total.toLocaleString()} with M-Pesa`}
                </button>
                <p className="text-center text-xs text-ink/50">
                  Prefer to pay directly? Use Till 8731216 below.
                </p>
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