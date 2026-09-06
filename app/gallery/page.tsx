'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const GALLERY_CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🖼️' },
  { id: 'food', name: 'Our Food', emoji: '🍽️' },
  { id: 'ambiance', name: 'Ambiance', emoji: '🏛️' },
  { id: 'events', name: 'Events', emoji: '🎉' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤' },
  { id: 'customers', name: 'Happy Customers', emoji: '😊' },
]

const GALLERY_IMAGES = [
  {
    id: 1,
    category: 'food',
    title: 'Jollof Rice with Grilled Chicken',
    image: '/images/hero/jollof-grilled-chicken.jpg',
    description: 'Our signature smoky jollof, served with grilled chicken and a fresh side salad',
  },
  {
    id: 2,
    category: 'food',
    title: 'Waakye Special',
    image: '/images/hero/waakye-special.jpg',
    description: 'Rice & beans loaded with fried fish, boiled egg, gari and spaghetti',
  },
  {
    id: 3,
    category: 'food',
    title: 'Banku with Fried Fish',
    image: '/images/hero/banku-fried-fish.jpg',
    description: 'Soft banku served with crispy fried fish and pepper sauce',
  },
  {
    id: 4,
    category: 'food',
    title: 'Grilled Tilapia with Banku',
    image: '/images/hero/tilapia-banku-plantain.jpg',
    description: 'Whole grilled tilapia with banku, fried plantain and avocado',
  },
  {
    id: 5,
    category: 'food',
    title: 'Fufu with Kontomire Soup',
    image: '/images/hero/fufu-kontomire-soup.jpg',
    description: 'Smooth fufu served with rich green kontomire soup',
  },
  {
    id: 6,
    category: 'food',
    title: 'Fufu with Light Soup',
    image: '/images/hero/fufu-light-soup.jpg',
    description: 'Fufu paired with a warming goat light soup',
  },
  {
    id: 7,
    category: 'food',
    title: 'Red Red with Fried Plantain',
    image: '/images/hero/red-red-plantain.jpg',
    description: 'Black-eyed peas stew served with sweet fried plantain',
  },
  {
    id: 8,
    category: 'food',
    title: 'Rice Balls with Light Soup',
    image: '/images/hero/riceballs-light-soup.jpg',
    description: 'Soft rice balls served in a spicy chicken light soup',
  },
  {
    id: 9,
    category: 'food',
    title: 'Akple with Fish Soup',
    image: '/images/hero/akple-fish-soup.jpg',
    description: 'Traditional akple served with dried fish and pepper soup',
  },
  {
    id: 10,
    category: 'food',
    title: 'Ampesi with Egg Stew',
    image: '/images/hero/yam-egg-stew-avocado.jpg',
    description: 'Boiled yam with rich egg stew and fresh avocado',
  },
  {
    id: 11,
    category: 'food',
    title: 'Kelewele',
    image: '/images/menu/appetisers/kelewele.jpg',
    description: 'Spiced fried plantain cubes, a Zara Kitchen favourite',
  },
  {
    id: 12,
    category: 'food',
    title: 'Grilled Guinea Fowl',
    image: '/images/menu/ghanaian-specialities/grilled-guinea-fowl.jpg',
    description: 'Charcoal grilled guinea fowl, smoky and tender',
  },
  {
    id: 13,
    category: 'food',
    title: 'Charcoal Grilled Tilapia',
    image: '/images/menu/ghanaian-specialities/charcoal-tilapia.jpg',
    description: 'Fresh tilapia grilled over charcoal to perfection',
  },
  {
    id: 14,
    category: 'food',
    title: 'Grilled Snapper',
    image: '/images/menu/ghanaian-specialities/grilled-snapper.jpg',
    description: 'Whole red snapper grilled with our house spice rub',
  },
  {
    id: 15,
    category: 'food',
    title: 'Zara Special Fried Rice',
    image: '/images/menu/rice-dishes/zara-special.jpg',
    description: 'Our signature fried rice, loaded with flavour',
  },
  {
    id: 16,
    category: 'food',
    title: 'Chicken Fried Rice',
    image: '/images/menu/rice-dishes/chiken-fried-rice.jpg',
    description: 'Classic fried rice tossed with tender chicken',
  },
  {
    id: 17,
    category: 'food',
    title: 'Zara Salad',
    image: '/images/menu/salads/zara-salad.jpg',
    description: 'Our house salad, fresh and light',
  },
  {
    id: 18,
    category: 'food',
    title: 'Avocado Salad',
    image: '/images/menu/salads/avacado-salad.jpg',
    description: 'Creamy avocado with crisp garden vegetables',
  },
  {
    id: 19,
    category: 'food',
    title: 'Assorted Cakes & Desserts',
    image: '/images/menu/desserts/cakes-and-dessert.jpg',
    description: 'A sweet selection to finish off your meal',
  },
  {
    id: 20,
    category: 'food',
    title: 'Ice Cream',
    image: '/images/menu/desserts/ice-cream.jpg',
    description: 'Cool, creamy ice cream in your favourite flavours',
  },
  {
    id: 21,
    category: 'ambiance',
    title: 'Zara Kitchen Dining Room',
    image: '/images/about/restaurant-interior.png',
    description: 'Our warm, welcoming dining space',
  },
  {
    id: 22,
    category: 'ambiance',
    title: 'Brunch Buffet Spread',
    image: '/images/about/buffet-spread.png',
    description: 'Our well-curated brunch buffet, laid out fresh',
  },
]

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredImages = activeCategory === 'all'
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter(img => img.category === activeCategory)

  const emptyCategoryNote: Record<string, string> = {
    events: "We're still building our events photo album — check back soon!",
    drinks: "We're still building our drinks photo album — check back soon!",
    customers: "We'll be sharing happy customer moments here soon!",
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-black border-b border-gray-800">
        <div className="container-wide grid lg:grid-cols-2">
          <div className="py-10 md:py-16 px-4">
            <p className="font-display italic text-3xl md:text-4xl text-white mb-1">Gallery</p>
            <h1 className="text-zara-gold text-lg font-semibold mb-4">A Glimpse of Zara Kitchen ❤️</h1>
            <p className="text-gray-400 max-w-md">
              Explore the ambiance, our delicious dishes and unforgettable moments at Zara Kitchen.
            </p>
          </div>
          <div className="relative h-56 md:h-auto min-h-[280px]">
            <img
              src="/images/about/restaurant-interior.png"
              alt="Zara Kitchen restaurant interior"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-[#FFF8E7] border-b border-gray-200">
        <div className="container-wide">
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
            {GALLERY_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 md:px-6 py-2 rounded-full font-bold whitespace-nowrap transition text-sm ${
                  activeCategory === category.id
                    ? 'bg-red-700 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
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
      <section className="py-12 px-4 bg-[#FFF8E7]">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-sm"
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
                <div className="absolute inset-0 p-3 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition duration-300">
                  <h3 className="text-sm font-bold text-white mb-1">{image.title}</h3>
                  <p className="text-gray-300 text-xs">{image.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {emptyCategoryNote[activeCategory] || 'No images found in this category.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Events & Catering CTA */}
      <section className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-semibold text-white mb-4">
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
