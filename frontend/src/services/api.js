import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

// Injeta o token salvo no localStorage em toda requisicao autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ll_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Se a API responder 401, o token expirou/invalido -> desloga
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ll_token')
      localStorage.removeItem('ll_user')
    }
    return Promise.reject(err)
  }
)

export default api
