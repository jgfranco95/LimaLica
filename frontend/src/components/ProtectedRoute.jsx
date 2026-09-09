import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Protege rotas da area do cliente
export function CustomerRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

// Protege rotas do painel administrativo (role=admin)
export function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/admin/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}
