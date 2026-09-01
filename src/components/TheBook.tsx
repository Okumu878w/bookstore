const themeSummaries = [
  {
    title: 'Resilience',
    text: 'Staying standing through pressure that would flatten most people, without hardening into someone unrecognizable.',
  },
  {
    title: 'Authenticity',
    text: 'Leading in your own voice, in rooms built for someone else\u2019s.',
  },
  {
    title: 'Becoming',
    text: 'Growth as an ongoing practice, not a title you arrive at and stop.',
  },
]

export default function TheBook() {
  return (
    <section id="book" className="border-t border-line/70 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="section-label mb-5">The Book</p>
            <h2 className="max-w-sm font-serif text-3xl leading-tight text-ink sm:text-4xl">
              A question every rising leader eventually has to answer
            </h2>
            <p className="mt-8 max-w-sm font-serif text-lg italic leading-relaxed text-ink/75">
              What do you keep, and what do you let the climb take from you?
            </p>
          </div>

          <div className="max-w-prose">
            <p className="text-[15px] leading-[1.8] text-ink/80">
              Rising Without Losing Yourself is an honest and deeply personal leadership memoir about the realities of growing into leadership while staying true to who you are.
Through real stories from boardrooms, factory floors, difficult seasons, setbacks, relationships, and moments of self-doubt, Brenda Chebet shares the lessons that shaped her understanding of leadership, resilience, authenticity, purpose, and influence.
            </p>
            <p className="mt-5 text-[15px] leading-[1.8] text-ink/80">
             This is not a book about perfect leaders or leadership theories that only work in perfect environments. It is about real people navigating real pressure—learning to lead others while also learning, unlearning, and becoming themselves. 

Whether you are stepping into leadership for the first time, navigating a challenging workplace, managing a team, building your career, or simply trying to grow without compromising your values, this book offers honest stories and practical reflections to help you keep moving forward.
You don't have to become someone else to lead effectively.
You can rise, grow, lead—and still remain yourself.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {themeSummaries.map((t) => (
                <div key={t.title} className="border-l-2 border-gold pl-5">
                  <h3 className="font-serif text-lg text-ink">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">
                    {t.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
