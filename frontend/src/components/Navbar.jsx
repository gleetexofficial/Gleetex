import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import useCartStore from '../store/cartStore'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const items = useCartStore((s) => s.items)
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl tracking-[0.3em] text-white hover:text-gold-500 transition-colors">
          Gleetex
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase">
          <Link to="/" className="text-white/70 hover:text-gold-500 transition-colors">Home</Link>
          <Link to="/shop" className="text-white/70 hover:text-gold-500 transition-colors">Products</Link>
          <Link to="/about" className="text-white/70 hover:text-gold-500 transition-colors">About</Link>
          <Link to="/contact" className="text-white/70 hover:text-gold-500 transition-colors">Contact</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-white/70 hover:text-gold-500 transition-colors">
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="text-white/70 hover:text-gold-500 transition-colors flex items-center gap-1 py-2">
                <FiUser size={20} />
              </button>
              {/* Invisible bridge to prevent gap between button and menu */}
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                <div className="bg-zinc-900 border border-white/10 w-44 py-2">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-xs tracking-widest text-gold-500 hover:bg-white/5">
                      ADMIN PANEL
                    </Link>
                  )}
                  <Link to="/orders" className="block px-4 py-2 text-xs tracking-widest text-white/70 hover:bg-white/5">
                    MY ORDERS
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs tracking-widest text-white/70 hover:bg-white/5">
                    LOGOUT
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-white/70 hover:text-gold-500 transition-colors">
              <FiUser size={20} />
            </Link>
          )}

          <button className="md:hidden text-white/70" onClick={() => setOpen(!open)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 px-4 py-6 flex flex-col gap-4 text-xs tracking-widest uppercase">
          <Link to="/" onClick={() => setOpen(false)} className="text-white/70 hover:text-gold-500">Home</Link>
          <Link to="/shop" onClick={() => setOpen(false)} className="text-white/70 hover:text-gold-500">Products</Link>
          <Link to="/about" onClick={() => setOpen(false)} className="text-white/70 hover:text-gold-500">About</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="text-white/70 hover:text-gold-500">Contact</Link>
          {user ? (
            <>
              <Link to="/orders" onClick={() => setOpen(false)} className="text-white/70 hover:text-gold-500">My Orders</Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setOpen(false)} className="text-gold-500">Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="text-left text-white/70 hover:text-gold-500">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="text-white/70 hover:text-gold-500">Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}
