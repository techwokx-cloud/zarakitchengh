'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { useInstallPrompt } from '@/lib/pwa/InstallPromptProvider'

export default function InstallAppButton({ className = '' }: { className?: string }) {
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt()
  const [showManualHint, setShowManualHint] = useState(false)

  if (isInstalled) return null

  const handleClick = async () => {
    if (canInstall) {
      await promptInstall()
    } else {
      // Browsers like Safari/iOS don't support an automatic prompt --
      // show a quick manual instruction instead of doing nothing.
      setShowManualHint(true)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className={
          className ||
          'flex items-center gap-2 bg-zara-gold hover:bg-zara-orange text-black font-bold text-sm px-4 py-2 rounded-lg transition'
        }
      >
        <Download size={16} />
        Install App
      </button>

      {showManualHint && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white text-black text-xs rounded-lg shadow-xl p-3 border border-gray-200">
          <p className="font-semibold mb-1">Add Zara Kitchen to your Home Screen</p>
          <p className="text-gray-600">
            On iPhone/iPad: tap the Share icon, then &quot;Add to Home Screen&quot;.
            On other browsers: use the browser menu and look for &quot;Install app&quot;.
          </p>
          <button
            onClick={() => setShowManualHint(false)}
            className="mt-2 text-zara-gold font-semibold"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  )
}
