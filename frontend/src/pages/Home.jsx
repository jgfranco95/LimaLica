import { useEffect, useState } from 'react'
import api from '../services/api'
import ProductCard from '../components/ProductCard'

const STORAGE_BASE = import.meta.env.VITE_API_URL?.replace('/api', '')

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

  const banner = banners[0]

  return (
    <div>
      {/* Hero editorial: imagem grande + tipografia sobreposta, com entrada suave */}
      <section className="relative h-[78vh] md:h-[88vh] overflow-hidden">
        {banner ? (
          <img
            src={`${STORAGE_BASE}/storage/${banner.image_path}`}
            alt={banner.title}
            className="absolute inset-0 w-full h-full animate-fade-in"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-aqua-light to-blush-light animate-fade-in" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />

        <div className="absolute bottom-10 left-6 md:left-14 right-6 md:right-auto text-white max-w-xl">
          <h1 className="font-serif font-medium text-5xl md:text-7xl leading-[0.95] tracking-tight animate-fade-in-up">
            {banner?.title || 'Lima Lica'}
          </h1>
          <p className="mt-3 text-base md:text-lg font-light animate-fade-in-up-delay">
            {banner?.subtitle || 'peças pensadas pro seu dia a dia'}
          </p>
        </div>
      </section>

      {/* Faixa de benefícios com cards e efeito hover */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
        {[
          'Frete grátis acima de R$299',
          'Troca grátis em 30 dias',
          'Pagamento seguro',
          'Parcelamento em até 10x',
        ].map((b) => (
          <div
            key={b}
            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            {b}
          </div>
        ))}
      </section>

      <ProductSection title="Em destaque" eyebrow="selecionado pra você" products={featured} size="large" />

      {/* Promoções: fundo de cor pra quebrar o ritmo repetitivo das seções */}
      {promos.length > 0 && (
        <section className="bg-blush-light py-14 mt-4">
          <div className="max-w-6xl mx-auto px-6">
            <SectionHeading title="Promoções" eyebrow="por tempo limitado" />
            <ProductGrid products={promos} />
          </div>
        </section>
      )}

      <ProductSection title="Novidades" eyebrow="acabou de chegar" products={news} />
      <ProductSection title="Mais vendidos" eyebrow="favoritos da galera" products={bestSellers} />
    </div>
  )
}

function SectionHeading({ title, eyebrow }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif font-medium text-3xl md:text-4xl text-neutral-900">{title}</h2>
      {eyebrow && <p className="text-sm text-neutral-500 mt-1">{eyebrow}</p>}
    </div>
  )
}

function ProductGrid({ products, size }) {
  return (
    <div className={size === 'large' ? 'grid grid-cols-2 md:grid-cols-3 gap-6' : 'grid grid-cols-2 md:grid-cols-4 gap-5'}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}

function ProductSection({ title, eyebrow, products, size }) {
  if (!products.length) return null
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <SectionHeading title={title} eyebrow={eyebrow} />
      <ProductGrid products={products} size={size} />
    </section>
  )
}