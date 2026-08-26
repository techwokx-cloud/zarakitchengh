'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

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
    {
      icon: Phone,
      title: 'Phone',
      details: ['+233 (0) 543637122', '054 363 7122'],
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['info@zarakitchengh.com'],
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['64 Patrice Lumumba St.', 'Airport Residential Area, Accra, Ghana'],
    },
    {
      icon: Phone,
      title: 'Other Line',
      details: ['+233 54 013 1808'],
    },
  ]

  const socialMedia = [
    { platform: 'Facebook', handle: 'zarakitchengbana', icon: '📘', url: 'https://facebook.com/zarakitchengbana' },
    { platform: 'Instagram', handle: '@zarakitchenofficial', icon: '📷', url: 'https://instagram.com/zarakitchenofficial' },
    { platform: 'TikTok', handle: '@ZaraKitchenGha', icon: '🎵', url: 'https://tiktok.com/@zarakitchengh' },
    { platform: 'WhatsApp', handle: '+233 54 363 7122', icon: '💬', url: 'https://wa.me/233243637122' },
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
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us <span className="text-zara-gold">❤️</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4">We'd Love to Hear From You!</p>
            <p className="text-gray-400">
              Whether you have a question, want to make a reservation, or need more information, our team is here to help. Reach out to us anytime!
            </p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-8 p-4 md:p-8">
        {/* Left Column - Contact Info & Form */}
        <div>
          {/* Get In Touch */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>

            <div className="space-y-6">
              {contactInfo.map((info, idx) => {
                const Icon = info.icon
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="text-2xl">
                      {info.title === 'Phone' && '📞'}
                      {info.title === 'Email' && '📧'}
                      {info.title === 'Visit Us' && '📍'}
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-400 text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Follow Us</h3>
            <div className="grid grid-cols-2 gap-3">
              {socialMedia.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition"
                >
                  <span className="text-2xl">{social.icon}</span>
                  <div className="text-left">
                    <p className="text-white text-sm font-bold">{social.platform}</p>
                    <p className="text-gray-400 text-xs">{social.handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Send Us a Message</h2>

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
                className="col-span-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold"
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
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold"
            />

            {/* Subject */}
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold"
            />

            {/* Message */}
            <textarea
              name="message"
              placeholder="Your Message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold resize-none"
            />

            {/* Submit Status */}
            {submitStatus === 'success' && (
              <p className="text-green-400 text-sm">✓ Message sent successfully!</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-400 text-sm">✗ Error sending message. Please try again.</p>
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
      <section className="grid lg:grid-cols-3 gap-8 p-4 md:p-8 bg-gradient-to-b from-black to-gray-900">
        {/* Map */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">Find Us on the Map</h2>
          <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-800 bg-gray-800">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen={true}
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.8447896839726!2d-0.18449732346812734!3d5.611788532678905!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b0e7c9c9c9c9%3A0x8c8c8c8c8c8c8c8c!2s64%20Patrice%20Lumumba%20St%2C%20Accra!5e0!3m2!1sen!2sgh!4v1234567890123"
            ></iframe>
          </div>
        </div>

        {/* Opening Hours & Info */}
        <div>
          <div className="mb-8 bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={20} />
              Opening Hours
            </h3>
            <div className="space-y-2">
              {openingHours.map((item) => (
                <div key={item.day} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.day}</span>
                  <span className={item.hours === 'Closed' ? 'text-red-400 font-bold' : 'text-white'}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Coverage</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>✓ Walk in</li>
              <li>✓ Delivery</li>
              <li>✓ Corporate</li>
              <li>✓ Outdoor Catering Events</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Support Features */}
      <section className="py-12 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container-wide">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🎧', title: 'Friendly Support', desc: 'Our team is ready to assist you with a smile.' },
              { icon: '⚡', title: 'Fast Response', desc: 'We respond quickly to all your inquiries.' },
              { icon: '📅', title: 'Reservations', desc: 'Book your table in advance for a seamless experience.' },
              { icon: '🎉', title: 'Events & Catering', desc: 'We cater for all types of events and special occasions.' },
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
