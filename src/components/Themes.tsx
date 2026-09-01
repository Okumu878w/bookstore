const themes = [
  {
    number: '01',
    title: 'Resilience',
    text: "Not the ability to avoid being knocked down, but the practice of getting back up in a way that doesn't cost you your judgment. Brenda writes about the specific pressures of operations leadership — production targets, crises, being the one people look to when something breaks — and how she learned to absorb pressure without passing it on unchanged.",
  },
  {
    number: '02',
    title: 'Authenticity',
    text: 'Most leadership advice was written for someone else. This section is about the ongoing negotiation between fitting into rooms not built for you and refusing to perform a version of leadership that isn\u2019t yours — told through the specific moments that forced the choice.',
  },
  {
    number: '03',
    title: 'Becoming',
    text: "Leadership treated as a direction rather than a destination. Chapters on the Lean Six Sigma discipline of continuous improvement applied to the self, and on why the growth never fully stops — even once the title, the promotion, or the recognition arrives.",
  },
]

export default function Themes() {
  return (
    <section id="themes" className="border-t border-line/70">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <p className="section-label mb-5">Throughlines</p>
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Three ideas the book keeps returning to
        </h2>

        <div className="mt-14 divide-y divide-line">
          {themes.map((t) => (
            <div
              key={t.title}
              className="grid grid-cols-1 gap-4 py-10 first:pt-0 sm:grid-cols-[auto_1fr] sm:gap-10"
            >
              <span className="font-serif text-2xl text-gold-dark sm:pt-1">
                {t.number}
              </span>
              <div className="max-w-2xl">
                <h3 className="font-serif text-2xl text-ink">{t.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.8] text-ink/75">
                  {t.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
