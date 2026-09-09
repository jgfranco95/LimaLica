import { useEffect, useState } from 'react'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [banners, setBanners] = useState([])
  const [featured, setFeatured] = useState([])
  const [promos, setPromos] = useState([])
  const [news, setNews] = useState([])
  const [bestSellers, setBestSellers] = useState([])

  useEffect(() => {
    api.get('/banners').then((r) => setBanners(r.data))
    api.get('/products', { params: { featured: 1, per_page: 8 } }).then((r) => setFeatured(r.data.data))
    api.get('/products', { params: { promo: 1, per_page: 8 } }).then((r) => setPromos(r.data.data))
    api.get('/products', { params: { is_new: 1, per_page: 8 } }).then((r) => setNews(r.data.data))
    api.get('/products', { params: { sort: 'recent', per_page: 8 } }).then((r) => setBestSellers(r.data.data))
  }, [])

  return (
    <div>
      {/* Banner principal rotativo */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="rounded-3xl overflow-hidden bg-gradient-to-r from-aqua-light to-blush-light h-64 md:h-96 flex items-center justify-center">
          {banners.length > 0 ? (
            <img
              src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${banners[0].image_path}`}
              alt={banners[0].title}
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-2xl font-light text-aqua-dark">Bem-vinda à Lima Lica 💖</p>
          )}
        </div>
      </section>

      <ProductSection title="Produtos em Destaque" products={featured} />
      <ProductSection title="Promoções" products={promos} accent />
      <ProductSection title="Novidades" products={news} />
      <ProductSection title="Mais Vendidos" products={bestSellers} />

      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
        {['Frete grátis acima de R$299', 'Troca grátis em 30 dias', 'Pagamento seguro', 'Parcelamento em até 10x'].map((b) => (
          <div key={b} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            {b}
          </div>
        ))}
      </section>
    </div>
  )
}

function ProductSection({ title, products, accent }) {
  if (!products.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className={`text-xl font-semibold mb-4 ${accent ? 'text-blush-dark' : 'text-neutral-800'}`}>{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
