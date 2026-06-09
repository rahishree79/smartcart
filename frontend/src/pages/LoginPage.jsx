import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrap}>
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🛒</div>
          <h1 style={styles.title}>Welcome Back</h1>
          <p style={styles.sub}>Login to your SmartCart account</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" type="email" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="input" type="password" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••" required />
          </div>

          <div style={styles.hint}>
            <strong>Test account:</strong> test@smartcart.com / password123
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrap: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: 24 },
  card: { width: '100%', maxWidth: 420, padding: 36 },
  header: { textAlign: 'center', marginBottom: 28 },
  icon: { fontSize: '2.5rem', marginBottom: 8 },
  title: { fontFamily: 'Syne, sans-serif', fontSize: '1.75rem', fontWeight: 800 },
  sub: { color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 6 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  hint: { background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 8, padding: '8px 12px', fontSize: '0.78rem' },
  switchText: { textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' },
  link: { color: 'var(--primary)', fontWeight: 600 },
}
