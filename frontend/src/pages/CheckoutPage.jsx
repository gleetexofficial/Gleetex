import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import useCartStore from '../store/cartStore'
import useAuthStore from '../store/authStore'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'Pakistan',
    paymentMethod: 'cod',
    notes: '',
  })

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping = subtotal >= 5000 ? 0 : 200
  const total = subtotal + shipping

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return toast.error('Your cart is empty')
    setLoading(true)
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: {
          fullName: form.fullName,
          phone: form.phone,
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      })
      clearCart()
      toast.success('Order placed successfully!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold-500 placeholder-white/20 tracking-wide'

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="section-title">Final Step</p>
          <h1 className="font-serif text-4xl text-white">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-white text-xs tracking-[0.3em] uppercase mb-4 pb-2 border-b border-white/10">
                Shipping Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Full Name *</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} required className={inputClass} placeholder="Muhammad Ahmed" />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange} required className={inputClass} placeholder="+92 300 0000000" />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">City *</label>
                  <input name="city" value={form.city} onChange={handleChange} required className={inputClass} placeholder="Karachi" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Street Address *</label>
                  <input name="street" value={form.street} onChange={handleChange} required className={inputClass} placeholder="House #, Street, Area" />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Province</label>
                  <input name="state" value={form.state} onChange={handleChange} className={inputClass} placeholder="Sindh" />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Postal Code</label>
                  <input name="zip" value={form.zip} onChange={handleChange} className={inputClass} placeholder="75500" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h3 className="text-white text-xs tracking-[0.3em] uppercase mb-4 pb-2 border-b border-white/10">
                Payment Method
              </h3>
              <div className="space-y-3">
                {[
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                ].map((m) => (
                  <label key={m.value} className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${form.paymentMethod === m.value ? 'border-gold-500 bg-gold-500/5' : 'border-white/10 hover:border-white/20'}`}>
                    <input type="radio" name="paymentMethod" value={m.value} checked={form.paymentMethod === m.value} onChange={handleChange} className="mt-1 accent-yellow-500" />
                    <div>
                      <p className="text-white text-xs tracking-widest uppercase font-semibold">{m.label}</p>
                      <p className="text-white/30 text-xs mt-1">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-white/40 text-[10px] tracking-widest uppercase block mb-2">Order Notes (Optional)</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-gold-500 placeholder-white/20 resize-none"
                placeholder="Special instructions for your order..." />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-zinc-950 border border-white/10 p-6 h-fit">
            <h3 className="text-white text-xs tracking-[0.3em] uppercase mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-xs">
                  <span className="text-white/50 truncate mr-2">{item.name} × {item.quantity}</span>
                  <span className="text-white flex-shrink-0">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-white/10 pt-3 space-y-2">
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
                <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                  <span className="text-white text-sm">Total</span>
                  <span className="text-gold-500">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  )
}
