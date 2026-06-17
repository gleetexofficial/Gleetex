import { create } from 'zustand'
import api from '../utils/api'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('gleetex_user')) || null,
  token: localStorage.getItem('gleetex_token') || null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true })
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('gleetex_token', data.token)
    localStorage.setItem('gleetex_user', JSON.stringify(data.user))
    set({ user: data.user, token: data.token, loading: false })
    return data.user
  },

  register: async (name, email, password, phone) => {
    set({ loading: true })
    const { data } = await api.post('/auth/register', { name, email, password, phone })
    localStorage.setItem('gleetex_token', data.token)
    localStorage.setItem('gleetex_user', JSON.stringify(data.user))
    set({ user: data.user, token: data.token, loading: false })
    return data.user
  },

  logout: () => {
    localStorage.removeItem('gleetex_token')
    localStorage.removeItem('gleetex_user')
    set({ user: null, token: null })
  },

  setLoading: (v) => set({ loading: v }),
}))

export default useAuthStore
