'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardBody,
  Button,
  Chip,
  Tabs,
  Tab,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw, 
  Share2,
  Minus,
  Plus,
  ArrowLeft,
  CheckCircle
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Product {
  _id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  rating: number
  reviewCount: number
  category: string
  isNew?: boolean
  isFeatured?: boolean
  stock: number
  description: string
  features: string[]
  specifications: { [key: string]: string }
  reviews: {
    id: string
    user: string
    rating: number
    comment: string
    date: string
  }[]
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const colors = [
  { name: 'Black', value: 'black', class: 'bg-black' },
  { name: 'White', value: 'white', class: 'bg-white border' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
]

export default function ProductDetailPage() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [activeTab, setActiveTab] = useState('description')
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      const mockProduct: Product = {
        _id: params.id as string,
        name: 'Wireless Bluetooth Headphones',
        price: 99.99,
        originalPrice: 149.99,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        ],
        rating: 4.5,
        reviewCount: 128,
        category: 'electronics',
        isNew: true,
        isFeatured: true,
        stock: 50,
        description: 'Experience premium sound quality with these wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for music lovers, gamers, and professionals who demand the best audio experience.',
        features: [
          'Active Noise Cancellation',
          '30-hour battery life',
          'Quick charge (3 hours in 10 minutes)',
          'Bluetooth 5.0 connectivity',
          'Comfortable over-ear design',
          'Built-in microphone',
          'Foldable for easy storage',
          'Premium build quality'
        ],
        specifications: {
          'Driver Size': '40mm',
          'Frequency Response': '20Hz - 20kHz',
          'Impedance': '32 ohms',
          'Battery Life': '30 hours',
          'Charging Time': '2 hours',
          'Weight': '250g',
          'Connectivity': 'Bluetooth 5.0',
          'Range': '10 meters'
        },
        reviews: [
          {
            id: '1',
            user: 'John Doe',
            rating: 5,
            comment: 'Amazing sound quality and very comfortable to wear for long periods. The noise cancellation works perfectly!',
            date: '2024-01-15'
          },
          {
            id: '2',
            user: 'Sarah Wilson',
            rating: 4,
            comment: 'Great headphones overall. Battery life is excellent and the sound is crisp and clear.',
            date: '2024-01-10'
          },
          {
            id: '3',
            user: 'Mike Johnson',
            rating: 5,
            comment: 'Perfect for my daily commute. The noise cancellation blocks out all the background noise.',
            date: '2024-01-08'
          }
        ]
      }
      
      setTimeout(() => {
        setProduct(mockProduct)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error('Error fetching product:', error)
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return
    
    if (product.stock === 0) {
      toast.error('This product is out of stock')
      return
    }

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
    })
    
    toast.success('Product added to cart!')
  }

  const handleWishlistToggle = () => {
    if (!product) return
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist({
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        originalPrice: product.originalPrice,
      })
      toast.success('Added to wishlist')
    }
  }

  const handleBuyNow = () => {
    handleAddToCart()
    // Redirect to checkout
    window.location.href = '/checkout'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/2" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <p className="text-foreground/60 mb-6">The product you're looking for doesn't exist.</p>
          <Button as={Link} href="/products" color="primary">
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-foreground/60 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Chip size="sm" variant="flat" color="primary">
                  {product.category}
                </Chip>
                {product.isNew && (
                  <Chip content="New" color="success" size="sm" />
                )}
                {product.originalPrice && (
                  <Chip 
                    content={`-${calculateDiscount(product.originalPrice, product.price)}% OFF`} 
                    color="danger" 
                    size="sm" 
                  />
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-foreground/60">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-foreground/60 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-foreground/70 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Size</h3>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'solid' : 'bordered'}
                    color={selectedSize === size ? 'primary' : 'default'}
                    size="sm"
                    onPress={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Color</h3>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      color.class
                    } ${
                      selectedColor === color.value 
                        ? 'border-primary scale-110' 
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-default-200 rounded-lg">
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    isDisabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    isDisabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-foreground/60">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  color="primary"
                  size="lg"
                  className="flex-1"
                  onPress={handleAddToCart}
                  isDisabled={product.stock === 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  onPress={handleWishlistToggle}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      isInWishlist(product._id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-600'
                    }`} 
                  />
                </Button>
                <Button
                  variant="bordered"
                  size="lg"
                  onPress={onOpen}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              
              <Button
                color="primary"
                variant="bordered"
                size="lg"
                className="w-full"
                onPress={handleBuyNow}
                isDisabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-foreground/60">On orders over $100</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs text-foreground/60">100% secure checkout</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RotateCcw className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-foreground/60">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            className="w-full"
          >
            <Tab key="description" title="Description">
              <Card>
                <CardBody className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Product Description</h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {product.description}
                    </p>
                    
                    <h4 className="text-lg font-semibold mt-6">Key Features</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            
            <Tab key="specifications" title="Specifications">
              <Card>
                <CardBody className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-default-100">
                        <span className="font-medium text-foreground/70">{key}</span>
                        <span className="text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Tab>
            
            <Tab key="reviews" title={`Reviews (${product.reviewCount})`}>
              <Card>
                <CardBody className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">{product.rating}</div>
                        <div className="flex items-center justify-center gap-1">
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
                        <p className="text-sm text-foreground/60 mt-1">
                          Based on {product.reviewCount} reviews
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b border-default-100 pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{review.user}</span>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-foreground/60">
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-foreground/70">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>

      {/* Share Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Share Product</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-foreground/70">
                    Share this product with your friends and family
                  </p>
                  <div className="flex gap-2">
                    <Button
                      color="primary"
                      variant="bordered"
                      className="flex-1"
                      onPress={() => {
                        navigator.clipboard.writeText(window.location.href)
                        toast.success('Link copied to clipboard!')
                        onClose()
                      }}
                    >
                      Copy Link
                    </Button>
                    <Button
                      color="primary"
                      variant="bordered"
                      className="flex-1"
                      onPress={() => {
                        // Implement social sharing
                        toast.success('Shared on social media!')
                        onClose()
                      }}
                    >
                      Share on Social
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
