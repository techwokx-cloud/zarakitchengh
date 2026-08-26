import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import MenuCategories from '@/components/MenuCategories'
import OrderSection from '@/components/OrderSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section with Carousel */}
      <HeroSection />

      {/* Menu Categories */}
      <MenuCategories />

      {/* Order Your Way Section */}
      <OrderSection />

      {/* About Section */}
      <section id="about" className="py-12 md:py-16 px-4 bg-gradient-to-r from-gray-900 to-black">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                About Zara Kitchen
              </h2>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Welcome to Zara Kitchen, where authentic Ghanaian and continental cuisine meet passion and care. 
                Every dish is prepared fresh with love, using the finest ingredients to deliver an unforgettable 
                dining experience.
              </p>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Whether you're craving traditional Ghanaian favorites like waakye, fufu, and palava sauce, or 
                international delights from our continental menu, we've got something special for everyone.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-zara-gold">✓</span>
                  <span className="text-gray-300">Fresh, Quality Ingredients</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-zara-gold">✓</span>
                  <span className="text-gray-300">Made with Love & Care</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-zara-gold">✓</span>
                  <span className="text-gray-300">Fast & Reliable Delivery</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-zara-gold to-zara-orange rounded-lg p-8 text-black text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold mb-4">Authentic Taste</h3>
              <p className="mb-6">
                Experience the true flavors of Ghana mixed with continental sophistication. Each meal tells a 
                story of tradition and innovation.
              </p>
              <a href="tel:+233241234567" className="inline-block btn-primary bg-black text-white hover:bg-gray-800">
                Reserve a Table Today
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-16 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Why Choose Zara Kitchen?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Quality',
                desc: 'Premium ingredients carefully selected for every dish'
              },
              {
                icon: '⚡',
                title: 'Speed',
                desc: 'Quick service without compromising on quality'
              },
              {
                icon: '💳',
                title: 'Convenience',
                desc: 'Multiple payment options and delivery methods'
              },
              {
                icon: '😋',
                title: 'Taste',
                desc: 'Authentic flavors that satisfy every craving'
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 p-6 rounded-lg text-center hover:border-zara-gold transition">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-2 text-lg">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-gradient-to-r from-black via-gray-900 to-black text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for Delicious Food?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Order now and experience the taste of authentic Ghanaian & Continental cuisine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+233241234567" className="btn-primary text-lg px-8 py-4">
              🛒 Order Online
            </a>
            <a
              href="https://wa.me/233241234567"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-8 py-4"
            >
              💬 Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
