import { useState } from 'react'
import { EDGE_FUNCTIONS_URL } from '../lib/supabaseClient'
import { isLikelyKenyanPhone } from '../lib/phone'

export default function PaymentSupport() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [mpesaCode, setMpesaCode] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (name.trim().length < 2 || !isLikelyKenyanPhone(phone) || location.trim().length < 2) {
      setError('Please fill in your name, phone number, and location.')
      return
    }

    setLoading(true)
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
          quantity: 1,
          location,
          paymentMethod: 'till_manual',
          mpesaCodeSubmitted: mpesaCode || undefined,
        }),
      })
      if (!res.ok) throw new Error('Could not submit your order. Please try again.')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="border-t border-line/70">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label mb-5">Payment &amp; Order Support</p>
            <h2 className="max-w-sm font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Paying directly by Till?
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/70">
              If the M-Pesa prompt above doesn't work for you, pay directly to
              our Till and let us know so we can match your order.
            </p>
            <div className="mt-8 inline-flex flex-col border border-gold/50 bg-gold/10 px-6 py-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-muted">
                Buy Goods Till Number
              </span>
              <span className="mt-1 font-serif text-3xl text-ink">8731216</span>
            </div>
          </div>

          <div className="max-w-lg border border-line bg-white/60 p-8 sm:p-10">
            {submitted ? (
              <div className="py-6 text-center">
                <h3 className="font-serif text-xl text-ink">Thanks — we've got it</h3>
                <p className="mt-2 text-sm text-ink/70">
                  Our team will reconcile your payment against the Till and
                  confirm your order shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <p className="text-sm text-ink/70">
                  Already paid to Till 8731216? Tell us who to match it to.
                </p>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Full name
                  </span>
                  <input
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Phone number used to pay
                  </span>
                  <input
                    className="input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    Delivery or collection location
                  </span>
                  <input
                    className="input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    M-Pesa message code (optional)
                  </span>
                  <input
                    className="input"
                    value={mpesaCode}
                    onChange={(e) => setMpesaCode(e.target.value)}
                    placeholder="e.g. QCX7Y2AB4C"
                  />
                  <span className="mt-1.5 block text-xs text-ink/45">
                    This helps our team reconcile faster — orders are only
                    marked paid once we've verified the transaction.
                  </span>
                </label>

                {error && (
                  <p className="text-sm text-red-700" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn-outline w-full" disabled={loading}>
                  {loading ? 'Submitting…' : 'Submit order for reconciliation'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
