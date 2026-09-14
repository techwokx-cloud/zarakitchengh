// app/manager/menu/page.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase/client'
import { fetchAllMenuItems, MenuItem } from '@/lib/menuItemsApi'
import { MENU_CATEGORIES } from '@/lib/menuData'
import { Plus, Pencil, Trash2, Star, EyeOff, Eye, Upload, Download, ImageOff, AlertTriangle, FileSpreadsheet, X } from 'lucide-react'

const CATEGORY_OPTIONS = MENU_CATEGORIES.filter((c) => c.name !== 'All Categories').map((c) => c.name)

const emptyForm = {
  category: CATEGORY_OPTIONS[0],
  name: '',
  description: '',
  price: '',
  image_url: '',
  is_spicy: false,
  is_vegetarian: false,
  is_featured_hero: false,
}

interface ParsedRow {
  name: string
  category: string
  price: string
  description: string
  image_url: string
  is_spicy: string
  is_vegetarian: string
  issues: string[]
}

function truthy(val: unknown): boolean {
  const s = String(val ?? '').trim().toLowerCase()
  return s === 'true' || s === 'yes' || s === '1'
}

function downloadTemplate() {
  const headers = ['name', 'category', 'price', 'description', 'image_url', 'is_spicy', 'is_vegetarian']
  const example = [
    'Kelewele', 'Appetisers', 35, 'Spicy fried plantain', '/images/menu/appetisers/kelewele.jpg', 'true', 'false',
  ]
  const ws = XLSX.utils.aoa_to_sheet([headers, example])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Menu Items')
  XLSX.writeFile(wb, 'zara-kitchen-menu-template.xlsx')
}

export default function ManagerMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [view, setView] = useState<'items' | 'slideshow'>('items')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showBatchUpload, setShowBatchUpload] = useState(false)
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [batchResult, setBatchResult] = useState<{ success: number; skipped: number } | null>(null)
  const [batchSaving, setBatchSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [nameWarning, setNameWarning] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchAllMenuItems()
      if (data.length === 0) {
        // Could genuinely be empty, or the table might not exist -- check directly
        const { error } = await supabase.from('menu_items').select('id').limit(1)
        if (error) setTableMissing(true)
      }
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setNameWarning('')
    setShowForm(true)
  }

  const checkDuplicateName = (name: string, excludeId?: string) => {
    const match = items.find(
      (i) => i.id !== excludeId && i.name.trim().toLowerCase() === name.trim().toLowerCase()
    )
    setNameWarning(match ? `An item named "${match.name}" already exists (GHS ${match.price.toFixed(0)}, ${match.category}).` : '')
  }

  const parseFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      // Reads by HEADER NAME (case-insensitive), not column position -- much
      // more forgiving than a strict comma-order format, and works
      // identically whether the file is .xlsx, .xls, or .csv
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

      const existingNames = new Set(items.map((i) => i.name.trim().toLowerCase()))
      const seenInFile = new Set<string>()

      const parsed: ParsedRow[] = rows.map((row) => {
        const get = (key: string) => {
          const foundKey = Object.keys(row).find((k) => k.trim().toLowerCase() === key)
          return String(row[foundKey ?? ''] ?? '').trim()
        }
        const name = get('name')
        const category = get('category')
        const price = get('price')
        const description = get('description')
        const image_url = get('image_url')
        const is_spicy = get('is_spicy')
        const is_vegetarian = get('is_vegetarian')

        const issues: string[] = []
        if (!name) issues.push('Missing name')
        if (!category) issues.push('Missing category')
        else if (!CATEGORY_OPTIONS.includes(category)) issues.push(`Unrecognized category "${category}"`)
        if (!price || isNaN(parseFloat(price))) issues.push('Missing/invalid price')
        if (!image_url) issues.push('No image path -- item will show with no photo')
        if (name) {
          const lower = name.trim().toLowerCase()
          if (existingNames.has(lower)) issues.push('Duplicate -- already exists in your menu')
          else if (seenInFile.has(lower)) issues.push('Duplicate -- appears twice in this file')
          seenInFile.add(lower)
        }

        return { name, category, price, description, image_url, is_spicy, is_vegetarian, issues }
      })

      setParsedRows(parsed)
      setBatchResult(null)
    }
    reader.readAsBinaryString(file)
  }

  const handleFileSelect = (files: FileList | null) => {
    const file = files?.[0]
    if (file) parseFile(file)
  }

  const handleConfirmBatchUpload = async () => {
    setBatchSaving(true)
    let success = 0
    let skipped = 0

    for (const row of parsedRows) {
      // Only block on issues that would actually break the record --
      // a missing image is allowed through (just flagged), everything
      // else (missing name/category/price, duplicates, bad category)
      // is skipped rather than silently creating bad data
      const blockingIssues = row.issues.filter((i) => i !== 'No image path -- item will show with no photo')
      if (blockingIssues.length > 0) {
        skipped++
        continue
      }

      const { error } = await supabase.from('menu_items').insert([{
        name: row.name,
        category: row.category,
        price: parseFloat(row.price) || 0,
        description: row.description || null,
        image_url: row.image_url || null,
        is_spicy: truthy(row.is_spicy),
        is_vegetarian: truthy(row.is_vegetarian),
      }])

      if (error) skipped++
      else success++
    }

    setBatchResult({ success, skipped })
    setBatchSaving(false)
    if (success > 0) load()
  }

  const openEdit = (item: MenuItem) => {
    setEditingId(item.id)
    setForm({
      category: item.category,
      name: item.name,
      description: item.description ?? '',
      price: String(item.price),
      image_url: item.image_url ?? '',
      is_spicy: item.is_spicy,
      is_vegetarian: item.is_vegetarian,
      is_featured_hero: item.is_featured_hero,
    })
    setNameWarning('')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      category: form.category,
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || null,
      is_spicy: form.is_spicy,
      is_vegetarian: form.is_vegetarian,
      is_featured_hero: form.is_featured_hero,
      updated_at: new Date().toISOString(),
    }

    if (editingId) {
      await supabase.from('menu_items').update(payload).eq('id', editingId)
    } else {
      await supabase.from('menu_items').insert([payload])
    }

    setShowForm(false)
    setSaving(false)
    load()
  }

  const toggleAvailable = async (item: MenuItem) => {
    await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id)
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, is_available: !i.is_available } : i))
    )
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this menu item? This cannot be undone.')) return
    await supabase.from('menu_items').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const toggleHero = async (item: MenuItem) => {
    await supabase.from('menu_items').update({ is_featured_hero: !item.is_featured_hero }).eq('id', item.id)
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_featured_hero: !i.is_featured_hero } : i)))
  }

  const moveHeroItem = async (item: MenuItem, direction: 'up' | 'down') => {
    const heroItems = items.filter((i) => i.is_featured_hero).sort((a, b) => a.display_order - b.display_order)
    const index = heroItems.findIndex((i) => i.id === item.id)
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= heroItems.length) return

    const other = heroItems[swapIndex]
    const itemOrder = item.display_order
    const otherOrder = other.display_order

    await supabase.from('menu_items').update({ display_order: otherOrder }).eq('id', item.id)
    await supabase.from('menu_items').update({ display_order: itemOrder }).eq('id', other.id)

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === item.id) return { ...i, display_order: otherOrder }
        if (i.id === other.id) return { ...i, display_order: itemOrder }
        return i
      })
    )
  }

  if (tableMissing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Menu</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-amber-300 text-sm">
          The <code className="bg-black/30 px-1 rounded">menu_items</code> table doesn&apos;t exist yet.
          Run <code className="bg-black/30 px-1 rounded">supabase/menu_items_table.sql</code> then{' '}
          <code className="bg-black/30 px-1 rounded">supabase/seed_menu_items.sql</code> in the Supabase
          SQL Editor, then reload this page.
        </div>
      </div>
    )
  }

  const categories = ['All', ...CATEGORY_OPTIONS]
  const duplicateNames = new Set(
    items
      .map((i) => i.name.trim().toLowerCase())
      .filter((name, idx, arr) => arr.indexOf(name) !== arr.lastIndexOf(name))
  )
  const issueCount = items.filter((i) => !i.image_url || duplicateNames.has(i.name.trim().toLowerCase())).length
  const visibleItems = (
    activeCategory === '__issues__'
      ? items.filter((i) => !i.image_url || duplicateNames.has(i.name.trim().toLowerCase()))
      : activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory)
  )
  const heroItems = items.filter((i) => i.is_featured_hero).sort((a, b) => a.display_order - b.display_order)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Menu</h1>
          <p className="text-gray-400 text-sm">{items.length} items across {CATEGORY_OPTIONS.length} categories</p>
        </div>
      </div>

      {/* View switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('items')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
            view === 'items' ? 'bg-zara-gold text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setView('slideshow')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1.5 ${
            view === 'slideshow' ? 'bg-zara-gold text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Star size={14} /> Hero Slideshow ({heroItems.length})
        </button>
      </div>

      {view === 'slideshow' ? (
        <div>
          <p className="text-gray-400 text-sm mb-4">
            These images rotate on the homepage hero, in this order. Use the arrows to reorder, or remove
            an item to take it out of rotation. To add more, go to All Items and click the ⭐ star button
            on any dish.
          </p>
          {heroItems.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
              No items in the slideshow yet.
            </div>
          ) : (
            <div className="space-y-3">
              {heroItems.map((item, i) => (
                <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex items-center gap-4">
                  <span className="text-gray-500 font-bold w-6 text-center">{i + 1}</span>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-20 h-14 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-semibold">{item.name}</p>
                    <p className="text-gray-500 text-xs">{item.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveHeroItem(item, 'up')}
                      disabled={i === 0}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveHeroItem(item, 'down')}
                      disabled={i === heroItems.length - 1}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => toggleHero(item)}
                      className="px-2 py-1 bg-gray-700 hover:bg-red-700 text-white rounded"
                      title="Remove from slideshow"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
      <>
      <div className="flex items-center justify-between mb-6">
        <div />
        <div className="flex gap-2">
          <button
            onClick={() => { setShowBatchUpload(true); setBatchResult(null); setParsedRows([]) }}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold px-4 py-2 rounded-lg transition"
          >
            <Upload size={18} />
            Import from Excel/CSV
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-zara-gold hover:bg-zara-orange text-black font-bold px-4 py-2 rounded-lg transition"
          >
            <Plus size={18} />
            Add Item
          </button>
        </div>
      </div>

      {/* Batch upload modal */}
      {showBatchUpload && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white text-lg">Import Menu Items</h2>
              <button onClick={() => setShowBatchUpload(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
              <p className="text-gray-400 text-sm">
                Upload an Excel (.xlsx) or CSV file. Columns can be in any order -- they&apos;re matched by
                header name: <code className="bg-black/40 px-1 rounded text-xs">name, category, price, description, image_url, is_spicy, is_vegetarian</code>
              </p>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-1.5 text-zara-gold hover:underline text-sm whitespace-nowrap"
              >
                <Download size={14} /> Download template
              </button>
            </div>

            {/* Drag and drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragActive(false)
                handleFileSelect(e.dataTransfer.files)
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                dragActive ? 'border-zara-gold bg-zara-gold/10' : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <FileSpreadsheet size={32} className="mx-auto mb-2 text-gray-400" />
              <p className="text-gray-300 text-sm font-medium">Drag and drop your file here, or click to browse</p>
              <p className="text-gray-500 text-xs mt-1">.xlsx, .xls, or .csv</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>

            {/* Preview table */}
            {parsedRows.length > 0 && (
              <div className="mt-5">
                <p className="text-sm text-gray-300 mb-2">
                  {parsedRows.length} row{parsedRows.length === 1 ? '' : 's'} found --{' '}
                  {parsedRows.filter((r) => r.issues.every((i) => i === 'No image path -- item will show with no photo')).length} ready to import,{' '}
                  {parsedRows.filter((r) => r.issues.some((i) => i !== 'No image path -- item will show with no photo')).length} will be skipped
                </p>
                <div className="max-h-64 overflow-y-auto border border-gray-700 rounded-lg">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-900 sticky top-0">
                      <tr className="text-left text-gray-400">
                        <th className="p-2">Name</th>
                        <th className="p-2">Category</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedRows.map((row, i) => {
                        const blocking = row.issues.filter((iss) => iss !== 'No image path -- item will show with no photo')
                        const hasImageWarningOnly = row.issues.length > 0 && blocking.length === 0
                        return (
                          <tr key={i} className="border-t border-gray-700">
                            <td className="p-2 text-white">{row.name || '--'}</td>
                            <td className="p-2 text-gray-300">{row.category || '--'}</td>
                            <td className="p-2 text-gray-300">{row.price || '--'}</td>
                            <td className="p-2">
                              {blocking.length > 0 ? (
                                <span className="text-red-400 flex items-center gap-1"><AlertTriangle size={12} /> {blocking.join('; ')}</span>
                              ) : hasImageWarningOnly ? (
                                <span className="text-amber-400 flex items-center gap-1"><ImageOff size={12} /> No image</span>
                              ) : (
                                <span className="text-green-400">Ready</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {batchResult && (
              <div className={`mt-4 text-sm rounded-lg p-3 ${batchResult.skipped > 0 ? 'bg-amber-500/10 text-amber-300' : 'bg-green-500/10 text-green-400'}`}>
                ✓ {batchResult.success} added{batchResult.skipped > 0 ? `, ${batchResult.skipped} skipped (see status column above)` : ''}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleConfirmBatchUpload}
                disabled={batchSaving || parsedRows.length === 0}
                className="bg-zara-gold hover:bg-zara-orange text-black font-bold px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                {batchSaving ? 'Uploading...' : `Import ${parsedRows.filter((r) => r.issues.every((i) => i === 'No image path -- item will show with no photo')).length} Items`}
              </button>
              <button
                onClick={() => setShowBatchUpload(false)}
                className="text-gray-400 hover:text-white px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {issueCount > 0 && (
          <button
            onClick={() => setActiveCategory('__issues__')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center gap-1 ${
              activeCategory === '__issues__' ? 'bg-red-600 text-white' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            }`}
          >
            <AlertTriangle size={12} /> Issues ({issueCount})
          </button>
        )}
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
              activeCategory === c ? 'bg-zara-gold text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-lg p-5 mb-6 space-y-4">
          <h2 className="font-bold text-white">{editingId ? 'Edit Item' : 'New Item'}</h2>

          <div className="grid sm:grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="Dish name"
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }))
                checkDuplicateName(e.target.value, editingId ?? undefined)
              }}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
          </div>
          {nameWarning && (
            <p className="text-amber-400 text-xs flex items-center gap-1.5">
              <AlertTriangle size={12} /> {nameWarning}
            </p>
          )}

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
          />

          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="number"
              step="0.01"
              required
              placeholder="Price (GHS)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
            <input
              type="text"
              placeholder="Image path (e.g. /images/menu/rice-dishes/jollof.jpg)"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={form.is_spicy}
                onChange={(e) => setForm((f) => ({ ...f, is_spicy: e.target.checked }))}
              />
              🌶 Spicy
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={form.is_vegetarian}
                onChange={(e) => setForm((f) => ({ ...f, is_vegetarian: e.target.checked }))}
              />
              🥬 Vegetarian
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={form.is_featured_hero}
                onChange={(e) => setForm((f) => ({ ...f, is_featured_hero: e.target.checked }))}
              />
              ⭐ Show in homepage hero slideshow
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-zara-gold hover:bg-zara-orange text-black font-bold px-4 py-2 rounded-lg transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Item'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading menu…</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className={`bg-gray-800 border rounded-lg overflow-hidden ${
                item.is_available ? 'border-gray-700' : 'border-gray-700 opacity-50'
              }`}
            >
              <div className="aspect-[4/3] bg-gray-900 relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                    <ImageOff size={24} />
                    <span className="text-[10px] mt-1">No image</span>
                  </div>
                )}
                {item.is_featured_hero && (
                  <span className="absolute top-2 left-2 bg-zara-gold text-black text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Star size={10} /> Hero
                  </span>
                )}
                {duplicateNames.has(item.name.trim().toLowerCase()) && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <AlertTriangle size={10} /> Duplicate
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-[10px] text-gray-500 uppercase font-bold">{item.category}</p>
                <h3 className="font-bold text-white text-sm mb-1">{item.name}</h3>
                <p className="text-zara-gold font-bold text-sm mb-2">GHS {item.price.toFixed(0)}</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => toggleHero(item)}
                    title={item.is_featured_hero ? 'Remove from hero slideshow' : 'Add to hero slideshow'}
                    className={`px-2 py-1.5 rounded transition ${
                      item.is_featured_hero
                        ? 'bg-zara-gold text-black hover:bg-zara-orange'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                  >
                    <Star size={14} />
                  </button>
                  <button
                    onClick={() => toggleAvailable(item)}
                    title={item.is_available ? 'Mark unavailable' : 'Mark available'}
                    className="px-2 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
                  >
                    {item.is_available ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="px-2 py-1.5 bg-gray-700 hover:bg-red-700 text-white rounded transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}
    </div>
  )
}
