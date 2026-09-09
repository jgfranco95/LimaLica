import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ll_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading, setLoading] = useState(false)

  async function login(email, password) {
    setLoading(true)
    try {
      const { data } = await api.post('/login', { email, password })
      localStorage.setItem('ll_token', data.token)
      localStorage.setItem('ll_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  async function register(payload) {
    setLoading(true)
    try {
      const { data } = await api.post('/register', payload)
      localStorage.setItem('ll_token', data.token)
      localStorage.setItem('ll_user', JSON.stringify(data.user))
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    api.post('/logout').catch(() => {})
    localStorage.removeItem('ll_token')
    localStorage.removeItem('ll_user')
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
