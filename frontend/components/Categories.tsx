'use client'

import Link from 'next/link'
import { Card, CardBody } from '@nextui-org/react'
import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Home, 
  Gamepad2, 
  BookOpen,
  Car,
  Music,
  Camera,
  Heart
} from 'lucide-react'
import Image from 'next/image'

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 150,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'computers',
    name: 'Computers',
    icon: Laptop,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 89,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: Shirt,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 234,
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'home',
    name: 'Home & Garden',
    icon: Home,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 167,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad2,
    image: 'https://images.unsplash.com/photo-1606144042614-2412a00c0d0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 78,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'books',
    name: 'Books',
    icon: BookOpen,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 312,
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 45,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 123,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 67,
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'health',
    name: 'Health & Beauty',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    count: 189,
    color: 'from-rose-500 to-rose-600'
  }
]

export function Categories() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Explore our wide range of categories and find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card
                key={category.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                isPressable
                as={Link}
                href={`/categories/${category.id}`}
              >
                <CardBody className="p-4 text-center">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  </div>
                  
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-foreground/60">
                    {category.count} items
                  </p>
                  
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <IconComponent className="w-5 h-5 mx-auto text-primary" />
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-foreground/60 mb-4">
            Can't find what you're looking for?
          </p>
          <Link
            href="/products"
            className="inline-flex items-center text-primary hover:text-primary-600 font-semibold transition-colors"
          >
            Browse All Products
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
