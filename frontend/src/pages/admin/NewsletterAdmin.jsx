import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function NewsletterAdmin() {
  const [subs, setSubs] = useState([])
  useEffect(() => { api.get('/admin/newsletter').then((r) => setSubs(r.data.data)) }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Newsletter</h1>
        <a href={`${import.meta.env.VITE_API_URL}/admin/newsletter/export`} className="bg-neutral-800 text-white rounded-lg px-4 py-2 text-sm">
          Exportar CSV
        </a>
      </div>
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {subs.map((s) => <div key={s.id} className="p-3 text-sm">{s.email}</div>)}
      </div>
    </div>
  )
}
