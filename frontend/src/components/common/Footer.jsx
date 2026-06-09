import React from 'react'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.inner}>
        <span style={styles.brand}>🛒 SmartCart</span>
        <span style={styles.copy}>© 2026 SmartCart.</span>
        <div style={styles.links}>
          <span style={styles.link}>Electronics</span>
          <span style={styles.link}>Clothing</span>
          <span style={styles.link}>Books</span>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: 'var(--text-primary)',
    color: '#fff',
    padding: '24px 0',
    marginTop: 'auto',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  brand: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem' },
  copy: { color: '#9ca3af', fontSize: '0.82rem' },
  links: { display: 'flex', gap: 16 },
  link: { color: '#9ca3af', fontSize: '0.82rem', cursor: 'pointer' },
}
