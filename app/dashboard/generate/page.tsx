// app/dashboard/generate/page.tsx
'use client'

import { useState } from 'react'
import { Zap, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

type ContentType = 'text' | 'image' | 'video' | 'carousel'
type ContentCategory = 'happy-month' | 'holiday' | 'promotion' | 'event' | 'engagement'
type ImageStyle = 'dalle3' | 'stable-diffusion'

export default function GenerateContent() {
  const [formData, setFormData] = useState({
    type: 'image' as ContentType,
    prompt: '',
    category: 'promotion' as ContentCategory,
    imageStyle: 'stable-diffusion' as ImageStyle,
    scheduledDate: new Date().toISOString().split('T')[0],
    platforms: {
      facebook: true,
      instagram: true,
      tiktok: false,
      twitter: true,
    },
    autoPost: false,
  })

  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<{
    caption?: string
    imageUrl?: string
    videoUrl?: string
    hashtags?: string[]
  }>({})
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.currentTarget
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : value,
    }))
  }

  const handlePlatformChange = (platform: keyof typeof formData.platforms) => {
    setFormData((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: !prev.platforms[platform],
      },
    }))
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/dashboard/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': token || '',
        },
        body: JSON.stringify({
          type: formData.type,
          prompt: formData.prompt,
          contentType: formData.category,
          imageStyle: formData.imageStyle,
          scheduledDate: formData.scheduledDate,
          platformTargets: Object.entries(formData.platforms)
            .filter(([, v]) => v)
            .map(([k]) => k),
          autoPost: formData.autoPost,
        }),
      })

      const data = (await response.json()) as {
        success?: boolean
        error?: string
        post?: {
          id: string
          content?: string
          image_url?: string
          video_url?: string
        }
        socialMediaResults?: {
          results: Record<string, { success: boolean; id?: string }>
        }
      }

      if (response.ok && data.success) {
        setPreview({
          caption: data.post?.content,
          imageUrl: data.post?.image_url,
          videoUrl: data.post?.video_url,
        })
        setStatus({
          type: 'success',
          message: formData.autoPost
            ? '✅ Content generated and posted to all platforms!'
            : '✅ Content generated successfully! Check the preview below.',
        })
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to generate content',
        })
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Generate Content</h1>
        <p className="text-gray-400">
          Create AI-powered posts with images, videos, and captions using our multi-model AI system.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleGenerate} className="space-y-4 bg-gray-800 rounded-lg p-6 border border-gray-700">
            {/* Status Message */}
            {status.type && (
              <div
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  status.type === 'success'
                    ? 'bg-green-500 bg-opacity-10 border border-green-500 text-green-400'
                    : 'bg-red-500 bg-opacity-10 border border-red-500 text-red-400'
                }`}
              >
                {status.type === 'success' ? (
                  <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                )}
                <span className="text-sm">{status.message}</span>
              </div>
            )}

            {/* Content Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-zara-gold focus:outline-none"
              >
                <option value="text">Text Only</option>
                <option value="image">Image + Caption</option>
                <option value="video">Video + Caption</option>
                <option value="carousel">Image Carousel</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-zara-gold focus:outline-none"
              >
                <option value="promotion">🔥 Promotion</option>
                <option value="holiday">🎉 Holiday/Event</option>
                <option value="happy-month">📅 Happy New Month</option>
                <option value="event">📢 Event Announcement</option>
                <option value="engagement">🎯 Engagement (Poll/Quiz)</option>
              </select>
            </div>

            {/* Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Prompt
              </label>
              <textarea
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                placeholder="E.g., 'Eid celebration dinner specials with traditional Ghanaian food'"
                rows={4}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-zara-gold focus:outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific for better results. Include mood, style, and key details.
              </p>
            </div>

            {/* Image Style */}
            {['image', 'video', 'carousel'].includes(formData.type) && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image Generation Model
                </label>
                <select
                  name="imageStyle"
                  value={formData.imageStyle}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-zara-gold focus:outline-none"
                >
                  <option value="stable-diffusion">Stable Diffusion (Fast & Free)</option>
                  <option value="dalle3">DALL-E 3 (Better Quality)</option>
                </select>
              </div>
            )}

            {/* Scheduled Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Schedule Date
              </label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-zara-gold focus:outline-none"
              />
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Post to Platforms
              </label>
              <div className="space-y-2">
                {(['facebook', 'instagram', 'tiktok', 'twitter'] as const).map((platform) => (
                  <label key={platform} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.platforms[platform]}
                      onChange={() => handlePlatformChange(platform)}
                      className="w-4 h-4 rounded bg-gray-700 border border-gray-600"
                    />
                    <span className="text-gray-300 capitalize text-sm">{platform}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Auto Post */}
            <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-gray-700">
              <input
                type="checkbox"
                name="autoPost"
                checked={formData.autoPost}
                onChange={handleInputChange}
                className="w-4 h-4 rounded bg-gray-700 border border-gray-600"
              />
              <span className="text-gray-300 text-sm">
                Auto-post after generation (requires approval)
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Generate Content
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 sticky top-6">
            <h2 className="text-xl font-bold text-white mb-4">Preview</h2>

            {Object.keys(preview).length === 0 ? (
              <div className="text-center py-12">
                <Zap className="mx-auto text-gray-600 mb-3" size={40} />
                <p className="text-gray-400">
                  Fill out the form and click "Generate Content" to see a preview
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                {preview.imageUrl && (
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <img
                      src={preview.imageUrl}
                      alt="Generated content"
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Video Preview */}
                {preview.videoUrl && (
                  <div className="bg-gray-900 rounded-lg overflow-hidden">
                    <video
                      src={preview.videoUrl}
                      controls
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Caption */}
                {preview.caption && (
                  <div className="bg-gray-900 rounded-lg p-4">
                    <p className="text-white text-sm leading-relaxed">
                      {preview.caption}
                    </p>
                  </div>
                )}

                {/* Hashtags */}
                {preview.hashtags && preview.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {preview.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-zara-gold bg-opacity-20 text-zara-gold text-xs font-medium rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
