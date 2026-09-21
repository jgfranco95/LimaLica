import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const inputClass =
  'w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua transition'

export default function AccountPage() {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-1 text-sm bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 h-fit">
        <p className="font-serif font-medium text-lg mb-3 px-1">{user?.name}</p>
        <Link to="/minha-conta" className="block px-1 py-1.5 rounded-lg hover:bg-blush-light/40 hover:text-aqua-dark transition-colors">Meus Dados</Link>
        <Link to="/minha-conta/enderecos" className="block px-1 py-1.5 rounded-lg hover:bg-blush-light/40 hover:text-aqua-dark transition-colors">Endereços</Link>
        <Link to="/minha-conta/pedidos" className="block px-1 py-1.5 rounded-lg hover:bg-blush-light/40 hover:text-aqua-dark transition-colors">Meus Pedidos</Link>
        <Link to="/favoritos" className="block px-1 py-1.5 rounded-lg hover:bg-blush-light/40 hover:text-aqua-dark transition-colors">Favoritos</Link>
        <button onClick={logout} className="text-blush-dark mt-3 px-1 hover:text-blush-dark/70 transition-colors">Sair</button>
      </aside>

      <Routes>
        <Route index element={<ProfileTab />} />
        <Route path="enderecos" element={<AddressesTab />} />
        <Route path="pedidos" element={<OrdersTab />} />
      </Routes>
    </div>
  )
}

function ProfileTab() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saved, setSaved] = useState(false)

  async function save() {
    await api.put('/me', { name, phone })
    setSaved(true)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-3 max-w-md">
      <h2 className="font-serif font-medium text-xl">Meus dados</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
      <button onClick={save} className="btn-primary px-4 py-2 text-sm">Salvar</button>
      {saved && <p className="text-sm text-green-600">Dados atualizados!</p>}
    </div>
  )
}

function AddressesTab() {
  const [addresses, setAddresses] = useState([])
  useEffect(() => { api.get('/addresses').then((r) => setAddresses(r.data)) }, [])

  return (
    <div className="space-y-3">
      <h2 className="font-serif font-medium text-xl">Meus endereços</h2>
      {addresses.map((a) => (
        <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 text-sm">
          {a.street}, {a.number} - {a.neighborhood}, {a.city}/{a.state} - CEP {a.zipcode}
        </div>
      ))}
    </div>
  )
}

function OrdersTab() {
  const [orders, setOrders] = useState([])
  useEffect(() => { api.get('/orders').then((r) => setOrders(r.data.data)) }, [])

  const statusLabels = {
    novo: 'Novo', pago: 'Pago', separacao: 'Em separação', enviado: 'Enviado', entregue: 'Entregue', cancelado: 'Cancelado',
  }

  return (
    <div className="space-y-3">
      <h2 className="font-serif font-medium text-xl">Meus pedidos</h2>
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm border border-neutral-100 text-sm flex justify-between">
          <div>
            <p className="font-medium">{o.order_number}</p>
            <p className="text-neutral-500">{statusLabels[o.status]}</p>
          </div>
          <p className="font-semibold">R$ {Number(o.total).toFixed(2)}</p>
        </div>
      ))}
      {orders.length === 0 && <p className="text-neutral-500 text-sm">Você ainda não fez nenhum pedido.</p>}
    </div>
  )
}