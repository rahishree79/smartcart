import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { cartCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/products')
  }

  const isActive = (path) => location.pathname === path

  return (
    <header style={styles.header}>
      <div className="container" style={styles.inner}>
        <Link to="/products" style={styles.logo}>
          <span style={styles.logoIcon}>🛒</span>
          <span style={styles.logoText}>Smart<span style={{ color: 'var(--accent)' }}>Cart</span></span>
        </Link>

        <nav style={styles.nav}>
          <Link to="/products" style={{ ...styles.navLink, ...(isActive('/products') ? styles.navActive : {}) }}>
            Products
          </Link>
          <Link to="/cart" style={{ ...styles.navLink, ...(isActive('/cart') ? styles.navActive : {}) }}>
            Cart
          </Link>
        </nav>

        <div style={styles.actions}>
          <Link to="/cart" style={styles.cartBtn} aria-label="Cart">
            🛒
            {cartCount > 0 && (
              <span style={styles.cartBadge}>{cartCount > 99 ? '99+' : cartCount}</span>
            )}
          </Link>

          {user ? (
            <div style={styles.userMenu}>
              <span style={styles.userName}>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
            </div>
          ) : (
            <div style={styles.authLinks}>
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

const styles = {
  header: {
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 12px rgba(108,71,255,0.06)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    gap: 24,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  logoIcon: { fontSize: '1.4rem' },
  logoText: {
    fontFamily: 'Syne, sans-serif',
    fontSize: '1.35rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
  },
  nav: { display: 'flex', gap: 4 },
  navLink: {
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    transition: 'all 0.2s',
  },
  navActive: {
    background: 'var(--primary-light)',
    color: 'var(--primary)',
    fontWeight: 600,
  },
  actions: { display: 'flex', alignItems: 'center', gap: 12 },
  cartBtn: {
    position: 'relative',
    fontSize: '1.3rem',
    padding: '4px 8px',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 700,
    width: 18,
    height: 18,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMenu: { display: 'flex', alignItems: 'center', gap: 8 },
  userName: { fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' },
  authLinks: { display: 'flex', alignItems: 'center', gap: 8 },
}
