import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    try {
      const user = await register(form.name, form.email, form.password, form.phone)
      toast.success(`Welcome to Gleetex, ${user.name}`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  const inputClass = 'w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold-500 placeholder-white/20'

  return (
    <div className="min-h-screen bg-black flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1200"
          alt="Luxury"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black" />
        <div className="absolute bottom-12 left-10">
          <h2 className="font-serif text-5xl text-white tracking-widest">Gleetex</h2>
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-2">Join the Atelier</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="font-serif text-2xl tracking-[0.3em] text-white hover:text-gold-500 transition-colors block mb-12 lg:hidden">
            Gleetex
          </Link>
          <p className="section-title mb-3">Exclusive Access</p>
          <h1 className="font-serif text-4xl text-white mb-10">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                required className={inputClass} placeholder="Muhammad Ahmed" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                required className={inputClass} placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Phone Number</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass} placeholder="+92 300 0000000" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Password</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                required className={inputClass} placeholder="Min. 6 characters" />
            </div>
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required className={inputClass} placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-white/30 text-xs tracking-wide text-center mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-500 hover:text-gold-400 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
