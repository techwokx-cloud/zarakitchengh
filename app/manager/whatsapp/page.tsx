// app/manager/whatsapp/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { MessageCircle } from 'lucide-react'

export default function WhatsAppPage() {
  const [optInCount, setOptInCount] = useState<number | null>(null)
  const [totalOrders, setTotalOrders] = useState<number | null>(null)

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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">WhatsApp</h1>
        <p className="text-gray-400 text-sm">Ordering number: +233 59 159 9629</p>
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

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 text-amber-300 text-sm mb-4">
        Conversation activity, quick replies, and automated order/status notifications aren&apos;t available
        yet -- that needs the separate WhatsApp bot (Baileys) integration, which isn&apos;t set up. The
        opt-in count above is real customer consent already being collected, ready for when it is.
      </div>

      <a
        href="https://wa.me/233591599629"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition"
      >
        <MessageCircle size={18} />
        Open WhatsApp Chat
      </a>
    </div>
  )
}
