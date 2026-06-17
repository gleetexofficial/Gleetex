import { useEffect, useState } from 'react'
import api from '../../utils/api'
import { FiUsers, FiPackage, FiShoppingBag, FiClock } from 'react-icons/fi'
import { TbCurrencyRupee } from 'react-icons/tb'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const chartData = data?.monthlySales?.map((m) => ({
    name: MONTHS[m._id.month - 1],
    revenue: m.revenue,
    orders: m.orders,
  })) || []

  const stats = [
    { label: 'Total Revenue', value: `Rs. ${data?.stats?.totalRevenue?.toLocaleString() || 0}`, icon: <TbCurrencyRupee size={20} />, color: 'text-gold-500' },
    { label: 'Total Orders', value: data?.stats?.totalOrders || 0, icon: <FiShoppingBag size={20} />, color: 'text-blue-400' },
    { label: 'Pending Orders', value: data?.stats?.pendingOrders || 0, icon: <FiClock size={20} />, color: 'text-yellow-400' },
    { label: 'Total Products', value: data?.stats?.totalProducts || 0, icon: <FiPackage size={20} />, color: 'text-purple-400' },
    { label: 'Total Users', value: data?.stats?.totalUsers || 0, icon: <FiUsers size={20} />, color: 'text-green-400' },
  ]

  const statusColors = {
    pending: 'text-yellow-400', confirmed: 'text-blue-400',
    processing: 'text-purple-400', shipped: 'text-cyan-400',
    delivered: 'text-green-400', cancelled: 'text-red-400',
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-white/30 text-xs tracking-widest uppercase mb-1">Overview</p>
        <h1 className="font-serif text-3xl text-white">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-black border border-white/10 p-5 hover:border-gold-500/30 transition-all">
            <div className={`${s.color} mb-3`}>{s.icon}</div>
            <p className="text-white font-semibold text-xl">{s.value}</p>
            <p className="text-white/30 text-[10px] tracking-widest uppercase mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-black border border-white/10 p-6">
          <h3 className="text-white text-xs tracking-widest uppercase mb-6">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#111', border: '1px solid #d4af3740', borderRadius: 0 }}
                labelStyle={{ color: '#fff', fontSize: 11 }}
                itemStyle={{ color: '#d4af37', fontSize: 11 }}
                formatter={(v) => [`Rs. ${v.toLocaleString()}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} dot={{ fill: '#d4af37', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-black border border-white/10 p-6">
          <h3 className="text-white text-xs tracking-widest uppercase mb-5">Recent Orders</h3>
          {data?.recentOrders?.length === 0 ? (
            <p className="text-white/20 text-xs tracking-widest uppercase">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {data?.recentOrders?.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white text-xs font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-white/30 text-[10px] tracking-wide mt-0.5">{order.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-500 text-xs font-semibold">Rs. {order.total?.toLocaleString()}</p>
                    <p className={`text-[10px] tracking-widest uppercase mt-0.5 ${statusColors[order.orderStatus]}`}>
                      {order.orderStatus}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-black border border-white/10 p-6">
          <h3 className="text-white text-xs tracking-widest uppercase mb-5">Top Products</h3>
          {data?.topProducts?.length === 0 ? (
            <p className="text-white/20 text-xs tracking-widest uppercase">No products yet</p>
          ) : (
            <div className="space-y-3">
              {data?.topProducts?.map((p, i) => (
                <div key={p._id} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                  <span className="text-white/20 text-xs w-4">{i + 1}</span>
                  <img
                    src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&q=80'}
                    alt={p.name}
                    className="w-10 h-10 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs truncate">{p.name}</p>
                    <p className="text-white/30 text-[10px] tracking-widest uppercase">{p.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold-500 text-xs">Rs. {p.price?.toLocaleString()}</p>
                    <p className="text-white/30 text-[10px]">{p.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
