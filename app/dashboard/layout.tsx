// app/dashboard/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    let active = true

    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/dashboard/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (!active) return

      // Website Admin dashboard is website_admin-only -- a Restaurant
      // Manager account gets redirected to their own dashboard instead
      // of silently being let into pages meant for the other role.
      if (profile?.role === 'restaurant_manager') {
        router.push('/manager')
        return
      }

      if (profile?.role !== 'website_admin') {
        router.push('/dashboard/login')
        return
      }

      setIsAuthenticated(true)
    }

    checkAccess()
    return () => { active = false }
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/dashboard/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative w-64 h-full bg-gray-800 border-r border-gray-700 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        z-40
      `}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-zara-gold rounded-full flex items-center justify-center">
              <span className="font-bold text-black">Z</span>
            </div>
            <div>
              <h1 className="font-bold text-white">Zara Kitchen</h1>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Overview" />
          <SidebarLink href="/dashboard/generate" icon={FileText} label="Generate Content" />
          <SidebarLink href="/dashboard/calendar" icon={Calendar} label="Content Calendar" />
          <SidebarLink href="/dashboard/analytics" icon={BarChart3} label="Analytics" />
          <SidebarLink href="/dashboard/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white hidden md:block">
            Content Management Dashboard
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-900">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

function SidebarLink({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: LucideIcon
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition"
    >
      <Icon size={20} />
      {label}
    </Link>
  )
}
