'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShoppingCart, MessageCircle } from 'lucide-react'

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop',
    alt: 'Grilled Chicken with Rice',
  },
  {
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop',
    alt: 'Assorted Meat with Fufu',
  },
  {
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop',
    alt: 'Spicy Chicken Rice Bowl',
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  return (
    <section id="home" className="relative w-full overflow-hidden">
      {/* Carousel */}
      <div className="relative h-screen max-h-96 md:max-h-screen">
        <div className="relative w-full h-full">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            </div>
          ))}
        </div>

        {/* Hero Text & Widget */}
        <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 z-20">
          {/* Left Content */}
          <div className="text-white max-w-md">
            <p className="text-sm md:text-base text-gray-300 mb-2">
              Authentic Ghanaian & Continental Cuisine
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-2">
              <span>Zara</span>
              <span className="text-zara-gold"> Kitchen</span>
            </h1>
            <p className="text-xl md:text-2xl italic text-gray-200 mb-2">
              Made with Love ❤️
            </p>
            <p className="text-sm md:text-base text-gray-300 mb-8">
              Fresh. Tasty. Satisfying.
            </p>

            <div className="flex gap-3">
              <a href="tel:+233241234567" className="btn-primary flex items-center gap-2">
                <ShoppingCart size={18} />
                Order Online
              </a>
              <a
                href="https://wa.me/233241234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center gap-2"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Ask Zara Widget */}
          <div className="hidden lg:block ask-zara-widget">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                Z
              </div>
              <div>
                <h3 className="font-bold text-black">Ask Zara</h3>
                <p className="text-xs text-gray-600">Your Smart Food Assistant</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-black">What are you craving today?</p>

              <div className="bg-purple-100 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  I'm hungry for something tasty under GH₵50
                </p>
              </div>

              <div className="bg-orange-100 rounded-lg p-3">
                <p className="text-sm text-gray-700 mb-2">
                  I've got you! 🔥
                </p>
                <p className="text-xs font-bold text-orange-600">
                  Try our Spicy Chicken Rice Bowl. GH₵45
                </p>
              </div>

              <button className="w-full btn-primary text-sm">
                🛒 Add to Order
              </button>

              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button className="flex-1 text-xs py-2 px-3 bg-gray-100 hover:bg-gray-200 rounded transition">
                  📋 View Menu
                </button>
                <button className="flex-1 text-xs py-2 px-3 bg-green-50 hover:bg-green-100 rounded transition">
                  💬 Order on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
        >
          <ChevronRight size={24} />
        </button>

        {/* Delicious Meals Badge */}
        <div className="absolute bottom-8 right-8 bg-zara-gold text-black px-6 py-4 rounded-lg shadow-lg max-w-xs">
          <p className="text-2xl font-bold italic">Delicious</p>
          <p className="text-2xl font-bold italic">Meals</p>
          <p className="text-sm">Made for You ❤️</p>
        </div>
      </div>
    </section>
  )
}
