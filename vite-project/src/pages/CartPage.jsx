import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { cartItems, itemCount, subtotal, setQuantity, removeFromCart, clearCart } = useCart()
  const shipping = subtotal > 0 ? 12 : 0
  const total = subtotal + shipping

  if (cartItems.length === 0) {
    return (
      <section className="section-block empty-state cart-empty">
        <p className="eyebrow">Cart</p>
        <h1>Your cart is empty.</h1>
        <p className="lede">Add products from the catalog to see the persistent cart state in action.</p>
        <Link to="/catalog" className="primary-button">
          Browse catalog
        </Link>
      </section>
    )
  }

  return (
    <div className="stacked-page">
      <section className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Cart</p>
            <h1>{itemCount} items ready for checkout</h1>
          </div>
          <button type="button" className="ghost-button" onClick={clearCart}>
            Clear cart
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <article key={item.id} className="cart-row">
                <div className="cart-item-copy">
                  <p className="eyebrow">{item.brand}</p>
                  <h3>{item.name}</h3>
                  <p>{formatPrice(item.price)}</p>
                </div>

                <div className="cart-controls">
                  <div className="stepper">
                    <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)}>
                      +
                    </button>
                  </div>

                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                  <button type="button" className="link-button" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="summary-card">
            <p className="eyebrow">Order summary</p>
            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>{formatPrice(shipping)}</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button type="button" className="primary-button">
              Checkout
            </button>
          </aside>
        </div>
      </section>
    </div>
  )
}

export default CartPage
