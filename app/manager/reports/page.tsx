// app/manager/reports/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Calendar, Users, TrendingUp } from 'lucide-react'

interface Reservation {
  reservation_date: string
  guests: number
  status: string
  created_at: string
}

export default function ReportsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('reservations')
        .select('reservation_date, guests, status, created_at')
      setReservations(data ?? [])
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

      {/* Sales Reports -- honestly blocked, no Orders system yet */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Sales Reports</h2>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 text-amber-300 text-sm">
          Not available yet -- there's no Orders system connected to the database yet, so there's no
          real sales/revenue data to report on. This will populate once online/in-person orders are
          tracked in Supabase.
        </div>
      </div>

      {/* Performance Reports -- honestly blocked */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Performance Reports</h2>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 text-amber-300 text-sm">
          Not available yet -- menu item popularity and social content performance need real order
          and engagement data flowing in, which isn&apos;t connected yet.
        </div>
      </div>
    </div>
  )
}
