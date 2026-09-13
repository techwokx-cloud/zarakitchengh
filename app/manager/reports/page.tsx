// app/manager/reports/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Calendar, Users, TrendingUp, Coins, Trophy } from 'lucide-react'

interface Reservation {
  reservation_date: string
  guests: number
  status: string
  created_at: string
}

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  items: OrderItem[]
  total: number
  status: string
  created_at: string
}

export default function ReportsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: resData } = await supabase
        .from('reservations')
        .select('reservation_date, guests, status, created_at')

      const { data: orderData } = await supabase
        .from('orders')
        .select('items, total, status, created_at')

      setReservations(resData ?? [])
      setOrders(orderData ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // Real stats, computed from real reservation data
  const total = reservations.length
  const byStatus = {
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
    completed: reservations.filter((r) => r.status === 'completed').length,
  }
  const totalGuests = reservations.reduce((sum, r) => sum + (r.guests || 0), 0)
  const avgPartySize = total > 0 ? (totalGuests / total).toFixed(1) : '0'

  // Reservations created per day, last 14 days
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return d.toISOString().split('T')[0]
  })
  const countsByDay = last14Days.map((day) =>
    reservations.filter((r) => r.created_at?.startsWith(day)).length
  )
  const maxCount = Math.max(...countsByDay, 1)

  // Real sales stats, from real orders
  const totalOrders = orders.length
  const completedOrders = orders.filter((o) => o.status === 'completed')
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const avgOrderValue = completedOrders.length > 0 ? (totalRevenue / completedOrders.length).toFixed(0) : '0'
  const cancelledOrders = orders.filter((o) => o.status === 'cancelled').length

  // Real top-selling items, aggregated from every order's items
  const itemCounts = new Map<string, number>()
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      itemCounts.set(item.name, (itemCounts.get(item.name) ?? 0) + item.quantity)
    })
  })
  const topItems = Array.from(itemCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-gray-400 text-sm">Sales, reservation, and performance reports.</p>
      </div>

      {/* Reservation Reports -- REAL data */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar size={18} className="text-zara-gold" />
          Reservation Reports
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Total Reservations</p>
                <p className="text-2xl font-bold text-white">{total}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{byStatus.pending}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Confirmed</p>
                <p className="text-2xl font-bold text-green-400">{byStatus.confirmed}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Completed</p>
                <p className="text-2xl font-bold text-blue-400">{byStatus.completed}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                  <Users size={12} /> Avg. Party Size
                </p>
                <p className="text-2xl font-bold text-white">{avgPartySize}</p>
              </div>
            </div>

            {/* Simple bar chart -- reservations created per day, last 14 days */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
              <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
                <TrendingUp size={14} />
                New reservations per day (last 14 days)
              </p>
              <div className="flex items-end gap-1.5 h-32">
                {countsByDay.map((count, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-zara-gold rounded-t"
                      style={{ height: `${Math.max((count / maxCount) * 100, 2)}%` }}
                      title={`${count} on ${last14Days[i]}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 mt-2">
                <span>{last14Days[0]?.slice(5)}</span>
                <span>{last14Days[last14Days.length - 1]?.slice(5)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sales Reports -- REAL data, from the Orders system */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Coins size={18} className="text-zara-gold" />
          Sales Reports
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-white">{totalOrders}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-400">{completedOrders.length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Cancelled</p>
            <p className="text-2xl font-bold text-red-400">{cancelledOrders}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-xs mb-1">Revenue</p>
            <p className="text-2xl font-bold text-zara-gold">GHS {totalRevenue.toFixed(0)}</p>
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-2">Average order value: GHS {avgOrderValue}</p>
      </div>

      {/* Performance Reports -- top items are real, content engagement isn't tracked yet */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Trophy size={18} className="text-zara-gold" />
          Performance Reports
        </h2>
        {topItems.length > 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-4">
            <p className="text-sm text-gray-400 mb-3">Top Selling Items</p>
            <div className="space-y-2">
              {topItems.map(([name, count], i) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span className="text-white">{i + 1}. {name}</span>
                  <span className="text-zara-gold font-bold">{count} sold</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 text-center text-gray-400 mb-4">
            No orders yet -- top items will appear here once orders come in.
          </div>
        )}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 text-amber-300 text-sm">
          Social content performance not available yet -- post engagement isn&apos;t tracked
          automatically, so there&apos;s no real marketing performance data to show.
        </div>
      </div>
    </div>
  )
}
