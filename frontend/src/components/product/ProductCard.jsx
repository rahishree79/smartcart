import React from 'react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/discounts'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { cart, addItem } = useCart()
  const inCart = cart.find(i => i._id === product._id)
  const isOutOfStock = product.stock === 0
  const isMaxed = inCart && inCart.quantity >= 10

  const handleAddToCart = () => {
    if (isOutOfStock) return
    if (isMaxed) {
      toast.error('Maximum quantity (10) reached')
      return
    }
    addItem(product)
    toast.success(`${product.name.split(' ').slice(0, 3).join(' ')} added to cart!`, {
      icon: '🛒',
    })
  }

  const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating))

  return (
    <div style={styles.card} className="fade-up">
      <div style={styles.imgWrap}>
        <img
          src={product.image}
          alt={product.name}
          style={{ ...styles.img, filter: isOutOfStock ? 'grayscale(60%)' : 'none' }}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
        />
        {isOutOfStock && (
          <div style={styles.outOverlay}>
            <span className="badge badge-out">Out of Stock</span>
          </div>
        )}
        <span className="tag" style={styles.categoryTag}>{product.category}</span>
      </div>

      <div style={styles.body}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.desc}>{product.description.slice(0, 80)}...</p>

        <div style={styles.meta}>
          <span className="stars">{stars}</span>
          <span style={styles.reviewCount}>({product.numReviews})</span>
          {product.stock > 0 && product.stock <= 5 && (
            <span style={styles.lowStock}>Only {product.stock} left</span>
          )}
        </div>

        <div style={styles.footer}>
          <span className="price">{formatPrice(product.price)}</span>
          <button
            className={`btn btn-sm ${isOutOfStock ? 'btn-ghost' : 'btn-primary'}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock || isMaxed}
            style={{ minWidth: 110 }}
          >
            {isOutOfStock ? 'Unavailable' : isMaxed ? 'Max Added' : inCart ? '+ Add More' : 'Add to Cart'}
          </button>
        </div>

        {inCart && (
          <div style={styles.inCartNote}>
            ✓ {inCart.quantity} in cart
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
  },
  imgWrap: { position: 'relative', paddingBottom: '65%', background: '#f9fafb' },
  img: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  outOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(255,255,255,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: '0.7rem',
  },
  body: { padding: '14px 16px 16px' },
  name: { fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 6, color: 'var(--text-primary)' },
  desc: { fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 },
  meta: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  reviewCount: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  lowStock: { fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 600, marginLeft: 'auto' },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  inCartNote: {
    marginTop: 8,
    fontSize: '0.78rem',
    color: 'var(--success)',
    fontWeight: 600,
  },
}
