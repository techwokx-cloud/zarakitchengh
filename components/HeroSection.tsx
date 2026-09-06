'use client'

import { ShoppingCart, MessageCircle } from 'lucide-react'

export default function HeroSection() {
  return (
    <section id="home" className="relative w-full overflow-hidden bg-black">
      <div className="grid lg:grid-cols-[38%_62%]">

        {/* Left: headline, CTAs, Ask Zara widget -- real HTML, fully interactive */}
        <div className="px-4 md:px-8 py-8 md:py-12 flex flex-col justify-center">
          <p className="text-sm md:text-base tracking-wide text-gray-300 mb-2">
            Authentic Ghanaian &amp; Continental Cuisine
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-[1.05] mb-1 text-white">
            Zara <span className="text-zara-gold">Kitchen</span>
          </h1>
          <p className="font-display italic text-2xl md:text-3xl text-white mb-1">
            Made with Love <span className="text-zara-gold">♡</span>
          </p>
          <p className="text-sm md:text-base text-gray-300 mb-5">
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

          {/* Mascot + Ask Zara widget row */}
          <div className="flex items-end">
            <img
              src="/images/mascot/zara-bot-full.jpg"
              alt="Zara, the Zara Kitchen food assistant"
              className="hidden sm:block w-24 md:w-28 h-auto flex-shrink-0 -mr-4 relative z-10"
            />
            <div className="ask-zara-widget flex-1 max-w-xs">
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

        {/* Right: single signature photo (with "Delicious Meals" baked in from the mockup), edge-to-edge */}
        <div className="relative min-h-[320px] md:min-h-[500px]">
          <img
            src="/images/hero/hero-signature-bowl.jpg"
            alt="Delicious grilled chicken, jollof rice and fresh salad bowl"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  )
}
