import { Link } from 'react-router-dom'
import { FiInstagram, FiYoutube, FiLinkedin, FiFacebook } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <h2 className="font-serif text-3xl tracking-[0.3em] text-white mb-4">Gleetex</h2>
          <p className="text-white/40 text-xs leading-relaxed tracking-wide uppercase">
            An advanced luxury atelier specializing in high-fidelity fashion and precision-engineered gadgets.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold-500 transition-colors"><FiInstagram size={18} /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold-500 transition-colors"><FiFacebook size={18} /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold-500 transition-colors"><FiYoutube size={18} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white/40 hover:text-gold-500 transition-colors"><FiLinkedin size={18} /></a>
            <a href="https://wa.me/923174434196" target="_blank" rel="noreferrer" className="text-white/40 hover:text-green-400 transition-colors"><FaWhatsapp size={18} /></a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-xs tracking-[0.3em] text-gold-500 uppercase mb-5">Explore</h4>
          <ul className="space-y-3 text-xs tracking-widest uppercase">
            <li><Link to="/" className="text-white/40 hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/shop" className="text-white/40 hover:text-white transition-colors">Products</Link></li>
            <li><Link to="/about" className="text-white/40 hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/contact" className="text-white/40 hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-xs tracking-[0.3em] text-gold-500 uppercase mb-5">Trust & Legal</h4>
          <ul className="space-y-3 text-xs tracking-widest uppercase">
            <li><Link to="/faq" className="text-white/40 hover:text-white transition-colors">FAQs</Link></li>
            <li><Link to="/privacy" className="text-white/40 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-white/40 hover:text-white transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs tracking-[0.3em] text-gold-500 uppercase mb-5">Contact</h4>
          <ul className="space-y-3 text-xs tracking-wide text-white/40">
            <li>Pakistan</li>
            <li>support@gleetex.com</li>
            <li>+92 317 443 4196</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2">
        <p className="text-white/20 text-xs tracking-widest uppercase">© 2024 Gleetex. All rights reserved.</p>
      </div>
    </footer>
  )
}
