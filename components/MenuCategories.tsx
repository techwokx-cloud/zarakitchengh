'use client'

const menuCategories = [
  { name: 'Healthy Breakfast', slug: 'Healthy Breakfast', image: '/images/menu/healthy-breakfast/granola-bowl.jpg' },
  { name: 'Hot Breakfast', slug: 'Hot Breakfast', image: '/images/menu/hot-breakfast/zara-full-breakfast1.jpg' },
  { name: 'On the Bakery', slug: 'On the Bakery', image: '/images/menu/on-the-bakery/waffles.jpg' },
  { name: 'Appetisers', slug: 'Appetisers', image: '/images/menu/appetisers/kelewele.jpg' },
  { name: 'Salads', slug: 'Salads', image: '/images/menu/salads/zara-salad.jpg' },
  { name: 'Light Meals', slug: 'Light Meals', image: '/images/menu/light-meals/zara-chic.jpg' },
  { name: 'On the Grill', slug: 'On the Grill', image: '/images/menu/on-the-grill/bbq-chicken.jpg' },
  { name: 'Pastas', slug: 'Pastas', image: '/images/menu/pastas/sea-food.jpg' },
  { name: 'Chinese Food', slug: 'Chinese Food', image: '/images/menu/chinese-food/chinese-chicken.jpg' },
  { name: 'Indian Dishes', slug: 'Indian Dishes', image: '/images/menu/indian-dishes/chicken-biyani.jpg' },
  { name: 'Rice Dishes', slug: 'Rice Dishes', image: '/images/menu/rice-dishes/zara-special.jpg' },
  { name: 'Ghanaian Specialities', slug: 'Ghanaian Specialities', image: '/images/menu/ghanaian-specialities/fuly-loaded-waakye.jpg' },
  { name: 'From the Grill', slug: 'From the Grill', image: '/images/menu/from-the-grill/charcoal-tilapia.jpg' },
  { name: 'Soups', slug: 'Soups', image: '/images/menu/soups/red-red.jpg' },
  { name: 'Extra Dishes', slug: 'Extra Dishes', image: '/images/menu/extra-dishes/jollof-rice.jpg' },
  { name: 'Desserts', slug: 'Desserts', image: '/images/menu/desserts/cakes-and-dessert.jpg' },
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
              key={category.slug}
              href={`/menu?category=${encodeURIComponent(category.slug)}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden ring-1 ring-black/10 shadow-sm group-hover:ring-2 group-hover:ring-zara-gold transition-all">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
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
