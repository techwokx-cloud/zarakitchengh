'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Upload } from 'lucide-react'

const CATEGORIES = [
  'Healthy Breakfast', 'Hot Breakfast', 'On the Bakery', 'Appetizers', 'Salads',
  'Light Meals', 'On the Grill', 'Pastas', 'Chinese Food', 'Indian Dishes',
  'Rice Dishes', 'Ghanaian Specialities', 'From the Grill', 'Soups', 'Extra Dishes', 'Desserts'
]

const MOCK_MENU_ITEMS = [
  {
    id: '1',
    category: 'Appetizers',
    name: 'Steamed Mussels',
    description: 'Fresh mussels steamed with glass noodles',
    price: 98.00,
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    is_available: true,
    is_spicy: false,
    is_vegetarian: false,
  },
  {
    id: '2',
    category: 'Appetizers',
    name: 'Sweet & Sour Prawns',
    description: 'Fresh prawns in sweet and sour sauce',
    price: 92.50,
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    is_available: true,
    is_spicy: true,
    is_vegetarian: false,
  },
]

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState(MOCK_MENU_ITEMS)
  const [selectedTab, setSelectedTab] = useState('menu')
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState('All')

  const [formData, setFormData] = useState({
    category: '',
    name: '',
    description: '',
    price: 0,
    image_url: '',
    is_available: true,
    is_spicy: false,
    is_vegetarian: false,
  })

  const handleAddItem = () => {
    setIsAddingItem(true)
    setFormData({
      category: '',
      name: '',
      description: '',
      price: 0,
      image_url: '',
      is_available: true,
      is_spicy: false,
      is_vegetarian: false,
    })
  }

  const handleEditItem = (item: any) => {
    setEditingItem(item.id)
    setFormData(item)
  }

  const handleSaveItem = () => {
    if (editingItem) {
      // Update existing
      setMenuItems(menuItems.map(item => 
        item.id === editingItem ? { ...formData, id: editingItem } : item
      ))
      setEditingItem(null)
    } else {
      // Add new
      const newItem = {
        ...formData,
        id: Math.random().toString(36).substring(7),
      }
      setMenuItems([...menuItems, newItem])
      setIsAddingItem(false)
    }
    resetForm()
  }

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(menuItems.filter(item => item.id !== id))
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) : value,
    }))
  }

  const resetForm = () => {
    setFormData({
      category: '',
      name: '',
      description: '',
      price: 0,
      image_url: '',
      is_available: true,
      is_spicy: false,
      is_vegetarian: false,
    })
  }

  const filteredItems = filterCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === filterCategory)

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Menu Management</h1>
          <p className="text-gray-400">Add, edit, and manage your menu items and pricing</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setSelectedTab('menu')}
            className={`px-4 py-2 font-bold transition ${
              selectedTab === 'menu'
                ? 'border-b-2 border-zara-gold text-zara-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📋 Menu Items
          </button>
          <button
            onClick={() => setSelectedTab('catering')}
            className={`px-4 py-2 font-bold transition ${
              selectedTab === 'catering'
                ? 'border-b-2 border-zara-gold text-zara-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎉 Catering Packages
          </button>
          <button
            onClick={() => setSelectedTab('bookings')}
            className={`px-4 py-2 font-bold transition ${
              selectedTab === 'bookings'
                ? 'border-b-2 border-zara-gold text-zara-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📅 Event Bookings
          </button>
        </div>

        {/* Menu Items Tab */}
        {selectedTab === 'menu' && (
          <div className="space-y-8">
            {/* Add Item Button */}
            {!isAddingItem && !editingItem && (
              <button
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-zara-gold text-black font-bold px-6 py-3 rounded-lg hover:bg-zara-orange transition"
              >
                <Plus size={20} />
                Add New Menu Item
              </button>
            )}

            {/* Add/Edit Form */}
            {(isAddingItem || editingItem) && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold">
                  {editingItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
                </h2>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-zara-gold"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Name & Price */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Item Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-zara-gold"
                      placeholder="e.g., Steamed Mussels"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Price (GHS)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-zara-gold"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-zara-gold resize-none"
                    placeholder="Describe the dish..."
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-zara-gold"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.image_url && (
                    <div className="mt-4">
                      <img src={formData.image_url} alt="Preview" className="max-w-xs rounded border border-gray-700" />
                    </div>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="grid md:grid-cols-4 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_available"
                      checked={formData.is_available}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span>Available</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_spicy"
                      checked={formData.is_spicy}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span>🌶️ Spicy</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_vegetarian"
                      checked={formData.is_vegetarian}
                      onChange={handleChange}
                      className="rounded"
                    />
                    <span>🥬 Vegetarian</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleSaveItem}
                    className="bg-zara-gold text-black font-bold px-6 py-2 rounded hover:bg-zara-orange transition"
                  >
                    💾 Save Item
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingItem(false)
                      setEditingItem(null)
                      resetForm()
                    }}
                    className="bg-gray-700 text-white font-bold px-6 py-2 rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Filter & List */}
            {!isAddingItem && !editingItem && (
              <div className="space-y-6">
                {/* Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Filter by Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-zara-gold"
                  >
                    <option>All</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left p-4 font-bold">Item Name</th>
                        <th className="text-left p-4 font-bold">Category</th>
                        <th className="text-left p-4 font-bold">Price (GHS)</th>
                        <th className="text-left p-4 font-bold">Status</th>
                        <th className="text-left p-4 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map(item => (
                        <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                          <td className="p-4">{item.name}</td>
                          <td className="p-4 text-gray-400">{item.category}</td>
                          <td className="p-4 font-bold text-zara-gold">GHS {item.price.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded text-xs font-bold ${
                              item.is_available ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                            }`}>
                              {item.is_available ? '✓ Available' : '✗ Unavailable'}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-blue-400 hover:text-blue-300 transition"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-400 hover:text-red-300 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredItems.length === 0 && (
                  <p className="text-center text-gray-400 py-8">No items in this category</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Catering Packages Tab */}
        {selectedTab === 'catering' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">Coming Soon: Manage catering packages pricing</p>
            <button className="bg-zara-gold text-black font-bold px-6 py-3 rounded hover:bg-zara-orange transition">
              Add Catering Package
            </button>
          </div>
        )}

        {/* Event Bookings Tab */}
        {selectedTab === 'bookings' && (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">Coming Soon: View and manage event bookings</p>
            <button className="bg-zara-gold text-black font-bold px-6 py-3 rounded hover:bg-zara-orange transition">
              View Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
