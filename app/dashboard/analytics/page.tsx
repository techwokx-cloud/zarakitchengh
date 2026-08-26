// app/dashboard/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Share2, Heart } from 'lucide-react'

interface AnalyticsData {
  totalImpressions: number
  totalEngagement: number
  totalShares: number
  averageEngagementRate: number
  byPlatform: Record<
    string,
    {
      impressions: number
      engagement: number
      shares: number
    }
  >
  topPosts: Array<{
    id: string
    title: string
    engagement: number
    platform: string
  }>
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalImpressions: 0,
    totalEngagement: 0,
    totalShares: 0,
    averageEngagementRate: 0,
    byPlatform: {},
    topPosts: [],
  })
  const [timeframe, setTimeframe] = useState('30days')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [timeframe])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(
        `/api/dashboard/analytics?timeframe=${timeframe}`,
        {
          headers: {
            'x-user-id': token || '',
          },
        }
      )

      if (response.ok) {
        const data = (await response.json()) as AnalyticsData
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">
            Track your content performance across all platforms
          </p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700 focus:border-zara-gold"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="text-blue-400" />}
          label="Total Impressions"
          value={analytics.totalImpressions.toLocaleString()}
        />
        <MetricCard
          icon={<Heart className="text-red-400" />}
          label="Total Engagement"
          value={analytics.totalEngagement.toLocaleString()}
        />
        <MetricCard
          icon={<Share2 className="text-green-400" />}
          label="Total Shares"
          value={analytics.totalShares.toLocaleString()}
        />
        <MetricCard
          icon={<TrendingUp className="text-yellow-400" />}
          label="Avg. Engagement Rate"
          value={`${analytics.averageEngagementRate.toFixed(2)}%`}
        />
      </div>

      {/* Platform Performance */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Platform Performance</h2>
        <div className="space-y-4">
          {Object.entries(analytics.byPlatform).map(([platform, data]) => (
            <PlatformRow
              key={platform}
              platform={platform}
              impressions={data.impressions}
              engagement={data.engagement}
              shares={data.shares}
            />
          ))}
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Top Performing Posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-3 text-gray-400 font-semibold">
                  Post Title
                </th>
                <th className="text-left px-4 py-3 text-gray-400 font-semibold">
                  Platform
                </th>
                <th className="text-right px-4 py-3 text-gray-400 font-semibold">
                  Engagement
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics.topPosts.map((post) => (
                <tr key={post.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-4 py-3 text-white">{post.title}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-zara-gold bg-opacity-20 text-zara-gold text-xs font-medium rounded">
                      {post.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-green-400 font-semibold">
                    {post.engagement.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Trends */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Engagement Trend</h2>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p>Chart visualization coming soon</p>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-zara-gold transition">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-gray-700 rounded">{icon}</div>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{label}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function PlatformRow({
  platform,
  impressions,
  engagement,
  shares,
}: {
  platform: string
  impressions: number
  engagement: number
  shares: number
}) {
  const engagementRate = impressions > 0 ? ((engagement / impressions) * 100).toFixed(2) : '0'

  const getPlatformColor = (p: string) => {
    const colors: Record<string, string> = {
      facebook: 'bg-blue-500',
      instagram: 'bg-pink-500',
      tiktok: 'bg-black',
      twitter: 'bg-sky-400',
    }
    return colors[p] || 'bg-gray-500'
  }

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`${getPlatformColor(platform)} w-3 h-3 rounded-full`}
          />
          <span className="font-semibold text-white capitalize">{platform}</span>
        </div>
        <span className="text-zara-gold font-semibold">{engagementRate}% engagement</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Impressions</p>
          <p className="text-lg font-bold text-white">
            {impressions.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Engagement</p>
          <p className="text-lg font-bold text-red-400">
            {engagement.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Shares</p>
          <p className="text-lg font-bold text-green-400">
            {shares.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
