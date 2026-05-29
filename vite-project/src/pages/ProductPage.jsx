import { Link, useParams } from 'react-router-dom'
import { formatPrice, getProductBySlug, PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'

function ProductPage() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const { addToCart } = useCart()

  if (!product) {
    return (
      <section className="section-block empty-state">
        <p className="eyebrow">Not found</p>
        <h1>That product does not exist.</h1>
        <p className="lede">The product may have been removed or the link may be incorrect.</p>
        <Link to="/catalog" className="primary-button">
          Back to catalog
        </Link>
      </section>
    )
  }

  const recommendedProducts = PRODUCTS.filter(
    (item) => item.category === product.category && item.id !== product.id,
  ).slice(0, 2)

  return (
    <div className="stacked-page">
      <section className="section-block product-detail">
        <div className="detail-visual" style={{ background: product.accent }}>
          <span>{product.badge}</span>
          <strong>{product.brand}</strong>
        </div>

        <div className="detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="lede">{product.description}</p>

          <div className="detail-meta">
            <span>{formatPrice(product.price)}</span>
            <span>{product.rating} / 5 from {product.reviewCount} reviews</span>
          </div>

          <ul className="feature-list detail-list">
            {product.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <div className="product-actions">
            <button type="button" className="primary-button" onClick={() => addToCart(product)}>
              Add to cart
            </button>
            <Link to="/catalog" className="secondary-button">
              Continue shopping
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block specs-grid">
        {product.specs.map((spec) => (
          <div key={spec.label} className="spec-card">
            <p>{spec.label}</p>
            <strong>{spec.value}</strong>
          </div>
        ))}
      </section>

      {recommendedProducts.length > 0 ? (
        <section className="section-block">
          <div className="section-head">
            <div>
              <p className="eyebrow">Recommended</p>
              <h2>More from this collection</h2>
            </div>
          </div>

          <div className="product-grid product-grid-tight">
            {recommendedProducts.map((item) => (
              <article key={item.id} className="mini-card">
                <p className="eyebrow">{item.brand}</p>
                <h3>{item.name}</h3>
                <p>{item.summary}</p>
                <Link to={`/product/${item.slug}`}>View details</Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default ProductPage
