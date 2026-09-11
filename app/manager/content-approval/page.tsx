// app/manager/content-approval/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Check, X as XIcon } from 'lucide-react'

interface Post {
  id: string
  title: string
  content: string
  image_url: string | null
  video_url: string | null
  post_type: string
  status: string
  scheduled_date: string | null
  created_at: string
}

export default function ContentApprovalPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [actioningId, setActioningId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'pending_approval')
      .order('scheduled_date', { ascending: true })

    if (error) {
      setTableMissing(true)
    } else {
      setPosts(data ?? [])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const decide = async (id: string, approve: boolean) => {
    setActioningId(id)
    await supabase
      .from('posts')
      .update({ status: approve ? 'approved' : 'rejected' })
      .eq('id', id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
    setActioningId(null)
  }

  if (tableMissing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Content Approval</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-amber-300 text-sm">
          The <code className="bg-black/30 px-1 rounded">posts</code> table doesn&apos;t exist yet. Run{' '}
          <code className="bg-black/30 px-1 rounded">supabase/schema.sql</code> in the Supabase SQL Editor
          (the original schema from earlier project setup), then reload this page.
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Content Approval</h1>
        <p className="text-gray-400 text-sm">
          Social media posts drafted by the Admin, waiting for your review before they go live.
        </p>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-blue-300 text-sm mb-6">
        Note: WhatsApp notifications for new pending posts aren&apos;t connected yet (that needs the
        separate WhatsApp bot integration) -- for now, check back here directly to review what&apos;s
        waiting.
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
          Nothing waiting for approval right now.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-800 border border-gray-700 rounded-lg p-5">
              <div className="flex flex-col md:flex-row gap-4">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full md:w-40 h-40 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-1">{post.title}</h3>
                  <p className="text-gray-300 text-sm mb-2 whitespace-pre-wrap">{post.content}</p>
                  {post.scheduled_date && (
                    <p className="text-xs text-gray-500">
                      Scheduled: {new Date(post.scheduled_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex md:flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => decide(post.id, true)}
                    disabled={actioningId === post.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition disabled:opacity-50"
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() => decide(post.id, false)}
                    disabled={actioningId === post.id}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition disabled:opacity-50"
                  >
                    <XIcon size={16} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
