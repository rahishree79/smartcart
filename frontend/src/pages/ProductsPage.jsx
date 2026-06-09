import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import ProductCard from '../components/product/ProductCard'
import Loader from '../components/common/Loader'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const params = {}
        if (search) params.search = search
        if (category !== 'All') params.category = category
        if (sort) params.sort = sort

        const { data } = await api.get('/products', { params })
        setProducts(data.products)
        setCategories(data.categories)
      } catch (err) {
        setError('Failed to load products. Make sure the backend is running.')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchProducts, search ? 400 : 0)
    return () => clearTimeout(timer)
  }, [search, category, sort])

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">Our Products</h1>
        <p className="page-subtitle">Discover amazing products at great prices</p>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            className="input"
            style={{ paddingLeft: 36 }}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="input select"
          style={{ width: 160 }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="input select"
          style={{ width: 180 }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Discount hint banner */}
      <div style={styles.discountBanner}>
        <span>🎉</span>
        <span>
          <strong>Deals active:</strong> Buy 3+ of any item → 10% off · Cart over ₹5,000 → extra 5% · Cheapest item always 50% off!
        </span>
      </div>

      {loading ? (
        <Loader text="Loading products..." />
      ) : error ? (
        <div className="empty-state">
          <div className="icon">⚠️</div>
          <h3>Failed to load</h3>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filters</p>
          <button className="btn btn-outline" onClick={() => { setSearch(''); setCategory('All'); setSort('') }}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p style={styles.resultCount}>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
          <div className="products-grid">
            {products.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  filters: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 20,
    alignItems: 'center',
  },
  searchWrap: { flex: 1, minWidth: 200, position: 'relative' },
  searchIcon: { position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem' },
  discountBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'linear-gradient(135deg, var(--primary-light), #fff)',
    border: '1px solid rgba(108,71,255,0.2)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 16px',
    marginBottom: 24,
    fontSize: '0.85rem',
    color: 'var(--primary-dark)',
  },
  resultCount: { color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 },
}
