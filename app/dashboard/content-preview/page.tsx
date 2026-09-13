// app/dashboard/content-preview/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Post {
  id: string
  title: string | null
  content: string
  image_url: string | null
  status: string
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  pending_approval: 'Awaiting Manager Review',
  approved: 'Approved',
  rejected: 'Rejected',
  published: 'Published',
  draft: 'Draft',
}

export default function ContentPreviewPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('posts')
        .select('id, title, content, image_url, status, created_at')
        .order('created_at', { ascending: false })
        .limit(20)
      setPosts(data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Content Preview</h1>
        <p className="text-gray-400 text-sm">
          See exactly what&apos;s been generated (including auto-generated daily/holiday posts), whether
          it&apos;s still waiting for the Manager&apos;s review, already approved, or rejected. Approval
          itself happens on the Manager&apos;s dashboard, not here.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : posts.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
          No posts generated yet.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              {post.image_url ? (
                <img src={post.image_url} alt={post.title || 'Post'} className="w-full aspect-[1200/630] object-cover" />
              ) : (
                <div className="w-full aspect-[1200/630] bg-gray-900 flex items-center justify-center text-gray-600 text-sm">
                  No image generated
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      post.status === 'pending_approval'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : post.status === 'approved' || post.status === 'published'
                        ? 'bg-green-500/20 text-green-400'
                        : post.status === 'rejected'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-600/40 text-gray-300'
                    }`}
                  >
                    {STATUS_LABELS[post.status] ?? post.status}
                  </span>
                  <span className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{post.title || 'Untitled'}</h3>
                <p className="text-gray-400 text-xs line-clamp-3">{post.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
