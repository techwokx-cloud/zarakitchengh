'use client'

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
  return (
    <section id="menu" className="py-6 md:py-8 px-4 bg-[#FFF8E7]">
      <div className="container-wide">
        <div className="grid grid-cols-4 md:grid-cols-8">
          {menuCategories.map((category) => (
            <a
              key={category.name}
              href={`/menu?category=${encodeURIComponent(category.name)}`}
              className="group block"
            >
              <img
                src={category.icon}
                alt={category.name}
                className="w-full h-auto group-hover:opacity-80 transition-opacity"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
