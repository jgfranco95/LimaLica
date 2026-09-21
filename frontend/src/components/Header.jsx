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
    <header className="sticky top-0 z-40 bg-blush-light/60 backdrop-blur border-b border-blush-light">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="text-2xl font-serif font-medium text-aqua-dark shrink-0 transition-transform duration-200 hover:scale-[1.03] inline-block">
          Lima Lica
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="w-full rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua transition"
          />
        </form>

        <div className="flex items-center gap-5 ml-auto text-sm">
          <Link to={user ? '/minha-conta' : '/login'} className="nav-link hover:text-aqua-dark transition-colors">
            {user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar'}
          </Link>
          <Link to="/favoritos" className="nav-link hover:text-aqua-dark transition-colors">♥ Favoritos</Link>
          <Link to="/carrinho" className="nav-link relative hover:text-aqua-dark transition-colors">
            🛒 Carrinho
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-blush-dark text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fade-in">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="border-t border-blush-light bg-blush-light/30">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto py-2 text-sm font-medium">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/categoria/${c.slug}`} className="nav-link whitespace-nowrap hover:text-aqua-dark transition-colors">
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}