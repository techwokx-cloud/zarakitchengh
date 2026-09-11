// app/manager/reservations/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Phone, Users, Calendar, Clock, StickyNote } from 'lucide-react'

interface Reservation {
  id: string
  customer_name: string
  phone: string
  email: string | null
  reservation_date: string
  reservation_time: string
  guests: number
  notes: string | null
  status: string
  created_at: string
}

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'cancelled', 'completed']

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadReservations = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: true })
      .order('reservation_time', { ascending: true })

    if (!error) setReservations(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadReservations()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id)
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)

    if (!error) {
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
    }
    setUpdatingId(null)
  }

  const filtered = filter === 'all'
    ? reservations
    : reservations.filter((r) => r.status === filter)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Reservations</h1>
        <p className="text-gray-400">Real bookings submitted through the website&apos;s Book a Table form.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === s
                ? 'bg-zara-gold text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== 'all' && (
              <span className="ml-1.5 opacity-70">
                ({reservations.filter((r) => r.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading reservations…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <p className="text-gray-400">No {filter !== 'all' ? filter : ''} reservations yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-white">{r.customer_name}</h3>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        r.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-400'
                          : r.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-400'
                          : r.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {r.reservation_date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {r.reservation_time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={14} /> {r.guests} guests
                    </span>
                    <a href={`tel:${r.phone}`} className="flex items-center gap-1.5 hover:text-zara-gold">
                      <Phone size={14} /> {r.phone}
                    </a>
                  </div>

                  {r.notes && (
                    <p className="flex items-start gap-1.5 text-sm text-gray-500 mt-2">
                      <StickyNote size={14} className="mt-0.5 flex-shrink-0" /> {r.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {r.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(r.id, 'confirmed')}
                        disabled={updatingId === r.id}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded transition disabled:opacity-50"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, 'cancelled')}
                        disabled={updatingId === r.id}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-red-700 text-white text-sm font-bold rounded transition disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </>
                  )}
                  {r.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(r.id, 'completed')}
                      disabled={updatingId === r.id}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded transition disabled:opacity-50"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
