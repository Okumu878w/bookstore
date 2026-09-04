const services = [
  {
    title: 'Keynote Speaking',
    text: 'Conversations on authentic leadership, resilience, leading under pressure, and the journey of becoming, drawing from real leadership experiences and lessons.',
    tagsLabel: 'Topics include',
    tags: [
      'Authentic Leadership',
      'Resilience',
      'Leading Under Pressure',
      'Leadership & Influence',
      'Women in Leadership',
      'Continuous Growth',
    ],
  },
  {
    title: 'Leadership Training & Workshops',
    text: 'Thought-provoking and practical sessions exploring the realities of leadership, personal growth, influence, and building stronger teams.',
    tagsLabel: 'Topics include',
    tags: [
      'Authentic Leadership',
      'Emotional Intelligence',
      'Leading Through Change',
      'Influence',
      'High-Performing Teams',
      'Leadership Transitions',
    ],
  },
  {
    title: 'Lean Six Sigma & Operational Excellence',
    text: 'A perspective on continuous improvement and process excellence, informed by hands-on experience leading operations the same discipline that shapes how Brenda writes and speaks about leadership.',
    tagsLabel: 'Areas of interest',
    tags: [
      'Lean Six Sigma',
      'Kaizen',
      'Problem Solving',
      'Root Cause Analysis',
      'Process Improvement',
      'Operational Excellence',
      
    ],
  },
  {
    title: 'Leadership & Career Conversations',
    text: 'Conversations for professionals navigating leadership transitions, increased responsibility, career growth, influence, and the challenge of remaining authentic while growing.',
    tagsLabel: 'Areas of interest',
    tags: [
      'Leadership Transitions',
      'Executive Presence',
      'Career Growth',
      'Influence',
      'Authentic Leadership',
      'Navigating Change',
    ],
  },
  {
    title: 'Book Clubs & Leadership Conversations',
    text: 'Facilitated conversations around Rising Without Losing Yourself, exploring the stories and themes of resilience, authenticity, leadership, faith, influence, and becoming. Ideal for leadership teams, professional groups, universities, and book clubs.',
    tagsLabel: null,
    tags: [],
  },
]

export default function Services() {
  return (
    <section id="services" className="border-t border-line/70 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <p className="section-label mb-5">Ways We Can Work Together</p>
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Speaking, training, and leadership conversations
        </h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink/70">
          Brenda's work brings together leadership experience, operational excellence,
          continuous improvement, and a deep interest in the human side of performance.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title} className="border-l-2 border-gold bg-cream/60 p-6">
              <h3 className="font-serif text-xl text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.text}</p>
              {s.tags.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-muted">
                    {s.tagsLabel}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs text-ink/75"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <p className="section-label mb-3">Let's Connect</p>
          <p className="max-w-lg text-[15px] leading-relaxed text-ink/70">
            Interested in a leadership conversation, speaking engagement, workshop, or
            group discussion?
          </p>
          <a href="#contact" className="btn-gold mt-6 inline-flex">
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}