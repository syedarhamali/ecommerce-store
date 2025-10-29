import axios from 'axios'
import { toast } from 'react-hot-toast'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An error occurred'
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token')
      window.location.href = '/auth/login'
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  googleAuth: (data: { googleId: string; name: string; email: string; avatar?: string }) =>
    api.post('/auth/google', data),
  
  getMe: () => api.get('/auth/me'),
  
  updateProfile: (data: { name?: string; email?: string; avatar?: string }) =>
    api.put('/auth/profile', data),
}

// Products API
export const productsApi = {
  getProducts: (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sort?: string
    order?: 'asc' | 'desc'
    minPrice?: number
    maxPrice?: number
    brand?: string
    isFeatured?: boolean
  }) => api.get('/products', { params }),
  
  getProduct: (id: string) => api.get(`/products/${id}`),
  
  getFeaturedProducts: () => api.get('/products/featured/list'),
  
  getProductsByCategory: (category: string, limit?: number) =>
    api.get(`/products/category/${category}`, { params: { limit } }),
  
  searchProducts: (query: string, limit?: number) =>
    api.get('/products/search/query', { params: { q: query, limit } }),
  
  getCategories: () => api.get('/products/categories/list'),
  
  addToWishlist: (productId: string) =>
    api.post(`/products/${productId}/wishlist`),
  
  removeFromWishlist: (productId: string) =>
    api.delete(`/products/${productId}/wishlist`),
  
  addReview: (productId: string, data: { rating: number; comment?: string }) =>
    api.post(`/products/${productId}/reviews`, data),
}

// Orders API
export const ordersApi = {
  createOrder: (data: {
    items: Array<{ product: string; quantity: number }>
    shippingAddress: any
    billingAddress?: any
    paymentMethod: string
    notes?: string
  }) => api.post('/orders', data),
  
  getMyOrders: (params?: {
    page?: number
    limit?: number
    status?: string
    sort?: string
    order?: 'asc' | 'desc'
  }) => api.get('/orders/my-orders', { params }),
  
  getOrder: (id: string) => api.get(`/orders/${id}`),
  
  cancelOrder: (id: string, reason?: string) =>
    api.put(`/orders/${id}/cancel`, { reason }),
  
  getOrderStats: () => api.get('/orders/stats/summary'),
}

// Admin API
export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Products
  getProducts: (params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    isActive?: boolean
    sort?: string
    order?: 'asc' | 'desc'
  }) => api.get('/admin/products', { params }),
  
  getProduct: (id: string) => api.get(`/admin/products/${id}`),
  
  createProduct: (data: FormData) => api.post('/admin/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  updateProduct: (id: string, data: FormData) => api.put(`/admin/products/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  
  // Orders
  getOrders: (params?: {
    page?: number
    limit?: number
    status?: string
    paymentStatus?: string
    sort?: string
    order?: 'asc' | 'desc'
  }) => api.get('/admin/orders', { params }),
  
  updateOrderStatus: (id: string, data: {
    status: string
    trackingNumber?: string
    notes?: string
  }) => api.put(`/admin/orders/${id}/status`, data),
  
  // Users
  getUsers: (params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    isActive?: boolean
  }) => api.get('/admin/users', { params }),
}

export default api
