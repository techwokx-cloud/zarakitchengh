// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Zap, TrendingUp, Share2, CheckCircle } from 'lucide-react'
import Link from 'next/link'

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
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'x-user-id': token || '',
        },
      })

      if (response.ok) {
        const data = (await response.json()) as DashboardStats
        setStats(data)
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
            title="View Content Calendar"
            description="Manage your 30-day content schedule"
            href="/dashboard/calendar"
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
      published_date: string
    }>
  >([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await fetch('/api/dashboard/generate-content?status=published&limit=5', {
          headers: {
            'x-user-id': token || '',
          },
        })

        if (response.ok) {
          const data = (await response.json()) as {
            posts: Array<{
              id: string
              title: string
              status: string
              published_date: string
            }>
          }
          setPosts(data.posts)
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
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
                Published: {new Date(post.published_date).toLocaleDateString()}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs font-medium rounded">
              {post.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function GhanaHolidaysList() {
  const holidays = [
    { date: 'Jan 1', name: "New Year's Day", type: 'National' },
    { date: 'Mar 6', name: 'Independence Day', type: 'National' },
    { date: 'May 1', name: 'Labour Day', type: 'National' },
    { date: 'Aug 1', name: 'Homowo Festival', type: 'Cultural' },
    { date: 'Sep 21', name: "Founder's Day", type: 'National' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {holidays.map((holiday, i) => (
        <div
          key={i}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-zara-gold transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm">{holiday.date}</p>
              <h4 className="font-semibold text-white mt-1">{holiday.name}</h4>
            </div>
            <span className="px-2 py-1 bg-zara-gold bg-opacity-20 text-zara-gold text-xs font-medium rounded">
              {holiday.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Import FileText icon at the top
import { FileText } from 'lucide-react'
