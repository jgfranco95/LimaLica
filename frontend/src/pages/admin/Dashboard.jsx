import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function Dashboard() {
  const [data, setData] = useState(null)

  useEffect(() => { api.get('/admin/dashboard').then((r) => setData(r.data)) }, [])
  if (!data) return <p>Carregando...</p>

  const cards = [
    ['Vendas totais', data.total_sales],
    ['Pedidos hoje', data.orders_today],
    ['Faturamento', `R$ ${Number(data.revenue).toFixed(2)}`],
    ['Faturamento hoje', `R$ ${Number(data.revenue_today).toFixed(2)}`],
    ['Produtos vendidos', data.products_sold],
    ['Produtos em falta', data.out_of_stock_products],
    ['Clientes cadastrados', data.registered_customers],
  ]

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(([label, value]) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-neutral-500">{label}</p>
            <p className="text-2xl font-semibold text-aqua-dark">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="font-semibold mb-3">Produtos mais vendidos</h2>
        {data.best_sellers.map((p) => (
          <div key={p.product_name} className="flex justify-between text-sm py-1 border-b last:border-0">
            <span>{p.product_name}</span><span>{p.total_qty} un.</span>
          </div>
        ))}
      </div>
    </div>
  )
}
