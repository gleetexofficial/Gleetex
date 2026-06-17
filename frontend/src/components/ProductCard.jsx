import { Link } from 'react-router-dom'
import { FiShoppingCart, FiStar } from 'react-icons/fi'
import useCartStore from '../store/cartStore'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link to={`/product/${product._id}`} className="group block bg-zinc-950 border border-white/5 hover:border-gold-500/30 transition-all duration-500">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-zinc-900">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-gold-500 text-black text-[10px] font-bold px-2 py-1 tracking-widest uppercase">
            Featured
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white/60 text-xs tracking-widest uppercase">Out of Stock</span>
          </div>
        )}
        {/* Quick Add */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-gold-500 text-black text-xs font-bold tracking-widest uppercase py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2"
          >
            <FiShoppingCart size={14} />
            Quick Add
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">{product.category}</p>
        <h3 className="text-white font-serif text-sm uppercase tracking-wide mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gold-500 font-semibold text-sm">Rs. {product.price?.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-white/30 text-xs line-through ml-2">Rs. {product.originalPrice?.toLocaleString()}</span>
            )}
          </div>
          {product.ratings > 0 && (
            <div className="flex items-center gap-1 text-gold-500">
              <FiStar size={11} fill="currentColor" />
              <span className="text-xs text-white/50">{product.ratings?.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
