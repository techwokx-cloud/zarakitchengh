// app/dashboard/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function DashboardLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      // Look up this user's role to send them to the right dashboard
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.session.user.id)
        .single()

      if (profile?.role === 'restaurant_manager') {
        router.push('/manager')
      } else {
        router.push('/dashboard')
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-zara-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-black">Z</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Zara Kitchen</h1>
          <p className="text-gray-400">Content Dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg p-8 border border-zara-gold border-opacity-20">
          <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zarakitchen.com"
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded border border-gray-600 focus:border-zara-gold focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded border border-gray-600 focus:border-zara-gold focus:outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary mt-6 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-400">
            <p>For access, contact the administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}
