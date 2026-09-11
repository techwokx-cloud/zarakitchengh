// app/dashboard/leads/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Lead {
  id: string
  name: string
  phone: string | null
  email: string | null
  source: string | null
  interest: string | null
  notes: string | null
  status: string
  created_at: string
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted', 'lost']

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setTableMissing(true)
    else setLeads(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('leads').update({ status }).eq('id', id)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  if (tableMissing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Leads</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-amber-300 text-sm">
          The <code className="bg-black/30 px-1 rounded">leads</code> table doesn&apos;t exist yet. Run{' '}
          <code className="bg-black/30 px-1 rounded">supabase/leads_table.sql</code> in the Supabase SQL
          Editor, then reload this page.
        </div>
      </div>
    )
  }

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.status === filter)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-gray-400 text-sm">
          Real inquiries from the website (catering form, etc.). A weekly digest of new leads is emailed
          to the Restaurant Manager automatically (once /api/reports/weekly-leads is scheduled).
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {['all', ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition capitalize ${
              filter === s ? 'bg-zara-gold text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
          No leads yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{lead.name}</h3>
                  <p className="text-gray-400 text-sm">{lead.interest}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {lead.phone && <span>{lead.phone} · </span>}
                    {lead.email && <span>{lead.email} · </span>}
                    {lead.source}
                  </p>
                </div>
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className="bg-gray-900 border border-gray-600 rounded-lg text-white text-sm px-3 py-1.5 capitalize"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
