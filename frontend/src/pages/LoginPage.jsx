import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, loading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await login(form.email, form.password)
      toast.success(`Welcome back, ${user.name}`)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200"
          alt="Luxury"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black" />
        <div className="absolute bottom-12 left-10">
          <h2 className="font-serif text-5xl text-white tracking-widest">Gleetex</h2>
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-2">Luxury Atelier</p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <Link to="/" className="font-serif text-2xl tracking-[0.3em] text-white hover:text-gold-500 transition-colors block mb-12 lg:hidden">
            Gleetex
          </Link>
          <p className="section-title mb-3">Welcome Back</p>
          <h1 className="font-serif text-4xl text-white mb-10">Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold-500 placeholder-white/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold-500 placeholder-white/20"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-white/30 text-xs tracking-wide text-center mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-500 hover:text-gold-400 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
