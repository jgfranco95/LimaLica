import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua transition'

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
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="font-serif font-medium text-3xl mb-8 text-center">Entrar</h1>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <input required type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)}
          className={inputClass} />
        <input required type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}
          className={inputClass} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={loading} className="w-full btn-primary">
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