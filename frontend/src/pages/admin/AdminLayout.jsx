import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MENU = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/produtos', label: 'Produtos' },
  { to: '/admin/estoque', label: 'Estoque' },
  { to: '/admin/categorias', label: 'Categorias' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/cupons', label: 'Cupons' },
  { to: '/admin/banners', label: 'Banners' },
  { to: '/admin/newsletter', label: 'Newsletter' },
]

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr] bg-neutral-100">
      <aside className="bg-neutral-900 text-white p-4 space-y-1">
        <p className="text-lg font-semibold mb-4">Lima Lica <span className="text-xs text-neutral-400">admin</span></p>
        {MENU.map((item) => (
          <Link key={item.to} to={item.to}
            className={`block px-3 py-2 rounded-lg text-sm ${pathname === item.to ? 'bg-aqua text-neutral-900' : 'hover:bg-neutral-800'}`}>
            {item.label}
          </Link>
        ))}
        <button onClick={logout} className="mt-6 text-sm text-blush-light">Sair ({user?.name})</button>
      </aside>
      <main className="p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
