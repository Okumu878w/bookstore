const links = [
  { href: '#book', label: 'The Book' },
  { href: '#themes', label: 'Themes' },
  { href: '#author', label: 'The Author' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#copy', label: 'Order' },
]

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <a href="#top" className="font-serif text-lg text-ink">
          Rising Without Losing Yourself
        </a>
        <ul className="hidden items-center gap-8 font-sans text-sm text-ink/80 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition-colors hover:text-gold-dark">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#copy" className="hidden rounded-sm bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-ink-deep transition-colors hover:bg-gold-dark md:inline-flex">
          Get Your Copy
        </a>
      </nav>
    </header>
  )
}
