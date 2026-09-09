import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Login separado para o painel administrativo (mesma API, guarda role=admin)
export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const user = await login(email, password)
      if (user.role !== 'admin') {
        setError('Este login não tem acesso ao painel administrativo.')
        return
      }
      navigate('/admin')
    } catch {
      setError('Credenciais inválidas.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold text-center mb-2">Painel Lima Lica</h1>
        <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        <input required type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full bg-neutral-900 text-white rounded-full py-3">Entrar</button>
      </form>
    </div>
  )
}
