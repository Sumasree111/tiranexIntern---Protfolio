import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="section-block empty-state">
      <p className="eyebrow">404</p>
      <h1>That page could not be found.</h1>
      <p className="lede">Use the navigation to return to the storefront or browse the catalog.</p>
      <Link to="/" className="primary-button">
        Go home
      </Link>
    </section>
  )
}

export default NotFoundPage
