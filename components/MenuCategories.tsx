'use client'

import { useState } from 'react'

const menuCategories = [
  { id: 1, name: 'Healthy Breakfast', image: '/images/menu/healthy-breakfast/granola-bowl.jpg' },
  { id: 2, name: 'Hot Breakfast', image: '/images/menu/hot-breakfast/zara-full-breakfast1.jpg' },
  { id: 3, name: 'On the Bakery', image: '/images/menu/on-the-bakery/waffles.jpg' },
  { id: 4, name: 'Appetisers', image: '/images/menu/appetisers/kelewele.jpg' },
  { id: 5, name: 'Salads', image: '/images/menu/salads/zara-salad.jpg' },
  { id: 6, name: 'Light Meals', image: '/images/menu/light-meals/zara-chic.jpg' },
  { id: 7, name: 'On the Grill', image: '/images/menu/on-the-grill/bbq-chicken.jpg' },
  { id: 8, name: 'Pastas', image: '/images/menu/pastas/sea-food.jpg' },
  { id: 9, name: 'Chinese Food', image: '/images/menu/chinese-food/chinese-chicken.jpg' },
  { id: 10, name: 'Indian Dishes', image: '/images/menu/indian-dishes/chicken-biyani.jpg' },
  { id: 11, name: 'Rice Dishes', image: '/images/menu/rice-dishes/zara-special.jpg' },
  { id: 12, name: 'Ghanaian Specialities', image: '/images/menu/ghanaian-specialities/fuly-loaded-waakye.jpg' },
  { id: 13, name: 'From the Grill', image: '/images/menu/from-the-grill/charcoal-tilapia.jpg' },
  { id: 14, name: 'Soups', image: '/images/menu/soups/red-red.jpg' },
  { id: 15, name: 'Extra Dishes', image: '/images/menu/extra-dishes/jollof-rice.jpg' },
  { id: 16, name: 'Desserts', image: '/images/menu/desserts/cakes-and-dessert.jpg' },
]

export default function MenuCategories() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section id="menu" className="py-12 md:py-16 px-4 bg-white">
      <div className="container-wide">
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-center text-black mb-2">
          Our Menu
        </h2>
        <p className="text-center text-gray-600 mb-10 md:mb-12">
          Sixteen categories, one kitchen — pick where you want to start
        </p>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelected(selected === category.id ? null : category.id)}
              className={`
                group relative aspect-square rounded-xl overflow-hidden transition-all duration-300
                ${selected === category.id ? 'ring-2 ring-zara-gold ring-offset-2' : ''}
              `}
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <p className="absolute bottom-2 left-2 right-2 text-xs md:text-sm font-semibold text-white leading-tight text-left">
                {category.name}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Category Info */}
        {selected && (
          <div className="mt-12 bg-gradient-to-r from-zara-gold/10 to-zara-orange/10 rounded-lg p-6 md:p-8">
            <h3 className="font-display text-2xl font-semibold text-black mb-4">
              {menuCategories.find((c) => c.id === selected)?.name}
            </h3>
            <p className="text-gray-700 mb-4">
              Browse our delicious {menuCategories.find((c) => c.id === selected)?.name.toLowerCase()} options.
            </p>
            <a href="/menu" className="btn-primary inline-block">
              View Full Menu &amp; Order
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
