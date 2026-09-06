'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CheckCircle } from 'lucide-react'

export default function AboutPage() {
  const achievements = [
    {
      icon: '👨‍🍳',
      title: 'Expert Chefs',
      desc: 'Our culinary team brings 25+ years of international experience to every dish.',
    },
    {
      icon: '🌿',
      title: 'Fresh Ingredients',
      desc: 'We source only the freshest ingredients daily for quality assurance.',
    },
    {
      icon: '⭐',
      title: 'Award Winning',
      desc: 'Recognized for quality food and excellent service in Accra.',
    },
    {
      icon: '👥',
      title: 'Dedicated Team',
      desc: 'Professional staff committed to making your experience memorable.',
    },
  ]

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About Zara Kitchen <span className="text-zara-gold">❤️</span>
            </h1>
            <p className="text-xl text-gray-300">Authentic Ghanaian & Continental Cuisine Made with Love</p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container-wide grid md:grid-cols-2 gap-8 items-center">
          {/* Left - Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Story</h2>

            <p className="text-gray-300 mb-4 leading-relaxed">
              Zara Kitchen is a restaurant situated at 64 Patrice Lumumba Street in the Airport Residential Area, Accra. 
              It offers a variety of dishes including Beef Shawarma, fries with guacamole, Frappuccino, pies, and Nasi Goreng.
            </p>

            <p className="text-gray-300 mb-4 leading-relaxed">
              The establishment is praised for its great service, natural juices made upon request, and affordability. 
              With its fresh, innovative international cuisine and sleek modern decor, Zara Restaurant & Bar is a dining experience 
              that shouldn't be missed.
            </p>

            <p className="text-gray-300 mb-4 leading-relaxed">
              Our passionate chef and professional staff are dedicated to creating the perfect dining experience for our guests. 
              Imagination is the key ingredient in this kitchen, where we bring your culinary dreams to life.
            </p>

            <p className="text-gray-300 mb-6 leading-relaxed">
              Zara Kitchen is a delightful culinary gem that promises an exceptional dining experience. 
              Known for its attentive service and welcoming atmosphere, this spot offers a range of delicious dishes made with fresh ingredients. 
              Guests rave about the natural juices prepared on request, ensuring every sip is refreshing and healthy.
            </p>

            <div className="space-y-3">
              {[
                '🎯 Quality ingredients',
                '👨‍🍳 Expert preparation',
                '💚 Made with love',
                '⚡ Fresh daily',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-300">
                  <CheckCircle size={20} className="text-zara-gold flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image */}
          <div className="relative h-96 rounded-lg overflow-hidden border border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=600&h=600&fit=crop"
              alt="Zara Kitchen Restaurant"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why You Should Choose Us</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="bg-black border border-gray-800 rounded-lg p-6 text-center hover:border-zara-gold transition">
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h3 className="font-bold text-white mb-2">{achievement.title}</h3>
                <p className="text-gray-400 text-sm">{achievement.desc}</p>
              </div>
            ))}
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

      {/* Service Details */}
      <section className="py-12 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container-wide grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Operating Hours */}
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">🕐 Opening Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Monday</span><span className="text-white">08:00 AM - 06:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Tuesday</span><span className="text-white">08:00 AM - 06:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Wednesday</span><span className="text-white">08:00 AM - 06:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Thursday</span><span className="text-white">08:00 AM - 06:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Friday</span><span className="text-white">08:00 AM - 07:00 PM</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Saturday</span><span className="text-white">09:00 AM - 05:00 PM</span></div>
              <div className="flex justify-between"><span className="text-red-400">Sunday</span><span className="text-red-400">Closed</span></div>
            </div>
          </div>

          {/* Coverage -- mockup asset used as-is */}
          <div className="bg-black border border-gray-800 rounded-lg p-6 flex items-center">
            <img
              src="/images/assets/coverage.png"
              alt="Coverage: Walk in, Delivery, Corporate, Outdoor Catering Events"
              className="w-full h-auto"
            />
          </div>

          {/* Services */}
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">🎯 Services Available</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><span className="text-zara-gold">✓</span> All You Can Eat</li>
              <li className="flex items-center gap-2"><span className="text-zara-gold">✓</span> Happy Hour Food</li>
              <li className="flex items-center gap-2"><span className="text-zara-gold">✓</span> Reservation Available</li>
              <li className="flex items-center gap-2"><span className="text-zara-gold">✓</span> Group Friendly</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 px-4 bg-gradient-to-r from-zara-gold/10 to-zara-orange/10 border-t border-gray-800">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience Zara Kitchen?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Visit us today and discover why we're Accra's favorite destination for authentic Ghanaian and continental cuisine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+233243637122" className="btn-primary text-lg px-8 py-4">
              📞 Call Us
            </a>
            <a
              href="https://wa.me/233243637122"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-8 py-4"
            >
              💬 WhatsApp
            </a>
            <a href="/catering" className="btn-secondary text-lg px-8 py-4">
              🎉 Book Catering
            </a>
          </div>
        </div>
      </section>

      {/* Above Footer banner -- mockup asset used as-is */}
      <section className="py-8 px-4 bg-black border-t border-gray-800">
        <div className="container-wide">
          <img
            src="/images/assets/above-footer.png"
            alt="Friendly Support, Fast Response, Reservations, Events & Catering"
            className="w-full h-auto rounded-lg"
          />
        </div>
      </section>

      <Footer />
    </main>
  )
}
