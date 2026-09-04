export default function Footer() {
  return (
    <footer className="border-t border-line/70">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 text-sm text-ink/60 sm:flex-row sm:items-center sm:px-10">
        <p className="font-serif text-ink">Rising Without Losing Yourself</p>
        <p>&copy; {new Date().getFullYear()} Brenda Chebet . All rights reserved.</p>
      </div>
    </footer>
  )
}
