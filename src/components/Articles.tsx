const LINKEDIN_URL =
  'https://www.linkedin.com/newsletters/elevated-leadership-7336419356718825472'

export default function Articles() {
  return (
    <section id="articles" className="border-t border-line/70">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="section-label mb-5">More From Brenda</p>
            <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
              Articles on leadership, on LinkedIn
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/70">
              Brenda writes regularly on leadership, resilience, and authenticity in her
              Elevated Leadership newsletter the same ideas from the book, applied to
              whatever's happening in leadership right now.
            </p>
          </div>

          <div className="flex justify-start lg:justify-end">
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              Read on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}