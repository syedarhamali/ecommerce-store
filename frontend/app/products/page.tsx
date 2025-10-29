'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Skeleton,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react'
import { Search, Filter, Grid, List, Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  isNew?: boolean
  isFeatured?: boolean
  stock: number
  description: string
}

const categories = [
  { key: 'all', label: 'All Categories' },
  { key: 'electronics', label: 'Electronics' },
  { key: 'fashion', label: 'Fashion' },
  { key: 'home', label: 'Home & Garden' },
  { key: 'sports', label: 'Sports' },
  { key: 'books', label: 'Books' },
]

const sortOptions = [
  { key: 'newest', label: 'Newest First' },
  { key: 'oldest', label: 'Oldest First' },
  { key: 'price-low', label: 'Price: Low to High' },
  { key: 'price-high', label: 'Price: High to Low' },
  { key: 'rating', label: 'Highest Rated' },
  { key: 'name', label: 'Name A-Z' },
]

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore()

  const itemsPerPage = 12

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, selectedCategory, sortBy, currentPage])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockProducts: Product[] = [
        {
          _id: '1',
          name: 'Wireless Bluetooth Headphones',
          price: 99.99,
          originalPrice: 149.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          rating: 4.5,
          reviewCount: 128,
          category: 'electronics',
          isNew: true,
          isFeatured: true,
          stock: 50,
          description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.'
        },
        {
          _id: '2',
          name: 'Premium Coffee Maker',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          rating: 4.8,
          reviewCount: 89,
          category: 'home',
          isFeatured: true,
          stock: 25,
          description: 'Professional-grade coffee maker with programmable features and thermal carafe.'
        },
        {
          _id: '3',
          name: 'Smart Fitness Watch',
          price: 299.99,
          originalPrice: 399.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          rating: 4.7,
          reviewCount: 203,
          category: 'electronics',
          isFeatured: true,
          stock: 15,
          description: 'Advanced fitness tracking with heart rate monitoring, GPS, and water resistance.'
        },
        {
          _id: '4',
          name: 'Organic Cotton T-Shirt',
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          rating: 4.3,
          reviewCount: 67,
          category: 'fashion',
          isNew: true,
          isFeatured: true,
          stock: 100,
          description: 'Comfortable and sustainable organic cotton t-shirt in various colors and sizes.'
        },
        {
          _id: '5',
          name: 'Wireless Gaming Mouse',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          rating: 4.6,
          reviewCount: 156,
          category: 'electronics',
          stock: 30,
          description: 'High-precision gaming mouse with customizable RGB lighting and programmable buttons.'
        },
        {
          _id: '6',
          name: 'Yoga Mat Premium',
          price: 49.99,
          originalPrice: 69.99,
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          rating: 4.4,
          reviewCount: 92,
          category: 'sports',
          stock: 40,
          description: 'Non-slip yoga mat with excellent cushioning and eco-friendly materials.'
        }
      ]

      // Filter products
      let filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        return matchesSearch && matchesCategory
      })

      // Sort products
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return b.isNew ? 1 : -1
          case 'oldest':
            return a.isNew ? 1 : -1
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'rating':
            return b.rating - a.rating
          case 'name':
            return a.name.localeCompare(b.name)
          default:
            return 0
        }
      })

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex)
      
      setProducts(paginatedProducts)
      setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage))
      
      setTimeout(() => setLoading(false), 500)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        originalPrice: product.originalPrice,
      })
    }
  }

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product)
    onOpen()
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <Link href={`/products/${product._id}`}>
          <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Chip content="New" color="success" size="sm" />
          )}
          {product.originalPrice && (
            <Chip 
              content={`-${calculateDiscount(product.originalPrice, product.price)}%`} 
              color="danger" 
              size="sm" 
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-white/90 backdrop-blur-sm"
            onPress={() => handleWishlistToggle(product)}
          >
            <Heart 
              className={`w-4 h-4 ${
                isInWishlist(product._id) 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600'
              }`} 
            />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-white/90 backdrop-blur-sm"
            onPress={() => handleQuickView(product)}
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </div>

      <CardBody className="p-4">
        <div className="space-y-2">
          <Chip size="sm" variant="flat" color="primary">
            {product.category}
          </Chip>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/products/${product._id}`}>
              {product.name}
            </Link>
          </h3>
          
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-foreground/60">
              ({product.reviewCount})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-foreground/60 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-foreground/60">
            <span>Stock: {product.stock}</span>
            {product.stock < 10 && (
              <Chip size="sm" color="warning" variant="flat">
                Low Stock
              </Chip>
            )}
          </div>
        </div>
      </CardBody>

      <CardFooter className="p-4 pt-0">
        <Button
          color="primary"
          className="w-full"
          onPress={() => handleAddToCart(product)}
          isDisabled={product.stock === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-foreground/60">
            Discover our amazing collection of products
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className="w-4 h-4 text-default-400" />}
                className="max-w-md"
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                placeholder="Category"
                selectedKeys={[selectedCategory]}
                onSelectionChange={(keys) => setSelectedCategory(Array.from(keys)[0] as string)}
                className="w-40"
              >
                {categories.map((category) => (
                  <SelectItem key={category.key} value={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>
              
              <Select
                placeholder="Sort by"
                selectedKeys={[sortBy]}
                onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
                className="w-40"
              >
                {sortOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
              
              <div className="flex border border-default-200 rounded-lg">
                <Button
                  isIconOnly
                  variant={viewMode === 'grid' ? 'solid' : 'light'}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  onPress={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  isIconOnly
                  variant={viewMode === 'list' ? 'solid' : 'light'}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  onPress={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="w-full">
                <Skeleton className="w-full h-48 rounded-t-lg" />
                <CardBody className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-foreground/60 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              color="primary"
              variant="bordered"
              onPress={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setSortBy('newest')
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  total={totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                  showControls
                  showShadow
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Quick View Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              {selectedProduct && (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {selectedProduct.name}
                  </ModalHeader>
                  <ModalBody>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative h-64 md:h-80">
                        <Image
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Chip size="sm" variant="flat" color="primary">
                            {selectedProduct.category}
                          </Chip>
                          {selectedProduct.isNew && (
                            <Chip content="New" color="success" size="sm" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(selectedProduct.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-foreground/60 ml-2">
                            ({selectedProduct.reviewCount} reviews)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {formatPrice(selectedProduct.price)}
                          </span>
                          {selectedProduct.originalPrice && (
                            <span className="text-lg text-foreground/60 line-through">
                              {formatPrice(selectedProduct.originalPrice)}
                            </span>
                          )}
                        </div>

                        <p className="text-foreground/70">
                          {selectedProduct.description}
                        </p>

                        <div className="flex gap-2">
                          <Button
                            color="primary"
                            className="flex-1"
                            onPress={() => {
                              handleAddToCart(selectedProduct)
                              onClose()
                            }}
                            isDisabled={selectedProduct.stock === 0}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            variant="bordered"
                            isIconOnly
                            onPress={() => handleWishlistToggle(selectedProduct)}
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                isInWishlist(selectedProduct._id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'text-gray-600'
                              }`} 
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
