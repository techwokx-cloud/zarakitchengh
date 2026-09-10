'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// Placeholder content -- same note as AnnouncementBar, this becomes
// admin-managed content later.
const POPUP = {
  title: '👋 Welcome to Zara Kitchen!',
  message: 'First time here? Enjoy 10% off your first order online.',
  code: 'WELCOME10',
  ctaText: 'Order Now',
  ctaLink: '/menu',
}

const AUTO_DISMISS_MS = 15000 // 15 seconds

export default function FirstVisitPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('zara_seen_welcome_popup')
    if (hasSeenPopup) return

    // Small delay so it doesn't feel like an instant jump-scare on page load
    const showTimer = setTimeout(() => {
      setVisible(true)
      localStorage.setItem('zara_seen_welcome_popup', 'true')
    }, 1200)

    return () => clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!visible) return
    const dismissTimer = setTimeout(() => setVisible(false), AUTO_DISMISS_MS)
    return () => clearTimeout(dismissTimer)
  }, [visible])

  if (!visible) return null

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

        <h3 className="font-display text-2xl font-semibold text-black mb-2">{POPUP.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{POPUP.message}</p>

        {POPUP.code && (
          <div className="bg-[#FFF8E7] border border-dashed border-zara-gold rounded-lg px-4 py-2 text-center mb-4">
            <span className="text-xs text-gray-500">Use code</span>
            <p className="font-bold text-lg tracking-wide text-black">{POPUP.code}</p>
          </div>
        )}

        <a
          href={POPUP.ctaLink}
          className="block w-full text-center bg-zara-gold hover:bg-zara-orange text-black font-bold py-2.5 rounded-lg transition"
        >
          {POPUP.ctaText}
        </a>
      </div>
    </div>
  )
}
