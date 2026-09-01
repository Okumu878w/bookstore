export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-16 sm:px-10 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div className="order-2 lg:order-1">
          <p className="section-label mb-6">A leadership memoir</p>
          <h1 className="max-w-xl font-serif text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-[3.4rem]">
            Rising Without Losing Yourself
          </h1>
          <p className="mt-6 max-w-md font-serif text-xl italic leading-relaxed text-ink/80">
            "Leadership is not about arriving. It's about rising without losing
            yourself."
          </p>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/70">
            Brenda Chebet Koech writes for anyone climbing while trying to stay
            whole — on resilience, authenticity, and the quiet work of becoming.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#copy" className="btn-gold">
              Get Your Copy — KSh 1,000
            </a>
            <a href="#book" className="btn-outline">
              Read the blurb
            </a>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-sm border border-gold/40 sm:-inset-6" />
            <div className="flex aspect-[5/7] w-56 flex-col justify-between border border-ink/15 bg-ink p-7 shadow-[0_30px_60px_-15px_rgba(28,63,96,0.35)] sm:w-72">
              <div className="h-px w-full bg-gold/40" />
              <div>
                <p className="font-serif text-[13px] uppercase tracking-[0.14em] text-gold-light">
                  A Leadership Memoir
                </p>
                <h2 className="mt-4 font-serif text-2xl leading-tight text-cream sm:text-3xl">
                  Rising Without
                  <br />
                  Losing Yourself
                </h2>
              </div>
              <div>
                <div className="h-px w-10 bg-gold" />
                <p className="mt-3 font-sans text-sm text-cream/80">
                  Brenda Chebet Koech
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
