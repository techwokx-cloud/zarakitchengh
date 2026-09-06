'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'

// Recommended size for new slideshow images: 1920x800px (landscape, ~2.4:1),
// JPEG/WebP, quality 85-90+. Landscape orientation avoids empty bars/pixelation.
const heroImages = [
  { url: '/images/hero/hero-signature-bowl.jpg', alt: 'Grilled chicken, jollof rice and fresh salad bowl' },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (heroImages.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)

  return (
    <section id="home" className="relative w-full overflow-hidden bg-black h-[520px] md:h-[600px]">
      {/* Full-bleed background photo(s) */}
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

      {/* Scrim for text legibility on the left */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

      {/* Overlaid content */}
      <div className="relative z-10 h-full container-wide px-4 flex items-center">
        <div className="max-w-md">
          <p className="text-sm md:text-base tracking-wide text-gray-200 mb-2">
            Authentic Ghanaian &amp; Continental Cuisine
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] mb-1 text-white">
            Zara <span className="text-zara-gold">Kitchen</span>
          </h1>
          <p className="font-display italic text-2xl md:text-3xl text-white mb-1">
            Made with Love <span className="text-zara-gold">♡</span>
          </p>
          <p className="text-sm md:text-base text-gray-200 mb-5">
            Fresh. Tasty. Satisfying.
          </p>

          <div className="flex gap-3 mb-6">
            <a href="/menu" className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
              <ShoppingCart size={16} />
              Order Online
            </a>
            <a
              href="https://wa.me/233243637122"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2 text-sm px-5 py-2.5"
            >
              <MessageCircle size={16} />
              WhatsApp Order
            </a>
          </div>

          {/* Mascot + Ask Zara widget, floating over the photo */}
          <div className="flex items-end">
            <img
              src="/images/mascot/zara-bot-full.jpg"
              alt="Zara, the Zara Kitchen food assistant"
              className="hidden sm:block w-24 md:w-28 h-auto flex-shrink-0 -mr-4 relative z-10 animate-float drop-shadow-2xl"
            />
            <div className="ask-zara-widget flex-1 max-w-xs shadow-2xl">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  Z
                </div>
                <div>
                  <h3 className="font-bold text-black text-sm leading-tight">Ask Zara</h3>
                  <p className="text-[11px] text-gray-600">Your Smart Food Assistant</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-black">What are you craving today?</p>
                <div className="bg-purple-100 rounded-lg px-2.5 py-1.5">
                  <p className="text-[11px] text-gray-700">
                    I&apos;m hungry for something tasty under GH₵50
                  </p>
                </div>
                <div className="bg-orange-100 rounded-lg px-2.5 py-1.5">
                  <p className="text-[11px] text-gray-700">I&apos;ve got you! 🔥</p>
                  <p className="text-[11px] font-bold text-orange-600">
                    Try our Spicy Chicken Rice Bowl. <span className="bg-zara-gold px-1 rounded">GH₵45</span>
                  </p>
                </div>
                <a href="/menu" className="block w-full text-center bg-zara-gold text-black font-bold text-xs py-1.5 rounded hover:bg-zara-orange transition">
                  🛒 Add to Order
                </a>
                <div className="flex gap-1.5 pt-0.5">
                  <a href="/menu" className="flex-1 text-center text-[10px] py-1.5 px-1 bg-gray-100 hover:bg-gray-200 rounded transition">
                    📋 View Menu
                  </a>
                  <a
                    href="https://wa.me/233243637122"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-[10px] py-1.5 px-1 bg-green-50 hover:bg-green-100 rounded transition"
                  >
                    💬 Order on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Delicious Meals" tag -- baked into the current photo already; only add a fallback badge if a future slide doesn't have one */}

      {/* Carousel controls, only shown once more than one slide exists */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous photo"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next photo"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                aria-label={`Show photo ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
