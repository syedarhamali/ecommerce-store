'use client'

import { useState } from 'react'
import { Button, Input } from '@nextui-org/react'
import { Mail, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubscribed(true)
      toast.success('Successfully subscribed to our newsletter!')
      setEmail('')
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className="py-16 bg-primary-50 dark:bg-primary-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Thank You for Subscribing!
            </h2>
            <p className="text-lg text-foreground/70 mb-8">
              You'll receive our latest updates, exclusive offers, and product recommendations directly in your inbox.
            </p>
            <Button
              color="primary"
              variant="bordered"
              onPress={() => setIsSubscribed(false)}
            >
              Subscribe Another Email
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-primary-50 dark:bg-primary-900/20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Stay Updated
          </h2>
          
          <p className="text-lg text-foreground/70 mb-8">
            Subscribe to our newsletter and be the first to know about new products, 
            exclusive deals, and special offers.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              className="flex-1"
              size="lg"
              isRequired
            />
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="px-8"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>

          <p className="text-sm text-foreground/60 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
