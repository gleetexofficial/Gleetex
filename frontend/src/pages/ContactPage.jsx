import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import toast from 'react-hot-toast'
import { FiMail, FiPhone, FiMapPin, FiInstagram } from 'react-icons/fi'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Message sent. We will respond within 24 hours.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  const inputClass = 'w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold-500 placeholder-white/20 tracking-wide'

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center">
        <p className="section-title mb-3">Get in Touch</p>
        <h1 className="font-serif text-5xl text-white">Contact Us</h1>
      </section>

      <section className="pb-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-8">
            <div>
              <p className="section-title mb-6">Concierge Service</p>
              <p className="text-white/40 text-sm leading-relaxed">
                Our team is available to assist you with product inquiries, order tracking,
                and any questions about your Gleetex experience.
              </p>
            </div>

            {[
              { icon: <FiMail size={18} />, label: 'Email', value: 'support@gleetex.com', href: 'mailto:support@gleetex.com' },
              { icon: <FiPhone size={18} />, label: 'WhatsApp', value: '+92 317 443 4196', href: 'https://wa.me/923174434196' },
              { icon: <FiMapPin size={18} />, label: 'Location', value: 'Pakistan', href: null },
              { icon: <FiInstagram size={18} />, label: 'Instagram', value: '@gleetexofficial', href: 'https://instagram.com/gleetexofficial' },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 border border-gold-500/30 flex items-center justify-center text-gold-500 flex-shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noreferrer" className="text-white text-sm hover:text-gold-500 transition-colors">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-white text-sm">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Your Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required className={inputClass} placeholder="Muhammad Ahmed" />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Email Address</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required className={inputClass} placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Subject</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  required className={inputClass} placeholder="Order inquiry, product question..." />
              </div>
              <div>
                <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Message</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required rows={6} className={`${inputClass} resize-none`}
                  placeholder="How can we assist you?" />
              </div>
              <button type="submit" disabled={loading} className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
