'use client'

import { useState } from 'react'
import { X, MessageCircle, CheckCircle2 } from 'lucide-react'

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
  const [result, setResult] = useState<{ success: boolean; customerNotified: boolean; error?: string } | null>(null)

  const total = item.price * quantity

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          phone,
          items: [{ name: item.name, price: item.price, quantity }],
          total,
          delivery_type: deliveryType,
          delivery_address: deliveryType === 'delivery' ? address : null,
          payment_method: paymentMethod,
          whatsapp_opt_in: whatsappOptIn,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResult({ success: false, customerNotified: false, error: data.error || 'Something went wrong' })
      } else {
        setResult({ success: true, customerNotified: data.customerNotification?.sent ?? false })
      }
    } catch {
      setResult({ success: false, customerNotified: false, error: 'Could not reach the server' })
    }

    setSubmitting(false)
  }

  if (result?.success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
          <CheckCircle2 size={48} className="mx-auto text-green-600 mb-3" />
          <h3 className="font-display text-xl font-semibold text-black mb-2">Order Received!</h3>
          <p className="text-gray-600 text-sm mb-4">
            {whatsappOptIn && result.customerNotified
              ? "We've sent a confirmation to your WhatsApp. We'll be in touch shortly!"
              : "We've got your order and will be in touch shortly to confirm."}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-zara-gold hover:bg-zara-orange text-black font-bold py-2.5 rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    )
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
            Send me an order confirmation and occasional promos on WhatsApp
          </label>

          {result?.error && (
            <p className="text-red-600 text-xs">✗ {result.error}</p>
          )}

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
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  )
}
