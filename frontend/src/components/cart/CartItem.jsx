import React from 'react'
import { useCart } from '../../context/CartContext'
import { formatPrice } from '../../utils/discounts'
import toast from 'react-hot-toast'

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const subtotal = item.price * item.quantity
  const hasProductDiscount = item.quantity >= 3
  const isBulkPurchase = item.quantity >= 5

  const handleRemove = () => {
    removeItem(item._id)
    toast.success('Item removed from cart')
  }

  return (
    <div style={styles.item}>
      <img
        src={item.image}
        alt={item.name}
        style={styles.img}
        onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=No+Image' }}
      />

      <div style={styles.details}>
        <div style={styles.nameRow}>
          <h4 style={styles.name}>{item.name}</h4>
          <div style={styles.badges}>
            {isBulkPurchase && (
              <span className="badge badge-bulk">⚡ Bulk Purchase</span>
            )}
            {hasProductDiscount && (
              <span className="badge badge-discount">10% off applied</span>
            )}
          </div>
        </div>

        <p style={styles.unitPrice}>{formatPrice(item.price)} per unit</p>

        <div style={styles.row}>
          <div className="qty-control">
            <button
              className="qty-btn"
              onClick={() => updateQty(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              −
            </button>
            <span className="qty-num">{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => updateQty(item._id, item.quantity + 1)}
              disabled={item.quantity >= 10}
            >
              +
            </button>
          </div>

          <div style={styles.priceBlock}>
            <span className="price">{formatPrice(subtotal)}</span>
            {hasProductDiscount && (
              <span style={styles.discount}>-{formatPrice(subtotal * 0.1)}</span>
            )}
          </div>

          <button className="btn btn-danger btn-sm" onClick={handleRemove}>
            🗑 Remove
          </button>
        </div>

        {item.quantity >= 10 && (
          <p style={styles.maxNote}>Maximum quantity reached</p>
        )}
      </div>
    </div>
  )
}

const styles = {
  item: {
    display: 'flex',
    gap: 16,
    padding: '20px 24px',
    borderBottom: '1px solid var(--border-light)',
    animation: 'slideIn 0.3s ease',
  },
  img: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 10,
    flexShrink: 0,
    border: '1px solid var(--border)',
  },
  details: { flex: 1, minWidth: 0 },
  nameRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 },
  name: { fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)' },
  badges: { display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' },
  unitPrice: { fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12 },
  row: { display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  priceBlock: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  discount: { fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 },
  maxNote: { fontSize: '0.75rem', color: 'var(--accent)', marginTop: 6, fontWeight: 500 },
}
