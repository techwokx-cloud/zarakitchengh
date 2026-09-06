'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface InstallPromptContextValue {
  canInstall: boolean
  isInstalled: boolean
  promptInstall: () => Promise<void>
}

const InstallPromptContext = createContext<InstallPromptContextValue>({
  canInstall: false,
  isInstalled: false,
  promptInstall: async () => {},
})

export function useInstallPrompt() {
  return useContext(InstallPromptContext)
}

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Register the service worker (required, alongside the manifest, for installability)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // non-fatal -- app still works as a normal website without it
      })
    }

    // Already running as an installed app?
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return (
    <InstallPromptContext.Provider
      value={{ canInstall: !!deferredPrompt, isInstalled, promptInstall }}
    >
      {children}
    </InstallPromptContext.Provider>
  )
}
