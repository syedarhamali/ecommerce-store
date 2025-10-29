'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Badge,
  Skeleton,
  Chip,
} from '@nextui-org/react'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import Image from 'next/image'

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
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore()

  useEffect(() => {
    // Simulate API call - replace with actual API call
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Mock data for now
        const mockProducts: Product[] = [
          {
            _id: '1',
            name: 'Wireless Bluetooth Headphones',
            price: 99.99,
            originalPrice: 149.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            rating: 4.5,
            reviewCount: 128,
            category: 'Electronics',
            isNew: true,
            isFeatured: true,
            stock: 50
          },
          {
            _id: '2',
            name: 'Premium Coffee Maker',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            rating: 4.8,
            reviewCount: 89,
            category: 'Home & Kitchen',
            isFeatured: true,
            stock: 25
          },
          {
            _id: '3',
            name: 'Smart Fitness Watch',
            price: 299.99,
            originalPrice: 399.99,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            rating: 4.7,
            reviewCount: 203,
            category: 'Electronics',
            isFeatured: true,
            stock: 15
          },
          {
            _id: '4',
            name: 'Organic Cotton T-Shirt',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            rating: 4.3,
            reviewCount: 67,
            category: 'Fashion',
            isNew: true,
            isFeatured: true,
            stock: 100
          }
        ]
        
        setTimeout(() => {
          setProducts(mockProducts)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching products:', error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
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
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that our customers love
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="group hover:shadow-lg transition-all duration-300">
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
                    <Badge content="New" color="success" size="sm" />
                  )}
                  {product.originalPrice && (
                    <Badge 
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
                    as={Link}
                    href={`/products/${product._id}`}
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
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            as={Link}
            href="/products"
            color="primary"
            variant="bordered"
            size="lg"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  )
}
