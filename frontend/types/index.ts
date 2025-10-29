export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
  addresses?: Address[]
}

export interface Address {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: ProductImage[]
  category: string
  subcategory?: string
  brand?: string
  sku?: string
  stock: number
  isActive: boolean
  isFeatured: boolean
  tags: string[]
  specifications: Specification[]
  dimensions?: {
    length: number
    width: number
    height: number
    unit: string
  }
  weight?: {
    value: number
    unit: string
  }
  ratings: {
    average: number
    count: number
  }
  reviews: Review[]
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  url: string
  alt?: string
  isPrimary: boolean
}

export interface Specification {
  name: string
  value: string
}

export interface Review {
  _id: string
  user: {
    _id: string
    name: string
    avatar?: string
  }
  rating: number
  comment?: string
  createdAt: string
}

export interface Order {
  _id: string
  orderNumber: string
  user: string
  items: OrderItem[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: 'abhipay' | 'card' | 'cash_on_delivery'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentId?: string
  paymentDetails?: {
    transactionId?: string
    gateway: string
    amount: number
    currency: string
    status: string
  }
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  trackingNumber?: string
  notes?: string
  estimatedDelivery?: string
  deliveredAt?: string
  cancelledAt?: string
  cancellationReason?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  product: string
  quantity: number
  price: number
  name: string
  image: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ProductsResponse {
  products: Product[]
  pagination: PaginationInfo
}

export interface OrdersResponse {
  orders: Order[]
  pagination: PaginationInfo
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  totalUsers: number
  totalOrders: number
  pendingOrders: number
  totalSales: number
}
