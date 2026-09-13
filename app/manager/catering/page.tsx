// app/manager/catering/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Phone, Mail, StickyNote } from 'lucide-react'

interface CateringLead {
  id: string
  name: string
  phone: string | null
  email: string | null
  interest: string | null
  notes: string | null
  status: string
  created_at: string
}

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted', 'lost']

export default function ManagerCateringPage() {
  const [leads, setLeads] = useState<CateringLead[]>([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [filter, setFilter] = useState('all')

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('source', 'catering_form')
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
        <h1 className="text-2xl font-bold text-white mb-2">Catering</h1>
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
        <h1 className="text-2xl font-bold text-white">Catering</h1>
        <p className="text-gray-400 text-sm">
          Real catering inquiries submitted through the website&apos;s /catering page.
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
          No catering inquiries yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{lead.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{lead.interest}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-400">
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-zara-gold">
                        <Phone size={14} /> {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-zara-gold">
                        <Mail size={14} /> {lead.email}
                      </a>
                    )}
                  </div>
                  {lead.notes && (
                    <p className="flex items-start gap-1.5 text-sm text-gray-500 mt-2">
                      <StickyNote size={14} className="mt-0.5 flex-shrink-0" /> {lead.notes}
                    </p>
                  )}
                </div>
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className="bg-gray-900 border border-gray-600 rounded-lg text-white text-sm px-3 py-1.5 capitalize flex-shrink-0"
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
