// components/OrderSection.tsx

export default function OrderSection() {
  return (
    <section className="pb-8 px-4 bg-[#FFF8E7]">
      <div className="container-wide">
        <img
          src="/images/assets/order-your-way-payments.png"
          alt="Order Your Way: Website, WhatsApp, Jumia Food, Uber Eats, Bolt Food, Glovo, Hubtel. All Payments Accepted: Mobile Money, Bank Cards, Pay on Delivery."
          className="w-full h-auto"
        />

        {/* Real links kept underneath for actual functionality, since the image itself isn't clickable */}
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm">
          <a href="/menu" className="text-gray-700 hover:text-zara-gold underline">Order on Website</a>
          <span className="text-gray-300">•</span>
          <a href="https://wa.me/233243637122" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-zara-gold underline">Order on WhatsApp</a>
        </div>
      </div>
    </section>
  )
}
