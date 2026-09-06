import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container-wide px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo & Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-zara-gold rounded-full flex items-center justify-center text-black font-bold text-lg">
                Z
              </div>
              <div>
                <h3 className="text-white font-bold">Zara Kitchen</h3>
                <p className="text-yellow-400 text-xs">Good Food, Good Mood</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Authentic Ghanaian & Continental Cuisine made with love, served fresh and tasty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-zara-gold transition">▸ Home</a></li>
              <li><a href="#menu" className="hover:text-zara-gold transition">▸ Menu</a></li>
              <li><a href="#about" className="hover:text-zara-gold transition">▸ About Us</a></li>
              <li><a href="#gallery" className="hover:text-zara-gold transition">▸ Gallery</a></li>
              <li><a href="#contact" className="hover:text-zara-gold transition">▸ Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-zara-gold" />
                <a href="tel:+233241234567" className="hover:text-zara-gold transition">
                  +233 24 123 4567
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="text-zara-gold mt-0.5" />
                <a href="mailto:info@zarakitchen.com" className="hover:text-zara-gold transition">
                  info@zarakitchen.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-zara-gold mt-0.5" />
                <span>Accra, Ghana</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-white font-bold mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span className="text-zara-gold">8:00 AM - 10:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sat - Sun:</span>
                <span className="text-zara-gold">8:00 AM - 11:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Get Our App */}
          <div>
            <h4 className="text-white font-bold mb-4">Get Our Food App</h4>
            <div className="bg-zara-gold text-black rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-xs font-semibold mb-2">Install PWA</p>
              <p className="text-xs mb-3">Order faster. Save favorites.</p>
              <a href="#" className="text-xs font-bold underline hover:no-underline">
                Download Now
              </a>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-bold mb-4">All Payments Accepted</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 p-3 rounded text-center text-xs">
                  💳 Bank Cards
                </div>
                <div className="bg-gray-800 p-3 rounded text-center text-xs">
                  📱 Mobile Money (MoMo)
                </div>
                <div className="bg-gray-800 p-3 rounded text-center text-xs">
                  📦 Pay on Delivery
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Order Your Way</h4>
              <div className="grid grid-cols-3 gap-4">
                <a href="#" className="bg-gray-800 p-2 rounded text-center flex flex-col items-center gap-1">
                  <img src="/images/order-icons/web.jpg" alt="Website" className="w-8 h-8 rounded object-cover" />
                  <span className="text-xs">Website</span>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded text-center flex flex-col items-center gap-1">
                  <img src="/images/order-icons/jumia.jpg" alt="Jumia Food" className="w-8 h-8 rounded object-cover" />
                  <span className="text-xs">Jumia Food</span>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded text-center flex flex-col items-center gap-1">
                  <img src="/images/order-icons/uber.jpg" alt="Uber Eats" className="w-8 h-8 rounded object-cover" />
                  <span className="text-xs">Uber Eats</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social & Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <span className="text-white font-bold">Follow Us</span>
            <a
              href="https://www.facebook.com/ZaraKitchenOfficial"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition"
            >
              <Facebook size={20} className="text-white" />
            </a>
            <a
              href="https://www.instagram.com/zarakitchenofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition"
            >
              <Instagram size={20} className="text-white" />
            </a>
            <a
              href="https://x.com/Zarakitchengh"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition"
            >
              <Twitter size={20} className="text-white" />
            </a>
          </div>

          <p className="text-sm text-gray-500 text-center md:text-right">
            © 2026 Zara Kitchen. All rights reserved. | Download. Order. Enjoy!
          </p>
        </div>
      </div>
    </footer>
  )
}
