const contactDetails = [
  {
    label: 'Email',
    value: 'elevatedleadership8@gmail.com',
    href: 'mailto:elevatedleadership8@gmail.com',
  },
  {
    label: 'Phone',
    value: '0795 055 109',
    href: 'tel:+254795055109',
  },
  {
    label: 'WhatsApp Us',
    value: '0795 055 109',
    href: 'https://wa.me/254795055109',
  },
]

export default function ContactUs() {
  return (
    <section id="contact" className="border-t border-line/70 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="section-label mb-5">Contact Us</p>
            <h2 className="max-w-sm font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Let's Start a Conversation
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/70">
              Whether it's about the book, a speaking engagement, a leadership
   conversation, or another professional enquiry reach out
  directly and we'll get back to you as soon as we can.
            </p>
          </div>

          <div className="max-w-lg border border-line bg-cream p-8 sm:p-10">
            <dl className="divide-y divide-line">
              {contactDetails.map((c) => (
                <div key={c.label} className="flex items-center justify-between py-5 first:pt-0 last:pb-0">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    {c.label}
                  </dt>
                  <dd>
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-serif text-lg text-ink transition-colors hover:text-gold-dark"
                    >
                      {c.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}