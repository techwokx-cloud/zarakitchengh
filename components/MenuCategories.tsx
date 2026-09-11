'use client'

import { useState, useEffect } from 'react'
import { fetchAvailableMenuItems, MenuItem } from '@/lib/menuItemsApi'

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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {items.slice(0, 12).map((item) => (
                <a
                  key={item.id}
                  href={`/menu?category=${encodeURIComponent(revealed)}`}
                  className="group/item"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-1.5">
                    <img
                      src={item.image_url ?? ''}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-xs font-semibold text-black leading-tight line-clamp-2">{item.name}</p>
                  <p className="text-xs text-red-600 font-bold">GHS {item.price.toFixed(0)}</p>
                </a>
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
    </section>
  )
}
