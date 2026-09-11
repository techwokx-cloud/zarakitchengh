'use client'

import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

const WHATSAPP_NUMBER = '233591599629'

interface QuickOrderItem {
  name: string
  price: number
}

export default function QuickOrderModal({
  item,
  onClose,
}: {
  item: QuickOrderItem
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery')
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card' | 'cash'>('momo')
  const [whatsappOptIn, setWhatsappOptIn] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const total = item.price * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Save the order to Supabase -- gives the Restaurant Manager a real
    // record, regardless of whether the WhatsApp message actually gets sent
    await supabase.from('orders').insert([{
      customer_name: name,
      phone,
      items: [{ name: item.name, price: item.price, quantity }],
      total,
      delivery_type: deliveryType,
      delivery_address: deliveryType === 'delivery' ? address : null,
      payment_method: paymentMethod,
      whatsapp_opt_in: whatsappOptIn,
      status: 'pending',
    }])

    // Build the WhatsApp message and open it -- this is what actually
    // gets the order to the restaurant today (no Baileys bot yet to
    // receive orders automatically any other way)
    const lines = [
      `New order from ${name}`,
      `Phone: ${phone}`,
      ``,
      `${quantity} x ${item.name} - GHS ${(item.price * quantity).toFixed(0)}`,
      ``,
      `Total: GHS ${total.toFixed(0)}`,
      `${deliveryType === 'delivery' ? `Delivery to: ${address}` : 'Pickup'}`,
      `Payment: ${paymentMethod === 'momo' ? 'Mobile Money' : paymentMethod === 'card' ? 'Bank Card' : 'Cash on Delivery'}`,
    ]
    const message = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')

    setSubmitting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-black"
        >
          <X size={20} />
        </button>

        <h3 className="font-display text-xl font-semibold text-black mb-1">Order {item.name}</h3>
        <p className="text-red-600 font-bold text-lg mb-4">GHS {item.price.toFixed(0)}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
            />
            <input
              type="tel"
              required
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Quantity</label>
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 text-black hover:bg-gray-100"
              >
                −
              </button>
              <span className="px-3 text-black font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 text-black hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1.5">Delivery or Pickup?</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                  deliveryType === 'delivery' ? 'bg-zara-gold text-black' : 'bg-gray-100 text-gray-600'
                }`}
              >
                🚗 Delivery
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${
                  deliveryType === 'pickup' ? 'bg-zara-gold text-black' : 'bg-gray-100 text-gray-600'
                }`}
              >
                🏪 Pickup
              </button>
            </div>
          </div>

          {deliveryType === 'delivery' && (
            <input
              type="text"
              required
              placeholder="Delivery Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:border-zara-gold"
            />
          )}

          <div>
            <p className="text-sm text-gray-600 mb-1.5">Payment Method</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'momo', label: '📱 MoMo' },
                { value: 'card', label: '💳 Card' },
                { value: 'cash', label: '💵 Cash' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPaymentMethod(opt.value as 'momo' | 'card' | 'cash')}
                  className={`py-2 rounded-lg text-xs font-bold transition ${
                    paymentMethod === opt.value ? 'bg-zara-gold text-black' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-gray-500">
            <input
              type="checkbox"
              checked={whatsappOptIn}
              onChange={(e) => setWhatsappOptIn(e.target.checked)}
              className="mt-0.5"
            />
            Send me order updates and occasional promos on WhatsApp
          </label>

          <div className="bg-[#FFF8E7] rounded-lg p-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">Total</span>
            <span className="text-lg font-bold text-red-600">GHS {total.toFixed(0)}</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            <MessageCircle size={18} />
            {submitting ? 'Sending...' : 'Send Order via WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  )
}
