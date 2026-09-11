'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, Filter } from 'lucide-react'
import { MENU_CATEGORIES } from '@/lib/menuData'
import { fetchAvailableMenuItems, MenuItem } from '@/lib/menuItemsApi'

function MenuPageContent() {
  const searchParams = useSearchParams()
  const categoryFromUrl = searchParams.get('category')

  const [activeCategory, setActiveCategory] = useState('All Categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [allItems, setAllItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  // Load real menu items from Supabase on mount
  useEffect(() => {
    fetchAvailableMenuItems().then((items) => {
      setAllItems(items)
      setFilteredItems(items)
      setLoading(false)
    })
  }, [])

  // Preset category + scroll to results when arriving from a homepage category link
  useEffect(() => {
    if (categoryFromUrl && allItems.length > 0) {
      const match = MENU_CATEGORIES.find(
        (c) => c.name.toLowerCase() === categoryFromUrl.toLowerCase()
      )
      const categoryName = match ? match.name : categoryFromUrl
      setActiveCategory(categoryName)
      setFilteredItems(
        categoryName === 'All Categories'
          ? allItems
          : allItems.filter((item) => item.category === categoryName)
      )
      const el = document.getElementById('menu-results')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromUrl, allItems])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    filterMenu(category, searchQuery)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterMenu(activeCategory, query)
  }

  const filterMenu = (category: string, search: string) => {
    let filtered = allItems

    if (category !== 'All Categories') {
      filtered = filtered.filter(item => item.category === category)
    }

    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description ?? '').toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }

  return (
    <main className="min-h-screen bg-[#FFF8E7]">
      <Header />

      <div className="p-4 md:p-8">
        {/* Breadcrumb */}
        <div className="container-wide mb-4 text-sm text-gray-600">
          <a href="/" className="hover:text-zara-gold">Home</a>
          <span className="mx-2">›</span>
          <span className="text-red-600 font-semibold">Food Menu</span>
        </div>

        <div className="container-wide flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Categories */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-5 sticky top-20 shadow-sm">
              <h2 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                <Filter size={18} />
                Categories
              </h2>

              {/* Search */}
              <div className="mb-5">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
                  />
                </div>
              </div>

              {/* Category List */}
              <div className="space-y-1">
                {MENU_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm flex items-center gap-2 ${
                      activeCategory === category.name
                        ? 'bg-zara-gold text-black font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{category.emoji}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Ask Zara mini widget -- mockup asset used as-is */}
              <a href="#" className="block mt-5">
                <img
                  src="/images/mascot/ask-zara-mini.png"
                  alt="Craving something special? Let Zara help you find your perfect meal. Ask Zara"
                  className="w-full h-auto"
                />
              </a>
            </div>
          </div>

          {/* Main Content - Menu Items */}
          <div id="menu-results" className="flex-1 scroll-mt-20">
            {/* Active Category Display */}
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-black mb-1">{activeCategory}</h2>
              <p className="text-gray-500 text-sm">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
              </p>
            </div>

            {/* Menu Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Loading menu…</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={item.image_url ?? ''}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {item.is_vegetarian && (
                        <span className="absolute top-2 right-2 bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                          🥬 Veg
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-black mb-1 leading-tight line-clamp-2">{item.name}</h3>

                      {/* Spice dots */}
                      <div className="flex items-center gap-0.5 mb-2">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span key={i} className={i < (item.is_spicy ? 2 : 0) ? 'text-red-500' : 'text-gray-200'}>
                            🌶
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-red-600 font-bold text-base">GHS {item.price.toFixed(0)}</span>
                        <button className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-xs transition">
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No items found matching your search.</p>
                <button
                  onClick={() => {
                    setActiveCategory('All Categories')
                    setSearchQuery('')
                    filterMenu('All Categories', '')
                  }}
                  className="mt-4 text-zara-gold hover:text-zara-orange transition"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-semibold text-white mb-4">Ready to Order?</h2>
          <p className="text-gray-300 mb-6">Choose your favorite dishes and place your order now!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+233243637122" className="btn-primary text-lg px-8 py-4">
              🛒 Order Online
            </a>
            <a
              href="https://wa.me/233243637122"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-8 py-4"
            >
              💬 Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuPageContent />
    </Suspense>
  )
}
