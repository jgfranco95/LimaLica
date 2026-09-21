import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import api from '../services/api'

const inputClass =
  'border border-neutral-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua transition'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const [coupon, setCoupon] = useState('')
  const [couponResult, setCouponResult] = useState(null)
  const [couponError, setCouponError] = useState('')
  const navigate = useNavigate()

  async function applyCoupon() {
    setCouponError('')
    try {
      const { data } = await api.post('/coupons/validate', { code: coupon, subtotal })
      setCouponResult(data)
    } catch {
      setCouponError('Cupom inválido ou expirado.')
      setCouponResult(null)
    }
  }

  const discount = couponResult?.discount || 0
  const total = Math.max(0, subtotal - discount)

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-neutral-500 mb-4">Seu carrinho está vazio.</p>
        <Link to="/" className="text-aqua-dark underline">Continuar comprando</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-4">
        <h1 className="font-serif font-medium text-2xl mb-2">Seu carrinho</h1>
        {items.map((item) => (
          <div key={item.variantId} className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-neutral-100">
            <div className="w-20 h-20 bg-blush-light/40 rounded-xl shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-neutral-500">{item.color} {item.size && `• ${item.size}`}</p>
              <p className="text-aqua-dark font-semibold">R$ {item.price.toFixed(2)}</p>
              <div className="flex items-center gap-2 mt-2">
                <input type="number" min={1} value={item.quantity}
                  onChange={(e) => updateQuantity(item.variantId, Math.max(1, Number(e.target.value)))}
                  className={`${inputClass} w-16`} />
                <button onClick={() => removeItem(item.variantId)} className="text-xs text-blush-dark hover:text-blush-dark/70 transition-colors">Remover</button>
              </div>
            </div>
            <p className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <Link to="/" className="inline-block text-sm text-aqua-dark underline">← Continuar Comprando</Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 h-fit space-y-3">
        <h2 className="font-serif font-medium text-xl mb-1">Resumo</h2>
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
        {discount > 0 && <div className="flex justify-between text-sm text-blush-dark"><span>Desconto</span><span>- R$ {discount.toFixed(2)}</span></div>}
        <div className="flex justify-between text-sm text-neutral-500"><span>Frete</span><span>Calculado no checkout</span></div>

        <div className="flex gap-2 pt-2">
          <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Cupom"
            className={`${inputClass} flex-1`} />
          <button onClick={applyCoupon} className="text-sm bg-neutral-800 text-white rounded-xl px-3 hover:bg-neutral-700 transition-colors">Aplicar</button>
        </div>
        {couponError && <p className="text-xs text-red-500">{couponError}</p>}

        <div className="flex justify-between font-semibold border-t border-neutral-200 pt-3">
          <span>Total</span><span>R$ {total.toFixed(2)}</span>
        </div>

        <button onClick={() => navigate('/checkout', { state: { couponCode: couponResult ? coupon : null } })}
          className="w-full btn-primary">
          Finalizar Compra
        </button>
      </div>
    </div>
  )
}