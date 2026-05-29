import { NavLink, Outlet, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function SiteLayout() {
  const { itemCount } = useCart()

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">C</span>
          <span>
            <strong>Capstone</strong>
            <small>commerce system</small>
          </span>
        </Link>

        <nav className="navlinks" aria-label="Primary navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/catalog">Catalog</NavLink>
          <NavLink to="/cart" className="cart-link">
            Cart <span>{itemCount}</span>
          </NavLink>
        </nav>

        <Link to="/catalog" className="header-cta">
          Explore products
        </Link>
      </header>

      <main className="page-frame">
        <Outlet />
      </main>

      <footer className="footer">
        <p>Built as a modular storefront with client-side routing, optimized for static deployment.</p>
      </footer>
    </div>
  )
}

export default SiteLayout
