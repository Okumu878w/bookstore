import { useState } from 'react'

const links = [
  { href: '#book', label: 'The Book' },
  { href: '#themes', label: 'Themes' },
  { href: '#author', label: 'The Author' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#copy', label: 'Order' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  function closeMenu() {
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <a href="#top" className="font-serif text-lg text-ink" onClick={closeMenu}>
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
        <a
          href="#copy"
          className="hidden rounded-sm bg-gold px-5 py-2.5 font-sans text-sm font-semibold text-ink-deep transition-colors hover:bg-gold-dark md:inline-flex"
        >
          Get Your Copy
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={`block h-px w-6 bg-ink transition-transform ${
              open ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-opacity ${open ? 'opacity-0' : 'opacity-100'}`}
          />
          <span
            className={`block h-px w-6 bg-ink transition-transform ${
              open ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {open && (
        <div className="border-t border-line/80 bg-cream md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4 font-sans text-sm text-ink/80 sm:px-10">
            {links.map((l) => (
              <li key={l.href} className="border-b border-line/60 last:border-none">
                <a
                  href={l.href}
                  onClick={closeMenu}
                  className="block py-3 transition-colors hover:text-gold-dark"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="px-6 pb-6 sm:px-10">
            <a
              href="#copy"
              onClick={closeMenu}
              className="block w-full rounded-sm bg-gold px-5 py-3 text-center font-sans text-sm font-semibold text-ink-deep transition-colors hover:bg-gold-dark"
            >
              Get Your Copy
            </a>
          </div>
        </div>
      )}
    </header>
  )
}