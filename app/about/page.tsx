'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CheckCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero: script "About" + bold "Zara Kitchen", description left; restaurant photo right */}
      <section className="relative bg-black border-b border-gray-800">
        <div className="container-wide grid lg:grid-cols-2">
          <div className="py-10 md:py-16 px-4">
            <p className="font-display italic text-3xl md:text-4xl text-white mb-1">About</p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-zara-gold mb-4">
              Zara Kitchen <span className="text-white">❤️</span>
            </h1>
            <p className="text-gray-300 leading-relaxed max-w-xl">
              Zara Kitchen is a restaurant situated at 64 Patrice Lumumba St, Accra, Ghana. It offers a variety
              of dishes, including Beef Shawarma, fries with guacamole, Frappuccino, pies, and Nasi Goreng.
              The establishment is praised for its great service, natural juices made upon request, and
              affordability. However, some reviews mention longer wait times, so ordering ahead is recommended.
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

      {/* Our Story + photo */}
      <section className="py-12 md:py-16 px-4 bg-[#FFF8E7]">
        <div className="container-wide grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-black mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4 leading-relaxed text-sm">
              At Zara Kitchen, you are treated to a menu of Ghanaian and Continental dishes that will no doubt
              leave your palate satisfied and your tummy filled.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed text-sm">
              With its fresh, innovative international cuisine and sleek modern decor, Zara Restaurant &amp; Bar
              is a dining experience that shouldn&apos;t be missed. Join us for breakfast, lunch, dinner or a
              late-night treat. Our award-winning chef and professional staff are dedicated to creating the
              perfect dining experience for your senses. Imagination is the key ingredient in this kitchen!
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed text-sm">
              Zara Kitchen is a delightful culinary gem that promises an exceptional dining experience. Known
              for its attentive service and welcoming atmosphere, this spot offers a range of delicious dishes
              made with fresh ingredients. Guests rave about the natural juices prepared on request, ensuring
              every sip is pure bliss. The menu features enticing options like Nasi Goreng, beef shawarma, and
              flavorful fried rice—though it&apos;s wise to place your order in advance as it can take some time
              to prepare.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src="/images/hero/jollof-grilled-chicken.jpg"
              alt="Grilled chicken and jollof rice bowl"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Why you should go / Know before you go */}
        <div className="container-wide grid md:grid-cols-2 gap-10 mt-10">
          <div>
            <h3 className="font-display text-2xl font-semibold text-black mb-4">Why you should go</h3>
            <div className="space-y-3">
              {[
                'Enjoy natural and additive-free juices made upon request',
                'Affordable prices for quality food',
                'Experience the enticing aroma and flavors of dishes like Nasi Goreng',
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-zara-gold text-black font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl font-semibold text-black mb-4">Know before you go</h3>
            <div className="space-y-3">
              {[
                'Order ahead of time to avoid long wait times',
                'Try the fried rice which is highly recommended by reviewers',
                "Don't miss out on their Pina Colada drink that's worth a visit",
                'Consider tipping Ishmael for excellent customer service',
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle size={20} className="text-zara-gold flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features -- mockup asset used as-is */}
      <section className="py-12 px-4 bg-black border-t border-gray-800">
        <div className="container-wide">
          <img
            src="/images/assets/features.png"
            alt="Features: Accepts Credit Cards, Air conditioning, Alcohol, Breakfast, Delivery, Event Space, Free Parking, Good for Business Meeting, Group Friendly, Kid Friendly, Outdoor Seating, Reservation, Take-out, Walk-in"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </section>

      {/* Buffet photo + Opening Hours + Coverage + Details + Contact info */}
      <section className="py-12 px-4 bg-[#FFF8E7]">
        <div className="container-wide grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1 rounded-lg overflow-hidden">
            <img
              src="/images/about/buffet-spread.png"
              alt="Zara Kitchen buffet spread"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-black mb-4">🕐 Opening Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Monday</span><span className="text-black">08:00 AM - 06:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tuesday</span><span className="text-black">08:00 AM - 06:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Wednesday</span><span className="text-black">08:00 AM - 06:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Thursday</span><span className="text-black">08:00 AM - 06:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Friday</span><span className="text-black">08:00 AM - 07:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Saturday</span><span className="text-black">09:00 AM - 05:00 PM</span></div>
              <div className="flex justify-between"><span className="text-red-500">Sunday</span><span className="text-red-500">Closed</span></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-black mb-3">📦 Coverage</h3>
            <p className="text-sm text-gray-600 mb-4">Walk in | Delivery | Corporate | Outdoor Catering Events</p>
            <h3 className="font-bold text-black mb-3">📞 Contact</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>+233 (0) 543637122</p>
              <p>054 363 7122</p>
              <p>@zarakitchenofficial</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-black mb-3">📍 Details</h3>
            <p className="text-sm text-gray-600 mb-4">
              66th Patrice Lumumba Street, Airport Residential Area, Accra, Ghana, 00233
            </p>
            <h3 className="font-bold text-black mb-2">🔗 Links</h3>
            <a href="https://zarakitchengh.com" className="text-sm text-zara-gold hover:underline">zarakitchengh.com</a>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-bold text-black mb-3">👤 Contact Info</h3>
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <p>📘 zarakitchenofficial &nbsp; 📷 zarakitchenghana &nbsp; 🎵 ZaraKitchenGha</p>
              <p>📞 054 363 7122</p>
              <p>✉️ info@zarakitchengh.com</p>
              <p>📞 +233 54 013 1808</p>
            </div>
            <p className="text-xs text-gray-500">
              A very rich, well-curated and presentable brunch buffet with wide varieties of delicious local,
              Chinese, continental dishes including finger foods on display; perfect for groups.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom trust strip */}
      <section className="py-8 px-4 bg-black border-t border-gray-800">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '👨‍🍳', title: 'Authentic Cuisine', desc: 'Delicious Ghanaian & Continental dishes made with love.' },
            { icon: '🌿', title: 'Fresh Ingredients', desc: 'We use only the freshest ingredients daily.' },
            { icon: '👥', title: 'Great Service', desc: 'Our friendly staff is here to serve you with a smile.' },
            { icon: '🏆', title: 'Award Winning', desc: 'Recognized for our quality food and excellent service.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">{item.icon}</div>
              <div>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
