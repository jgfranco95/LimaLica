import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const CATEGORIES = [
  { name: 'Feminino', slug: 'feminino' },
  { name: 'Masculino', slug: 'masculino' },
  { name: 'Infantil', slug: 'infantil' },
  { name: 'Calçados', slug: 'calcados' },
  { name: 'Acessórios', slug: 'acessorios' },
  { name: 'Promoções', slug: 'promocoes' },
  { name: 'Novidades', slug: 'novidades' },
]

export default function Header() {
  const [search, setSearch] = useState('')
  const { user } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/busca?q=${encodeURIComponent(search)}`)
  }

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <header className="sticky top-0 z-40 bg-[#FDF8F9]/90 backdrop-blur border-b border-[#F4D9DC]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-4">
        {/* Nova Logo Oficial */}
        <Link to="/" className="shrink-0 transition-transform duration-200 hover:scale-[1.03] inline-block">
          <img src="/logo.png" alt="Espaço Lima Lica" className="h-12 md:h-16 w-auto object-contain" />
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md ml-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#B86B77]/40 focus:border-[#B86B77] transition"
          />
        </form>

        <div className="flex items-center gap-5 ml-auto text-sm text-neutral-700">
          <Link to={user ? '/minha-conta' : '/login'} className="nav-link hover:text-[#B86B77] transition-colors font-medium">
            {user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}
          </Link>
          <Link to="/favoritos" className="nav-link hover:text-[#B86B77] transition-colors font-medium">♥ Favoritos</Link>
          <Link to="/carrinho" className="nav-link relative hover:text-[#B86B77] transition-colors font-medium">
            🛒 Carrinho
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#B86B77] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fade-in shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="border-t border-[#F4D9DC] bg-[#FDF8F9]/50">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto py-3 text-sm font-medium text-neutral-700">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/categoria/${c.slug}`} className="nav-link whitespace-nowrap hover:text-[#B86B77] transition-colors">
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}