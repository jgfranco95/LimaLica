import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function StockAdmin() {
  const [movements, setMovements] = useState([])
  const [form, setForm] = useState({ product_variant_id: '', type: 'entrada', quantity: '', reason: '' })

  function load() {
    api.get('/admin/stock').then((r) => setMovements(r.data.data))
  }
  useEffect(load, [])

  async function submit(e) {
    e.preventDefault()
    await api.post('/admin/stock', form)
    setForm({ product_variant_id: '', type: 'entrada', quantity: '', reason: '' })
    load()
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Controle de Estoque</h1>

      <form onSubmit={submit} className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex gap-2 flex-wrap items-end">
        <div>
          <label className="text-xs block">ID da variação</label>
          <input required value={form.product_variant_id} onChange={(e) => setForm((f) => ({ ...f, product_variant_id: e.target.value }))} className="border rounded-lg px-2 py-1 text-sm w-32" />
        </div>
        <div>
          <label className="text-xs block">Tipo</label>
          <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="border rounded-lg px-2 py-1 text-sm">
            <option value="entrada">Entrada</option>
            <option value="saida">Saída manual</option>
            <option value="ajuste">Ajuste</option>
          </select>
        </div>
        <div>
          <label className="text-xs block">Quantidade</label>
          <input required type="number" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} className="border rounded-lg px-2 py-1 text-sm w-24" />
        </div>
        <div>
          <label className="text-xs block">Motivo</label>
          <input value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} className="border rounded-lg px-2 py-1 text-sm" />
        </div>
        <button className="bg-aqua text-white rounded-lg px-4 py-2 text-sm">Registrar</button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-100 text-left">
            <tr><th className="p-3">Produto</th><th>Tipo</th><th>Qtd</th><th>Motivo</th><th>Data</th></tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.variant?.product?.name}</td>
                <td className="capitalize">{m.type}</td>
                <td>{m.quantity}</td>
                <td>{m.reason}</td>
                <td>{new Date(m.created_at).toLocaleString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-neutral-400 mt-2">
        Estoque zerado exibe automaticamente "Produto indisponível" na loja (ver ProductVariant::isAvailable()).
      </p>
    </div>
  )
}
