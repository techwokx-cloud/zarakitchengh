// app/manager/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  CalendarCheck,
  PartyPopper,
  Users,
  MessageCircle,
  Megaphone,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react'

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pendingReservations, setPendingReservations] = useState(0)

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

      if (profile?.role === 'website_admin') {
        router.push('/dashboard')
        return
      }

      if (profile?.role !== 'restaurant_manager') {
        router.push('/dashboard/login')
        return
      }

      setIsAuthenticated(true)

      // Real count, used as a sidebar badge -- pending reservations
      // that need the manager's attention
      const { count } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      if (active) setPendingReservations(count ?? 0)
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
        fixed md:relative w-64 h-full bg-gray-800 border-r border-gray-700 transition-transform duration-300 overflow-y-auto
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
              <p className="text-xs text-gray-400">Restaurant Manager</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <SidebarLink href="/manager" icon={LayoutDashboard} label="Dashboard" pathname={pathname} exact />

          <SidebarSectionLabel>Restaurant</SidebarSectionLabel>
          <SidebarLink href="/manager/orders" icon={ClipboardList} label="Orders" pathname={pathname} />
          <SidebarLink href="/manager/menu" icon={UtensilsCrossed} label="Menu" pathname={pathname} />
          <SidebarLink
            href="/manager/reservations"
            icon={CalendarCheck}
            label="Reservations"
            pathname={pathname}
            badge={pendingReservations > 0 ? pendingReservations : undefined}
          />
          <SidebarLink href="/manager/catering" icon={PartyPopper} label="Catering" pathname={pathname} />

          <SidebarSectionLabel>Customers</SidebarSectionLabel>
          <SidebarLink href="/manager/customers" icon={Users} label="Customers" pathname={pathname} />
          <SidebarLink href="/manager/whatsapp" icon={MessageCircle} label="WhatsApp" pathname={pathname} />

          <SidebarSectionLabel>Marketing</SidebarSectionLabel>
          <SidebarLink href="/manager/promotions" icon={Megaphone} label="Promotions" pathname={pathname} />

          <SidebarSectionLabel>Insights</SidebarSectionLabel>
          <SidebarLink href="/manager/reports" icon={BarChart3} label="Reports" pathname={pathname} />
          <SidebarLink href="/manager/settings" icon={Settings} label="Settings" pathname={pathname} />
        </nav>

        <div className="p-4 mt-4">
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
            Restaurant Manager
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

function SidebarSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-4 pt-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
      {children}
    </p>
  )
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  pathname,
  exact = false,
  badge,
}: {
  href: string
  icon: LucideIcon
  label: string
  pathname: string
  exact?: boolean
  badge?: number
}) {
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-3 px-4 py-2 rounded transition ${
        isActive
          ? 'bg-zara-gold text-black font-bold'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon size={20} />
        {label}
      </span>
      {badge !== undefined && (
        <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  )
}
