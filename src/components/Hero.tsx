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
            Brenda Chebet  writes for anyone climbing while trying to stay
            whole  on resilience, influence, authenticity, and the quiet work of becoming.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#copy" className="btn-gold">
              Pre-Order Your Copy
            </a>
            <a href="#book" className="btn-outline">
              Read the blurb
            </a>
          </div>
        </div>

        <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-sm border border-gold/40 sm:-inset-6" />
            <img
              src="/book cover.jpeg"
              alt="Rising Without Losing Yourself — book cover"
              className="aspect-[5/7] w-56 border border-ink/15 object-cover shadow-[0_30px_60px_-15px_rgba(28,63,96,0.35)] sm:w-72"
            />
          </div>
        </div>
      </div>
    </section>
  )
}