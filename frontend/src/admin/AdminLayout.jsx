import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiLogOut, FiMenu, FiX, FiHome, FiChevronRight
} from 'react-icons/fi'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: <FiGrid size={18} /> },
  { path: '/admin/products', label: 'Products', icon: <FiPackage size={18} /> },
  { path: '/admin/orders', label: 'Orders', icon: <FiShoppingBag size={18} /> },
  { path: '/admin/users', label: 'Users', icon: <FiUsers size={18} /> },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-black border-r border-white/10 flex flex-col transition-all duration-300 fixed h-full z-40`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {sidebarOpen && (
            <Link to="/" className="font-serif text-xl tracking-[0.3em] text-white hover:text-gold-500 transition-colors">
              Gleetex
            </Link>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/40 hover:text-gold-500 transition-colors ml-auto">
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        {/* Admin badge */}
        {sidebarOpen && (
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-[10px] tracking-widest uppercase text-gold-500">Admin Panel</p>
            <p className="text-white/60 text-xs mt-1 truncate">{user?.name}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase transition-all duration-200 ${
                  active
                    ? 'text-gold-500 bg-gold-500/10 border-r-2 border-gold-500'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div className="border-t border-white/10 py-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase text-white/40 hover:text-white hover:bg-white/5 transition-all"
          >
            <FiHome size={18} />
            {sidebarOpen && <span>View Store</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase text-white/40 hover:text-red-400 hover:bg-white/5 transition-all"
          >
            <FiLogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-60' : 'ml-16'} transition-all duration-300`}>
        {/* Top bar */}
        <header className="h-16 bg-black border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-white/30 tracking-widest uppercase">
            <span>Admin</span>
            <FiChevronRight size={12} />
            <span className="text-white/60">
              {navItems.find((n) => n.path === location.pathname)?.label || 'Panel'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gold-500 flex items-center justify-center text-black text-xs font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            {sidebarOpen && <span className="text-white/60 text-xs hidden md:block">{user?.email}</span>}
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
