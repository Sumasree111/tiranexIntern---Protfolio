import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, PRODUCTS } from '../data/products'

function HomePage() {
  const featuredProducts = PRODUCTS.filter((product) => product.featured).slice(0, 3)

  return (
    <div className="stacked-page">
      <section className="hero-panel landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">Modular storefront</p>
          <h1>Build a product catalog that feels production ready.</h1>
          <p className="lede">
            A routed React storefront with featured collections, product details, a persistent cart,
            and a deployment-friendly static build.
          </p>

          <div className="hero-actions">
            <Link to="/catalog" className="primary-button">
              Shop the catalog
            </Link>
            <Link to="/cart" className="secondary-button">
              Review cart
            </Link>
          </div>
        </div>

        <div className="hero-radar">
          <div>
            <strong>6</strong>
            <span>curated products</span>
          </div>
          <div>
            <strong>4.8</strong>
            <span>average rating</span>
          </div>
          <div>
            <strong>SPA</strong>
            <span>client-side routing</span>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Collections</p>
            <h2>Browse by category</h2>
          </div>
          <Link to="/catalog">See all categories</Link>
        </div>

        <div className="category-grid">
          {CATEGORIES.filter((category) => category.key !== 'all').map((category) => (
            <Link
              key={category.key}
              to={`/catalog?category=${category.key}`}
              className="category-card"
            >
              <span>{category.label}</span>
              <small>{category.description}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Featured products</p>
            <h2>Top picks for the capstone</h2>
          </div>
          <Link to="/catalog?sort=featured">Open catalog</Link>
        </div>

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} compact />
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
