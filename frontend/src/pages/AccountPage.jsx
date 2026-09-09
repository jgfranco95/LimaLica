import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function AccountPage() {
  const { user, logout } = useAuth()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-2 text-sm">
        <p className="font-semibold mb-2">{user?.name}</p>
        <Link to="/minha-conta" className="block hover:text-aqua-dark">Meus Dados</Link>
        <Link to="/minha-conta/enderecos" className="block hover:text-aqua-dark">Endereços</Link>
        <Link to="/minha-conta/pedidos" className="block hover:text-aqua-dark">Meus Pedidos</Link>
        <Link to="/favoritos" className="block hover:text-aqua-dark">Favoritos</Link>
        <button onClick={logout} className="text-blush-dark mt-4">Sair</button>
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
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-3 max-w-md">
      <h2 className="font-semibold">Meus dados</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
      <button onClick={save} className="bg-aqua text-white rounded-full px-4 py-2 text-sm">Salvar</button>
      {saved && <p className="text-sm text-green-600">Dados atualizados!</p>}
    </div>
  )
}

function AddressesTab() {
  const [addresses, setAddresses] = useState([])
  useEffect(() => { api.get('/addresses').then((r) => setAddresses(r.data)) }, [])

  return (
    <div className="space-y-3">
      <h2 className="font-semibold">Meus endereços</h2>
      {addresses.map((a) => (
        <div key={a.id} className="bg-white rounded-2xl p-4 shadow-sm text-sm">
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
      <h2 className="font-semibold">Meus pedidos</h2>
      {orders.map((o) => (
        <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm text-sm flex justify-between">
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
