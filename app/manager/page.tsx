// app/manager/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import {
  Utensils,
  Calendar,
  PartyPopper,
  Coins,
  Clock,
} from 'lucide-react'

interface Reservation {
  id: string
  customer_name: string
  phone: string
  reservation_date: string
  reservation_time: string
  guests: number
  status: string
}

function PlaceholderBadge() {
  return (
    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
      Sample
    </span>
  )
}

export default function ManagerDashboard() {
  const [todaysReservations, setTodaysReservations] = useState<Reservation[]>([])
  const [upcoming, setUpcoming] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const today = new Date().toISOString().split('T')[0]

      const { data: todays } = await supabase
        .from('reservations')
        .select('*')
        .eq('reservation_date', today)
        .order('reservation_time', { ascending: true })

      const { data: soon } = await supabase
        .from('reservations')
        .select('*')
        .gte('reservation_date', today)
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true })
        .limit(5)

      setTodaysReservations(todays ?? [])
      setUpcoming(soon ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome back 👋</h1>
        <p className="text-gray-400">Here&apos;s what&apos;s happening at Zara Kitchen today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Utensils size={16} />
            Today&apos;s Orders <PlaceholderBadge />
          </div>
          <p className="text-2xl font-bold text-white">24</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Calendar size={16} />
            Today&apos;s Reservations
          </div>
          <p className="text-2xl font-bold text-white">
            {loading ? '…' : todaysReservations.length}
          </p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <PartyPopper size={16} />
            Catering Leads <PlaceholderBadge />
          </div>
          <p className="text-2xl font-bold text-white">3</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
            <Coins size={16} />
            Today&apos;s Revenue <PlaceholderBadge />
          </div>
          <p className="text-2xl font-bold text-white">GHS 2,450</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Reservations -- REAL data */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Clock size={18} />
              Upcoming Reservations
            </h2>
            <Link href="/manager/reservations" className="text-zara-gold text-sm hover:underline">
              View All
            </Link>
          </div>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : upcoming.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming reservations yet.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm border-b border-gray-700 pb-2 last:border-0">
                  <div>
                    <p className="text-white font-medium">{r.customer_name}</p>
                    <p className="text-gray-500 text-xs">
                      {r.reservation_date} · {r.reservation_time} · {r.guests} guests
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      r.status === 'confirmed'
                        ? 'bg-green-500/20 text-green-400'
                        : r.status === 'cancelled'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
          <h2 className="font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/manager/reservations" className="bg-gray-900 hover:bg-gray-700 rounded-lg p-4 text-center transition">
              <Calendar size={22} className="mx-auto mb-2 text-zara-gold" />
              <p className="text-sm text-white">Manage Reservations</p>
            </Link>
            <Link href="/manager/content-approval" className="bg-gray-900 hover:bg-gray-700 rounded-lg p-4 text-center transition">
              <Utensils size={22} className="mx-auto mb-2 text-zara-gold" />
              <p className="text-sm text-white">Content Approval</p>
            </Link>
            <Link href="/manager/catering" className="bg-gray-900 hover:bg-gray-700 rounded-lg p-4 text-center transition">
              <PartyPopper size={22} className="mx-auto mb-2 text-zara-gold" />
              <p className="text-sm text-white">Catering Leads</p>
            </Link>
            <Link href="/manager/orders" className="bg-gray-900 hover:bg-gray-700 rounded-lg p-4 text-center transition">
              <Coins size={22} className="mx-auto mb-2 text-zara-gold" />
              <p className="text-sm text-white">View Orders</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
