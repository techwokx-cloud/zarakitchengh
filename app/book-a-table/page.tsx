'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase/client'
import { Calendar, Clock, Users } from 'lucide-react'

export default function BookATablePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'db_unavailable' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Attempt to store in Supabase. The `reservations` table doesn't exist
    // yet (dashboard/DB work is still pending), so this will currently
    // fail gracefully -- once the table is created, this starts working
    // with no code changes needed.
    const { error } = await supabase.from('reservations').insert([
      {
        customer_name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        reservation_date: formData.date,
        reservation_time: formData.time,
        guests: Number(formData.guests),
        notes: formData.notes || null,
        status: 'pending',
      },
    ])

    if (error) {
      setSubmitStatus('db_unavailable')
    } else {
      setSubmitStatus('success')
      setFormData({ name: '', phone: '', email: '', date: '', time: '', guests: '2', notes: '' })
    }

    setIsSubmitting(false)
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Zara Kitchen! I'd like to book a table.\nName: ${formData.name}\nDate: ${formData.date}\nTime: ${formData.time}\nGuests: ${formData.guests}${formData.notes ? `\nNotes: ${formData.notes}` : ''}`
  )

  return (
    <main className="min-h-screen bg-black">
      <Header />

      <section className="py-10 md:py-14 px-4 bg-black border-b border-gray-800">
        <div className="container-wide">
          <p className="font-display italic text-3xl md:text-4xl text-white mb-1">Book a Table</p>
          <p className="text-gray-400 max-w-lg">
            Reserve your table at Zara Kitchen. We'll confirm by phone or WhatsApp shortly after you submit.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14 px-4 bg-[#FFF8E7]">
        <div className="container-wide max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
            />

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-zara-gold"
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-zara-gold"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-black focus:outline-none focus:border-zara-gold appearance-none"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              name="notes"
              placeholder="Special requests (optional)"
              rows={3}
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold resize-none"
            />

            {submitStatus === 'success' && (
              <p className="text-green-600 text-sm">✓ Reservation request received! We'll confirm shortly.</p>
            )}
            {submitStatus === 'db_unavailable' && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-3">
                We couldn't save this online just yet -- please confirm your booking on WhatsApp instead:
                <a
                  href={`https://wa.me/233243637122?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 font-bold text-green-700 underline"
                >
                  Send booking details on WhatsApp →
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-zara-gold hover:bg-zara-orange text-black font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {isSubmitting ? 'Booking...' : 'Book Table'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
