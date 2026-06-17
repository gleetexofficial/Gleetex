import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi'

const statusColors = {
  pending: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  confirmed: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  processing: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  shipped: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
  delivered: 'text-green-400 border-green-400/30 bg-green-400/5',
  cancelled: 'text-red-400 border-red-400/30 bg-red-400/5',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    api.get('/orders/my')
      .then(({ data }) => setOrders(data.orders))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="section-title">Your History</p>
          <h1 className="font-serif text-4xl text-white">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24">
            <FiPackage size={48} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm tracking-widest uppercase">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-zinc-950 border border-white/10 hover:border-white/20 transition-all">
                {/* Header */}
                <button
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Order ID</p>
                      <p className="text-white text-xs font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Date</p>
                      <p className="text-white text-xs">{new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Total</p>
                      <p className="text-gold-500 text-sm font-semibold">Rs. {order.total?.toLocaleString()}</p>
                    </div>
                    <span className={`text-[10px] tracking-widest uppercase border px-3 py-1 ${statusColors[order.orderStatus] || 'text-white/40 border-white/10'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  {expanded === order._id ? <FiChevronUp className="text-white/40 flex-shrink-0" /> : <FiChevronDown className="text-white/40 flex-shrink-0" />}
                </button>

                {/* Expanded */}
                {expanded === order._id && (
                  <div className="border-t border-white/10 p-5 space-y-4">
                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <img
                            src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80'}
                            alt={item.name}
                            className="w-14 h-14 object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm truncate">{item.name}</p>
                            <p className="text-white/30 text-xs">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-white/60 text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div>
                        <p className="text-white/30 text-[10px] tracking-widest uppercase mb-2">Shipping To</p>
                        <p className="text-white/60 text-xs leading-relaxed">
                          {order.shippingAddress?.fullName}<br />
                          {order.shippingAddress?.street}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/30 text-[10px] tracking-widest uppercase mb-2">Payment</p>
                        <p className="text-white/60 text-xs uppercase tracking-widest">{order.paymentMethod}</p>
                        {order.trackingNumber && (
                          <div className="mt-2">
                            <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">Tracking</p>
                            <p className="text-gold-500 text-xs font-mono">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="flex justify-end gap-8 pt-3 border-t border-white/10 text-xs">
                      <div className="text-right">
                        <p className="text-white/30 tracking-widest uppercase">Subtotal</p>
                        <p className="text-white">Rs. {order.subtotal?.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/30 tracking-widest uppercase">Shipping</p>
                        <p className="text-white">{order.shippingCost === 0 ? 'FREE' : `Rs. ${order.shippingCost}`}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/30 tracking-widest uppercase">Total</p>
                        <p className="text-gold-500 font-semibold">Rs. {order.total?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
