'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const GALLERY_CATEGORIES = [
  { id: 'all', name: 'All', emoji: '📸' },
  { id: 'ghanaian', name: 'Ghanaian Classics', emoji: '🇬🇭' },
  { id: 'grill', name: 'Grill & Appetisers', emoji: '🔥' },
  { id: 'rice', name: 'Rice Dishes', emoji: '🍚' },
  { id: 'salads', name: 'Salads', emoji: '🥗' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' },
]

const GALLERY_IMAGES = [
  {
    id: 1,
    category: 'ghanaian',
    title: 'Jollof Rice with Grilled Chicken',
    image: '/images/hero/jollof-grilled-chicken.jpg',
    description: 'Our signature smoky jollof, served with grilled chicken and a fresh side salad',
  },
  {
    id: 2,
    category: 'ghanaian',
    title: 'Waakye Special',
    image: '/images/hero/waakye-special.jpg',
    description: 'Rice & beans loaded with fried fish, boiled egg, gari and spaghetti',
  },
  {
    id: 3,
    category: 'ghanaian',
    title: 'Banku with Fried Fish',
    image: '/images/hero/banku-fried-fish.jpg',
    description: 'Soft banku served with crispy fried fish and pepper sauce',
  },
  {
    id: 4,
    category: 'ghanaian',
    title: 'Grilled Tilapia with Banku',
    image: '/images/hero/tilapia-banku-plantain.jpg',
    description: 'Whole grilled tilapia with banku, fried plantain and avocado',
  },
  {
    id: 5,
    category: 'ghanaian',
    title: 'Fufu with Kontomire Soup',
    image: '/images/hero/fufu-kontomire-soup.jpg',
    description: 'Smooth fufu served with rich green kontomire soup',
  },
  {
    id: 6,
    category: 'ghanaian',
    title: 'Fufu with Light Soup',
    image: '/images/hero/fufu-light-soup.jpg',
    description: 'Fufu paired with a warming goat light soup',
  },
  {
    id: 7,
    category: 'ghanaian',
    title: 'Red Red with Fried Plantain',
    image: '/images/hero/red-red-plantain.jpg',
    description: 'Black-eyed peas stew served with sweet fried plantain',
  },
  {
    id: 8,
    category: 'ghanaian',
    title: 'Rice Balls with Light Soup',
    image: '/images/hero/riceballs-light-soup.jpg',
    description: 'Soft rice balls served in a spicy chicken light soup',
  },
  {
    id: 9,
    category: 'ghanaian',
    title: 'Akple with Fish Soup',
    image: '/images/hero/akple-fish-soup.jpg',
    description: 'Traditional akple served with dried fish and pepper soup',
  },
  {
    id: 10,
    category: 'ghanaian',
    title: 'Ampesi with Egg Stew',
    image: '/images/hero/yam-egg-stew-avocado.jpg',
    description: 'Boiled yam with rich egg stew and fresh avocado',
  },
  {
    id: 11,
    category: 'grill',
    title: 'Kelewele',
    image: '/images/menu/appetisers/kelewele.jpg',
    description: 'Spiced fried plantain cubes, a Zara Kitchen favourite',
  },
  {
    id: 12,
    category: 'grill',
    title: 'Grilled Guinea Fowl',
    image: '/images/menu/ghanaian-specialities/grilled-guinea-fowl.jpg',
    description: 'Charcoal grilled guinea fowl, smoky and tender',
  },
  {
    id: 13,
    category: 'grill',
    title: 'Charcoal Grilled Tilapia',
    image: '/images/menu/ghanaian-specialities/charcoal-tilapia.jpg',
    description: 'Fresh tilapia grilled over charcoal to perfection',
  },
  {
    id: 14,
    category: 'grill',
    title: 'Grilled Snapper',
    image: '/images/menu/ghanaian-specialities/grilled-snapper.jpg',
    description: 'Whole red snapper grilled with our house spice rub',
  },
  {
    id: 15,
    category: 'rice',
    title: 'Zara Special Fried Rice',
    image: '/images/menu/rice-dishes/zara-special.jpg',
    description: 'Our signature fried rice, loaded with flavour',
  },
  {
    id: 16,
    category: 'rice',
    title: 'Chicken Fried Rice',
    image: '/images/menu/rice-dishes/chiken-fried-rice.jpg',
    description: 'Classic fried rice tossed with tender chicken',
  },
  {
    id: 17,
    category: 'salads',
    title: 'Zara Salad',
    image: '/images/menu/salads/zara-salad.jpg',
    description: 'Our house salad, fresh and light',
  },
  {
    id: 18,
    category: 'salads',
    title: 'Avocado Salad',
    image: '/images/menu/salads/avacado-salad.jpg',
    description: 'Creamy avocado with crisp garden vegetables',
  },
  {
    id: 19,
    category: 'desserts',
    title: 'Assorted Cakes & Desserts',
    image: '/images/menu/desserts/cakes-and-dessert.jpg',
    description: 'A sweet selection to finish off your meal',
  },
  {
    id: 20,
    category: 'desserts',
    title: 'Ice Cream',
    image: '/images/menu/desserts/ice-cream.jpg',
    description: 'Cool, creamy ice cream in your favourite flavours',
  },
]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredImages = activeCategory === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory)

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Gallery <span className="text-zara-gold">❤️</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4">A Glimpse of Zara Kitchen</p>
            <p className="text-gray-400">
              Explore the ambiance, our delicious dishes and unforgettable moments at Zara Kitchen.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-gradient-to-b from-gray-900 to-black border-b border-gray-800">
        <div className="container-wide">
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
            {GALLERY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 md:px-6 py-2 rounded-full font-bold whitespace-nowrap transition ${
                  activeCategory === category.id
                    ? 'bg-zara-gold text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-4 bg-black">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative h-80 rounded-lg overflow-hidden cursor-pointer"
              >
                {/* Image */}
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/70 group-hover:bg-black/50 transition duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition duration-300">
                  <h3 className="text-xl font-bold text-white mb-2">{image.title}</h3>
                  <p className="text-gray-300">{image.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Events & Catering CTA */}
      <section className="py-12 px-4 bg-gradient-to-r from-zara-gold/10 to-zara-orange/10 border-t border-gray-800">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Your Special Event?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether it's a corporate gathering, wedding, or birthday celebration, let us make your event unforgettable with our catering services.
          </p>
          <a
            href="/catering"
            className="inline-block btn-primary text-lg px-8 py-4"
          >
            Explore Catering Packages 🎉
          </a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
