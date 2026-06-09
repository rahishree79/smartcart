import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/cart/CartItem'
import { formatPrice, calculateCartDiscounts } from '../utils/discounts'

export default function CartPage() {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ minHeight: '70vh' }}>
          <div className="icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet. Start shopping!</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    )
  }

  const { totalAmount, productDiscountTotal, cartDiscount, bulkDiscount, finalAmount, cheapestItemName } =
    calculateCartDiscounts(cart)

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Your Cart</h1>
          <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} · {cart.reduce((s, i) => s + i.quantity, 0)} units</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ color: 'var(--danger)' }}>
          🗑 Clear All
        </button>
      </div>

      <div style={styles.layout}>
        {/* Items */}
        <div className="card" style={{ flex: 1, overflow: 'hidden' }}>
          {cart.map(item => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            <div className="divider" style={{ margin: '12px 0' }} />

            <div style={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>

            {productDiscountTotal > 0 && (
              <div className="discount-row">
                <span>🏷 Bulk discount (3+ units)</span>
                <span>−{formatPrice(productDiscountTotal)}</span>
              </div>
            )}

            {bulkDiscount > 0 && (
              <div className="discount-row">
                <span>🎁 Cheapest item 50% off<br />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({cheapestItemName?.slice(0, 25)}...)</small>
                </span>
                <span>−{formatPrice(bulkDiscount)}</span>
              </div>
            )}

            {cartDiscount > 0 && (
              <div className="discount-row">
                <span>🛒 Cart discount (over ₹5,000)</span>
                <span>−{formatPrice(cartDiscount)}</span>
              </div>
            )}

            {totalAmount <= 5000 && (
              <div style={styles.discountHint}>
                Add {formatPrice(5000 - totalAmount)} more to unlock 5% cart discount!
              </div>
            )}

            <div className="divider" />

            <div style={styles.totalRow}>
              <span>Total</span>
              <div style={{ textAlign: 'right' }}>
                <div style={styles.finalPrice}>{formatPrice(finalAmount)}</div>
                {totalAmount !== finalAmount && (
                  <div className="price-original">{formatPrice(totalAmount)}</div>
                )}
              </div>
            </div>

            {totalAmount !== finalAmount && (
              <div style={styles.savingsBadge}>
                🎉 You save {formatPrice(totalAmount - finalAmount)}!
              </div>
            )}

            <button
              className="btn btn-primary btn-full"
              style={{ marginTop: 20 }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <Link to="/products" style={styles.continueLink}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  layout: { display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' },
  summaryTitle: { fontSize: '1.1rem', fontWeight: 700 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '6px 0', color: 'var(--text-secondary)' },
  discountHint: {
    background: '#fff7ed',
    border: '1px dashed #fed7aa',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: '0.78rem',
    color: '#c2410c',
    margin: '8px 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1rem',
  },
  finalPrice: { fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' },
  savingsBadge: {
    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    color: '#065f46',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: '0.82rem',
    fontWeight: 600,
    textAlign: 'center',
    marginTop: 10,
  },
  continueLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: 14,
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
}
