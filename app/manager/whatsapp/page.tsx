// app/manager/whatsapp/page.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'

interface BotStatus {
  configured: boolean
  status: 'qr_pending' | 'connected' | 'connecting' | 'disconnected'
  qrDataUrl: string | null
  error?: string
}

export default function WhatsAppPage() {
  const [optInCount, setOptInCount] = useState<number | null>(null)
  const [totalOrders, setTotalOrders] = useState<number | null>(null)
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const load = async () => {
      const { count: optIns } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('whatsapp_opt_in', true)

      const { count: total } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      setOptInCount(optIns ?? 0)
      setTotalOrders(total ?? 0)
    }
    load()
  }, [])

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/whatsapp/status', { cache: 'no-store' })
        const data: BotStatus = await res.json()
        setBotStatus(data)
      } catch {
        setBotStatus({ configured: false, status: 'disconnected', qrDataUrl: null, error: 'Network error' })
      }
    }

    fetchStatus()
    // Poll every 4 seconds -- Baileys QR codes expire/rotate quickly,
    // and we want to reflect a successful scan promptly.
    pollRef.current = setInterval(fetchStatus, 4000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">WhatsApp</h1>
        <p className="text-gray-400 text-sm">Ordering number: +233 59 159 9629</p>
      </div>

      {/* Connection status / QR pairing */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
        <h2 className="font-bold text-white mb-4">Bot Connection</h2>

        {!botStatus ? (
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Checking connection…
          </p>
        ) : !botStatus.configured ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-amber-300 text-sm">
            Bot not configured yet. {botStatus.error && <span className="block mt-1 text-xs opacity-80">{botStatus.error}</span>}
          </div>
        ) : botStatus.status === 'connected' ? (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 size={20} />
            <span className="font-medium">WhatsApp is connected and active</span>
          </div>
        ) : botStatus.status === 'qr_pending' && botStatus.qrDataUrl ? (
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-4">
              Open WhatsApp on your phone → Settings → Linked Devices → Link a Device, then scan this code:
            </p>
            <img
              src={botStatus.qrDataUrl}
              alt="Scan with WhatsApp to connect"
              className="mx-auto rounded-lg border border-gray-600"
              style={{ width: 240, height: 240 }}
            />
            <p className="text-gray-500 text-xs mt-3">This code refreshes automatically -- no need to reload the page.</p>
          </div>
        ) : botStatus.status === 'connecting' ? (
          <p className="text-yellow-400 text-sm flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" /> Connecting…
          </p>
        ) : (
          <div className="flex items-center gap-2 text-red-400">
            <XCircle size={20} />
            <span className="text-sm">Disconnected {botStatus.error ? `-- ${botStatus.error}` : ''}</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Customers opted in for updates</p>
          <p className="text-2xl font-bold text-white">{optInCount ?? '…'}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-xs mb-1">Total orders placed</p>
          <p className="text-2xl font-bold text-white">{totalOrders ?? '…'}</p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 text-amber-300 text-sm">
        Conversation activity, quick replies, and automated order/status notifications depend on the bot
        being connected above, and on the messaging logic being built on the bot server itself.
      </div>
    </div>
  )
}
