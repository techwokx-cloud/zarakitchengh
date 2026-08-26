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
            <h1 className="text-white font-bold text-lg">Zara Kitchen</h1>
            <p className="text-yellow-500 text-xs">Good Food, Good Mood</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-zara-gold hover:text-white transition">
            Home
          </a>
          <a href="#menu" className="text-white hover:text-zara-gold transition">
            Menu
          </a>
          <a href="#about" className="text-white hover:text-zara-gold transition">
            About
          </a>
          <a href="#gallery" className="text-white hover:text-zara-gold transition">
            Gallery
          </a>
          <a href="#contact" className="text-white hover:text-zara-gold transition">
            Contact
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+233241234567"
            className="btn-primary text-sm"
          >
            🛒 Order Online
          </a>
          <a
            href="https://wa.me/233241234567"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm"
          >
            💬 WhatsApp
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
            <a href="#home" className="text-zara-gold">Home</a>
            <a href="#menu" className="text-white">Menu</a>
            <a href="#about" className="text-white">About</a>
            <a href="#gallery" className="text-white">Gallery</a>
            <a href="#contact" className="text-white">Contact</a>
            <div className="border-t border-gray-700 pt-4 flex flex-col gap-2">
              <a href="tel:+233241234567" className="btn-primary text-sm text-center">
                🛒 Order Online
              </a>
              <a
                href="https://wa.me/233241234567"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm text-center"
              >
                💬 WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
