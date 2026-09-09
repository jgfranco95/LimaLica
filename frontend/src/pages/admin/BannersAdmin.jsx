import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function BannersAdmin() {
  const [banners, setBanners] = useState([])
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')

  function load() {
    api.get('/admin/banners').then((r) => setBanners(r.data))
  }
  useEffect(load, [])

  async function create(e) {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', file)
    formData.append('title', title)
    await api.post('/admin/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    setFile(null)
    setTitle('')
    load()
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Banners</h1>
      <form onSubmit={create} className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex gap-2 items-end flex-wrap">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
        <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="border rounded-lg px-2 py-1 text-sm" />
        <button className="bg-aqua text-white rounded-lg px-4 py-2 text-sm">Adicionar</button>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl p-2 shadow-sm text-sm">
            <p>{b.title || '(sem título)'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
