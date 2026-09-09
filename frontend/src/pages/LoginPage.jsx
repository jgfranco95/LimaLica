import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const user = await login(email, password)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch {
      setError('E-mail ou senha inválidos.')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6 text-center">Entrar</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2" />
        <input required type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={loading} className="w-full bg-aqua text-white rounded-full py-3 font-medium hover:bg-aqua-dark">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div className="text-sm text-center mt-4 space-y-1">
        <p><Link to="/esqueci-senha" className="text-aqua-dark underline">Esqueci minha senha</Link></p>
        <p>Não tem conta? <Link to="/cadastro" className="text-aqua-dark underline">Cadastre-se</Link></p>
      </div>
    </div>
  )
}
