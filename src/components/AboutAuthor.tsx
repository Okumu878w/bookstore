const credentials = [
  'Plant Manager, Unga Limited',
  'Lean Six Sigma Black Belt',
  'Global MBA Candidate',
  'Founder, Elevated Leadership',
]

export default function AboutAuthor() {
  return (
    <section id="author" className="border-t border-line/70 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="section-label mb-5">About the Author</p>
            <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Brenda Chebet Koech
            </h2>
            <div className="mt-8 h-40 w-32 border border-line bg-ink/5 sm:h-48 sm:w-36" aria-hidden="true" />
          </div>

          <div className="max-w-prose">
            <p className="text-[15px] leading-[1.8] text-ink/80">
              Brenda leads plant operations at Unga Limited, one of East
              Africa's largest food manufacturers, where she applies the same
              discipline she writes about &mdash; measured, continuous, and
              unglamorous &mdash; to running a production floor under real
              pressure. She holds a Lean Six Sigma Black Belt and is currently
              completing a Global MBA, and founded Elevated Leadership to
              extend the ideas in this book beyond its pages.
            </p>
            <p className="mt-5 text-[15px] leading-[1.8] text-ink/80">
              Rising Without Losing Yourself draws directly from that
              experience: what it takes to lead through a shift change, a
              missed target, or a boardroom that expects you to be someone
              you're not &mdash; and what it costs, or doesn't, to stay
              yourself through all of it.
            </p>

            <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-line pt-8 sm:grid-cols-2">
              {credentials.map((c) => (
                <div key={c} className="flex items-start gap-3">
                  <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <dd className="text-sm text-ink/75">{c}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
