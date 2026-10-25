import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { HeroSkeleton, HeroStatic } from '../components/HeroOverlay'

// O 3D (three.js + GSAP) vai num pacote separado: só baixa quando a Home abre,
// e o resto do site não fica mais pesado por causa dele.
const Hero3D = lazy(() => import('../components/Hero3D'))

// Quando tiver um modelo 3D seu (.glb), coloque em frontend/public/models/
// e troque null pelo caminho, ex.: '/models/vestido.glb'
const HERO_MODEL_URL = null

const STORAGE_BASE = import.meta.env.VITE_API_URL?.replace('/api', '')
const imgUrl = (path) => (path?.startsWith('http') ? path : `${STORAGE_BASE}/storage/${path}`)

// Só usa o 3D se o aparelho aguenta e a pessoa não pediu "reduzir movimento".
function canUse3D() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl')
    ctx?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!ctx
  } catch {
    return false
  }
}

export default function Home() {
  const [use3D] = useState(canUse3D)
  const [banners, setBanners] = useState([])
  const [featured, setFeatured] = useState([])
  const [promos, setPromos] = useState([])
  const [news, setNews] = useState([])
  const [recent, setRecent] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    const products = (params) =>
      api.get('/products', { params }).then((r) => r.data.data).catch(() => [])

    Promise.all([
      api.get('/banners').then((r) => r.data).catch(() => []),
      products({ featured: 1, per_page: 10 }),
      products({ promo: 1, per_page: 10 }),
      products({ is_new: 1, per_page: 10 }),
      products({ sort: 'recent', per_page: 12 }),
    ]).then(([b, f, p, n, r]) => {
      if (!alive) return
      setBanners(b)
      setFeatured(f)
      setPromos(p)
      setNews(n)
      setRecent(r)
      setLoaded(true)
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <div>
      {use3D ? (
        <Suspense fallback={<HeroSkeleton />}>
          <Hero3D modelUrl={HERO_MODEL_URL} />
        </Suspense>
      ) : (
        <HeroStatic />
      )}

      <Marquee />

      {/* Faixa de benefícios com cards e efeito hover */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
        {[
          'Frete grátis acima de R$299',
          'Troca grátis em 30 dias',
          'Pagamento seguro',
          'Parcelamento em até 10x',
        ].map((b, i) => (
          <Reveal key={b} delay={i * 80}>
            <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              {b}
            </div>
          </Reveal>
        ))}
      </section>

      <CategoryTiles />

      {banners.length > 0 && (
        <Reveal className="max-w-6xl mx-auto px-6 pt-4 pb-2">
          <img
            src={imgUrl(banners[0].image_path)}
            alt={banners[0].title || 'Destaque da loja'}
            className="w-full max-h-[420px] object-cover rounded-3xl shadow-sm"
          />
        </Reveal>
      )}

      {featured.length > 0 && (
        <Section title="Em destaque" eyebrow="selecionado pra você" to="/categoria/feminino">
          <ProductCarousel products={featured} />
        </Section>
      )}

      {promos.length > 0 && (
        <div className="bg-blush-light mt-6 py-4">
          <Section title="Promoções" eyebrow="por tempo limitado" to="/categoria/promocoes">
            <ProductCarousel products={promos} />
          </Section>
        </div>
      )}

      {news.length > 0 && (
        <Section title="Novidades" eyebrow="acabou de chegar" to="/categoria/novidades">
          <ProductCarousel products={news} />
        </Section>
      )}

      {/* Vitrine geral: sempre aparece, mesmo sem produto marcado como destaque/promo/novidade */}
      <Section title="Vitrine da loja" eyebrow="peças recém-cadastradas" to="/categoria/feminino">
        {loaded ? <ProductCarousel products={recent} /> : <CarouselSkeleton />}
      </Section>

      <BrandBlock />
    </div>
  )
}

/* ---------------------------------------------------------------- */

function Marquee() {
  const items = ['Moda pra todo dia', 'Feminino', 'Masculino', 'Infantil', 'Calçados do 36 ao 44', 'Acessórios']
  return (
    <div className="overflow-hidden border-y border-blush-light bg-white/60 py-3" aria-hidden="true">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center gap-8 pr-8">
            {items.map((item) => (
              <span key={item} className="flex items-center gap-8 font-serif text-lg text-neutral-700 whitespace-nowrap">
                {item}
                <span className="text-aqua text-base">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const TILES = [
  { name: 'Feminino', slug: 'feminino', bg: 'bg-blush', className: 'col-span-2 md:row-span-2', big: true },
  { name: 'Masculino', slug: 'masculino', bg: 'bg-aqua-light' },
  { name: 'Infantil', slug: 'infantil', bg: 'bg-[#FBEFD5]' },
  { name: 'Calçados', slug: 'calcados', bg: 'bg-aqua' },
  { name: 'Acessórios', slug: 'acessorios', bg: 'bg-blush-light' },
]

function CategoryTiles() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <Reveal>
        <h2 className="font-serif font-medium text-3xl md:text-4xl text-neutral-900 mb-6">Compre por categoria</h2>
      </Reveal>
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] md:auto-rows-[200px] gap-4">
        {TILES.map((t, i) => (
          <Reveal key={t.slug} delay={i * 70} className={t.className || ''}>
            <Link
              to={`/categoria/${t.slug}`}
              className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-3xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${t.bg}`}
            >
              {/* círculos decorativos que crescem no hover */}
              <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 transition-transform duration-500 group-hover:scale-150" />
              <span className="absolute right-10 top-16 h-12 w-12 rounded-full bg-white/30 transition-transform duration-500 group-hover:scale-125" />
              <span className={`relative font-serif font-medium text-neutral-900 ${t.big ? 'text-3xl md:text-5xl' : 'text-2xl'}`}>
                {t.name}
              </span>
              <span className="relative mt-1 flex items-center gap-1 text-sm text-neutral-700">
                Ver coleção
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Section({ title, eyebrow, to, children }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <Reveal>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif font-medium text-3xl md:text-4xl text-neutral-900">{title}</h2>
            {eyebrow && <p className="mt-1 text-sm text-neutral-500">{eyebrow}</p>}
          </div>
          {to && (
            <Link to={to} className="nav-link shrink-0 text-sm text-aqua-dark hover:text-neutral-900 transition-colors">
              Ver tudo →
            </Link>
          )}
        </div>
      </Reveal>
      <Reveal delay={100}>{children}</Reveal>
    </section>
  )
}

function ProductCarousel({ products }) {
  const scroller = useRef(null)
  const scrollBy = (dir) =>
    scroller.current?.scrollBy({ left: dir * scroller.current.clientWidth * 0.85, behavior: 'smooth' })

  if (!products.length) {
    return <p className="text-sm text-neutral-500">Nenhum produto por aqui ainda.</p>
  }

  return (
    <div className="relative">
      <div
        ref={scroller}
        className="no-scrollbar -mx-6 flex gap-5 overflow-x-auto scroll-smooth px-6 pt-2 pb-6 snap-x snap-mandatory"
      >
        {products.map((p) => (
          <div key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Anterior"
        onClick={() => scrollBy(-1)}
        className="absolute -left-3 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-md transition-all hover:scale-110 hover:shadow-lg md:flex"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Próximo"
        onClick={() => scrollBy(1)}
        className="absolute -right-3 top-1/3 hidden h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-md transition-all hover:scale-110 hover:shadow-lg md:flex"
      >
        ›
      </button>
    </div>
  )
}

function CarouselSkeleton() {
  return (
    <div className="flex gap-5 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="w-[46%] shrink-0 sm:w-[31%] lg:w-[23%]">
          <div className="mb-3 aspect-square animate-pulse rounded-2xl bg-blush-light/60" />
          <div className="mb-2 h-3 w-2/3 animate-pulse rounded bg-blush-light/60" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-blush-light/60" />
        </div>
      ))}
    </div>
  )
}

function BrandBlock() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20 text-center">
      <Reveal>
        <p className="text-xs tracking-[0.3em] uppercase text-aqua-dark mb-4">Sobre a Lima Lica</p>
        <h2 className="font-serif font-medium text-3xl md:text-5xl leading-tight text-neutral-900">
          Moda boa é a que a gente usa de verdade.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-neutral-600">
          Escolhemos cada peça pensando em conforto, caimento e no seu dia a dia — do básico ao look especial.
        </p>
        <Link
          to="/sobre"
          className="mt-8 inline-block rounded-full border-2 border-neutral-900 px-7 py-3 text-sm font-medium text-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-neutral-900 hover:text-white"
        >
          Conheça nossa história
        </Link>
      </Reveal>
    </section>
  )
}
