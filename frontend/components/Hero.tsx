'use client'

import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { ArrowRight, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Discover Amazing
                <span className="text-primary"> Products</span>
              </h1>
              <p className="text-xl text-foreground/80 max-w-lg">
                Shop the latest trends with our curated collection of high-quality products. 
                Fast shipping, secure payments, and exceptional customer service.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                as={Link}
                href="/products"
                color="primary"
                size="lg"
                className="font-semibold"
                endContent={<ArrowRight className="w-5 h-5" />}
              >
                Shop Now
              </Button>
              <Button
                as={Link}
                href="/categories"
                variant="bordered"
                size="lg"
                className="font-semibold"
              >
                Browse Categories
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-8">
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
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Top Rated</p>
                  <p className="text-xs text-foreground/60">4.9/5 customer rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Ecommerce Store Hero"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">Live Orders</span>
              </div>
              <p className="text-2xl font-bold text-primary">1,234</p>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold">Rating</span>
              </div>
              <p className="text-2xl font-bold">4.9</p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>
    </section>
  )
}
