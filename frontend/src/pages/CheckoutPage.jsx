import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice, calculateCartDiscounts } from '../utils/discounts'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    email: user?.email || '',
  })
  const [loading, setLoading] = useState(false)

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="empty-state" style={{ minHeight: '70vh' }}>
          <div className="icon">🛒</div>
          <h3>Nothing to checkout</h3>
          <Link to="/products" className="btn btn-primary">Shop Now</Link>
        </div>
      </div>
    )
  }

  const {
    processedItems,
    totalAmount,
    productDiscountTotal,
    cartDiscount,
    bulkDiscount,
    finalAmount,
    cheapestItemName,
    savings,
  } = calculateCartDiscounts(cart)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.address || !form.city || !form.pincode || !form.phone) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setLoading(true)
      const items = cart.map(i => ({ productId: i._id, quantity: i.quantity }))
      const { data } = await api.post('/orders', {
        items,
        shippingAddress: form,
        guestEmail: !user ? form.email : undefined,
      })
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate(`/order/${data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ paddingBottom: 48 }}>
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Complete your purchase</p>
      </div>

      <div style={styles.layout}>
        {/* Form */}
        <div style={{ flex: 1 }}>
          <div className="card" style={{ padding: 28 }}>
            <h3 style={styles.sectionTitle}>Shipping Details</h3>
            <div className="divider" />

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="input" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="input" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" required />
                </div>
              </div>

              {!user && (
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Email</label>
                  <input className="input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
                </div>
              )}

              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label">Address *</label>
                <input className="input" name="address" value={form.address} onChange={handleChange} placeholder="House No, Street, Landmark" required />
              </div>

              <div style={{ ...styles.formGrid, marginTop: 16 }}>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="input" name="city" value={form.city} onChange={handleChange} placeholder="Ahmedabad" required />
                </div>
                <div className="form-group">
                  <label className="form-label">PIN Code *</label>
                  <input className="input" name="pincode" value={form.pincode} onChange={handleChange} placeholder="380001" required maxLength={6} />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ marginTop: 28 }}
                disabled={loading}
              >
                {loading ? '⏳ Placing Order...' : `Place Order · ${formatPrice(finalAmount)}`}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ width: 360, flexShrink: 0 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={styles.sectionTitle}>Order Summary</h3>
            <div className="divider" />

            {/* Items list */}
            <div style={styles.itemsList}>
              {processedItems.map(item => (
                <div key={item._id} style={styles.orderItem}>
                  <img src={item.image} alt={item.name} style={styles.thumb}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }} />
                  <div style={{ flex: 1 }}>
                    <div style={styles.itemName}>{item.name}</div>
                    <div style={styles.itemMeta}>
                      {item.quantity} × {formatPrice(item.price)}
                      {item.productDiscount > 0 && (
                        <span style={{ color: 'var(--success)', marginLeft: 6 }}>
                          (−{formatPrice(item.productDiscount)})
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={styles.itemTotal}>{formatPrice(item.discountedSubtotal)}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            {/* Discount breakdown */}
            <div style={styles.pricingSection}>
              <div style={styles.priceRow}>
                <span>Subtotal</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>

              {productDiscountTotal > 0 && (
                <div style={{ ...styles.priceRow, color: 'var(--success)' }}>
                  <span>🏷 Product Discount (qty ≥ 3)</span>
                  <span>−{formatPrice(productDiscountTotal)}</span>
                </div>
              )}

              {bulkDiscount > 0 && (
                <div style={{ ...styles.priceRow, color: 'var(--success)' }}>
                  <div>
                    <div>🎁 Cheapest Item 50% Off</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {cheapestItemName?.slice(0, 30)}
                    </div>
                  </div>
                  <span>−{formatPrice(bulkDiscount)}</span>
                </div>
              )}

              {cartDiscount > 0 && (
                <div style={{ ...styles.priceRow, color: 'var(--success)' }}>
                  <span>🛒 Cart Discount (over ₹5K)</span>
                  <span>−{formatPrice(cartDiscount)}</span>
                </div>
              )}

              <div style={{ ...styles.priceRow, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <span>🚚 Delivery</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
              </div>
            </div>

            <div className="divider" />

            <div style={styles.totalRow}>
              <span>Final Amount</span>
              <div style={{ textAlign: 'right' }}>
                <div style={styles.finalPrice}>{formatPrice(finalAmount)}</div>
                {savings > 0 && <div className="price-original">{formatPrice(totalAmount)}</div>}
              </div>
            </div>

            {savings > 0 && (
              <div style={styles.savingsBadge}>
                🎉 Total savings: {formatPrice(savings)}
              </div>
            )}
          </div>

          <Link to="/cart" style={styles.backLink}>← Back to Cart</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  layout: { display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  itemsList: { display: 'flex', flexDirection: 'column', gap: 12 },
  orderItem: { display: 'flex', alignItems: 'center', gap: 10 },
  thumb: { width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' },
  itemName: { fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3 },
  itemMeta: { fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 },
  itemTotal: { fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 },
  pricingSection: { display: 'flex', flexDirection: 'column', gap: 10 },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    fontSize: '0.875rem',
    gap: 8,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: '1rem',
  },
  finalPrice: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' },
  savingsBadge: {
    background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    color: '#065f46',
    borderRadius: 8,
    padding: '8px 12px',
    fontSize: '0.82rem',
    fontWeight: 600,
    textAlign: 'center',
    marginTop: 12,
  },
  backLink: {
    display: 'block',
    textAlign: 'center',
    marginTop: 14,
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
}
