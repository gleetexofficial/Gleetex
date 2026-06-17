import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 15

  const fetchProducts = () => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit })
    if (search) params.set('search', search)
    api.get(`/products?${params}`)
      .then(({ data }) => { setProducts(data.products); setTotal(data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [page, search])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const toggleFeatured = async (id, current) => {
    try {
      await api.put(`/products/${id}`, { featured: !current })
      toast.success('Updated')
      fetchProducts()
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Inventory</p>
          <h1 className="font-serif text-3xl text-white">Products</h1>
        </div>
        <Link to="/admin/products/new" className="btn-gold flex items-center gap-2">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
        <input
          type="text"
          placeholder="Search products..."
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
              {['Product', 'Category', 'Price', 'Stock', 'Sold', 'Featured', 'Actions'].map((h) => (
                <th key={h} className="text-left text-[10px] tracking-widest uppercase text-white/30 px-4 py-3 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  {Array(7).fill(0).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-zinc-800 animate-pulse rounded" /></td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-white/20 text-xs tracking-widest uppercase py-16">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&q=80'}
                        alt={p.name}
                        className="w-10 h-10 object-cover flex-shrink-0"
                      />
                      <span className="text-white text-sm truncate max-w-[160px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white/40 text-xs tracking-widest uppercase">{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gold-500 text-sm font-semibold">Rs. {p.price?.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${p.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white/40 text-xs">{p.sold}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleFeatured(p._id, p.featured)}
                      className={`text-xs tracking-widest uppercase border px-2 py-1 transition-all ${
                        p.featured
                          ? 'border-gold-500 text-gold-500 bg-gold-500/10'
                          : 'border-white/10 text-white/30 hover:border-white/30'
                      }`}
                    >
                      {p.featured ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link to={`/admin/products/edit/${p._id}`} className="text-white/40 hover:text-gold-500 transition-colors">
                        <FiEdit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(p._id, p.name)} className="text-white/40 hover:text-red-400 transition-colors">
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
