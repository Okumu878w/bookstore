const themes = [
  {
    number: '01',
    title: 'Resilience',
    text: "Leadership will test you in ways no job description can fully prepare you for. Through burnout, self-doubt, crises, difficult seasons, and moments when quitting felt easier, Brenda explores resilience not as simply enduring pressure, but as learning how to recover, reflect, and rise without losing yourself in the process. The book asks what it means to keep going while also learning when to pause, seek support, and rebuild.",
  },
  {
    number: '02',
    title: 'Authenticity',
    text: 'You do not have to become someone else to lead effectively. Brenda explores the tension between staying true to your values and navigating workplaces, expectations, and relationships that may challenge them. From finding her own leadership voice to learning how to remain grounded under pressure, the book is a reflection on leading with integrity without performing a version of leadership that isn\'t yours',
  },
  {
    number: '03',
    title: 'Influence',
    text: "Leadership is more than competence, position, or having the right answer. It is also about how you communicate, build trust, navigate complexity, and move people toward what matters. Brenda reflects on the evolution from doing to influencing—learning to combine emotional intelligence, strategic thinking, diplomacy, and calm authority without compromising moral clarity.",
  },
  {
    number: '04',
    title: 'Becoming',
    text: "The book's deepest thread is the idea that leadership is not a destination. It is a continual process of learning, unlearning, growing, and becoming. Brenda reflects on the lessons leadership has forced her to unlearn—perfectionism, over-functioning, and the need to carry everything herself—while embracing a more human, grounded, and sustainable way of leading. Through it all, faith remains a quiet anchor, reminding her that identity is bigger than a title, promotion, performance, or the opinions of others.",
  },
]

export default function Themes() {
  return (
    <section id="themes" className="border-t border-line/70">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <p className="section-label mb-5">Throughlines</p>
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Four ideas the book keeps returning to
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
