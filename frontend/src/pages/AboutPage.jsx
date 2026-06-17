import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import founderImg from '../assets/founder.jpg'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
            alt="About Gleetex"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black" />
        </div>
        <div className="relative z-10 text-center px-4">
          <p className="section-title mb-4">Our Story</p>
          <h1 className="font-serif text-5xl md:text-7xl text-white">About <span className="text-gold-500">Gleetex</span></h1>
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-4 max-w-lg mx-auto">
            Redefining luxury for the modern connoisseur
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-title mb-4">Who We Are</p>
            <h2 className="font-serif text-4xl text-white mb-6">An Advanced Luxury Atelier</h2>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Gleetex is a premium luxury destination specializing in high-fidelity fashion and
              precision-engineered gadgets for the modern connoisseur. Every piece in our collection
              is curated with obsessive attention to detail.
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              Founded with a vision to bring world-class luxury to Pakistan, we bridge the gap
              between international craftsmanship and local accessibility — delivering authentic
              premium products with concierge-level service.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"
              alt="Luxury Watch"
              className="w-full aspect-square object-cover"
            />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-gold-500" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-title mb-3">What Drives Us</p>
            <h2 className="font-serif text-4xl text-white">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Authenticity',
                desc: 'Every product we carry is verified for authenticity. We never compromise on the integrity of our collection.',
                icon: '◆',
              },
              {
                title: 'Precision',
                desc: 'From product selection to packaging, every detail is executed with the precision of a master craftsman.',
                icon: '◈',
              },
              {
                title: 'Excellence',
                desc: 'We hold ourselves to the highest standard of service, ensuring every customer interaction is exceptional.',
                icon: '◉',
              },
            ].map((v, i) => (
              <div key={i} className="border border-white/10 p-8 hover:border-gold-500/50 hover:bg-white/[0.02] transition-all duration-500 group">
                <span className="text-gold-500 text-2xl block mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">{v.icon}</span>
                <h3 className="font-serif text-xl text-white mb-3">{v.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Happy Clients' },
            { value: '100%', label: 'Authentic Products' },
            { value: '24h', label: 'Support Response' },
            { value: 'PKG', label: 'Premium Packaging' },
          ].map((s, i) => (
            <div key={i}>
              <p className="font-serif text-4xl text-gold-500 mb-2">{s.value}</p>
              <p className="text-white/30 text-[10px] tracking-widest uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 md:order-1">
            <div className="relative overflow-hidden">
              <img
                src={founderImg}
                alt="Muneeb Wahla — Founder & CEO"
                className="w-full aspect-square object-cover object-top"
              />
              {/* Gold overlay accent */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-gold-500" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold-500/10 border border-gold-500/30" />
          </div>
          <div className="order-1 md:order-2">
            <p className="section-title mb-4">Master Architect</p>
            <h2 className="font-serif text-4xl text-white mb-1">Muneeb Wahla</h2>
            <p className="text-gold-500 text-xs tracking-widest uppercase mb-2">Founder & CEO — Gleetex</p>
            <div className="w-12 h-px bg-gold-500/50 mb-6" />
            <p className="text-white/60 text-lg font-serif italic mb-6 leading-relaxed">
              "Quality. Trust. Excellence. ✨"
            </p>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Muneeb Wahla founded Gleetex with a singular vision: to create Pakistan's most
              prestigious luxury e-commerce destination. With a background rooted in quality,
              trust, and excellence, he brings an unmatched dedication to every product and experience.
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              His commitment to authenticity is reflected in every aspect of the
              Gleetex experience — from product curation to customer service.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-zinc-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-gold-500/5" />
        <div className="relative z-10">
          <p className="section-title mb-4">Ready to Explore?</p>
          <h2 className="font-serif text-4xl text-white mb-4">Discover the Collection</h2>
          <p className="text-white/30 text-xs tracking-widest uppercase mb-8 max-w-sm mx-auto">
            Premium products curated for the discerning taste
          </p>
          <Link to="/shop" className="btn-gold">Shop Now</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
