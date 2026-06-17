import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { FiStar, FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const addItem = useCartStore((s) => s.addItem)
  const { user } = useAuthStore()

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = () => {
    addItem(product, qty)
    toast.success(`${product.name} added to cart`)
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Please login to review')
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, comment: reviewText })
      toast.success('Review submitted')
      setReviewText('')
      const { data } = await api.get(`/products/${id}`)
      setProduct(data.product)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return null

  const images = product.images?.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80']

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/40 hover:text-gold-500 text-xs tracking-widest uppercase mb-8 transition-colors">
          <FiArrowLeft size={14} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-zinc-900 overflow-hidden mb-4">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 border-2 overflow-hidden transition-all ${activeImg === i ? 'border-gold-500' : 'border-white/10'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-white/30 text-xs tracking-widest uppercase mb-2">{product.category}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-white uppercase mb-4">{product.name}</h1>

            {product.ratings > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <FiStar key={s} size={14} className={s <= Math.round(product.ratings) ? 'text-gold-500 fill-gold-500' : 'text-white/20'} />
                  ))}
                </div>
                <span className="text-white/40 text-xs">({product.numReviews} reviews)</span>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-gold-500 text-2xl font-semibold">Rs. {product.price?.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-white/30 text-sm line-through">Rs. {product.originalPrice?.toLocaleString()}</span>
              )}
            </div>

            <p className="text-white/50 text-sm leading-relaxed mb-8">{product.description}</p>

            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs tracking-widest uppercase ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {product.stock > 0 && (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-white/40 text-xs tracking-widest uppercase">Quantity</span>
                  <div className="flex items-center border border-white/10">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-white/50 hover:text-gold-500 transition-colors">
                      <FiMinus size={14} />
                    </button>
                    <span className="px-4 py-2 text-white text-sm border-x border-white/10">{qty}</span>
                    <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 text-white/50 hover:text-gold-500 transition-colors">
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
                <button onClick={handleAddToCart} className="btn-gold w-full flex items-center justify-center gap-2 mb-4">
                  <FiShoppingCart size={16} /> Add to Cart
                </button>
              </>
            )}

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {product.tags.map((tag, i) => (
                  <span key={i} className="text-[10px] tracking-widest uppercase border border-white/10 text-white/30 px-3 py-1">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20 border-t border-white/10 pt-12">
          <h2 className="font-serif text-2xl text-white mb-8">Customer Reviews</h2>

          {product.reviews?.length === 0 ? (
            <p className="text-white/30 text-sm tracking-widest uppercase mb-8">No reviews yet. Be the first.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {product.reviews?.map((r, i) => (
                <div key={i} className="bg-zinc-950 border border-white/5 p-6">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <FiStar key={s} size={12} className={s <= r.rating ? 'text-gold-500 fill-gold-500' : 'text-white/20'} />
                    ))}
                  </div>
                  <p className="text-white/60 text-sm italic mb-4">"{r.comment}"</p>
                  <p className="text-white text-xs tracking-widest uppercase font-semibold">{r.name}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Review */}
          {user && (
            <form onSubmit={handleReview} className="bg-zinc-950 border border-white/10 p-6 max-w-lg">
              <h3 className="text-white text-sm tracking-widest uppercase mb-4">Write a Review</h3>
              <div className="flex gap-2 mb-4">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button" onClick={() => setReviewRating(s)}>
                    <FiStar size={20} className={s <= reviewRating ? 'text-gold-500 fill-gold-500' : 'text-white/20'} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full bg-black border border-white/10 text-white text-sm p-3 focus:outline-none focus:border-gold-500 placeholder-white/20 resize-none mb-4"
                required
              />
              <button type="submit" className="btn-gold">Submit Review</button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
