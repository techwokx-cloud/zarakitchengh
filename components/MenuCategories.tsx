'use client'

import { useState, useEffect } from 'react'
import { fetchAvailableMenuItems, MenuItem } from '@/lib/menuItemsApi'
import QuickOrderModal from './QuickOrderModal'

const menuCategories = [
  { name: 'Healthy Breakfast', icon: '/images/category-icons/breakfast.png' },
  { name: 'Hot Breakfast', icon: '/images/category-icons/hot-breakfast.png' },
  { name: 'On the Bakery', icon: '/images/category-icons/on-the-bakery.png' },
  { name: 'Appetisers', icon: '/images/category-icons/appetisers.png' },
  { name: 'Salads', icon: '/images/category-icons/salads.png' },
  { name: 'Light Meals', icon: '/images/category-icons/light-meals.png' },
  { name: 'On the Grill', icon: '/images/category-icons/on-the-grill.png' },
  { name: 'Pastas', icon: '/images/category-icons/pastas.png' },
  { name: 'Chinese Food', icon: '/images/category-icons/chinese-food.png' },
  { name: 'Indian Dishes', icon: '/images/category-icons/indian-dishes.png' },
  { name: 'Rice Dishes', icon: '/images/category-icons/rice-dishes.png' },
  { name: 'Ghanaian Specialities', icon: '/images/category-icons/ghanaian-specialities.png' },
  { name: 'From the Grill', icon: '/images/category-icons/from-the-grill.png' },
  { name: 'Soups', icon: '/images/category-icons/soups.png' },
  { name: 'Extra Dishes', icon: '/images/category-icons/extra-dishes.png' },
  { name: 'Desserts', icon: '/images/category-icons/desserts.png' },
]

export default function MenuCategories() {
  const [revealed, setRevealed] = useState<string | null>(null)
  const [allItems, setAllItems] = useState<MenuItem[]>([])
  const [orderingItem, setOrderingItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    fetchAvailableMenuItems().then(setAllItems)
  }, [])

  const handleClick = (name: string) => {
    setRevealed((prev) => (prev === name ? null : name))
  }

  const items = revealed ? allItems.filter((i) => i.category === revealed) : []

  return (
    <section id="menu" className="py-6 md:py-8 px-4 bg-[#FFF8E7]">
      <div className="container-wide">
        <div className="grid grid-cols-4 md:grid-cols-8">
          {menuCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleClick(category.name)}
              className="group block text-left"
            >
              <img
                src={category.icon}
                alt={category.name}
                className={`w-full h-auto transition-opacity ${
                  revealed === category.name ? 'opacity-100' : 'group-hover:opacity-80'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Revealed menu preview */}
        {revealed && (
          <div className="mt-6 bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl font-semibold text-black">{revealed}</h3>
              <button
                onClick={() => setRevealed(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-black text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="group/item block bg-[#FFF8E7] rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition"
                >
                  <a href={`/menu?category=${encodeURIComponent(revealed)}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={item.image_url ?? ''}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                      />
                    </div>
                  </a>
                  <div className="p-3 flex items-center justify-between gap-2">
                    <a
                      href={`/menu?category=${encodeURIComponent(revealed)}`}
                      className="text-sm font-bold text-black leading-tight line-clamp-2 flex-1 hover:text-zara-gold transition"
                    >
                      {item.name}
                    </a>
                    <button
                      onClick={() => setOrderingItem(item)}
                      className="flex-shrink-0 flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-3 py-1.5 rounded-lg transition"
                    >
                      GHS {item.price.toFixed(0)}
                      <span className="text-xs">+</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-5">
              <a
                href={`/menu?category=${encodeURIComponent(revealed)}`}
                className="inline-block btn-primary text-sm px-6 py-2.5"
              >
                View Full {revealed} Menu ({items.length} items)
              </a>
            </div>
          </div>
        )}
      </div>

      {orderingItem && (
        <QuickOrderModal
          item={{ name: orderingItem.name, price: orderingItem.price }}
          onClose={() => setOrderingItem(null)}
        />
      )}
    </section>
  )
}
