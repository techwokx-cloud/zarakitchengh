'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SAMPLE_MENU_ITEMS } from '@/lib/menuData'

const GALLERY_CATEGORIES = [
  { id: 'all', name: 'All', emoji: '🖼️' },
  { id: 'food', name: 'Our Food', emoji: '🍽️' },
  { id: 'ambiance', name: 'Ambiance', emoji: '🏛️' },
  { id: 'events', name: 'Events', emoji: '🎉' },
  { id: 'drinks', name: 'Drinks', emoji: '🥤' },
  { id: 'customers', name: 'Happy Customers', emoji: '😊' },
]

const AMBIANCE_IMAGES = [
  {
    id: 9001,
    category: 'ambiance',
    title: 'Zara Kitchen Dining Room',
    image: '/images/about/restaurant-interior.png',
    description: 'Our warm, welcoming dining space',
  },
  {
    id: 9002,
    category: 'ambiance',
    title: 'Brunch Buffet Spread',
    image: '/images/about/buffet-spread.png',
    description: 'Our well-curated brunch buffet, laid out fresh',
  },
]

// Every dish photo from the real menu, pushed into the gallery automatically --
// stays in sync with lib/menuData.ts rather than needing a separately
// maintained list.
const FOOD_IMAGES = SAMPLE_MENU_ITEMS.map((item) => ({
  id: item.id,
  category: 'food',
  title: item.name,
  image: item.image,
  description: item.description,
}))

const GALLERY_IMAGES = [...FOOD_IMAGES, ...AMBIANCE_IMAGES]

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
