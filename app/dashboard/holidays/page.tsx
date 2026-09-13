// app/dashboard/holidays/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2, Calendar } from 'lucide-react'

interface Holiday {
  id: string
  name: string
  holiday_date: string
  notes: string | null
}

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('ghana_holidays')
      .select('*')
      .order('holiday_date', { ascending: true })

    if (error) setTableMissing(true)
    else setHolidays(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('ghana_holidays').insert([{
      name,
      holiday_date: date,
      notes: notes || null,
    }])
    if (!error) {
      setName('')
      setDate('')
      setNotes('')
      setShowForm(false)
      load()
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this holiday?')) return
    await supabase.from('ghana_holidays').delete().eq('id', id)
    setHolidays((prev) => prev.filter((h) => h.id !== id))
  }

  if (tableMissing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Holidays</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-amber-300 text-sm">
          The <code className="bg-black/30 px-1 rounded">ghana_holidays</code> table doesn&apos;t exist yet.
          Run <code className="bg-black/30 px-1 rounded">supabase/ghana_holidays_table.sql</code> in the
          Supabase SQL Editor, then reload this page.
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Holidays</h1>
          <p className="text-gray-400 text-sm">
            Drives the auto-generated holiday promo drafts. Add, edit, or remove dates here --
            no code changes needed.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-zara-gold hover:bg-zara-orange text-black font-bold px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          Add Holiday
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Holiday name (e.g. Eid al-Fitr)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-zara-gold hover:bg-zara-orange text-black font-bold px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Add'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-left">
                <th className="p-3">Date</th>
                <th className="p-3">Holiday</th>
                <th className="p-3">Notes</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((h) => (
                <tr key={h.id} className={`border-b border-gray-700 last:border-0 ${h.holiday_date < today ? 'opacity-40' : ''}`}>
                  <td className="p-3 text-white flex items-center gap-1.5">
                    <Calendar size={14} className="text-zara-gold" /> {h.holiday_date}
                  </td>
                  <td className="p-3 text-white">{h.name}</td>
                  <td className="p-3 text-gray-400">{h.notes || '-'}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleDelete(h.id)} className="text-gray-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
