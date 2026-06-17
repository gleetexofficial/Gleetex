import { create } from 'zustand'

const useCartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('gleetex_cart')) || [],

  addItem: (product, quantity = 1) => {
    const items = get().items
    const existing = items.find((i) => i._id === product._id)
    let updated
    if (existing) {
      updated = items.map((i) =>
        i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
      )
    } else {
      updated = [...items, { ...product, quantity }]
    }
    localStorage.setItem('gleetex_cart', JSON.stringify(updated))
    set({ items: updated })
  },

  removeItem: (id) => {
    const updated = get().items.filter((i) => i._id !== id)
    localStorage.setItem('gleetex_cart', JSON.stringify(updated))
    set({ items: updated })
  },

  updateQuantity: (id, quantity) => {
    if (quantity < 1) return
    const updated = get().items.map((i) => (i._id === id ? { ...i, quantity } : i))
    localStorage.setItem('gleetex_cart', JSON.stringify(updated))
    set({ items: updated })
  },

  clearCart: () => {
    localStorage.removeItem('gleetex_cart')
    set({ items: [] })
  },

  getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}))

export default useCartStore
