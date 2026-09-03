import type { Order, OrderStatus } from '../types'

export default function StatsCards({ orders }: { orders: Order[] }) {
  const total = orders.length
  const paidOrders = orders.filter((o) => o.status === 'PAID' || o.status === 'DISPATCHED' || o.status === 'DELIVERED')
  const revenue = paidOrders.reduce((sum, o) => sum + Number(o.amount), 0)

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  const statuses: OrderStatus[] = [
    'PENDING',
    'PAYMENT_INITIATED',
    'PAID',
    'DISPATCHED',
    'DELIVERED',
    'FAILED',
    'CANCELLED',
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="Total orders" value={total.toString()} />
      <StatCard label="Paid revenue" value={`KSh ${revenue.toLocaleString()}`} accent />
      <StatCard label="Paid orders" value={paidOrders.length.toString()} />
      <StatCard
        label="Awaiting payment"
        value={((byStatus.PENDING || 0) + (byStatus.PAYMENT_INITIATED || 0)).toString()}
      />

      <div className="col-span-2 border border-line bg-white p-5 sm:col-span-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-muted">
          Orders by status
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {statuses.map((s) => (
            <span key={s} className="text-sm text-ink/75">
              <span className="font-semibold text-ink">{byStatus[s] || 0}</span>{' '}
              {s.replace('_', ' ').toLowerCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="border border-line bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-muted">{label}</p>
      <p className={`mt-2 font-serif text-2xl ${accent ? 'text-gold-dark' : 'text-ink'}`}>{value}</p>
    </div>
  )
}