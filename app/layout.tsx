import type { Metadata, Viewport } from 'next'
import './globals.css'
import { InstallPromptProvider } from '@/lib/pwa/InstallPromptProvider'

export const metadata: Metadata = {
  title: 'Zara Kitchen - Authentic Ghanaian & Continental Cuisine',
  description: 'Experience authentic Ghanaian and Continental cuisine made with love. Fresh, Tasty, Satisfying. Order online or via WhatsApp.',
  keywords: 'Ghanaian food, Continental cuisine, Accra, restaurants, food delivery',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Zara Kitchen',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/icon-192.png',
  },
  openGraph: {
    title: 'Zara Kitchen - Good Food, Good Mood',
    description: 'Authentic Ghanaian & Continental Cuisine',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#F5A623',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <InstallPromptProvider>{children}</InstallPromptProvider>
      </body>
    </html>
  )
}
