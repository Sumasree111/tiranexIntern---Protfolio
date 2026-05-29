import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProductById } from '../data/products'

const STORAGE_KEY = 'thiranex.catalog.cart.v1'

const CartContext = createContext(null)

function loadCart() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsed = JSON.parse(rawValue)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.productId === 'string' &&
          Number.isFinite(item.quantity) &&
          item.quantity > 0,
      )
      .map((item) => ({ productId: item.productId, quantity: Math.floor(item.quantity) }))
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [lineItems, setLineItems] = useState(loadCart)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lineItems))
  }, [lineItems])

  const cartItems = useMemo(() => {
    return lineItems
      .map((lineItem) => {
        const product = getProductById(lineItem.productId)

        if (!product) {
          return null
        }

        return {
          ...product,
          quantity: lineItem.quantity,
        }
      })
      .filter(Boolean)
  }, [lineItems])

  const itemCount = useMemo(
    () => lineItems.reduce((total, lineItem) => total + lineItem.quantity, 0),
    [lineItems],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((total, product) => total + product.price * product.quantity, 0),
    [cartItems],
  )

  function addToCart(product, quantity = 1) {
    setLineItems((currentItems) => {
      const match = currentItems.find((item) => item.productId === product.id)

      if (match) {
        return currentItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [...currentItems, { productId: product.id, quantity }]
    })
  }

  function setQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setLineItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    )
  }

  function removeFromCart(productId) {
    setLineItems((currentItems) => currentItems.filter((item) => item.productId !== productId))
  }

  function clearCart() {
    setLineItems([])
  }

  const value = useMemo(
    () => ({
      cartItems,
      itemCount,
      subtotal,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
    }),
    [cartItems, itemCount, subtotal],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
