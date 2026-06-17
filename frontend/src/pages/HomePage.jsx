import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import api from '../utils/api'
import { FaWhatsapp } from 'react-icons/fa'

const testimonials = [
  { name: 'Faisal R.', city: 'Karachi', text: 'The quality is unmatched. Gleetex is truly a luxury destination.' },
  { name: 'Sarah K.', city: 'Lahore', text: 'Fast delivery and precision packaging. Something truly special.' },
  { name: 'Zain A.', city: 'Peshawar', text: 'Innovative gadgets paired with timeless style. My go-to for premium essentials.' },
  { name: 'Omar D.', city: 'Multan', text: 'The attention to detail in the packaging alone tells you this is a high-end brand.' },
  { name: 'Maria S.', city: 'Swat', text: 'Professional service and authentic products. Gleetex sets the standard.' },
  { name: 'Ahmed T.', city: 'Swabi', text: 'Impressed by the seamless checkout and quick response from their concierge.' },
  { name: 'Hassan M.', city: 'Larkana', text: 'High-fidelity craftsmanship at its best. Exactly as described.' },
  { name: 'Usman B.', city: 'Mianwali', text: 'A truly curated experience. Every piece feels selected with precision.' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products?featured=true&limit=3')
      .then(({ data }) => setFeatured(data.products))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
            alt="Hero"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black" />
        </div>
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <p className="section-title mb-6">Premium Luxury</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-4">
            THE CURATED<br />
            <span className="text-gold-500">LOOK</span>
          </h1>
          <p className="text-white/50 text-xs md:text-sm tracking-[0.3em] uppercase mb-4">
            Timeless Design. Modern Edge.
          </p>
          <p className="text-white/40 text-xs tracking-widest uppercase max-w-md mx-auto mb-10">
            High-end watches and luxury essentials crafted for the perfect masculine aesthetic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" className="btn-gold">Explore Products</Link>
            <Link to="/about" className="btn-outline">About Us</Link>
          </div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gold-500/50" />
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-gold-500 py-3 marquee-wrapper">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex items-center">
              {['LUXURY WATCHES', 'PREMIUM GADGETS', 'CURATED FASHION', 'PRECISION CRAFTED', 'EXCLUSIVE DROPS'].map((t, j) => (
                <span key={j} className="text-black text-xs font-bold tracking-[0.3em] uppercase px-8">
                  {t} <span className="mx-4 opacity-40">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-title">Drop 001</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white">Featured Products</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-900 animate-pulse aspect-square" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-white/20 text-xs tracking-widest uppercase">No products yet — add some from the admin panel</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/shop" className="btn-outline">View All Pieces</Link>
        </div>
      </section>

      {/* Brand Statement */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <p className="section-title mb-6">Our Philosophy</p>
          <h2 className="font-serif text-4xl md:text-6xl text-white leading-tight mb-8">
            Crafted for the<br />
            <span className="text-gold-500">Modern Connoisseur</span>
          </h2>
          <p className="text-white/40 text-sm tracking-wide leading-relaxed max-w-2xl mx-auto">
            Every piece in our collection is selected with obsessive attention to detail.
            From precision-engineered timepieces to cutting-edge gadgets, Gleetex represents
            the intersection of luxury and innovation.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 overflow-hidden">
        <div className="text-center mb-14 px-4">
          <p className="section-title">Collective Feedback</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white">Reflections.</h2>
        </div>
        <div className="marquee-wrapper">
          <div className="marquee-track gap-6">
            {[...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className="w-72 flex-shrink-0 bg-zinc-950 border border-white/10 p-6 mx-3">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className="text-gold-500 text-xs">★</span>
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="text-white font-semibold text-xs tracking-widest uppercase">{t.name}</p>
                  <p className="text-white/30 text-xs tracking-widest uppercase mt-1">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-title mb-4">Exclusive Access</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">Join the Atelier</h2>
          <p className="text-white/40 text-sm tracking-wide mb-10">
            Create an account to access exclusive drops, track your orders, and experience concierge service.
          </p>
          <Link to="/register" className="btn-gold">Create Account</Link>
        </div>
      </section>

      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/923174434196"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-110 whatsapp-btn"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp size={28} className="text-white" />
      </a>
    </div>
  )
}
