import './App.css'

import { Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import { CartProvider } from './context/CartContext'
import CartPage from './pages/CartPage'
import CatalogPage from './pages/CatalogPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ProductPage from './pages/ProductPage'

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="product/:slug" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}

export default App
