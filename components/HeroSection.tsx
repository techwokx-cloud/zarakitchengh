'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShoppingCart, MessageCircle } from 'lucide-react'

const heroImages = [
  { url: '/images/hero/jollof-grilled-chicken.jpg', alt: 'Jollof Rice with Grilled Chicken' },
  { url: '/images/hero/waakye-special.jpg', alt: 'Waakye Special with Fish, Egg & Gari' },
  { url: '/images/hero/tilapia-banku-plantain.jpg', alt: 'Grilled Tilapia with Banku & Plantain' },
  { url: '/images/hero/red-red-plantain.jpg', alt: 'Red Red with Fried Plantain' },
  { url: '/images/hero/fufu-kontomire-soup.jpg', alt: 'Fufu with Kontomire Soup' },
  { url: '/images/hero/banku-fried-fish.jpg', alt: 'Banku with Fried Fish & Pepper' },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)

  return (
    <section id="home" className="relative w-full overflow-hidden bg-black">
      <div className="container-wide px-4 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left: Text + Ask Zara widget */}
          <div>
            <p className="text-sm md:text-base tracking-wide text-gray-300 mb-3">
              Authentic Ghanaian &amp; Continental Cuisine
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[0.95] mb-3 text-white">
              Zara <span className="text-zara-gold">Kitchen</span>
            </h1>
            <p className="font-display italic text-xl md:text-2xl text-gray-200 mb-2">
              Made with Love ❤️
            </p>
            <p className="text-sm md:text-base text-gray-400 mb-8">
              Fresh. Tasty. Satisfying.
            </p>

            <div className="flex gap-3 mb-10">
              <a href="/menu" className="btn-primary flex items-center gap-2">
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

            {/* Ask Zara Widget */}
            <div className="flex items-end gap-3 max-w-md">
              <img
                src="/images/mascot/zara-bot.png"
                alt="Zara, the Zara Kitchen food assistant"
                className="hidden sm:block w-20 h-20 flex-shrink-0"
              />
              <div className="ask-zara-widget flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    Z
                  </div>
                  <div>
                    <h3 className="font-bold text-black text-sm">Ask Zara</h3>
                    <p className="text-xs text-gray-600">Your Smart Food Assistant</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-black">What are you craving today?</p>
                  <div className="bg-purple-100 rounded-lg p-2.5">
                    <p className="text-xs text-gray-700">
                      I&apos;m hungry for something tasty under GH₵50
                    </p>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-2.5">
                    <p className="text-xs text-gray-700 mb-1">I&apos;ve got you! 🔥</p>
                    <p className="text-xs font-bold text-orange-600">
                      Try our Spicy Chicken Rice Bowl. GH₵45
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a href="/menu" className="flex-1 text-center text-xs py-2 px-2 bg-gray-100 hover:bg-gray-200 rounded transition">
                      📋 View Menu
                    </a>
                    <a
                      href="https://wa.me/233243637122"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs py-2 px-2 bg-green-50 hover:bg-green-100 rounded transition"
                    >
                      💬 Order on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Photo carousel, contained (not full-bleed) */}
          <div className="relative">
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              {heroImages.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={image.alt}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}

              {/* Delicious Meals Badge */}
              <div className="absolute bottom-4 right-4 bg-zara-gold text-black px-4 py-3 rounded-lg shadow-lg -rotate-2">
                <p className="font-display text-lg font-semibold italic leading-tight">Delicious Meals</p>
                <p className="text-xs">Made for you ❤️</p>
              </div>

              {/* Carousel Controls */}
              <button
                onClick={prevSlide}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Carousel dots */}
            <div className="flex justify-center gap-2 mt-4">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Show photo ${index + 1}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
