// app/dashboard/analytics/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Post {
  id: string
  title: string | null
  status: string
  created_at: string
  facebook_post_id: string | null
  instagram_post_id: string | null
  tiktok_post_id: string | null
  twitter_post_id: string | null
  whatsapp_message_id: string | null
}

export default function Analytics() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, status, created_at, facebook_post_id, instagram_post_id, tiktok_post_id, twitter_post_id, whatsapp_message_id')
        .order('created_at', { ascending: false })
      setPosts(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  const byStatus = {
    published: posts.filter((p) => p.status === 'published').length,
    pending: posts.filter((p) => p.status === 'pending_approval').length,
    approved: posts.filter((p) => p.status === 'approved').length,
    rejected: posts.filter((p) => p.status === 'rejected').length,
  }

  const byPlatform = {
    facebook: posts.filter((p) => p.facebook_post_id).length,
    instagram: posts.filter((p) => p.instagram_post_id).length,
    tiktok: posts.filter((p) => p.tiktok_post_id).length,
    twitter: posts.filter((p) => p.twitter_post_id).length,
    whatsapp: posts.filter((p) => p.whatsapp_message_id).length,
  }

  // Posts created per week, last 8 weeks
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const start = new Date()
    start.setDate(start.getDate() - (7 - i) * 7)
    return start
  })
  const countsByWeek = weeks.map((weekStart, i) => {
    const weekEnd = weeks[i + 1] ?? new Date()
    return posts.filter((p) => {
      const d = new Date(p.created_at)
      return d >= weekStart && d < weekEnd
    }).length
  })
  const maxWeekCount = Math.max(...countsByWeek, 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Content pipeline activity, from real post data.</p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={<FileText className="text-blue-400" />} label="Total Posts" value={posts.length} />
            <MetricCard icon={<CheckCircle className="text-green-400" />} label="Published" value={byStatus.published} />
            <MetricCard icon={<Clock className="text-yellow-400" />} label="Pending Approval" value={byStatus.pending} />
            <MetricCard icon={<XCircle className="text-red-400" />} label="Rejected" value={byStatus.rejected} />
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Posts by Platform</h2>
            <p className="text-gray-500 text-xs mb-4">
              Counts how many posts have actually gone out to each platform. Impressions/engagement/reach
              aren&apos;t shown here -- that needs each platform&apos;s own API connected to pull real
              numbers back in, which isn&apos;t set up yet.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(byPlatform).map(([platform, count]) => (
                <div key={platform} className="bg-gray-900 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-white">{count}</p>
                  <p className="text-xs text-gray-400 capitalize">{platform}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Posts Created (Last 8 Weeks)</h2>
            <div className="flex items-end gap-2 h-32">
              {countsByWeek.map((count, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-zara-gold rounded-t"
                    style={{ height: `${Math.max((count / maxWeekCount) * 100, 2)}%` }}
                    title={`${count} posts`}
                  />
                  <span className="text-[10px] text-gray-500">W{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Posts</h2>
            {posts.length === 0 ? (
              <p className="text-gray-400 text-sm">No posts yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-left text-gray-400">
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.slice(0, 10).map((post) => (
                      <tr key={post.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                        <td className="px-4 py-2 text-white">{post.title || 'Untitled'}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 bg-zara-gold bg-opacity-20 text-zara-gold text-xs rounded">
                            {post.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-400">{new Date(post.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
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
