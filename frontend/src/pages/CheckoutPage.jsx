import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../services/api'

const inputClass =
  'border border-neutral-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua transition'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const { state } = useLocation()
  const navigate = useNavigate()

  const [addresses, setAddresses] = useState([])
  const [addressId, setAddressId] = useState(null)
  const [newAddress, setNewAddress] = useState({ zipcode: '', street: '', number: '', neighborhood: '', city: '', state: '' })
  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [shipping, setShipping] = useState(19.9)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/addresses').then((r) => {
      setAddresses(r.data)
      const def = r.data.find((a) => a.is_default) || r.data[0]
      if (def) setAddressId(def.id)
    })
  }, [])

  async function saveNewAddress() {
    const { data } = await api.post('/addresses', { ...newAddress, is_default: addresses.length === 0 })
    setAddresses((prev) => [...prev, data])
    setAddressId(data.id)
  }

  async function submitOrder() {
    setError('')
    try {
      const { data } = await api.post('/checkout', {
        address_id: addressId,
        payment_method: paymentMethod,
        coupon_code: state?.couponCode || null,
        shipping_cost: shipping,
        items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
      })
      setResult(data)
      clearCart()
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao finalizar pedido.')
    }
  }

  if (result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center bg-white rounded-2xl shadow-sm border border-neutral-100 mt-8">
        <h2 className="font-serif font-medium text-2xl mb-2">Pedido {result.order.order_number} criado! 🎉</h2>
        {paymentMethod === 'pix' && result.payment.qr_code_base64 ? (
          <>
            <p className="text-sm text-neutral-600 mb-4">Escaneie o QR Code para pagar via Pix:</p>
            <img src={`data:image/png;base64,${result.payment.qr_code_base64}`} alt="QR Code Pix" className="mx-auto w-48 h-48" />
          </>
        ) : (
          <p className="text-sm text-neutral-600">Finalize o pagamento na tela do Mercado Pago.</p>
        )}
        <button onClick={() => navigate('/minha-conta/pedidos')} className="mt-6 text-aqua-dark underline">
          Ver meus pedidos
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <h1 className="font-serif font-medium text-3xl">Finalizar compra</h1>

      <section>
        <h2 className="font-medium mb-3">Endereço de entrega</h2>
        <div className="space-y-2">
          {addresses.map((a) => (
            <label key={a.id} className="flex items-center gap-2 bg-white p-3 rounded-xl shadow-sm border border-neutral-100">
              <input type="radio" checked={addressId === a.id} onChange={() => setAddressId(a.id)} />
              <span className="text-sm">{a.street}, {a.number} - {a.city}/{a.state}</span>
            </label>
          ))}
        </div>
        <details className="mt-3">
          <summary className="text-sm text-aqua-dark cursor-pointer">+ Adicionar novo endereço</summary>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {['zipcode', 'street', 'number', 'neighborhood', 'city', 'state'].map((f) => (
              <input key={f} placeholder={f} value={newAddress[f]}
                onChange={(e) => setNewAddress((p) => ({ ...p, [f]: e.target.value }))}
                className={inputClass} />
            ))}
          </div>
          <button onClick={saveNewAddress} className="mt-2 text-sm bg-neutral-800 text-white rounded-xl px-3 py-1.5 hover:bg-neutral-700 transition-colors">Salvar endereço</button>
        </details>
      </section>

      <section>
        <h2 className="font-medium mb-3">Cadastro</h2>
        <p className="text-sm text-neutral-500">Nome, CPF, e-mail e telefone já cadastrados na conta são usados automaticamente.</p>
      </section>

      <section>
        <h2 className="font-medium mb-3">Pagamento</h2>
        <div className="flex gap-3 flex-wrap">
          {[['pix', 'Pix'], ['credit_card', 'Cartão de Crédito'], ['debit_card', 'Cartão de Débito']].map(([val, label]) => (
            <button key={val} onClick={() => setPaymentMethod(val)}
              className={`px-4 py-2 rounded-full border text-sm transition-colors ${paymentMethod === val ? 'bg-aqua text-white border-aqua' : 'border-neutral-300 hover:border-aqua'}`}>
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between text-sm"><span>Frete</span><span>R$ {shipping.toFixed(2)}</span></div>
        <div className="flex justify-between font-semibold border-t border-neutral-200 mt-2 pt-2">
          <span>Total</span><span>R$ {(subtotal + shipping).toFixed(2)}</span>
        </div>
      </section>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button onClick={submitOrder} disabled={!addressId}
        className="w-full btn-primary">
        Confirmar Pedido
      </button>
    </div>
  )
}