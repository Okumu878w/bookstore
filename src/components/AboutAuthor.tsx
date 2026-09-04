const credentials = [
   'Author',
   'Business & Manufacturing Leader',
   'Leadership Thought Leader',
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
               Brenda Chebet
            </h2>
             <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-muted">
   Author &bull; Business &amp; Manufacturing Leader &bull; Leadership Thought Leader &bull; Lean Six Sigma Black Belt
 </p>
            <img
              src="/author-photo.jpeg"
              alt="Chebet Brenda "
              className="mt-8 h-40 w-32 border border-line object-cover sm:h-48 sm:w-36"
            />
          </div>

          <div className="max-w-prose">
            <p className="text-[15px] leading-[1.8] text-ink/80">
              Brenda Chebet  is a business and manufacturing leader, author, mentor, and leadership thought leader with over 12 years of experience leading people, operations, and transformation. She has built a career leading people, operations, and transformation across complex manufacturing and business environments, with a focus on performance, continuous improvement, and developing high-performing teams.
            </p>
            <p className="mt-5 text-[15px] leading-[1.8] text-ink/80">
             <b>A Lean Six Sigma Black Belt and Global MBA candidate,</b> Brenda has built her career across manufacturing, operational excellence, continuous improvement, quality, and people leadership. Her leadership journey has taken her from the manufacturing floor to senior management, shaping her perspective on what leadership demands beyond technical competence and titles.
            </p>
            <p className="mt-5 text-[15px] leading-[1.8] text-ink/80">
            As a mentor and founder of Elevated Leadership, Brenda is passionate about creating spaces where leaders can grow with greater self-awareness, authenticity, courage, and purpose. Through the Elevated Leadership platform, she extends these conversations beyond her professional career and into leadership development, mentorship, speaking, and thought leadership.

            </p>
            <p className="mt-5 text-[15px] leading-[1.8] text-ink/80">
            <b>Rising Without Losing Yourself</b> is her first book. Drawing from real experiences of pressure, self-doubt, difficult decisions, setbacks, relationships, faith, and growth, Brenda offers an honest reflection on what it means to lead others while continuing to learn, unlearn, and become yourself.
           </p>
           <p className="mt-5 text-[15px] leading-[1.8] text-ink/80">
She believes that <b>leadership isn't about arriving. It is about becoming.</b>

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