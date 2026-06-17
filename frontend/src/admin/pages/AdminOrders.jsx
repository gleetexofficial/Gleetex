import { useEffect, useState } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed']

const statusColors = {
  pending: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  confirmed: 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  processing: 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  shipped: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
  delivered: 'text-green-400 border-green-400/30 bg-green-400/5',
  cancelled: 'text-red-400 border-red-400/30 bg-red-400/5',
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [expanded, setExpanded] = useState(null)
  const [updating, setUpdating] = useState(null)
  const limit = 15

  const fetchOrders = () => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit })
    if (filter) params.set('status', filter)
    api.get(`/orders?${params}`)
      .then(({ data }) => { setOrders(data.orders); setTotal(data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [page, filter])

  const handleStatusUpdate = async (orderId, field, value) => {
    setUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { [field]: value })
      toast.success('Order updated')
      fetchOrders()
    } catch {
      toast.error('Failed to update order')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Management</p>
        <h1 className="font-serif text-3xl text-white">Orders</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['', ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1) }}
            className={`text-xs tracking-widest uppercase px-4 py-2 border transition-all ${
              filter === s
                ? 'bg-gold-500 text-black border-gold-500'
                : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-black border border-white/10">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {['Order', 'Customer', 'Total', 'Payment', 'Status', 'Date', ''].map((h) => (
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
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center text-white/20 text-xs tracking-widest uppercase py-16">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <>
                  <tr key={order._id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-white text-xs font-mono">#{order._id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-xs">{order.user?.name}</p>
                      <p className="text-white/30 text-[10px]">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gold-500 text-sm font-semibold">Rs. {order.total?.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) => handleStatusUpdate(order._id, 'paymentStatus', e.target.value)}
                        disabled={updating === order._id}
                        className="bg-zinc-900 border border-white/10 text-white/60 text-[10px] tracking-widest uppercase px-2 py-1 focus:outline-none focus:border-gold-500"
                      >
                        {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, 'orderStatus', e.target.value)}
                        disabled={updating === order._id}
                        className={`border text-[10px] tracking-widest uppercase px-2 py-1 focus:outline-none bg-transparent ${statusColors[order.orderStatus]}`}
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s} className="bg-zinc-900 text-white">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/30 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                        className="text-white/30 hover:text-gold-500 transition-colors"
                      >
                        {expanded === order._id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded row */}
                  {expanded === order._id && (
                    <tr key={`${order._id}-exp`} className="border-b border-white/10 bg-zinc-950">
                      <td colSpan={7} className="px-6 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Items */}
                          <div className="md:col-span-2">
                            <p className="text-white/30 text-[10px] tracking-widest uppercase mb-3">Items</p>
                            <div className="space-y-2">
                              {order.items?.map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <img
                                    src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&q=80'}
                                    alt={item.name}
                                    className="w-10 h-10 object-cover"
                                  />
                                  <div className="flex-1">
                                    <p className="text-white text-xs">{item.name}</p>
                                    <p className="text-white/30 text-[10px]">Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}</p>
                                  </div>
                                  <p className="text-white/60 text-xs">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping & Tracking */}
                          <div className="space-y-4">
                            <div>
                              <p className="text-white/30 text-[10px] tracking-widest uppercase mb-2">Ship To</p>
                              <p className="text-white/60 text-xs leading-relaxed">
                                {order.shippingAddress?.fullName}<br />
                                {order.shippingAddress?.phone}<br />
                                {order.shippingAddress?.street}<br />
                                {order.shippingAddress?.city}, {order.shippingAddress?.country}
                              </p>
                            </div>
                            <div>
                              <p className="text-white/30 text-[10px] tracking-widest uppercase mb-2">Tracking Number</p>
                              <input
                                type="text"
                                defaultValue={order.trackingNumber || ''}
                                onBlur={(e) => {
                                  if (e.target.value !== order.trackingNumber) {
                                    handleStatusUpdate(order._id, 'trackingNumber', e.target.value)
                                  }
                                }}
                                className="w-full bg-zinc-900 border border-white/10 text-white text-xs px-3 py-2 focus:outline-none focus:border-gold-500 placeholder-white/20"
                                placeholder="Enter tracking number..."
                              />
                            </div>
                            {order.notes && (
                              <div>
                                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-2">Notes</p>
                                <p className="text-white/50 text-xs">{order.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
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
