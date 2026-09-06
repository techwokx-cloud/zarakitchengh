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
      {/* Full-width carousel, images shown uncropped (object-contain) */}
      <div className="relative w-full h-[420px] sm:h-[520px] md:h-[640px] bg-black">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={image.alt}
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Hero Text & Widget */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-8 py-6 z-20 pointer-events-none">
          {/* Left Content */}
          <div className="text-white max-w-md pointer-events-auto bg-black/50 backdrop-blur-sm rounded-xl p-4 md:bg-transparent md:backdrop-blur-none md:p-0">
            <p className="text-sm md:text-base tracking-wide text-gray-200 mb-2">
              Authentic Ghanaian &amp; Continental Cuisine
            </p>
            <h1 className="font-display text-3xl md:text-6xl font-semibold leading-[0.95] mb-2">
              Zara <span className="text-zara-gold">Kitchen</span>
            </h1>
            <p className="font-display italic text-lg md:text-2xl text-gray-100 mb-1">
              Made with Love ❤️
            </p>
            <p className="text-sm md:text-base text-gray-300 mb-4 md:mb-8">
              Fresh. Tasty. Satisfying.
            </p>

            <div className="flex gap-3">
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
          </div>

          {/* Ask Zara Widget */}
          <div className="hidden lg:flex items-end gap-2 pointer-events-auto">
            <img
              src="/images/mascot/zara-bot.png"
              alt="Zara, the Zara Kitchen food assistant"
              className="w-16 h-16 flex-shrink-0"
            />
            <div className="ask-zara-widget">
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

        {/* Carousel Navigation */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {heroImages.map((_, index) => (
            <button
              key={index}
              aria-label={`Show photo ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
        >
          <ChevronRight size={24} />
        </button>

        {/* Delicious Meals Badge */}
        <div className="hidden md:block absolute bottom-6 right-6 bg-zara-gold text-black px-6 py-4 rounded-lg shadow-lg max-w-xs z-20">
          <p className="font-display text-2xl font-semibold italic leading-tight">Delicious Meals</p>
          <p className="text-sm mt-1">Made for you, every time</p>
        </div>
      </div>
    </section>
  )
}
