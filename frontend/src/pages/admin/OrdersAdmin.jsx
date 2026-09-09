import { useEffect, useState } from 'react'
import api from '../../services/api'

const STATUSES = ['novo', 'pago', 'separacao', 'enviado', 'entregue', 'cancelado']

export default function OrdersAdmin() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('')

  function load() {
    api.get('/admin/orders', { params: { status: filter || undefined } }).then((r) => setOrders(r.data.data))
  }
  useEffect(load, [filter])

  async function updateOrder(id, patch) {
    await api.put(`/admin/orders/${id}`, patch)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Pedidos</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
          <option value="">Todos os status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{o.order_number} — {o.user?.name}</p>
                <p className="text-xs text-neutral-500">{o.payment_method} • R$ {Number(o.total).toFixed(2)}</p>
              </div>
              <select value={o.status} onChange={(e) => updateOrder(o.id, { status: e.target.value })}
                className="border rounded-lg px-2 py-1 text-sm">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-2 mt-2 items-center">
              <input placeholder="Código de rastreio" defaultValue={o.tracking_code || ''}
                onBlur={(e) => updateOrder(o.id, { tracking_code: e.target.value })}
                className="border rounded-lg px-2 py-1 text-sm flex-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
