import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useCartStore from '../store/cartStore'
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal >= 5000 ? 0 : 200
  const total = subtotal + shipping
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-32 pb-16 px-4 text-center">
        <p className="section-title mb-4">Your Cart</p>
        <h2 className="font-serif text-4xl text-white mb-6">Cart is Empty</h2>
        <p className="text-white/40 text-sm tracking-wide mb-10">Add some luxury pieces to your collection.</p>
        <Link to="/shop" className="btn-gold">Explore Products</Link>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="section-title">Your Selection</p>
          <h1 className="font-serif text-4xl text-white">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex gap-4 bg-zinc-950 border border-white/5 p-4">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'}
                  alt={item.name}
                  className="w-24 h-24 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">{item.category}</p>
                  <h3 className="text-white font-serif text-sm uppercase tracking-wide mb-2 truncate">{item.name}</h3>
                  <p className="text-gold-500 font-semibold text-sm">Rs. {item.price?.toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button onClick={() => removeItem(item._id)} className="text-white/20 hover:text-red-400 transition-colors">
                    <FiTrash2 size={16} />
                  </button>
                  <div className="flex items-center border border-white/10">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="px-2 py-1 text-white/50 hover:text-gold-500 transition-colors">
                      <FiMinus size={12} />
                    </button>
                    <span className="px-3 py-1 text-white text-xs border-x border-white/10">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2 py-1 text-white/50 hover:text-gold-500 transition-colors">
                      <FiPlus size={12} />
                    </button>
                  </div>
                  <p className="text-white/60 text-xs">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-white/20 hover:text-red-400 text-xs tracking-widest uppercase transition-colors mt-2">
              Clear Cart
            </button>
          </div>

          {/* Summary */}
          <div className="bg-zinc-950 border border-white/10 p-6 h-fit">
            <h3 className="text-white text-xs tracking-[0.3em] uppercase mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Subtotal</span>
                <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Shipping</span>
                <span className={shipping === 0 ? 'text-green-400 text-xs' : 'text-white'}>
                  {shipping === 0 ? 'FREE' : `Rs. ${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-white/20 text-[10px] tracking-wide">Free shipping on orders over Rs. 5,000</p>
              )}
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="text-white font-semibold text-sm">Total</span>
                <span className="text-gold-500 font-semibold">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-gold w-full flex items-center justify-center gap-2">
              Proceed to Checkout <FiArrowRight size={14} />
            </button>
            <Link to="/shop" className="block text-center text-white/30 text-xs tracking-widest uppercase mt-4 hover:text-gold-500 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
