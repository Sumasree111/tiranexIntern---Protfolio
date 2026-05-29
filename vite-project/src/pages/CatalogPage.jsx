import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, PRODUCTS } from '../data/products'

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const category = searchParams.get('category') ?? 'all'
  const sort = searchParams.get('sort') ?? 'featured'

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const matchesCategory = (product) => category === 'all' || product.category === category
    const matchesQuery = (product) =>
      !normalizedQuery ||
      [product.name, product.brand, product.summary, ...product.features]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)

    const sorted = PRODUCTS.filter(matchesCategory).filter(matchesQuery).slice()

    if (sort === 'price-asc') {
      sorted.sort((left, right) => left.price - right.price)
    } else if (sort === 'price-desc') {
      sorted.sort((left, right) => right.price - left.price)
    } else if (sort === 'rating') {
      sorted.sort((left, right) => right.rating - left.rating)
    } else {
      sorted.sort((left, right) => Number(right.featured) - Number(left.featured))
    }

    return sorted
  }, [category, query, sort])

  function updateParam(key, value) {
    const nextParams = new URLSearchParams(searchParams)

    if (!value || value === 'all') {
      nextParams.delete(key)
    } else {
      nextParams.set(key, value)
    }

    setSearchParams(nextParams)
  }

  return (
    <div className="stacked-page">
      <section className="section-block catalog-hero">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Everything organized into a seamless storefront.</h1>
          <p className="lede">
            Search, filter, and sort the catalog with URL-backed state so navigation stays fast and
            shareable.
          </p>
        </div>

        <div className="search-toolbar">
          <input
            type="search"
            value={query}
            onChange={(event) => updateParam('q', event.target.value)}
            placeholder="Search products, brands, or features"
          />

          <select value={category} onChange={(event) => updateParam('category', event.target.value)}>
            {CATEGORIES.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>

          <select value={sort} onChange={(event) => updateParam('sort', event.target.value)}>
            <option value="featured">Featured</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <div>
            <p className="eyebrow">Results</p>
            <h2>{filteredProducts.length} products matched</h2>
          </div>
          <Link to="/cart">Go to cart</Link>
        </div>

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
          ) : (
            <div className="empty-card">
              <h3>No products found</h3>
              <p>Try a broader search term or switch to a different category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default CatalogPage
