'use client'

import { useInstallPrompt } from '@/lib/pwa/InstallPromptProvider'

export default function Footer() {
  const { canInstall, promptInstall } = useInstallPrompt()

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

        {/* Get Our Food App -- your new "Install Zara Mobile App" asset, fitted into this column */}
        <div className="absolute left-[65%] top-0 w-[17%] h-full bg-black flex items-center justify-center p-1">
          <button
            onClick={() => canInstall && promptInstall()}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src="/images/assets/install-app-button.png"
              alt="Get Our App: Install Zara Mobile App. Order faster. Save your favourites. iOS & Android compatible."
              className="w-full h-auto max-h-full object-contain"
            />
          </button>
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
