import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zara Kitchen - Authentic Ghanaian & Continental Cuisine',
  description: 'Experience authentic Ghanaian and Continental cuisine made with love. Fresh, Tasty, Satisfying. Order online or via WhatsApp.',
  keywords: 'Ghanaian food, Continental cuisine, Accra, restaurants, food delivery',
  openGraph: {
    title: 'Zara Kitchen - Good Food, Good Mood',
    description: 'Authentic Ghanaian & Continental Cuisine',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  )
}
