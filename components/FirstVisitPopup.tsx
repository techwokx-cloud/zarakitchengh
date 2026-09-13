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
  image_url: string | null
}

const AUTO_DISMISS_MS = 30000 // 30 seconds

export default function FirstVisitPopup() {
  const [visible, setVisible] = useState(false)
  const [promo, setPromo] = useState<PopupPromo | null>(null)

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('zara_seen_welcome_popup')
    if (hasSeenPopup) return

    const load = async () => {
      const { data } = await supabase
        .from('promotions')
        .select('title, message, promo_code, link_url, link_text, image_url')
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
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/40"
      onClick={() => setVisible(false)}
    >
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-float"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 text-white bg-black/40 hover:bg-black/60 rounded-full p-1.5"
        >
          <X size={20} />
        </button>

        {promo.image_url && (
          <img src={promo.image_url} alt={promo.title || 'Promotion'} className="w-full h-auto" />
        )}

        <div className="p-6">
          {promo.title && (
            <h3 className="font-display text-3xl font-semibold text-black mb-3">{promo.title}</h3>
          )}
          <p className="text-gray-700 text-base leading-relaxed mb-4">{promo.message}</p>

          {promo.promo_code && (
            <div className="bg-[#FFF8E7] border border-dashed border-zara-gold rounded-lg px-4 py-3 text-center mb-4">
              <span className="text-sm text-gray-500">Use code</span>
              <p className="font-bold text-2xl tracking-wide text-black">{promo.promo_code}</p>
            </div>
          )}

          {promo.link_url && (
            <a
              href={promo.link_url}
              className="block w-full text-center bg-zara-gold hover:bg-zara-orange text-black font-bold text-lg py-3 rounded-lg transition"
            >
              {promo.link_text || 'Learn More'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
