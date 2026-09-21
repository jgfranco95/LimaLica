import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  const hasPromo = !!product.promo_price
  const image = product.images?.[0]?.path
  const imageUrl = image ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${image}` : null

  return (
    <Link
      to={`/produto/${product.slug}`}
      className="group block rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
    >
      <div className="aspect-square bg-blush-light/40 rounded-2xl overflow-hidden mb-3 relative shadow-sm group-hover:shadow-xl transition-shadow duration-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300 text-sm">Sem imagem</div>
        )}
        {hasPromo && (
          <span className="absolute top-2 left-2 bg-blush-dark text-white text-xs px-2 py-1 rounded-full">
            Promoção
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="text-sm font-medium text-neutral-800 truncate group-hover:text-aqua-dark transition-colors duration-200">
        {product.name}
      </h3>
      <div className="flex items-baseline gap-2 mt-0.5">
        {hasPromo && (
          <span className="text-xs text-neutral-400 line-through">R$ {Number(product.price).toFixed(2)}</span>
        )}
        <span className="text-aqua-dark font-semibold">
          R$ {Number(hasPromo ? product.promo_price : product.price).toFixed(2)}
        </span>
      </div>
    </Link>
  )
}