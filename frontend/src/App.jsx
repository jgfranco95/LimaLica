import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { CustomerRoute, AdminRoute } from './components/ProtectedRoute'

import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'

import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import ProductsAdmin from './pages/admin/ProductsAdmin'
import StockAdmin from './pages/admin/StockAdmin'
import OrdersAdmin from './pages/admin/OrdersAdmin'
import CustomersAdmin from './pages/admin/CustomersAdmin'
import CategoriesAdmin from './pages/admin/CategoriesAdmin'
import CouponsAdmin from './pages/admin/CouponsAdmin'
import BannersAdmin from './pages/admin/BannersAdmin'
import NewsletterAdmin from './pages/admin/NewsletterAdmin'

export default function App() {
  return (
    <Routes>
      {/* Painel administrativo - layout proprio, sem Header/Footer da loja */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="produtos" element={<ProductsAdmin />} />
        <Route path="estoque" element={<StockAdmin />} />
        <Route path="categorias" element={<CategoriesAdmin />} />
        <Route path="pedidos" element={<OrdersAdmin />} />
        <Route path="clientes" element={<CustomersAdmin />} />
        <Route path="cupons" element={<CouponsAdmin />} />
        <Route path="banners" element={<BannersAdmin />} />
        <Route path="newsletter" element={<NewsletterAdmin />} />
      </Route>

      {/* Area publica / loja */}
      <Route
        path="/*"
        element={
          <>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categoria/:slug" element={<CategoryPage />} />
              <Route path="/busca" element={<CategoryPage />} />
              <Route path="/produto/:slug" element={<ProductPage />} />
              <Route path="/carrinho" element={<CartPage />} />
              <Route
                path="/checkout"
                element={
                  <CustomerRoute>
                    <CheckoutPage />
                  </CustomerRoute>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<RegisterPage />} />
              <Route
                path="/minha-conta/*"
                element={
                  <CustomerRoute>
                    <AccountPage />
                  </CustomerRoute>
                }
              />
              <Route
                path="/favoritos"
                element={
                  <CustomerRoute>
                    <AccountPage />
                  </CustomerRoute>
                }
              />
            </Routes>
            <Footer />
          </>
        }
      />
    </Routes>
  )
}
