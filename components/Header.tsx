'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-black bg-opacity-95 backdrop-blur">
      <div className="container-wide flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-zara-gold rounded-full flex items-center justify-center text-black font-bold">
            Z
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display text-white font-semibold text-lg leading-none">Zara Kitchen</h1>
            <p className="text-yellow-500 text-xs mt-0.5">Good Food, Good Mood</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="/" className="text-zara-gold hover:text-white transition font-bold">
            Home
          </a>
          <a href="/menu" className="text-white hover:text-zara-gold transition">
            Menu
          </a>
          <a href="/about" className="text-white hover:text-zara-gold transition">
            About
          </a>
          <a href="/gallery" className="text-white hover:text-zara-gold transition">
            Gallery
          </a>
          <a href="/catering" className="text-white hover:text-zara-gold transition">
            Catering
          </a>
          <a href="/contact" className="text-white hover:text-zara-gold transition">
            Contact
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/book-a-table"
            className="flex items-center gap-1.5 border border-zara-gold text-zara-gold hover:bg-zara-gold hover:text-black text-xs font-bold px-3 py-2 rounded-lg transition"
          >
            📅 Book a Table
          </a>
          <a href="/menu">
            <img src="/images/buttons/order-online.png" alt="Order Online" className="h-9 w-auto" />
          </a>
          <a
            href="https://wa.me/233243637122"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/buttons/whatsapp-order.png" alt="WhatsApp Order" className="h-9 w-auto" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black bg-opacity-90 border-t border-zara-gold">
          <nav className="flex flex-col gap-4 p-4">
            <a href="/" className="text-zara-gold font-bold">Home</a>
            <a href="/menu" className="text-white">Menu</a>
            <a href="/about" className="text-white">About</a>
            <a href="/gallery" className="text-white">Gallery</a>
            <a href="/catering" className="text-white">Catering</a>
            <a href="/contact" className="text-white">Contact</a>
            <div className="border-t border-gray-700 pt-4 flex flex-col gap-2 items-start">
              <a
                href="/book-a-table"
                className="flex items-center gap-1.5 border border-zara-gold text-zara-gold text-sm font-bold px-4 py-2 rounded-lg"
              >
                📅 Book a Table
              </a>
              <a href="/menu">
                <img src="/images/buttons/order-online.png" alt="Order Online" className="h-9 w-auto" />
              </a>
              <a
                href="https://wa.me/233243637122"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/buttons/whatsapp-order.png" alt="WhatsApp Order" className="h-9 w-auto" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
