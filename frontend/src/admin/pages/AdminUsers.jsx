import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiSearch, FiTrash2, FiShield, FiUser } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const { user: currentUser } = useAuthStore()
  const limit = 20

  const fetchUsers = () => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit })
    if (search) params.set('search', search)
    api.get(`/admin/users?${params}`)
      .then(({ data }) => { setUsers(data.users); setTotal(data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [page, search])

  const handleRoleToggle = async (id, currentRole) => {
    if (id === currentUser._id) return toast.error("You can't change your own role")
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole })
      toast.success(`Role updated to ${newRole}`)
      fetchUsers()
    } catch {
      toast.error('Failed to update role')
    }
  }

  const handleDelete = async (id, name) => {
    if (id === currentUser._id) return toast.error("You can't delete yourself")
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/admin/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Management</p>
        <h1 className="font-serif text-3xl text-white">Users</h1>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="w-full bg-black border border-white/10 text-white text-sm pl-9 pr-4 py-2.5 focus:outline-none focus:border-gold-500 placeholder-white/20"
        />
      </div>

      {/* Table */}
      <div className="bg-black border border-white/10 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['Name', 'Email', 'Phone', 'Role', 'Joined', 'Actions'].map((h) => (
                <th key={h} className="text-left text-[10px] tracking-widest uppercase text-white/30 px-4 py-3 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  {Array(6).fill(0).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-800 animate-pulse rounded" /></td>
                  ))}
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-white/20 text-xs tracking-widest uppercase py-16">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center text-white/60 text-xs font-bold flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-white text-sm">{u.name}</span>
                      {u._id === currentUser._id && (
                        <span className="text-[10px] text-gold-500 tracking-widest uppercase border border-gold-500/30 px-1.5 py-0.5">You</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white/50 text-xs">{u.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white/40 text-xs">{u.phone || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase border px-2 py-1 ${
                      u.role === 'admin'
                        ? 'text-gold-500 border-gold-500/30 bg-gold-500/5'
                        : 'text-white/30 border-white/10'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white/30 text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleRoleToggle(u._id, u.role)}
                        title={u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                        className={`transition-colors ${u.role === 'admin' ? 'text-gold-500 hover:text-white/40' : 'text-white/30 hover:text-gold-500'}`}
                      >
                        {u.role === 'admin' ? <FiShield size={15} /> : <FiUser size={15} />}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id, u.name)}
                        className="text-white/30 hover:text-red-400 transition-colors"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center gap-2">
          {Array(Math.ceil(total / limit)).fill(0).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 text-xs border transition-all ${
                page === i + 1 ? 'bg-gold-500 text-black border-gold-500' : 'border-white/10 text-white/40 hover:border-gold-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
