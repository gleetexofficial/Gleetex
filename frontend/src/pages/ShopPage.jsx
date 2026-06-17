import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import api from '../utils/api'
import { FiSearch, FiFilter } from 'react-icons/fi'

const categories = ['all', 'watches', 'gadgets', 'accessories', 'fashion']

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('-createdAt')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 12

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit, sort })
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    api.get(`/products?${params}`)
      .then(({ data }) => { setProducts(data.products); setTotal(data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [category, search, sort, page])

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-title">Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl text-white">All Products</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full bg-zinc-900 border border-white/10 text-white text-sm pl-10 pr-4 py-3 focus:outline-none focus:border-gold-500 placeholder-white/20 tracking-wide"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-zinc-900 border border-white/10 text-white/70 text-xs tracking-widest uppercase px-4 py-3 focus:outline-none focus:border-gold-500"
          >
            <option value="-createdAt">Newest</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-ratings">Top Rated</option>
          </select>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1) }}
              className={`text-xs tracking-widest uppercase px-5 py-2 border transition-all duration-300 ${
                category === c
                  ? 'bg-gold-500 text-black border-gold-500'
                  : 'border-white/10 text-white/50 hover:border-gold-500/50 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-zinc-900 animate-pulse aspect-square" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-white/30 text-sm tracking-widest uppercase">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex justify-center gap-2 mt-12">
            {Array(Math.ceil(total / limit)).fill(0).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 text-xs border transition-all ${
                  page === i + 1
                    ? 'bg-gold-500 text-black border-gold-500'
                    : 'border-white/10 text-white/50 hover:border-gold-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
