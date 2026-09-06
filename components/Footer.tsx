export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="relative w-full">
        <img
          src="/images/assets/footer-full.png"
          alt="Zara Kitchen footer: Quick Links (Home, Menu, About Us, Gallery, Contact), Contact Us, Opening Hours, Get Our Food App, Follow Us"
          className="w-full h-auto block"
        />

        {/* Clickable overlays -- positioned as percentages so they track the image at any width */}

        {/* Logo -> home */}
        <a href="/" aria-label="Zara Kitchen home" className="absolute left-[0%] top-0 w-[17%] h-full" />

        {/* Quick Links */}
        <a href="/" aria-label="Home" className="absolute left-[18.5%] top-[24%] w-[11%] h-[14%]" />
        <a href="/menu" aria-label="Menu" className="absolute left-[18.5%] top-[40%] w-[11%] h-[14%]" />
        <a href="/about" aria-label="About Us" className="absolute left-[18.5%] top-[56%] w-[11%] h-[14%]" />
        <a href="/gallery" aria-label="Gallery" className="absolute left-[18.5%] top-[72%] w-[11%] h-[14%]" />
        <a href="/contact" aria-label="Contact" className="absolute left-[18.5%] top-[86%] w-[11%] h-[12%]" />

        {/* Contact Us */}
        <a href="tel:+233241234567" aria-label="Call +233 24 123 4567" className="absolute left-[31.5%] top-[30%] w-[13%] h-[16%]" />
        <a href="mailto:info@zarakitchengh.com" aria-label="Email info@zarakitchengh.com" className="absolute left-[31.5%] top-[48%] w-[13%] h-[16%]" />

        {/* Get Our Food App -- covered and replaced with clearer wording (people may not know what "PWA" means) */}
        <div className="absolute left-[65%] top-0 w-[17%] h-full bg-black flex flex-col items-center justify-center gap-2 px-2">
          <p className="text-zara-gold font-bold text-[clamp(0.55rem,1.4vw,0.95rem)] text-center leading-tight">
            Get Our Mobile App
          </p>
          <a
            href="#"
            className="w-full bg-zara-gold hover:bg-zara-orange text-black rounded-lg px-3 py-2 flex items-center gap-2 transition"
          >
            <span className="text-[clamp(1rem,2vw,1.4rem)] flex-shrink-0">📱</span>
            <span className="text-left leading-tight">
              <span className="block font-bold text-[clamp(0.55rem,1.4vw,0.85rem)]">Get the App</span>
              <span className="block text-[clamp(0.45rem,1vw,0.7rem)]">Order faster. Save favourites.</span>
            </span>
          </a>
        </div>

        {/* Follow Us */}
        <a href="https://www.facebook.com/ZaraKitchenOfficial" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="absolute left-[84.4%] top-[30%] w-[2.6%] h-[28%]" />
        <a href="https://www.instagram.com/zarakitchenofficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="absolute left-[87.4%] top-[30%] w-[2.6%] h-[28%]" />
        <a href="https://tiktok.com/@zarakitchengh" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="absolute left-[90.3%] top-[30%] w-[2.6%] h-[28%]" />
        <a href="https://youtube.com/@zarakitchengh" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="absolute left-[93.2%] top-[30%] w-[2.6%] h-[28%]" />
        <a href="https://x.com/Zarakitchengh" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="absolute left-[96.2%] top-[30%] w-[2.6%] h-[28%]" />
      </div>

      <p className="text-center text-xs text-gray-500 py-3 border-t border-gray-900">
        © 2026 Zara Kitchen. All rights reserved. | Download. Order. Enjoy!
      </p>
    </footer>
  )
}
