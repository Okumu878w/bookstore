import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Order } from '../types'
import { useAuth } from './useAuth'
import StatsCards from './StatsCards'
import OrdersTable from './OrdersTable'

export default function Dashboard() {
  const { signOut, session } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (!active) return
      if (error) {
        setError('Could not load orders. Confirm your account has admin access.')
      } else {
        setOrders((data || []) as Order[])
      }
      setLoading(false)
    }

    load()

    // Live updates when the Lipwa webhook or another admin changes an order.
    const channel = supabase
      .channel('orders-admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          setOrders((prev) => {
            if (payload.eventType === 'INSERT') {
              return [payload.new as Order, ...prev]
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map((o) => (o.id === (payload.new as Order).id ? (payload.new as Order) : o))
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter((o) => o.id !== (payload.old as Order).id)
            }
            return prev
          })
        },
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <div>
            <p className="section-label">Admin</p>
            <h1 className="font-serif text-xl text-ink">Order dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink/50 sm:inline">{session?.user.email}</span>
            <button onClick={() => signOut()} className="btn-outline px-4 py-2 text-sm">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10 sm:px-10">
        {error && <p className="text-sm text-red-700">{error}</p>}
        {loading ? (
          <p className="text-sm text-ink/50">Loading orders…</p>
        ) : (
          <>
            <StatsCards orders={orders} />
            <OrdersTable
              orders={orders}
              onOrderUpdated={(updated) =>
                setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
              }
            />
          </>
        )}
      </main>
    </div>
  )
}
