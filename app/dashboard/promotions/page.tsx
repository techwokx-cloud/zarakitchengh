// app/manager/promotions/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'

interface Promotion {
  id: string
  placement: 'bar' | 'popup'
  title: string | null
  message: string
  link_url: string | null
  link_text: string | null
  promo_code: string | null
  is_active: boolean
  created_at: string
}

const emptyForm = {
  placement: 'bar' as 'bar' | 'popup',
  title: '',
  message: '',
  link_url: '',
  link_text: '',
  promo_code: '',
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [tableMissing, setTableMissing] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      // Most likely the table doesn't exist yet (migration not run)
      setTableMissing(true)
    } else {
      setPromotions(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const { error } = await supabase.from('promotions').insert([{
      placement: form.placement,
      title: form.title || null,
      message: form.message,
      link_url: form.link_url || null,
      link_text: form.link_text || null,
      promo_code: form.promo_code || null,
      is_active: true,
    }])

    if (!error) {
      setForm(emptyForm)
      setShowForm(false)
      load()
    }
    setSaving(false)
  }

  const toggleActive = async (promo: Promotion) => {
    await supabase
      .from('promotions')
      .update({ is_active: !promo.is_active })
      .eq('id', promo.id)
    setPromotions((prev) =>
      prev.map((p) => (p.id === promo.id ? { ...p, is_active: !p.is_active } : p))
    )
  }

  const deletePromo = async (id: string) => {
    if (!confirm('Delete this promotion?')) return
    await supabase.from('promotions').delete().eq('id', id)
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }

  if (tableMissing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Promotions</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-amber-300 text-sm">
          The <code className="bg-black/30 px-1 rounded">promotions</code> table doesn&apos;t exist in
          Supabase yet. Run <code className="bg-black/30 px-1 rounded">supabase/promotions_and_settings.sql</code>{' '}
          in the Supabase SQL Editor, then reload this page.
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Promotions</h1>
          <p className="text-gray-400 text-sm">
            Active promotions appear live on the website&apos;s announcement bar and welcome popup.
          </p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center gap-2 bg-zara-gold hover:bg-zara-orange text-black font-bold px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          New Promotion
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Where should this appear?</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, placement: 'bar' }))}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                  form.placement === 'bar' ? 'bg-zara-gold text-black' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Announcement Bar
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, placement: 'popup' }))}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
                  form.placement === 'popup' ? 'bg-zara-gold text-black' : 'bg-gray-700 text-gray-300'
                }`}
              >
                Welcome Popup
              </button>
            </div>
          </div>

          {form.placement === 'popup' && (
            <input
              type="text"
              placeholder="Title (e.g. 👋 Welcome to Zara Kitchen!)"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
          )}

          <textarea
            required
            placeholder="Message (e.g. 15% off all Ghanaian Specialities, Fri-Sun!)"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
          />

          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Link URL (optional, e.g. /menu)"
              value={form.link_url}
              onChange={(e) => setForm((f) => ({ ...f, link_url: e.target.value }))}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Link text (optional, e.g. View Menu)"
              value={form.link_text}
              onChange={(e) => setForm((f) => ({ ...f, link_text: e.target.value }))}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
          </div>

          {form.placement === 'popup' && (
            <input
              type="text"
              placeholder="Promo code (optional, e.g. WELCOME10)"
              value={form.promo_code}
              onChange={(e) => setForm((f) => ({ ...f, promo_code: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-zara-gold hover:bg-zara-orange text-black font-bold px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create & Activate'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : promotions.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
          No promotions yet. Create one above.
        </div>
      ) : (
        <div className="space-y-3">
          {promotions.map((p) => (
            <div key={p.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded">
                    {p.placement === 'bar' ? 'Announcement Bar' : 'Welcome Popup'}
                  </span>
                  {p.is_active && (
                    <span className="text-xs font-bold uppercase bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                      Live
                    </span>
                  )}
                </div>
                {p.title && <p className="text-white font-semibold">{p.title}</p>}
                <p className="text-gray-300 text-sm truncate">{p.message}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(p)}
                  title={p.is_active ? 'Deactivate' : 'Activate'}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300"
                >
                  {p.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={() => deletePromo(p.id)}
                  title="Delete"
                  className="p-2 bg-gray-700 hover:bg-red-700 rounded-lg text-gray-300 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
