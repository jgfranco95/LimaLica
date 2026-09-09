import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

export default function CategoryPage() {
  const { slug } = useParams()
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ color: '', size: '', min_price: '', max_price: '', brand_id: '', gender: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = { category: slug, ...filters }
    if (slug === 'promocoes') { params.promo = 1; delete params.category }
    if (slug === 'novidades') { params.is_new = 1; delete params.category }

    api.get('/products', { params }).then((r) => {
      setProducts(r.data.data)
      setLoading(false)
    })
  }, [slug, filters])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-6">
        <h2 className="font-semibold capitalize">{slug.replace('-', ' ')}</h2>

        <FilterGroup label="Cor">
          <select className="w-full border rounded-lg px-2 py-1 text-sm" onChange={(e) => setFilters((f) => ({ ...f, color: e.target.value }))}>
            <option value="">Todas</option>
            <option value="Rosa">Rosa</option>
            <option value="Verde">Verde</option>
            <option value="Branco">Branco</option>
            <option value="Preto">Preto</option>
          </select>
        </FilterGroup>

        <FilterGroup label="Tamanho">
          <select className="w-full border rounded-lg px-2 py-1 text-sm" onChange={(e) => setFilters((f) => ({ ...f, size: e.target.value }))}>
            <option value="">Todos</option>
            {['PP', 'P', 'M', 'G', 'GG'].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FilterGroup>

        <FilterGroup label="Gênero">
          <select className="w-full border rounded-lg px-2 py-1 text-sm" onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value }))}>
            <option value="">Todos</option>
            <option value="feminino">Feminino</option>
            <option value="masculino">Masculino</option>
            <option value="infantil">Infantil</option>
          </select>
        </FilterGroup>

        <FilterGroup label="Faixa de preço">
          <div className="flex gap-2">
            <input placeholder="Min" type="number" className="w-full border rounded-lg px-2 py-1 text-sm"
              onChange={(e) => setFilters((f) => ({ ...f, min_price: e.target.value }))} />
            <input placeholder="Max" type="number" className="w-full border rounded-lg px-2 py-1 text-sm"
              onChange={(e) => setFilters((f) => ({ ...f, max_price: e.target.value }))} />
          </div>
        </FilterGroup>
      </aside>

      <div>
        {loading ? (
          <p>Carregando...</p>
        ) : products.length === 0 ? (
          <p className="text-neutral-500">Nenhum produto encontrado com esses filtros.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <p className="text-sm font-medium mb-1">{label}</p>
      {children}
    </div>
  )
}
