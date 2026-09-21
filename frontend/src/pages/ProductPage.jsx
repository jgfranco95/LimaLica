import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const inputClass =
  'border border-neutral-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua transition'

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState(null)
  const [size, setSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [cep, setCep] = useState('')
  const [shippingOptions, setShippingOptions] = useState(null)
  const { addItem } = useCart()

  useEffect(() => {
    api.get(`/products/${slug}`).then((r) => {
      setProduct(r.data.product)
      setRelated(r.data.related)
    })
  }, [slug])

  if (!product) return <p className="max-w-7xl mx-auto px-4 py-8 text-neutral-500">Carregando...</p>

  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))]
  const selectedVariant = product.variants.find(
    (v) => (!colors.length || v.color === color) && (!sizes.length || v.size === size)
  )
  const hasPromo = !!product.promo_price
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '')

  async function calcShipping() {
    const { data } = await api.post('/shipping/calculate', { zipcode: cep })
    setShippingOptions(data.options)
  }

  function handleAddToCart() {
    if (!selectedVariant) return alert('Selecione cor e tamanho.')
    addItem(product, selectedVariant, quantity)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Galeria */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-blush-light/30 mb-3">
            {product.images[activeImage] && (
              <img
                src={`${apiBase}/storage/${product.images[activeImage].path}`}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-125 transition duration-300 cursor-zoom-in"
              />
            )}
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button key={img.id} onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-aqua' : 'border-transparent'}`}>
                <img src={`${apiBase}/storage/${img.path}`} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {product.video_url && (
            <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-aqua-dark underline mt-3 inline-block">
              Ver vídeo do produto
            </a>
          )}
        </div>

        {/* Informações e compra */}
        <div>
          <h1 className="font-serif font-medium text-3xl">{product.name}</h1>
          <p className="text-xs text-neutral-400 mb-2 mt-1">SKU: {product.sku}</p>
          <p className="text-neutral-600 mb-5">{product.short_description}</p>

          <div className="mb-5">
            {hasPromo && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-neutral-400 line-through text-sm">R$ {Number(product.price).toFixed(2)}</span>
                <span className="text-xs bg-blush-dark text-white px-2 py-0.5 rounded-full">
                  -{Math.round((1 - product.promo_price / product.price) * 100)}%
                </span>
              </div>
            )}
            <div className="text-3xl font-semibold text-aqua-dark">
              R$ {Number(hasPromo ? product.promo_price : product.price).toFixed(2)}
            </div>
            <p className="text-sm text-neutral-500 mt-1">
              em até {product.installments_max}x de R$ {(Number(hasPromo ? product.promo_price : product.price) / product.installments_max).toFixed(2)} sem juros
            </p>
          </div>

          {colors.length > 0 && (
            <OptionGroup label="Cor" options={colors} selected={color} onSelect={setColor} />
          )}
          {sizes.length > 0 && (
            <OptionGroup label="Tamanho" options={sizes} selected={size} onSelect={setSize} />
          )}

          <div className="flex items-center gap-3 my-5">
            <label className="text-sm">Quantidade</label>
            <input type="number" min={1} value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className={`${inputClass} w-16`} />
          </div>

          <div className="flex gap-3 mb-4">
            <button onClick={handleAddToCart} className="flex-1 btn-outline">
              Adicionar ao Carrinho
            </button>
            <button onClick={handleAddToCart} className="flex-1 btn-primary">
              Comprar Agora
            </button>
          </div>
          <button className="text-sm text-blush-dark mb-6 hover:text-blush-dark/70 transition-colors">♥ Favoritar</button>

          <div className="border-t border-neutral-200 pt-5">
            <div className="flex gap-2 mb-2">
              <input placeholder="Digite seu CEP" value={cep} onChange={(e) => setCep(e.target.value)}
                className={`${inputClass} flex-1`} />
              <button onClick={calcShipping} className="text-sm bg-neutral-800 text-white rounded-xl px-4 hover:bg-neutral-700 transition-colors">Calcular</button>
            </div>
            {shippingOptions?.map((opt) => (
              <p key={opt.name} className="text-sm text-neutral-600">
                {opt.name}: R$ {opt.price.toFixed(2)} — até {opt.days} dias úteis
              </p>
            ))}
          </div>

          <div className="border-t border-neutral-200 mt-6 pt-5 text-sm text-neutral-700 whitespace-pre-line">
            {product.description}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif font-medium text-2xl mb-6">Produtos relacionados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}

function OptionGroup({ label, options, selected, onSelect }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-1.5">{label}</p>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button key={opt} onClick={() => onSelect(opt)}
            className={`px-3 py-1 rounded-full border text-sm transition-colors ${selected === opt ? 'bg-aqua text-white border-aqua' : 'border-neutral-300 hover:border-aqua'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}