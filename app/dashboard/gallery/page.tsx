// app/dashboard/gallery/page.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Upload, Trash2, ImageIcon, Loader2, X } from 'lucide-react'

interface GalleryImage {
  id: string
  category: string
  title: string | null
  description: string | null
  image_url: string
  display_order: number
  created_at: string
}

const DEFAULT_CATEGORIES = [
  { value: 'ambiance', label: 'Ambiance' },
  { value: 'events', label: 'Events' },
  { value: 'drinks', label: 'Drinks' },
  { value: 'customers', label: 'Happy Customers' },
]

function labelize(value: string): string {
  return value
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function GalleryManagementPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [activeCategory, setActiveCategory] = useState('ambiance')
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('category', { ascending: true })
      .order('display_order', { ascending: true })

    if (error) setTableMissing(true)
    else setImages(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError('')

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue

      const ext = file.name.split('.').pop()
      const filename = `${activeCategory}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('gallery')
        .upload(filename, file, { contentType: file.type })

      if (uploadErr) {
        setUploadError(`Failed to upload ${file.name}: ${uploadErr.message}`)
        continue
      }

      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(filename)

      await supabase.from('gallery_images').insert([{
        category: activeCategory,
        image_url: publicUrlData.publicUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
      }])
    }

    setUploading(false)
    load()
  }

  const deleteImage = async (image: GalleryImage) => {
    if (!confirm('Delete this image?')) return
    // Try to remove the underlying file too (best-effort -- extracting
    // the storage path from the public URL)
    const pathMatch = image.image_url.match(/gallery\/(.+)$/)
    if (pathMatch) {
      await supabase.storage.from('gallery').remove([pathMatch[1]])
    }
    await supabase.from('gallery_images').delete().eq('id', image.id)
    setImages((prev) => prev.filter((i) => i.id !== image.id))
  }

  if (tableMissing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Gallery</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-amber-300 text-sm">
          The <code className="bg-black/30 px-1 rounded">gallery_images</code> table/bucket doesn&apos;t
          exist yet. Run <code className="bg-black/30 px-1 rounded">supabase/gallery_images.sql</code> in
          the Supabase SQL Editor, then reload this page.
        </div>
      </div>
    )
  }

  const visibleImages = images.filter((i) => i.category === activeCategory)

  // Combine the default categories with any custom ones found in real
  // uploaded data, so categories added on the fly keep showing up
  const customCategories = Array.from(new Set(images.map((i) => i.category)))
    .filter((cat) => !DEFAULT_CATEGORIES.some((d) => d.value === cat))
    .map((cat) => ({ value: cat, label: labelize(cat) }))
  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories]

  const handleAddCategory = () => {
    const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (!slug) return
    setActiveCategory(slug)
    setNewCategoryName('')
    setAddingCategory(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Gallery</h1>
        <p className="text-gray-400 text-sm">
          Upload photos for the public Gallery page&apos;s categories. (&quot;Our Food&quot; fills in
          automatically from your Menu, no upload needed there.)
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 items-center">
        {allCategories.map((c) => (
          <button
            key={c.value}
            onClick={() => setActiveCategory(c.value)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition whitespace-nowrap ${
              activeCategory === c.value ? 'bg-zara-gold text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {c.label} ({images.filter((i) => i.category === c.value).length})
          </button>
        ))}

        {addingCategory ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddCategory(); if (e.key === 'Escape') setAddingCategory(false) }}
              placeholder="New category name"
              className="px-3 py-2 bg-gray-900 border border-zara-gold rounded-lg text-white text-sm placeholder-gray-500 w-40"
            />
            <button onClick={handleAddCategory} className="bg-zara-gold hover:bg-zara-orange text-black font-bold px-3 py-2 rounded-lg text-sm">
              Add
            </button>
            <button onClick={() => { setAddingCategory(false); setNewCategoryName('') }} className="text-gray-400 hover:text-white px-2">
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingCategory(true)}
            className="px-3 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white border border-dashed border-gray-600 hover:border-gray-500 whitespace-nowrap"
          >
            + New Category
          </button>
        )}
      </div>

      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); uploadFiles(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition mb-6 ${
          dragActive ? 'border-zara-gold bg-zara-gold/10' : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        {uploading ? (
          <>
            <Loader2 size={32} className="mx-auto mb-2 text-zara-gold animate-spin" />
            <p className="text-gray-300 text-sm">Uploading…</p>
          </>
        ) : (
          <>
            <Upload size={32} className="mx-auto mb-2 text-gray-400" />
            <p className="text-gray-300 text-sm font-medium">
              Drag and drop photos here, or click to browse
            </p>
            <p className="text-gray-500 text-xs mt-1">Uploading to: {allCategories.find((c) => c.value === activeCategory)?.label ?? labelize(activeCategory)}. You can select multiple files.</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>

      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm mb-6">
          {uploadError}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : visibleImages.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400 flex flex-col items-center gap-2">
          <ImageIcon size={28} className="text-gray-600" />
          No photos in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {visibleImages.map((image) => (
            <div key={image.id} className="relative group bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <img src={image.image_url} alt={image.title || ''} className="w-full aspect-square object-cover" />
              <button
                onClick={() => deleteImage(image)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
