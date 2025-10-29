'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardBody,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Select,
  SelectItem,
  useDisclosure,
  Tabs,
  Tab,
} from '@nextui-org/react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Upload
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  stock: number
  isActive: boolean
  createdAt: string
}

interface Order {
  _id: string
  orderNumber: string
  customer: string
  total: number
  status: string
  createdAt: string
}

interface Stats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  recentOrders: Order[]
  lowStockProducts: Product[]
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/auth/signin')
      return
    }
    
    fetchData()
  }, [session, status, router])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API calls
      const mockStats: Stats = {
        totalProducts: 156,
        totalOrders: 89,
        totalRevenue: 45678.90,
        totalCustomers: 234,
        recentOrders: [
          {
            _id: '1',
            orderNumber: 'ORD-001',
            customer: 'John Doe',
            total: 299.99,
            status: 'completed',
            createdAt: '2024-01-15'
          },
          {
            _id: '2',
            orderNumber: 'ORD-002',
            customer: 'Jane Smith',
            total: 149.99,
            status: 'pending',
            createdAt: '2024-01-14'
          },
          {
            _id: '3',
            orderNumber: 'ORD-003',
            customer: 'Mike Johnson',
            total: 79.99,
            status: 'shipped',
            createdAt: '2024-01-13'
          }
        ],
        lowStockProducts: [
          {
            _id: '1',
            name: 'Wireless Headphones',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            category: 'electronics',
            stock: 5,
            isActive: true,
            createdAt: '2024-01-01'
          },
          {
            _id: '2',
            name: 'Coffee Maker',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            category: 'home',
            stock: 3,
            isActive: true,
            createdAt: '2024-01-02'
          }
        ]
      }

      const mockProducts: Product[] = [
        {
          _id: '1',
          name: 'Wireless Bluetooth Headphones',
          price: 99.99,
          originalPrice: 149.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          category: 'electronics',
          stock: 50,
          isActive: true,
          createdAt: '2024-01-01'
        },
        {
          _id: '2',
          name: 'Premium Coffee Maker',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          category: 'home',
          stock: 25,
          isActive: true,
          createdAt: '2024-01-02'
        },
        {
          _id: '3',
          name: 'Smart Fitness Watch',
          price: 299.99,
          originalPrice: 399.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          category: 'electronics',
          stock: 15,
          isActive: true,
          createdAt: '2024-01-03'
        },
        {
          _id: '4',
          name: 'Organic Cotton T-Shirt',
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          category: 'fashion',
          stock: 100,
          isActive: true,
          createdAt: '2024-01-04'
        }
      ]

      setTimeout(() => {
        setStats(mockStats)
        setProducts(mockProducts)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      // Mock API call
      setProducts(products.filter(p => p._id !== productId))
      toast.success('Product deleted successfully')
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleToggleProductStatus = async (productId: string) => {
    try {
      setProducts(products.map(p => 
        p._id === productId ? { ...p, isActive: !p.isActive } : p
      ))
      toast.success('Product status updated')
    } catch (error) {
      toast.error('Failed to update product status')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-foreground/60">Manage your ecommerce store</p>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="w-4 h-4" />}
            onPress={() => {
              setSelectedProduct(null)
              onOpen()
            }}
          >
            Add Product
          </Button>
        </div>

        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          className="w-full"
        >
          <Tab key="overview" title="Overview">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm">Total Products</p>
                      <p className="text-2xl font-bold text-foreground">{stats?.totalProducts}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-foreground">{stats?.totalOrders}</p>
                    </div>
                    <div className="p-3 bg-success/10 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">{formatPrice(stats?.totalRevenue || 0)}</p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <DollarSign className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground/60 text-sm">Total Customers</p>
                      <p className="text-2xl font-bold text-foreground">{stats?.totalCustomers}</p>
                    </div>
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="mb-8">
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
                <Table aria-label="Recent orders table">
                  <TableHeader>
                    <TableColumn>Order #</TableColumn>
                    <TableColumn>Customer</TableColumn>
                    <TableColumn>Total</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Date</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {stats?.recentOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{formatPrice(order.total)}</TableCell>
                        <TableCell>
                          <Chip
                            color={
                              order.status === 'completed' ? 'success' :
                              order.status === 'pending' ? 'warning' :
                              order.status === 'shipped' ? 'primary' : 'default'
                            }
                            size="sm"
                          >
                            {order.status}
                          </Chip>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>

            {/* Low Stock Products */}
            <Card>
              <CardBody className="p-6">
                <h3 className="text-xl font-semibold mb-4">Low Stock Products</h3>
                <div className="space-y-4">
                  {stats?.lowStockProducts.map((product) => (
                    <div key={product._id} className="flex items-center gap-4 p-4 border border-warning/20 rounded-lg bg-warning/5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-foreground/60">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-warning font-semibold">Stock: {product.stock}</p>
                        <p className="text-sm text-foreground/60">Low stock warning</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="products" title="Products">
            <Card>
              <CardBody className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">All Products</h3>
                  <Button
                    color="primary"
                    startContent={<Plus className="w-4 h-4" />}
                    onPress={() => {
                      setSelectedProduct(null)
                      onOpen()
                    }}
                  >
                    Add Product
                  </Button>
                </div>

                <Table aria-label="Products table">
                  <TableHeader>
                    <TableColumn>Product</TableColumn>
                    <TableColumn>Category</TableColumn>
                    <TableColumn>Price</TableColumn>
                    <TableColumn>Stock</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Actions</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-foreground/60">
                                {product.originalPrice && (
                                  <span className="line-through mr-2">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                                {formatPrice(product.price)}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip size="sm" variant="flat" color="primary">
                            {product.category}
                          </Chip>
                        </TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          <span className={product.stock < 10 ? 'text-warning font-semibold' : ''}>
                            {product.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={product.isActive ? 'success' : 'default'}
                            size="sm"
                          >
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              onPress={() => {
                                setSelectedProduct(product)
                                onOpen()
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              color="warning"
                              onPress={() => handleToggleProductStatus(product._id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              color="danger"
                              onPress={() => handleDeleteProduct(product._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Add/Edit Product Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Product Name"
                    placeholder="Enter product name"
                    defaultValue={selectedProduct?.name || ''}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Price"
                      type="number"
                      placeholder="0.00"
                      defaultValue={selectedProduct?.price?.toString() || ''}
                    />
                    <Input
                      label="Original Price"
                      type="number"
                      placeholder="0.00"
                      defaultValue={selectedProduct?.originalPrice?.toString() || ''}
                    />
                  </div>
                  
                  <Select
                    label="Category"
                    placeholder="Select category"
                    defaultSelectedKeys={selectedProduct?.category ? [selectedProduct.category] : []}
                  >
                    <SelectItem key="electronics" value="electronics">Electronics</SelectItem>
                    <SelectItem key="fashion" value="fashion">Fashion</SelectItem>
                    <SelectItem key="home" value="home">Home & Garden</SelectItem>
                    <SelectItem key="sports" value="sports">Sports</SelectItem>
                    <SelectItem key="books" value="books">Books</SelectItem>
                  </Select>
                  
                  <Input
                    label="Stock Quantity"
                    type="number"
                    placeholder="0"
                    defaultValue={selectedProduct?.stock?.toString() || ''}
                  />
                  
                  <Textarea
                    label="Description"
                    placeholder="Enter product description"
                    defaultValue={selectedProduct?.description || ''}
                  />
                  
                  <div className="border-2 border-dashed border-default-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-default-400" />
                    <p className="text-sm text-default-400">Click to upload product images</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  {selectedProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
