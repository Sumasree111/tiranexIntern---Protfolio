import { Link } from 'react-router-dom'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'

function ProductCard({ product, compact = false }) {
  const { addToCart } = useCart()

  return (
    <article className={compact ? 'product-card compact' : 'product-card'}>
      <div className="product-visual" style={{ background: product.accent }}>
        <span>{product.badge}</span>
        <strong>{product.brand}</strong>
      </div>

      <div className="product-copy">
        <div className="product-heading">
          <div>
            <p className="eyebrow">{product.category}</p>
            <h3>{product.name}</h3>
          </div>
          <span className="price">{formatPrice(product.price)}</span>
        </div>

        <p className="muted">{product.summary}</p>

        {!compact ? (
          <ul className="feature-list">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        ) : null}

        <div className="product-actions">
          <Link to={`/product/${product.slug}`} className="secondary-button">
            View details
          </Link>
          <button type="button" className="primary-button" onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
