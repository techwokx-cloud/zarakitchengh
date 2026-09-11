// app/manager/menu/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { fetchAllMenuItems, MenuItem } from '@/lib/menuItemsApi'
import { MENU_CATEGORIES } from '@/lib/menuData'
import { Plus, Pencil, Trash2, Star, EyeOff, Eye } from 'lucide-react'

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

export default function ManagerMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

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
    setShowForm(true)
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
  const visibleItems = activeCategory === 'All' ? items : items.filter((i) => i.category === activeCategory)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Menu</h1>
          <p className="text-gray-400 text-sm">{items.length} items across {CATEGORY_OPTIONS.length} categories</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-zara-gold hover:bg-zara-orange text-black font-bold px-4 py-2 rounded-lg transition"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
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
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500"
            />
          </div>

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
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                )}
                {item.is_featured_hero && (
                  <span className="absolute top-2 left-2 bg-zara-gold text-black text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    <Star size={10} /> Hero
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
    </div>
  )
}
