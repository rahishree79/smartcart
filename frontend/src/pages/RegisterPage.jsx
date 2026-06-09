import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    try {
      setLoading(true)
      await register(form.name, form.email, form.password)
      toast.success('Account created! Welcome to SmartCart 🎉')
      navigate('/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const onChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div style={styles.wrap}>
      <div className="card" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🛒</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.sub}>Join SmartCart and start shopping</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="input" value={form.name} onChange={onChange('name')} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" type="email" value={form.email} onChange={onChange('email')} placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="input" type="password" value={form.password} onChange={onChange('password')} placeholder="Min 6 characters" required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="input" type="password" value={form.confirm} onChange={onChange('confirm')} placeholder="Re-enter password" required />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
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
  switchText: { textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-muted)' },
  link: { color: 'var(--primary)', fontWeight: 600 },
}
