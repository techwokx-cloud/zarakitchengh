// app/manager/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function ManagerDashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/dashboard/login')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-zara-gold rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl font-bold text-black">Z</span>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Restaurant Manager Dashboard</h1>
      <p className="text-gray-400 max-w-md mb-6">
        You&apos;re logged in as a Restaurant Manager. The full dashboard (Orders, Menu,
        Reservations, Catering, Customers, WhatsApp) is being built next.
      </p>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  )
}
