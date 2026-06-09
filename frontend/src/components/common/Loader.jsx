import React from 'react'

export default function Loader({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 40 }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{text}</p>
    </div>
  )
}
