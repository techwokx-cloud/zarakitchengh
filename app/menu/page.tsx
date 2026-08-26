'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, Filter } from 'lucide-react'

// Mock data - will be replaced with API calls
const MENU_CATEGORIES = [
  { id: 1, name: 'All Categories', emoji: '📋' },
  { id: 2, name: 'Healthy Breakfast', emoji: '🥗' },
  { id: 3, name: 'Hot Breakfast', emoji: '🍳' },
  { id: 4, name: 'On the Bakery', emoji: '🥐' },
  { id: 5, name: 'Appetizers', emoji: '🍤' },
  { id: 6, name: 'Salads', emoji: '🥬' },
  { id: 7, name: 'Light Meals', emoji: '🍴' },
  { id: 8, name: 'On the Grill', emoji: '🔥' },
  { id: 9, name: 'Pastas', emoji: '🍝' },
  { id: 10, name: 'Chinese Food', emoji: '🥢' },
  { id: 11, name: 'Indian Dishes', emoji: '🍛' },
  { id: 12, name: 'Rice Dishes', emoji: '🍚' },
  { id: 13, name: 'Ghanaian Specialities', emoji: '🇬🇭' },
  { id: 14, name: 'From the Grill', emoji: '🐟' },
  { id: 15, name: 'Soups', emoji: '🍲' },
  { id: 16, name: 'Desserts', emoji: '🍰' },
]

const SAMPLE_MENU_ITEMS = [
  {
    id: 1,
    category: 'Appetizers',
    name: 'Steamed Mussels with glass noodles & garlic sauce',
    price: 98.00,
    description: 'Fresh mussels steamed with glass noodles in garlic sauce',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 2,
    category: 'Appetizers',
    name: 'Sweet & Sour Prawns',
    price: 92.50,
    description: 'Fresh prawns in sweet and sour sauce',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 3,
    category: 'Appetizers',
    name: 'Fried prawns with Vegetable and Cashew nuts',
    price: 98.00,
    description: 'Crispy fried prawns with fresh vegetables and cashews',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 4,
    category: 'Appetizers',
    name: 'Steamed Prawn with garlic',
    price: 108.00,
    description: 'Tender steamed prawns with aromatic garlic',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 5,
    category: 'Appetizers',
    name: 'Kung Pao Prawns',
    price: 93.50,
    description: 'Prawns in spicy kung pao sauce with peanuts',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 6,
    category: 'Appetizers',
    name: 'Blood Clam',
    price: 108.00,
    description: 'Fresh blood clams prepared with chef\'s special sauce',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 7,
    category: 'Appetizers',
    name: 'Fried Local Squid with Burglary sauce',
    price: 79.00,
    description: 'Crispy fried local squid with special burglary sauce',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 8,
    category: 'Appetizers',
    name: 'Boiled Local prawn with homemade soya sauce',
    price: 108.00,
    description: 'Tender boiled prawns with homemade soy sauce',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    isSpicy: false,
    isVegetarian: false,
  },
]

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All Categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState(SAMPLE_MENU_ITEMS)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    filterMenu(category, searchQuery)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterMenu(activeCategory, query)
  }

  const filterMenu = (category: string, search: string) => {
    let filtered = SAMPLE_MENU_ITEMS

    if (category !== 'All Categories') {
      filtered = filtered.filter(item => item.category === category)
    }

    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="container-wide">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Our Menu</h1>
          <p className="text-xl text-gray-300">Authentic Ghanaian & Continental Cuisine</p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8">
        {/* Sidebar - Categories */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Filter size={20} />
              Categories
            </h2>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold"
                />
              </div>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              {MENU_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeCategory === category.name
                      ? 'bg-zara-gold text-black font-bold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Menu Items */}
        <div className="flex-1">
          {/* Active Category Display */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{activeCategory}</h2>
            <p className="text-gray-400">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
            </p>
          </div>

          {/* Menu Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-zara-gold transition group"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition"></div>

                    {/* Tags */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {item.isSpicy && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          🌶️ Spicy
                        </span>
                      )}
                      {item.isVegetarian && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                          🥬 Vegan
                        </span>
                      )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 bg-zara-gold text-black px-4 py-2 rounded-lg font-bold text-lg">
                      GHS {item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>

                    {/* Add to Order Button */}
                    <button className="w-full bg-zara-gold text-black font-bold py-2 rounded-lg hover:bg-zara-orange transition">
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No items found matching your search.</p>
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

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-zara-gold/10 to-zara-orange/10 border-t border-gray-800">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Order?</h2>
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
