// app/manager/settings/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Save } from 'lucide-react'

interface DayHours {
  day: string
  open: string | null
  close: string | null
  closed: boolean
}

interface Settings {
  phone: string
  whatsapp_number: string
  email: string
  address: string
  opening_hours: DayHours[]
}

export default function ManagerSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tableMissing, setTableMissing] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .eq('id', 1)
        .single()

      if (error) {
        setTableMissing(true)
      } else {
        setSettings(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  const updateDay = (index: number, field: keyof DayHours, value: string | boolean) => {
    if (!settings) return
    const updated = [...settings.opening_hours]
    updated[index] = { ...updated[index], [field]: value }
    setSettings({ ...settings, opening_hours: updated })
  }

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    setSaved(false)

    const { error } = await supabase
      .from('restaurant_settings')
      .update({
        phone: settings.phone,
        whatsapp_number: settings.whatsapp_number,
        email: settings.email,
        address: settings.address,
        opening_hours: settings.opening_hours,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)

    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (loading) return <p className="text-gray-500">Loading settings…</p>

  if (tableMissing || !settings) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-amber-300 text-sm">
          The <code className="bg-black/30 px-1 rounded">restaurant_settings</code> table doesn&apos;t exist
          yet. Run <code className="bg-black/30 px-1 rounded">supabase/promotions_and_settings.sql</code>{' '}
          in the Supabase SQL Editor, then reload this page.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm">Restaurant profile and opening hours.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-zara-gold hover:bg-zara-orange text-black font-bold px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg p-3 mb-4">
          ✓ Settings saved.
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6 space-y-4">
        <h2 className="font-bold text-white">Restaurant Profile</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input
              type="text"
              value={settings.phone || ''}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">WhatsApp Number</label>
            <input
              type="text"
              value={settings.whatsapp_number || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            value={settings.email || ''}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Address</label>
          <textarea
            value={settings.address || ''}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white resize-none"
          />
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg p-5">
        <h2 className="font-bold text-white mb-4">Opening Hours</h2>
        <div className="space-y-2">
          {settings.opening_hours.map((day, i) => (
            <div key={day.day} className="flex items-center gap-3 text-sm">
              <span className="w-24 text-gray-300">{day.day}</span>
              <label className="flex items-center gap-1.5 text-gray-400">
                <input
                  type="checkbox"
                  checked={day.closed}
                  onChange={(e) => updateDay(i, 'closed', e.target.checked)}
                />
                Closed
              </label>
              {!day.closed && (
                <>
                  <input
                    type="time"
                    value={day.open ?? ''}
                    onChange={(e) => updateDay(i, 'open', e.target.value)}
                    className="px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={day.close ?? ''}
                    onChange={(e) => updateDay(i, 'close', e.target.value)}
                    className="px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Note: these changes save to the database, but the public website&apos;s pages (About, Contact,
        Footer) still show hardcoded hours for now -- wiring those to read from here is a follow-up step.
      </p>
    </div>
  )
}
