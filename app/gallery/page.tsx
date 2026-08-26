'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const GALLERY_CATEGORIES = [
  { id: 'all', name: 'All', emoji: '📸' },
  { id: 'food', name: 'Our Food', emoji: '🍽️' },
  { id: 'ambiance', name: 'Ambiance', emoji: '✨' },
  { id: 'events', name: 'Events', emoji: '🎉' },
  { id: 'drinks', name: 'Drinks', emoji: '🍹' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' },
  { id: 'team', name: 'Happy Customers', emoji: '😊' },
]

const GALLERY_IMAGES = [
  {
    id: 1,
    category: 'food',
    title: 'Grilled Fish Platter',
    image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=600&fit=crop',
    description: 'Fresh grilled fish with spices',
  },
  {
    id: 2,
    category: 'ambiance',
    title: 'Dining Area',
    image: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600&h=600&fit=crop',
    description: 'Modern and cozy dining space',
  },
  {
    id: 3,
    category: 'food',
    title: 'Seafood Specialities',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop',
    description: 'Our signature seafood dishes',
  },
  {
    id: 4,
    category: 'food',
    title: 'Fried Rice',
    image: 'https://images.unsplash.com/photo-1584622666256-2ae8f8ded05e?w=600&h=600&fit=crop',
    description: 'Delicious fried rice with vegetables',
  },
  {
    id: 5,
    category: 'drinks',
    title: 'Fresh Juices',
    image: 'https://images.unsplash.com/photo-1585518419759-8f6da5a74ae1?w=600&h=600&fit=crop',
    description: 'Fresh natural juices',
  },
  {
    id: 6,
    category: 'ambiance',
    title: 'Restaurant Counter',
    image: 'https://images.unsplash.com/photo-1559529007-9650874c44a0?w=600&h=600&fit=crop',
    description: 'Professional service counter',
  },
  {
    id: 7,
    category: 'food',
    title: 'Bread & Pastries',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561611?w=600&h=600&fit=crop',
    description: 'Fresh baked goods daily',
  },
  {
    id: 8,
    category: 'desserts',
    title: 'Cheesecake',
    image: 'https://images.unsplash.com/photo-1612874742237-415221591f30?w=600&h=600&fit=crop',
    description: 'Delicious homemade cheesecake',
  },
  {
    id: 9,
    category: 'events',
    title: 'Corporate Event',
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&h=600&fit=crop',
    description: 'Professional event catering',
  },
  {
    id: 10,
    category: 'food',
    title: 'Beef Steak',
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&h=600&fit=crop',
    description: 'Premium grilled beef steaks',
  },
  {
    id: 11,
    category: 'ambiance',
    title: 'Evening Ambiance',
    image: 'https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600&h=600&fit=crop',
    description: 'Cozy evening dining',
  },
  {
    id: 12,
    category: 'team',
    title: 'Happy Diners',
    image: 'https://images.unsplash.com/photo-1552318281-6f405c0ab145?w=600&h=600&fit=crop',
    description: 'Satisfied customers enjoying their meal',
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
