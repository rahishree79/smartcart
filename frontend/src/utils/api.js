import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token if available
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem('smartcart_user'))
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
  } catch {}
  return config
})

export default api
