'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Clock } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Call API to send email
      console.log('Form submitted:', formData)
      setSubmitStatus('success')
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' })

      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    { icon: '📞', title: 'Phone', details: ['+233 (0) 543637122', '054 363 7122'] },
    { icon: '📷', title: 'Instagram', details: ['zarakitchenofficial'] },
    { icon: '📘', title: 'Facebook', details: ['zarakitchenghana'] },
    { icon: '🎵', title: 'TikTok', details: ['ZaraKitchenGha'] },
    { icon: '✉️', title: 'Email', details: ['info@zarakitchengh.com'] },
    { icon: '📞', title: 'Other Line', details: ['+233 54 013 1808'] },
  ]

  const openingHours = [
    { day: 'Monday', hours: '08:00 AM - 06:00 PM' },
    { day: 'Tuesday', hours: '08:00 AM - 06:00 PM' },
    { day: 'Wednesday', hours: '08:00 AM - 06:00 PM' },
    { day: 'Thursday', hours: '08:00 AM - 06:00 PM' },
    { day: 'Friday', hours: '08:00 AM - 07:00 PM' },
    { day: 'Saturday', hours: '09:00 PM - 05:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ]

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-black border-b border-gray-800">
        <div className="container-wide grid lg:grid-cols-2">
          <div className="py-10 md:py-16 px-4">
            <p className="font-display italic text-3xl md:text-4xl text-white mb-1">Contact Us</p>
            <p className="text-zara-gold text-lg font-semibold mb-4">We&apos;d Love to Hear From You!</p>
            <p className="text-gray-400 mb-6 max-w-md">
              Whether you have a question, want to make a reservation, or need more information, our team is
              here to help. Reach out to us anytime!
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-xl">📞</span>
                <div>
                  <p className="text-gray-500 text-xs">Call Us</p>
                  <p>+233 (0) 543637122</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-xl">✉️</span>
                <div>
                  <p className="text-gray-500 text-xs">Email Us</p>
                  <p>info@zarakitchengh.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <span className="text-xl">📍</span>
                <div>
                  <p className="text-gray-500 text-xs">Visit Us</p>
                  <p>64 Patrice Lumumba St, Accra</p>
                </div>
              </div>
            </div>
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

      <div className="grid lg:grid-cols-2 gap-8 p-4 md:p-8 bg-[#FFF8E7]">
        {/* Left Column - Contact Info & Form */}
        <div>
          {/* Get In Touch */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">Get In Touch</h2>

            <div className="space-y-5">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-2xl">{info.icon}</div>
                  <div>
                    <h3 className="font-bold text-black mb-1">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-600 text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Send Us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="col-span-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
            />

            {/* Subject */}
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
            />

            {/* Message */}
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold resize-none"
            />

            {/* Submit Status */}
            {submitStatus === 'success' && (
              <p className="text-green-600 text-sm">✓ Message sent successfully!</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-600 text-sm">✗ Error sending message. Please try again.</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zara-gold text-black font-bold py-3 rounded-lg hover:bg-zara-orange transition disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'} 🚀
            </button>
          </form>
        </div>
      </div>

      {/* Map & Hours Section */}
      <section className="grid lg:grid-cols-3 gap-8 p-4 md:p-8 bg-[#FFF8E7] border-t border-gray-200">
        {/* Map */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-black mb-4">Find Us on the Map</h2>
          <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 bg-gray-200">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen={true}
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=64+Patrice+Lumumba+St,+Airport+Residential+Area,+Accra,+Ghana&output=embed"
            ></iframe>
          </div>
        </div>

        {/* Opening Hours & Info */}
        <div>
          <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <Clock size={20} />
              Opening Hours
            </h3>
            <div className="space-y-2">
              {openingHours.map((item) => (
                <div key={item.day} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.day}</span>
                  <span className={item.hours === 'Closed' ? 'text-red-500 font-bold' : 'text-black'}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black mb-4">Coverage</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>✓ Walk in</li>
              <li>✓ Delivery</li>
              <li>✓ Corporate</li>
              <li>✓ Outdoor Catering Events</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Support Features */}
      <section className="py-8 px-4 bg-[#FFF8E7] border-t border-gray-200">
        <div className="container-wide">
          <div className="grid md:grid-cols-4 gap-6 bg-[#FFEFC7] rounded-xl p-6">
            {[
              { icon: '🎧', title: 'Friendly Support', desc: 'Our team is ready to assist you with a smile.' },
              { icon: '⚡', title: 'Fast Response', desc: 'We respond quickly to all your inquiries.' },
              { icon: '📅', title: 'Reservations', desc: 'Book your table in advance for a seamless experience.' },
              { icon: '🎉', title: 'Events & Catering', desc: 'We cater for all types of events and special occasions.' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="text-3xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="font-bold text-black text-sm mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-xs">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
