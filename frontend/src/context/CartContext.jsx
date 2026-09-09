import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

// Carrinho fica no localStorage/estado do cliente ate o checkout,
// quando os itens sao enviados de uma vez para POST /checkout
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('ll_cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('ll_cart', JSON.stringify(items))
  }, [items])

  function addItem(product, variant, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variant.id)
      if (existing) {
        return prev.map((i) =>
          i.variantId === variant.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          variantId: variant.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0]?.path,
          price: product.promo_price || product.price,
          color: variant.color,
          size: variant.size,
          quantity,
        },
      ]
    })
  }

  function updateQuantity(variantId, quantity) {
    setItems((prev) => prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)))
  }

  function removeItem(variantId) {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId))
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
