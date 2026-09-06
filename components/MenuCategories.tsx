'use client'

const menuCategories = [
  { name: 'Healthy Breakfast', icon: '/images/category-icons/breakfast.jpg' },
  { name: 'Hot Breakfast', icon: '/images/category-icons/hot-breakfast.jpg' },
  { name: 'On the Bakery', icon: '/images/category-icons/on-the-bakery.jpg' },
  { name: 'Appetisers', icon: '/images/category-icons/appetisers.jpg' },
  { name: 'Salads', icon: '/images/category-icons/salads.jpg' },
  { name: 'Light Meals', icon: '/images/category-icons/light-meals.jpg' },
  { name: 'On the Grill', icon: '/images/category-icons/on-the-grill.jpg' },
  { name: 'Pastas', icon: '/images/category-icons/pastas.jpg' },
  { name: 'Chinese Food', icon: '/images/category-icons/chinese-food.jpg' },
  { name: 'Indian Dishes', icon: '/images/category-icons/indian-dishes.jpg' },
  { name: 'Rice Dishes', icon: '/images/category-icons/rice-dishes.jpg' },
  { name: 'Ghanaian Specialities', icon: '/images/category-icons/ghanaian-specialities.jpg' },
  { name: 'From the Grill', icon: '/images/category-icons/from-the-grill.jpg' },
  { name: 'Soups', icon: '/images/category-icons/soups.jpg' },
  { name: 'Extra Dishes', icon: '/images/category-icons/extra-dishes.jpg' },
  { name: 'Desserts', icon: '/images/category-icons/desserts.jpg' },
]

export default function MenuCategories() {
  return (
    <section id="menu" className="py-8 md:py-10 px-4 bg-[#FFF8E7]">
      <div className="container-wide">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-x-2 gap-y-6">
          {menuCategories.map((category) => (
            <a
              key={category.name}
              href={`/menu?category=${encodeURIComponent(category.name)}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#FDF8EA] group-hover:ring-2 group-hover:ring-zara-gold transition-all">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <p className="mt-2 text-[11px] md:text-sm font-bold text-black leading-tight">
                {category.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
