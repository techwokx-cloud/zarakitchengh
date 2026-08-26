'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const CATERING_PACKAGES = [
  {
    id: 1,
    name: 'Corporate Lunch Bundle',
    type: 'corporate',
    minGuests: 10,
    maxGuests: 100,
    pricePerHead: 45,
    description: 'Perfect for team lunches and working sessions',
    includes: [
      'Main course (choice of 2)',
      'Sides & vegetables',
      'Soft drinks',
      'Dessert',
      'Professional serving',
    ],
    image: '🍱',
    isPopular: true,
  },
  {
    id: 2,
    name: 'Executive Dinner',
    type: 'corporate',
    minGuests: 20,
    maxGuests: 200,
    pricePerHead: 65,
    description: 'Elegant dining experience for corporate events',
    includes: [
      'Appetizers',
      'Main course (choice of 3)',
      'Premium sides',
      'Wine/premium beverages',
      'Dessert platter',
      'Professional wait staff',
    ],
    image: '🎩',
    isPopular: false,
  },
  {
    id: 3,
    name: 'Wedding Package',
    type: 'wedding',
    minGuests: 50,
    maxGuests: 500,
    pricePerHead: 85,
    description: 'Create unforgettable memories on your special day',
    includes: [
      'Cocktail appetizers',
      'Multi-course dinner',
      'Premium beverages',
      'Dessert & cake cutting',
      'Decoration setup',
      'Full catering staff',
      'Custom menu available',
    ],
    image: '💍',
    isPopular: false,
  },
  {
    id: 4,
    name: 'Birthday Celebration',
    type: 'birthday',
    minGuests: 15,
    maxGuests: 150,
    pricePerHead: 50,
    description: 'Make birthdays special with great food',
    includes: [
      'Main course (choice of 2)',
      'Sides & salads',
      'Beverages',
      'Birthday cake',
      'Decorations',
      'Friendly service',
    ],
    image: '🎂',
    isPopular: true,
  },
  {
    id: 5,
    name: 'Conference Package',
    type: 'conference',
    minGuests: 25,
    maxGuests: 300,
    pricePerHead: 40,
    description: 'Keep attendees energized throughout the day',
    includes: [
      'Breakfast & snacks',
      'Lunch (2 main courses)',
      'Afternoon refreshments',
      'Beverages all day',
      'Setup & cleanup',
    ],
    image: '📊',
    isPopular: false,
  },
  {
    id: 6,
    name: 'Intimate Dinner',
    type: 'custom',
    minGuests: 8,
    maxGuests: 30,
    pricePerHead: 75,
    description: 'Private dining experience tailored to you',
    includes: [
      'Customized menu',
      'Wine pairing options',
      'Personalized service',
      'Flexible timing',
      'Premium ingredients',
    ],
    image: '🍷',
    isPopular: false,
  },
]

export default function CateringPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [bookingData, setBookingData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    eventTime: '',
    numberOfGuests: 50,
    eventType: 'corporate',
    specialRequests: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBookingData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Call API to save booking
      console.log('Booking submitted:', bookingData, selectedPackage)
      setSubmitStatus('success')
      setTimeout(() => {
        setSubmitStatus('idle')
        setBookingData({
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          eventDate: '',
          eventTime: '',
          numberOfGuests: 50,
          eventType: 'corporate',
          specialRequests: '',
        })
        setSelectedPackage(null)
      }, 5000)
    } catch (error) {
      console.error('Error submitting booking:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedPkgInfo = selectedPackage ? CATERING_PACKAGES.find(p => p.id === selectedPackage) : null

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Events & Catering 🎉
            </h1>
            <p className="text-xl text-gray-300 mb-4">Make Every Occasion Special</p>
            <p className="text-gray-400">
              From corporate lunches to weddings, we provide comprehensive catering services that exceed expectations. Our expert team ensures your event is memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Catering Packages */}
      <section className="py-12 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Catering Packages</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose from our expertly crafted packages or let us create a custom menu for your specific needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATERING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative border rounded-lg overflow-hidden transition cursor-pointer ${
                  selectedPackage === pkg.id
                    ? 'border-zara-gold bg-gray-800'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute top-0 right-0 bg-zara-gold text-black px-3 py-1 text-xs font-bold rounded-bl-lg">
                    ⭐ Popular
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="text-5xl mb-4">{pkg.image}</div>
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-zara-gold">
                      GHS {pkg.pricePerHead}
                      <span className="text-sm text-gray-400">/head</span>
                    </p>
                    <p className="text-gray-400 text-xs">
                      {pkg.minGuests} - {pkg.maxGuests} guests
                    </p>
                  </div>

                  {/* Includes */}
                  <div className="mb-4">
                    <h4 className="font-bold text-white mb-2">Includes:</h4>
                    <ul className="space-y-1">
                      {pkg.includes.map((item, idx) => (
                        <li key={idx} className="text-gray-400 text-sm flex items-start gap-2">
                          <span className="text-zara-gold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Select Button */}
                  <button
                    className={`w-full py-2 rounded-lg font-bold transition ${
                      selectedPackage === pkg.id
                        ? 'bg-zara-gold text-black'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {selectedPackage === pkg.id ? '✓ Selected' : 'Select Package'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container-wide max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Book Your Event</h2>
            <p className="text-gray-400">
              {selectedPackage
                ? `You selected ${selectedPkgInfo?.name}. Fill in your details below.`
                : 'Select a package above and fill in your event details.'}
            </p>
          </div>

          {selectedPackage ? (
            <form onSubmit={handleSubmit} className="space-y-6 bg-black border border-gray-800 rounded-lg p-8">
              <div className="bg-gray-900 border-l-4 border-zara-gold p-4 rounded">
                <p className="text-white font-bold">{selectedPkgInfo?.name}</p>
                <p className="text-gray-400 text-sm">
                  GHS {selectedPkgInfo?.pricePerHead}/head • {selectedPkgInfo?.minGuests}-{selectedPkgInfo?.maxGuests} guests
                </p>
              </div>

              {/* Client Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="clientName"
                  placeholder="Your Name *"
                  value={bookingData.clientName}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold"
                />
                <input
                  type="email"
                  name="clientEmail"
                  placeholder="Email Address *"
                  value={bookingData.clientEmail}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="tel"
                  name="clientPhone"
                  placeholder="Phone Number *"
                  value={bookingData.clientPhone}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold"
                />
                <select
                  name="eventType"
                  value={bookingData.eventType}
                  onChange={handleChange}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-zara-gold"
                >
                  <option value="corporate">Corporate Event</option>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="conference">Conference</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Event Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="date"
                  name="eventDate"
                  value={bookingData.eventDate}
                  onChange={handleChange}
                  required
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-zara-gold"
                />
                <input
                  type="time"
                  name="eventTime"
                  value={bookingData.eventTime}
                  onChange={handleChange}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-zara-gold"
                />
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-white font-bold mb-2">
                  Number of Guests: {bookingData.numberOfGuests}
                </label>
                <input
                  type="range"
                  name="numberOfGuests"
                  min={selectedPkgInfo?.minGuests || 10}
                  max={selectedPkgInfo?.maxGuests || 500}
                  value={bookingData.numberOfGuests}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>{selectedPkgInfo?.minGuests}</span>
                  <span>{selectedPkgInfo?.maxGuests}</span>
                </div>
              </div>

              {/* Estimated Cost */}
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Estimated Cost:</span>
                  <span className="text-2xl font-bold text-zara-gold">
                    GHS {(bookingData.numberOfGuests * (selectedPkgInfo?.pricePerHead || 0)).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-2">Plus service charge (10%) & setup fee</p>
              </div>

              {/* Special Requests */}
              <textarea
                name="specialRequests"
                placeholder="Special requests or dietary restrictions?"
                rows={4}
                value={bookingData.specialRequests}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold resize-none"
              />

              {/* Submit Status */}
              {submitStatus === 'success' && (
                <p className="text-green-400 text-sm bg-green-900/20 border border-green-500 rounded p-3">
                  ✓ Booking request sent! We'll contact you within 24 hours.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-400 text-sm bg-red-900/20 border border-red-500 rounded p-3">
                  ✗ Error submitting booking. Please try again.
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-zara-gold text-black font-bold py-3 rounded-lg hover:bg-zara-orange transition disabled:opacity-50"
              >
                {isSubmitting ? 'Sending Booking Request...' : 'Reserve Your Event 🎉'}
              </button>

              <p className="text-gray-400 text-xs text-center">
                We'll review your request and contact you within 24 hours to confirm.
              </p>
            </form>
          ) : (
            <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
              <p className="text-gray-400 mb-4">👆 Select a catering package above to get started</p>
              <p className="text-gray-500 text-sm">Or call us at +233 54 363 7122 for custom packages</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 px-4 bg-gradient-to-b from-gray-900 to-black border-t border-gray-800">
        <div className="container-wide">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Zara Kitchen for Catering?</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '👨‍🍳',
                title: 'Expert Chefs',
                desc: '25+ years of culinary excellence',
              },
              {
                icon: '✨',
                title: 'Fresh Ingredients',
                desc: 'Only premium quality ingredients used',
              },
              {
                icon: '🎯',
                title: 'Customizable Menus',
                desc: 'Tailor-made menus for your needs',
              },
              {
                icon: '⚡',
                title: 'Reliable Service',
                desc: 'Professional & punctual every time',
              },
              {
                icon: '💰',
                title: 'Competitive Pricing',
                desc: 'Best value for your budget',
              },
              {
                icon: '🎨',
                title: 'Presentation',
                desc: 'Beautifully plated dishes',
              },
              {
                icon: '📞',
                title: 'Dedicated Support',
                desc: 'Personal event coordinator',
              },
              {
                icon: '🏆',
                title: 'Proven Track Record',
                desc: '100s of successful events',
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
