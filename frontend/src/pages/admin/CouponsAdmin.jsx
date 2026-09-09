import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function CouponsAdmin() {
  const [coupons, setCoupons] = useState([])
  const [form, setForm] = useState({ code: '', type: 'percentual', value: '', min_purchase_value: 0, max_uses: '' })

  function load() {
    api.get('/admin/coupons').then((r) => setCoupons(r.data.data))
  }
  useEffect(load, [])

  async function create(e) {
    e.preventDefault()
    await api.post('/admin/coupons', form)
    setForm({ code: '', type: 'percentual', value: '', min_purchase_value: 0, max_uses: '' })
    load()
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Cupons</h1>
      <form onSubmit={create} className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex gap-2 flex-wrap items-end">
        <input required placeholder="Código" value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="border rounded-lg px-2 py-1 text-sm" />
        <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="border rounded-lg px-2 py-1 text-sm">
          <option value="percentual">Percentual</option>
          <option value="valor_fixo">Valor fixo</option>
          <option value="frete_gratis">Frete grátis</option>
        </select>
        <input placeholder="Valor" type="number" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} className="border rounded-lg px-2 py-1 text-sm w-24" />
        <input placeholder="Compra mínima" type="number" value={form.min_purchase_value} onChange={(e) => setForm((f) => ({ ...f, min_purchase_value: e.target.value }))} className="border rounded-lg px-2 py-1 text-sm w-28" />
        <input placeholder="Usos máximos" type="number" value={form.max_uses} onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))} className="border rounded-lg px-2 py-1 text-sm w-28" />
        <button className="bg-aqua text-white rounded-lg px-4 py-2 text-sm">Criar</button>
      </form>
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {coupons.map((c) => (
          <div key={c.id} className="p-3 text-sm flex justify-between">
            <span>{c.code} — {c.type} {c.value && `(${c.value})`}</span>
            <span className="text-neutral-500">{c.used_count}/{c.max_uses ?? '∞'} usos</span>
          </div>
        ))}
      </div>
    </div>
  )
}
