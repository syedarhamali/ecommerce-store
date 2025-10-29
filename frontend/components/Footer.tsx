'use client'

import Link from 'next/link'
import { Button } from '@nextui-org/react'
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react'

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'New Arrivals', href: '/products?filter=new' },
    { name: 'Best Sellers', href: '/products?filter=bestsellers' },
    { name: 'Sale', href: '/products?filter=sale' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ],
  categories: [
    { name: 'Electronics', href: '/categories/electronics' },
    { name: 'Fashion', href: '/categories/fashion' },
    { name: 'Home & Garden', href: '/categories/home' },
    { name: 'Sports', href: '/categories/sports' },
    { name: 'Books', href: '/categories/books' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
    { name: 'Partnerships', href: '/partnerships' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Accessibility', href: '/accessibility' },
  ]
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'YouTube', href: '#', icon: Youtube },
]

const features = [
  { icon: Truck, text: 'Free shipping on orders over $100' },
  { icon: Shield, text: 'Secure payment processing' },
  { icon: RotateCcw, text: '30-day return policy' },
  { icon: CreditCard, text: 'Multiple payment options' },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-foreground-50">
      {/* Features */}
      <div className="border-b border-foreground-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
              EcommerceStore
            </Link>
            <p className="text-foreground-400 mb-6 max-w-sm">
              Your one-stop destination for quality products, exceptional service, 
              and unbeatable prices. Shop with confidence.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-foreground-400">
                <Mail className="w-4 h-4" />
                <span>support@ecommercestore.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground-400">
                <MapPin className="w-4 h-4" />
                <span>123 Commerce St, City, State 12345</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Button
                    key={social.name}
                    isIconOnly
                    variant="light"
                    size="sm"
                    as={Link}
                    href={social.href}
                    className="text-foreground-400 hover:text-primary"
                  >
                    <IconComponent className="w-5 h-5" />
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-foreground-50 mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div>
            <h3 className="font-semibold text-foreground-50 mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground-50 mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground-50 mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-foreground-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-foreground-400 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <p className="text-sm text-foreground-400">
              © {new Date().getFullYear()} EcommerceStore. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
