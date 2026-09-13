// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Zap, TrendingUp, Share2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalEngagement: number
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalEngagement: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('status, views, likes, shares, comments')

      if (!error && data) {
        setStats({
          totalPosts: data.length,
          publishedPosts: data.filter((p) => p.status === 'published').length,
          draftPosts: data.filter((p) => p.status === 'draft' || p.status === 'pending_approval').length,
          totalEngagement: data.reduce(
            (sum, p) => sum + (p.views || 0) + (p.likes || 0) + (p.shares || 0) + (p.comments || 0),
            0
          ),
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
        <p className="text-gray-400">
          Your AI content generation dashboard is ready. Create engaging content in seconds.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Zap className="text-zara-gold" size={24} />}
          label="Total Posts"
          value={stats.totalPosts}
          change="+12% this month"
        />
        <StatCard
          icon={<CheckCircle className="text-green-500" size={24} />}
          label="Published"
          value={stats.publishedPosts}
          change="Ready to engage"
        />
        <StatCard
          icon={<FileText className="text-blue-500" size={24} />}
          label="Drafts"
          value={stats.draftPosts}
          change="Awaiting approval"
        />
        <StatCard
          icon={<TrendingUp className="text-orange-500" size={24} />}
          label="Total Engagement"
          value={stats.totalEngagement}
          change="From all posts"
          isBig
        />
      </div>
      <p className="text-xs text-gray-500 -mt-4">
        Note: Total Engagement will show 0 until post-level view/like/share tracking is wired up --
        these are real counts from the database, not placeholders, they just aren&apos;t populated by
        anything yet.
      </p>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Generate New Content"
            description="Create AI-powered posts with images and videos"
            href="/dashboard/generate"
            icon="✨"
          />
          <QuickActionCard
            title="Manage Holidays"
            description="Add or edit the calendar that drives auto-generated promos"
            href="/dashboard/holidays"
            icon="📅"
          />
          <QuickActionCard
            title="View Analytics"
            description="Track engagement and performance metrics"
            href="/dashboard/analytics"
            icon="📊"
          />
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Recent Posts</h2>
          <Link
            href="/dashboard/generate"
            className="btn-primary text-sm"
          >
            Create New
          </Link>
        </div>
        <RecentPostsList />
      </div>

      {/* Ghana Holiday Calendar */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Upcoming Ghana Holidays</h2>
        <GhanaHolidaysList />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  change,
  isBig = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  change: string
  isBig?: boolean
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-zara-gold transition">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-gray-700 rounded">{icon}</div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{label}</h3>
      <p className={`${isBig ? 'text-4xl' : 'text-3xl'} font-bold text-white mb-2`}>
        {value}
      </p>
      <p className="text-xs text-gray-500">{change}</p>
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  href,
  icon,
}: {
  title: string
  description: string
  href: string
  icon: string
}) {
  return (
    <Link
      href={href}
      className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-zara-gold transition group"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold text-white mb-2 group-hover:text-zara-gold transition">
        {title}
      </h3>
      <p className="text-sm text-gray-400">{description}</p>
      <div className="mt-4 inline-block text-zara-gold text-sm font-medium">
        Get Started →
      </div>
    </Link>
  )
}

function RecentPostsList() {
  const [posts, setPosts] = useState<
    Array<{
      id: string
      title: string
      status: string
      published_date: string | null
      created_at: string
    }>
  >([])

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, status, published_date, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      setPosts(data ?? [])
    }

    fetchPosts()
  }, [])

  if (posts.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-400">No posts yet. Create your first post!</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      {posts.map((post) => (
        <div
          key={post.id}
          className="px-6 py-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white">{post.title}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {post.published_date
                  ? `Published: ${new Date(post.published_date).toLocaleDateString()}`
                  : `Created: ${new Date(post.created_at).toLocaleDateString()}`}
              </p>
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded ${
                post.status === 'published'
                  ? 'bg-green-500 bg-opacity-20 text-green-400'
                  : post.status === 'pending_approval'
                  ? 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                  : post.status === 'rejected'
                  ? 'bg-red-500 bg-opacity-20 text-red-400'
                  : 'bg-gray-600 bg-opacity-40 text-gray-300'
              }`}
            >
              {post.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function GhanaHolidaysList() {
  const [holidays, setHolidays] = useState<{ id: string; name: string; holiday_date: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { supabase } = await import('@/lib/supabase/client')
      const today = new Date().toISOString().split('T')[0]
      const { data } = await supabase
        .from('ghana_holidays')
        .select('id, name, holiday_date')
        .gte('holiday_date', today)
        .order('holiday_date', { ascending: true })
        .limit(6)
      setHolidays(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="text-gray-500 text-sm">Loading…</p>

  if (holidays.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No upcoming holidays found -- manage the calendar on the{' '}
        <Link href="/dashboard/holidays" className="text-zara-gold hover:underline">Holidays page</Link>.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {holidays.map((holiday) => (
        <div
          key={holiday.id}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-zara-gold transition"
        >
          <p className="text-gray-400 text-sm">
            {new Date(holiday.holiday_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <h4 className="font-semibold text-white mt-1">{holiday.name}</h4>
        </div>
      ))}
    </div>
  )
}

// Import FileText icon at the top
import { FileText } from 'lucide-react'
