export default function Reviews() {
  return (
    <section id="reviews" className="border-t border-line/70 bg-white/40">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <p className="section-label mb-5">Reviews &amp; Endorsements</p>
        <h2 className="max-w-md font-serif text-3xl leading-tight text-ink sm:text-4xl">
          Early readers and press
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex h-40 flex-col justify-between border border-dashed border-line/80 p-6"
            >
              <p className="text-sm italic text-ink/40">
                Reader reviews and media features will appear here.
              </p>
              <span className="text-xs text-ink/30">Coming soon</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
