'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

// Placeholder content -- this will become admin-managed (create in Admin dashboard,
// approved via WhatsApp by the Restaurant Manager) once that workflow is built.
const ANNOUNCEMENT = {
  message: '🎉 Weekend Special: 15% off all Ghanaian Specialities, Fri-Sun!',
  link: '/menu?category=Ghanaian%20Specialities',
  linkText: 'View Menu',
}

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true) // default hidden until we check sessionStorage, avoids flash

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('zara_announcement_dismissed')
    setDismissed(wasDismissed === 'true')
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    sessionStorage.setItem('zara_announcement_dismissed', 'true')
  }

  if (dismissed) return null

  return (
    <div className="bg-zara-gold text-black text-sm">
      <div className="container-wide px-4 py-2 flex items-center justify-center gap-3 relative">
        <p className="text-center font-medium">
          {ANNOUNCEMENT.message}{' '}
          {ANNOUNCEMENT.link && (
            <a href={ANNOUNCEMENT.link} className="underline font-bold">
              {ANNOUNCEMENT.linkText}
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
