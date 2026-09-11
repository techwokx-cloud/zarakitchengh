'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface PopupPromo {
  title: string | null
  message: string
  promo_code: string | null
  link_url: string | null
  link_text: string | null
}

const AUTO_DISMISS_MS = 15000 // 15 seconds

export default function FirstVisitPopup() {
  const [visible, setVisible] = useState(false)
  const [promo, setPromo] = useState<PopupPromo | null>(null)

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('zara_seen_welcome_popup')
    if (hasSeenPopup) return

    const load = async () => {
      const { data } = await supabase
        .from('promotions')
        .select('title, message, promo_code, link_url, link_text')
        .eq('placement', 'popup')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Nothing to show if there's no active popup promotion in Supabase
      if (!data) return

      setPromo(data)

      // Small delay so it doesn't feel like an instant jump-scare on page load
      setTimeout(() => {
        setVisible(true)
        localStorage.setItem('zara_seen_welcome_popup', 'true')
      }, 1200)
    }
    load()
  }, [])

  useEffect(() => {
    if (!visible) return
    const dismissTimer = setTimeout(() => setVisible(false), AUTO_DISMISS_MS)
    return () => clearTimeout(dismissTimer)
  }, [visible])

  if (!visible || !promo) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-float">
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute right-3 top-3 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        {promo.title && (
          <h3 className="font-display text-2xl font-semibold text-black mb-2">{promo.title}</h3>
        )}
        <p className="text-gray-600 text-sm mb-4">{promo.message}</p>

        {promo.promo_code && (
          <div className="bg-[#FFF8E7] border border-dashed border-zara-gold rounded-lg px-4 py-2 text-center mb-4">
            <span className="text-xs text-gray-500">Use code</span>
            <p className="font-bold text-lg tracking-wide text-black">{promo.promo_code}</p>
          </div>
        )}

        {promo.link_url && (
          <a
            href={promo.link_url}
            className="block w-full text-center bg-zara-gold hover:bg-zara-orange text-black font-bold py-2.5 rounded-lg transition"
          >
            {promo.link_text || 'Learn More'}
          </a>
        )}
      </div>
    </div>
  )
}
