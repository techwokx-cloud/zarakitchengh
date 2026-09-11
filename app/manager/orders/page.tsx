// app/manager/orders/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Phone, Truck, Store, CreditCard } from 'lucide-react'

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customer_name: string
  phone: string
  items: OrderItem[]
  total: number
  delivery_type: string
  delivery_address: string | null
  payment_method: string
  whatsapp_opt_in: boolean
  status: string
  created_at: string
}

const STATUS_FLOW: Record<string, string> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'out_for_delivery',
  out_for_delivery: 'completed',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setTableMissing(true)
    } else {
      setOrders(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const advanceStatus = async (order: Order) => {
    const next = STATUS_FLOW[order.status]
    if (!next) return
    setUpdatingId(order.id)
    await supabase.from('orders').update({ status: next }).eq('id', order.id)
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)))
    setUpdatingId(null)
  }

  const cancelOrder = async (id: string) => {
    setUpdatingId(id)
    await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)))
    setUpdatingId(null)
  }

  if (tableMissing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Orders</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-amber-300 text-sm">
          The <code className="bg-black/30 px-1 rounded">orders</code> table doesn&apos;t exist yet. Run{' '}
          <code className="bg-black/30 px-1 rounded">supabase/orders_table.sql</code> in the Supabase SQL
          Editor, then reload this page.
        </div>
      </div>
    )
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-400 text-sm">
          Real orders placed through the website (each is also sent to the ordering WhatsApp number).
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              filter === s ? 'bg-zara-gold text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-white">{order.customer_name}</h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        order.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : order.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  <div className="text-sm text-gray-300 mb-2">
                    {order.items?.map((item, i) => (
                      <p key={i}>{item.quantity} x {item.name} -- GHS {(item.price * item.quantity).toFixed(0)}</p>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-400">
                    <a href={`tel:${order.phone}`} className="flex items-center gap-1.5 hover:text-zara-gold">
                      <Phone size={14} /> {order.phone}
                    </a>
                    <span className="flex items-center gap-1.5">
                      {order.delivery_type === 'delivery' ? <Truck size={14} /> : <Store size={14} />}
                      {order.delivery_type === 'delivery' ? order.delivery_address : 'Pickup'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={14} />
                      {order.payment_method === 'momo' ? 'Mobile Money' : order.payment_method === 'card' ? 'Bank Card' : 'Cash'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p className="text-lg font-bold text-zara-gold">GHS {order.total.toFixed(0)}</p>
                  <div className="flex gap-2">
                    {STATUS_FLOW[order.status] && (
                      <button
                        onClick={() => advanceStatus(order)}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded transition disabled:opacity-50"
                      >
                        Mark {STATUS_LABELS[STATUS_FLOW[order.status]]}
                      </button>
                    )}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={updatingId === order.id}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-red-700 text-white text-xs font-bold rounded transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
