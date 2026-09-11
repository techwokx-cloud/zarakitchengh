'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface BarPromo {
  message: string
  link_url: string | null
  link_text: string | null
}

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true) // default hidden until we check sessionStorage, avoids flash
  const [promo, setPromo] = useState<BarPromo | null>(null)

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('zara_announcement_dismissed')
    setDismissed(wasDismissed === 'true')

    const load = async () => {
      const { data } = await supabase
        .from('promotions')
        .select('message, link_url, link_text')
        .eq('placement', 'bar')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) setPromo(data)
    }
    load()
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('zara_announcement_dismissed', 'true')
  }

  // Nothing to show if dismissed, or if there's no active promotion in Supabase
  if (dismissed || !promo) return null

  return (
    <div className="bg-zara-gold text-black text-sm">
      <div className="container-wide px-4 py-2 flex items-center justify-center gap-3 relative">
        <p className="text-center font-medium">
          {promo.message}{' '}
          {promo.link_url && (
            <a href={promo.link_url} className="underline font-bold">
              {promo.link_text || 'Learn More'}
            </a>
          )}
        </p>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-4 text-black/70 hover:text-black"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
