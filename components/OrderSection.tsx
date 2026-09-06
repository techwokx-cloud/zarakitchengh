// components/OrderSection.tsx

export default function OrderSection() {
  const orderMethods = [
    { icon: '/images/order-icons/web.jpg', title: 'Website', subtitle: 'Order Online', link: '/menu' },
    { icon: '/images/order-icons/whatsapp.jpg', title: 'WhatsApp', subtitle: 'Chat & Order', link: 'https://wa.me/233243637122' },
    { icon: '/images/order-icons/jumia.jpg', title: 'Jumia Food', subtitle: '', link: '#' },
    { icon: '/images/order-icons/uber.jpg', title: 'Uber Eats', subtitle: '', link: '#' },
    { icon: '/images/order-icons/bolt.jpg', title: 'Bolt Food', subtitle: '', link: '#' },
    { icon: '/images/order-icons/hubtel.jpg', title: 'Hubtel', subtitle: '', link: '#' },
  ]

  const paymentMethods = [
    { icon: '📱', title: 'Mobile Money', subtitle: '(MoMo)' },
    { icon: '💳', title: 'Bank Cards', subtitle: '' },
    { icon: '📦', title: 'Pay on Delivery', subtitle: '' },
  ]

  return (
    <section className="pb-8 px-4 bg-[#FFF8E7]">
      <div className="container-wide">
        <div className="bg-[#FFEFC7] rounded-lg flex flex-col lg:flex-row items-center divide-y lg:divide-y-0 lg:divide-x divide-black/10 overflow-hidden">

          {/* Order Your Way */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 px-6 py-4 w-full lg:w-auto">
            <div className="text-left flex-shrink-0">
              <h3 className="font-bold text-black text-lg leading-tight">Order Your Way</h3>
              <p className="text-xs text-gray-600">Fast • Easy • Convenient</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-5">
              {orderMethods.map((m) => (
                <a
                  key={m.title}
                  href={m.link}
                  target={m.link.startsWith('http') ? '_blank' : undefined}
                  rel={m.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex flex-col items-center gap-1 group"
                >
                  <img src={m.icon} alt={m.title} className="w-7 h-7 rounded object-cover group-hover:scale-110 transition" />
                  <span className="text-[11px] font-semibold text-black text-center leading-tight">{m.title}</span>
                </a>
              ))}
            </div>
          </div>

          {/* All Payments Accepted */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 px-6 py-4 w-full lg:w-auto">
            <h3 className="font-bold text-black text-sm flex-shrink-0">All Payments Accepted</h3>
            <div className="flex flex-wrap justify-center gap-5">
              {paymentMethods.map((m) => (
                <div key={m.title} className="flex flex-col items-center gap-1">
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[11px] font-semibold text-black text-center leading-tight">
                    {m.title} {m.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
