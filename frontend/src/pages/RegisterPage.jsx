import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', cpf: '', phone: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const { register, loading } = useAuth()
  const navigate = useNavigate()

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(Object.values(err.response?.data?.errors || {}).flat().join(' ') || 'Erro ao cadastrar.')
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-semibold mb-6 text-center">Criar Conta</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input required placeholder="Nome completo" value={form.name} onChange={(e) => set('name', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        <input required type="email" placeholder="E-mail" value={form.email} onChange={(e) => set('email', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        <input placeholder="CPF" value={form.cpf} onChange={(e) => set('cpf', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        <input placeholder="Telefone" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        <input required type="password" placeholder="Senha" value={form.password} onChange={(e) => set('password', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        <input required type="password" placeholder="Confirmar senha" value={form.password_confirmation} onChange={(e) => set('password_confirmation', e.target.value)} className="w-full border rounded-lg px-3 py-2" />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={loading} className="w-full bg-aqua text-white rounded-full py-3 font-medium hover:bg-aqua-dark">
          {loading ? 'Criando...' : 'Criar conta'}
        </button>
      </form>
    </div>
  )
}
