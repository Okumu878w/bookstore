import { useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Order, OrderStatus } from '../types'

const ALL_STATUSES: (OrderStatus | 'ALL')[] = [
  'ALL',
  'PENDING',
  'PAYMENT_INITIATED',
  'PAID',
  'DISPATCHED',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
]

const NEXT_STATUSES: OrderStatus[] = [
  'PENDING',
  'PAYMENT_INITIATED',
  'PAID',
  'DISPATCHED',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
]

export default function OrdersTable({
  orders,
  onOrderUpdated,
}: {
  orders: Order[]
  onOrderUpdated: (order: Order) => void
}) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter
      const matchesQuery =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.order_ref.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [orders, query, statusFilter])

  async function updateStatus(order: Order, status: OrderStatus) {
    setUpdatingId(order.id)
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', order.id)
      .select()
      .single()
    setUpdatingId(null)
    if (!error && data) onOrderUpdated(data as Order)
  }

  return (
    <div className="border border-line bg-white">
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          className="input sm:max-w-xs"
          placeholder="Search name, phone, or order ref"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="input sm:max-w-[200px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'All statuses' : s.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-slate-muted">
              <th className="px-4 py-3 font-semibold">Ref</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Qty</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Method</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-line/60 text-ink/80">
                <td className="px-4 py-3 font-medium text-ink">{o.order_ref}</td>
                <td className="px-4 py-3">{o.name}</td>
                <td className="px-4 py-3">{o.phone}</td>
                <td className="px-4 py-3">{o.quantity}</td>
                <td className="px-4 py-3">{o.location}</td>
                <td className="px-4 py-3">
                  {o.payment_method === 'till_manual' ? 'Till (manual)' : 'STK push'}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={o.status} />
                </td>
                <td className="px-4 py-3">
                  <select
                    className="input py-1.5 text-xs"
                    value={o.status}
                    disabled={updatingId === o.id}
                    onChange={(e) => updateStatus(o, e.target.value as OrderStatus)}
                  >
                    {NEXT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-ink/40">
                  No orders match this search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    PENDING: 'bg-ink/10 text-ink/70',
    PAYMENT_INITIATED: 'bg-gold/20 text-gold-dark',
    PAID: 'bg-green-100 text-green-800',
    DISPATCHED: 'bg-blue-100 text-blue-800',
    DELIVERED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-ink/10 text-ink/50',
  }
  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
