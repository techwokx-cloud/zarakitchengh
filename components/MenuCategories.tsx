'use client'

import { useState } from 'react'

const menuCategories = [
  { id: 1, name: 'Healthy Breakfast', icon: '🥗', color: 'bg-green-50' },
  { id: 2, name: 'Hot Breakfast', icon: '🍳', color: 'bg-orange-50' },
  { id: 3, name: 'On the Bakery', icon: '🥐', color: 'bg-amber-50' },
  { id: 4, name: 'Appetisers', icon: '🍤', color: 'bg-red-50' },
  { id: 5, name: 'Salads', icon: '🥙', color: 'bg-green-50' },
  { id: 6, name: 'Light Meals', icon: '🌮', color: 'bg-yellow-50' },
  { id: 7, name: 'On the Grill', icon: '🍗', color: 'bg-orange-50' },
  { id: 8, name: 'Pastas', icon: '🍝', color: 'bg-amber-50' },
  { id: 9, name: 'Chinese Food', icon: '🥡', color: 'bg-red-50' },
  { id: 10, name: 'Indian Dishes', icon: '🍛', color: 'bg-orange-100' },
  { id: 11, name: 'Rice Dishes', icon: '🍚', color: 'bg-yellow-50' },
  { id: 12, name: 'Ghanaian Specialities', icon: '🍲', color: 'bg-amber-100' },
  { id: 13, name: 'From the Grill', icon: '🐟', color: 'bg-blue-50' },
  { id: 14, name: 'Soups', icon: '🥣', color: 'bg-orange-50' },
  { id: 15, name: 'Extra Dishes', icon: '🍟', color: 'bg-yellow-100' },
  { id: 16, name: 'Desserts', icon: '🍰', color: 'bg-pink-50' },
]

export default function MenuCategories() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section id="menu" className="py-12 px-4 bg-white">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-2">
          Our Menu
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Select a category to explore our delicious offerings
        </p>

        {/* Menu Grid */}
        <div className="grid grid-cols-5 md:grid-cols-8 gap-3 md:gap-4">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelected(selected === category.id ? null : category.id)}
              className={`
                menu-item group
                ${selected === category.id ? `${category.color} ring-2 ring-zara-gold` : `${category.color}`}
                transition-all duration-300
              `}
            >
              <div className="text-3xl md:text-4xl mb-2 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <p className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2">
                {category.name}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Category Info */}
        {selected && (
          <div className="mt-12 bg-gradient-to-r from-zara-gold/10 to-zara-orange/10 rounded-lg p-6 md:p-8">
            <h3 className="text-2xl font-bold text-black mb-4">
              {menuCategories.find((c) => c.id === selected)?.name}
            </h3>
            <p className="text-gray-700 mb-4">
              Browse our delicious {menuCategories.find((c) => c.id === selected)?.name.toLowerCase()} options.
            </p>
            <a href="tel:+233241234567" className="btn-primary inline-block">
              View Full Menu & Order
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
