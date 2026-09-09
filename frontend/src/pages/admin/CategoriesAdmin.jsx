import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')

  function load() {
    api.get('/admin/categories').then((r) => setCategories(r.data))
  }
  useEffect(load, [])

  async function create(e) {
    e.preventDefault()
    await api.post('/admin/categories', { name })
    setName('')
    load()
  }

  async function remove(id) {
    if (!confirm('Excluir categoria?')) return
    await api.delete(`/admin/categories/${id}`)
    load()
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Categorias</h1>
      <form onSubmit={create} className="flex gap-2 mb-4">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Nova categoria" className="border rounded-lg px-3 py-2 text-sm" />
        <button className="bg-aqua text-white rounded-lg px-4 py-2 text-sm">Criar</button>
      </form>
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {categories.map((c) => (
          <div key={c.id} className="p-3 flex justify-between text-sm">
            <span>{c.name}</span>
            <button onClick={() => remove(c.id)} className="text-blush-dark text-xs">Excluir</button>
          </div>
        ))}
      </div>
    </div>
  )
}
