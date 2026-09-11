// app/manager/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
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

      // Restaurant Manager's dashboard is restaurant_manager-only --
      // a Website Admin account gets sent to their own dashboard instead.
      if (profile?.role === 'website_admin') {
        router.push('/dashboard')
        return
      }

      if (profile?.role !== 'restaurant_manager') {
        router.push('/dashboard/login')
        return
      }

      setIsAuthenticated(true)
    }

    checkAccess()
    return () => { active = false }
  }, [router])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
