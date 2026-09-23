import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

const inputClass =
  'w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua transition'

// Numeração de calçados: 36 a 44
const SHOE_SIZES = Array.from({ length: 9 }, (_, i) => 36 + i)

// Tipos de roupa e coleção — deixados comentados por enquanto.
// Quando quiser ativar, é só descomentar o bloco no JSX mais abaixo
// e voltar a usar essas constantes.
// const CLOTHING_TYPES = ['Vestidos', 'Camisas', 'Camisetas']
// const IS_WINTER_COLLECTION = true

export default function CategoryPage() {
  const { slug } = useParams()
  const isShoes = slug === 'calcados'

  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ gender: '', size: '', min_price: '', max_price: '' })
  const [loading, setLoading] = useState(true)

  // Zera os filtros ao trocar de categoria, pra não vazar filtro de
  // calçado (numeração) pra uma categoria de roupa, por exemplo.
  useEffect(() => {
    setFilters({ gender: '', size: '', min_price: '', max_price: '' })
  }, [slug])

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
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-[220px_1fr] gap-10">
      <aside className="space-y-6">
        <h2 className="font-serif font-medium text-2xl capitalize">{slug.replace('-', ' ')}</h2>

        {isShoes ? (
          <>
            <FilterGroup label="Gênero">
              <select
                className={inputClass}
                value={filters.gender}
                onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value }))}
              >
                <option value="">Todos</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </FilterGroup>

            <FilterGroup label="Numeração">
              <div className="flex flex-wrap gap-2">
                {SHOE_SIZES.map((n) => (
                  <button
                    key={n}
                    onClick={() => setFilters((f) => ({ ...f, size: f.size === String(n) ? '' : String(n) }))}
                    className={`w-10 h-10 rounded-full border text-sm transition-colors ${
                      filters.size === String(n)
                        ? 'bg-aqua text-white border-aqua'
                        : 'border-neutral-300 hover:border-aqua'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </FilterGroup>
          </>
        ) : (
          <>
            {/*
              Filtro por tipo de roupa e coleção de inverno — desativado
              por enquanto a pedido. Pra ativar, descomente as constantes
              CLOTHING_TYPES / IS_WINTER_COLLECTION no topo do arquivo e
              este bloco:

              <FilterGroup label="Tipo">
                <select className={inputClass}
                  onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
                  <option value="">Todos</option>
                  {CLOTHING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </FilterGroup>

              <FilterGroup label="Coleção">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox"
                    onChange={(e) => setFilters((f) => ({ ...f, winter: e.target.checked ? 1 : '' }))} />
                  Coleção de Inverno
                </label>
              </FilterGroup>
            */}
          </>
        )}

        <FilterGroup label="Faixa de preço">
          <div className="flex gap-2">
            <input
              placeholder="Min"
              type="number"
              value={filters.min_price}
              className={inputClass}
              onChange={(e) => setFilters((f) => ({ ...f, min_price: e.target.value }))}
            />
            <input
              placeholder="Max"
              type="number"
              value={filters.max_price}
              className={inputClass}
              onChange={(e) => setFilters((f) => ({ ...f, max_price: e.target.value }))}
            />
          </div>
        </FilterGroup>
      </aside>

      <div>
        {loading ? (
          <p className="text-neutral-500">Carregando...</p>
        ) : products.length === 0 ? (
          <p className="text-neutral-500">Nenhum produto encontrado com esses filtros.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
      <p className="text-sm font-medium mb-1.5">{label}</p>
      {children}
    </div>
  )
}