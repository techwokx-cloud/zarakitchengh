// components/OrderSection.tsx
import { CreditCard, Smartphone, Smartphone as MobileMoneyIcon, TrendingUp } from 'lucide-react'

export default function OrderSection() {
  const orderMethods = [
    {
      icon: '/images/order-icons/web.jpg',
      title: 'Website',
      subtitle: 'Order Online',
      link: '#'
    },
    {
      icon: '/images/order-icons/whatsapp.jpg',
      title: 'WhatsApp',
      subtitle: 'Chat & Order',
      link: 'https://wa.me/233243637122'
    },
    {
      icon: '/images/order-icons/jumia.jpg',
      title: 'Jumia Food',
      subtitle: 'Via Jumia Food',
      link: '#'
    },
    {
      icon: '/images/order-icons/uber.jpg',
      title: 'Uber Eats',
      subtitle: 'Via Uber Eats',
      link: '#'
    },
    {
      icon: '/images/order-icons/bolt.jpg',
      title: 'Bolt Food',
      subtitle: 'Via Bolt Food',
      link: '#'
    },
    {
      icon: '/images/order-icons/hubtel.jpg',
      title: 'Hubtel',
      subtitle: 'Via Hubtel',
      link: '#'
    }
  ]

  const paymentMethods = [
    {
      icon: '📱',
      title: 'Mobile Money',
      subtitle: 'MTN, Vodafone, Airtel'
    },
    {
      icon: '💳',
      title: 'Bank Cards',
      subtitle: 'Visa, Mastercard'
    },
    {
      icon: '🚚',
      title: 'Pay on Delivery',
      subtitle: 'Cash on delivery'
    }
  ]

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="container-wide">
        {/* Order Your Way */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Order Your Way
            </h2>
            <p className="text-gray-400 text-lg">
              Fast • Easy • Convenient
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {orderMethods.map((method, i) => (
              <a
                key={i}
                href={method.link}
                target={method.link.startsWith('http') ? '_blank' : undefined}
                rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group bg-gray-800 border border-gray-700 p-6 rounded-lg text-center hover:border-zara-gold hover:bg-gray-750 transition"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-lg overflow-hidden group-hover:scale-110 transition">
                  <img src={method.icon} alt={method.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-white mb-1">{method.title}</h3>
                <p className="text-gray-400 text-xs">{method.subtitle}</p>
              </a>
            ))}
          </div>
        </div>

        {/* All Payments Accepted */}
        <div className="bg-gradient-to-r from-zara-gold/10 to-zara-orange/10 border border-zara-gold/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">All Payments Accepted</h3>
            <p className="text-gray-400">Multiple secure payment options for your convenience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {paymentMethods.map((method, i) => (
              <div key={i} className="flex items-center justify-center gap-3">
                <div className="text-4xl">{method.icon}</div>
                <div className="text-left">
                  <h4 className="font-bold text-white">{method.title}</h4>
                  <p className="text-gray-400 text-sm">{method.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
