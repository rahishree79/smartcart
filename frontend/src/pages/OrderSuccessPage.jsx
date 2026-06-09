import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import { formatPrice } from '../utils/discounts'
import Loader from '../components/common/Loader'

export default function OrderSuccessPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(r => setOrder(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="container"><Loader text="Loading order..." /></div>

  if (!order) return (
    <div className="container">
      <div className="empty-state">
        <div className="icon">❌</div>
        <h3>Order not found</h3>
        <Link to="/products" className="btn btn-primary">Go Shopping</Link>
      </div>
    </div>
  )

  return (
    <div className="container" style={{ paddingBottom: 48, maxWidth: 640, margin: '0 auto' }}>
      <div style={styles.hero} className="card">
        <div style={styles.checkmark}>✅</div>
        <h1 style={styles.title}>Order Confirmed!</h1>
        <p style={styles.subtitle}>Thank you for your purchase. Your order is on its way.</p>
        <code style={styles.orderId}>Order #{order._id.slice(-8).toUpperCase()}</code>
      </div>

      <div className="card" style={{ padding: 24, marginTop: 20 }}>
        <h3 style={styles.sectionTitle}>Order Details</h3>
        <div className="divider" />

        {order.items.map((item, i) => (
          <div key={i} style={styles.itemRow}>
            <img src={item.image} alt={item.name} style={styles.thumb}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/48' }} />
            <div style={{ flex: 1 }}>
              <div style={styles.itemName}>{item.name}</div>
              <div style={styles.itemMeta}>{item.quantity} × {formatPrice(item.price)}</div>
            </div>
            <span style={styles.itemTotal}>{formatPrice(item.discountedSubtotal)}</span>
          </div>
        ))}

        <div className="divider" />

        <div style={styles.pricingBlock}>
          <div style={styles.priceRow}><span>Subtotal</span><span>{formatPrice(order.totalAmount)}</span></div>
          {order.productDiscountTotal > 0 && (
            <div style={{ ...styles.priceRow, color: 'var(--success)' }}>
              <span>Product Discounts</span><span>−{formatPrice(order.productDiscountTotal)}</span>
            </div>
          )}
          {order.bulkDiscount > 0 && (
            <div style={{ ...styles.priceRow, color: 'var(--success)' }}>
              <span>Cheapest Item 50% Off</span><span>−{formatPrice(order.bulkDiscount)}</span>
            </div>
          )}
          {order.cartDiscount > 0 && (
            <div style={{ ...styles.priceRow, color: 'var(--success)' }}>
              <span>Cart Discount (5%)</span><span>−{formatPrice(order.cartDiscount)}</span>
            </div>
          )}
          <div className="divider" style={{ margin: '10px 0' }} />
          <div style={{ ...styles.priceRow, fontWeight: 800, fontSize: '1.1rem' }}>
            <span>Amount Paid</span>
            <span style={{ color: 'var(--primary)' }}>{formatPrice(order.finalAmount)}</span>
          </div>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="card" style={{ padding: 20, marginTop: 16 }}>
          <h4 style={styles.sectionTitle}>Delivery Address</h4>
          <div className="divider" />
          <p style={styles.address}>
            {order.shippingAddress.name}<br />
            {order.shippingAddress.address}<br />
            {order.shippingAddress.city} – {order.shippingAddress.pincode}<br />
            📞 {order.shippingAddress.phone}
          </p>
        </div>
      )}

      <div style={styles.actions}>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    </div>
  )
}

const styles = {
  hero: { padding: '40px 24px', textAlign: 'center', marginTop: 32 },
  checkmark: { fontSize: '3rem', marginBottom: 16 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: 8 },
  subtitle: { color: 'var(--text-secondary)', marginBottom: 16 },
  orderId: { background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 16px', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700 },
  sectionTitle: { fontSize: '1rem', fontWeight: 700 },
  itemRow: { display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' },
  thumb: { width: 48, height: 48, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' },
  itemName: { fontSize: '0.875rem', fontWeight: 600 },
  itemMeta: { fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 },
  itemTotal: { fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 },
  pricingBlock: { display: 'flex', flexDirection: 'column', gap: 8 },
  priceRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' },
  address: { fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.8 },
  actions: { display: 'flex', justifyContent: 'center', marginTop: 28, gap: 16 },
}
