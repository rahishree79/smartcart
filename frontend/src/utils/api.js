import axios from 'axios'

const api = axios.create({
  baseURL: 'https://smartcart-backend-rs8z.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
})

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