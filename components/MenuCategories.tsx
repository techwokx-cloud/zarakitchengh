'use client'

const menuCategories = [
  { name: 'Healthy Breakfast', icon: '🥣', bg: 'bg-green-100' },
  { name: 'Hot Breakfast', icon: '🍳', bg: 'bg-orange-100' },
  { name: 'On the Bakery', icon: '🥐', bg: 'bg-amber-100' },
  { name: 'Appetisers', icon: '🍤', bg: 'bg-red-100' },
  { name: 'Salads', icon: '🥗', bg: 'bg-lime-100' },
  { name: 'Light Meals', icon: '🥪', bg: 'bg-yellow-100' },
  { name: 'On the Grill', icon: '🍗', bg: 'bg-orange-100' },
  { name: 'Pastas', icon: '🍝', bg: 'bg-amber-100' },
  { name: 'Chinese Food', icon: '🥡', bg: 'bg-red-100' },
  { name: 'Indian Dishes', icon: '🍛', bg: 'bg-orange-100' },
  { name: 'Rice Dishes', icon: '🍚', bg: 'bg-yellow-100' },
  { name: 'Ghanaian Specialities', icon: '🇬🇭', bg: 'bg-amber-100' },
  { name: 'From the Grill', icon: '🐟', bg: 'bg-blue-100' },
  { name: 'Soups', icon: '🥣', bg: 'bg-orange-100' },
  { name: 'Extra Dishes', icon: '🍟', bg: 'bg-yellow-100' },
  { name: 'Desserts', icon: '🍰', bg: 'bg-pink-100' },
]

export default function MenuCategories() {
  return (
    <section id="menu" className="py-12 md:py-16 px-4 bg-[#FFF8E7]">
      <div className="container-wide">
        <h2 className="font-display text-3xl md:text-5xl font-semibold text-center text-black mb-2">
          Our Menu
        </h2>
        <p className="text-center text-gray-600 mb-10 md:mb-12">
          Sixteen categories, one kitchen — tap one to see the full menu
        </p>

        {/* Menu Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-x-3 gap-y-6 md:gap-x-4 md:gap-y-8">
          {menuCategories.map((category) => (
            <a
              key={category.name}
              href={`/menu?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center ${category.bg} ring-1 ring-black/5 shadow-sm group-hover:ring-2 group-hover:ring-zara-gold group-hover:scale-105 transition-all`}>
                <span className="text-3xl md:text-5xl group-hover:scale-110 transition-transform">
                  {category.icon}
                </span>
              </div>
              <p className="mt-2 text-[11px] md:text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                {category.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
