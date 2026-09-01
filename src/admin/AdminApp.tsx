import { useAuth } from './useAuth'
import Login from './Login'
import Dashboard from './Dashboard'

export default function AdminApp() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-ink/50">Loading…</p>
      </div>
    )
  }

  return session ? <Dashboard /> : <Login />
}
