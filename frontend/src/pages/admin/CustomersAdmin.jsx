import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState([])
  useEffect(() => { api.get('/admin/customers').then((r) => setCustomers(r.data.data)) }, [])

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Clientes</h1>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr><th className="p-3">Nome</th><th>E-mail</th><th>Pedidos</th><th>Total gasto</th></tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td>{c.email}</td>
                <td>{c.orders_count}</td>
                <td>R$ {Number(c.orders_sum_total || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
