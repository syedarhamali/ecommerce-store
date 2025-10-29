'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Avatar,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react'
import { useTheme } from 'next-themes'
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Sun, 
  Moon, 
  Menu,
  X,
  LogOut,
  Settings,
  Package,
  CreditCard
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice } from '@/lib/utils'

export function Navbar() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { getTotalItems, getTotalPrice } = useCartStore()
  const { getTotalItems: getWishlistItems } = useWishlistStore()
  
  const cartItems = getTotalItems()
  const cartTotal = getTotalPrice()
  const wishlistItems = getWishlistItems()

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <NextUINavbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="shadow-sm"
        maxWidth="xl"
      >
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <Link href="/" className="font-bold text-xl text-primary">
              EcommerceStore
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <Link
                href={item.href}
                className="text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          {/* Search */}
          <NavbarItem className="hidden lg:flex">
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startContent={<Search className="w-4 h-4 text-default-400" />}
                className="w-64"
                size="sm"
              />
            </form>
          </NavbarItem>

          {/* Theme Toggle */}
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </NavbarItem>

          {/* Wishlist */}
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              as={Link}
              href="/wishlist"
            >
              <Badge content={wishlistItems} color="danger" size="sm">
                <Heart className="w-5 h-5" />
              </Badge>
            </Button>
          </NavbarItem>

          {/* Cart */}
          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              onPress={onOpen}
            >
              <Badge content={cartItems} color="primary" size="sm">
                <ShoppingCart className="w-5 h-5" />
              </Badge>
            </Button>
          </NavbarItem>

          {/* User Menu */}
          <NavbarItem>
            {session ? (
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={session.user?.name || 'User'}
                    size="sm"
                    src={session.user?.image || ''}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Signed in as</p>
                    <p className="font-semibold">{session.user?.email}</p>
                  </DropdownItem>
                  <DropdownItem key="dashboard" as={Link} href="/dashboard">
                    <User className="w-4 h-4" />
                    Dashboard
                  </DropdownItem>
                  <DropdownItem key="orders" as={Link} href="/orders">
                    <Package className="w-4 h-4" />
                    My Orders
                  </DropdownItem>
                  <DropdownItem key="settings" as={Link} href="/settings">
                    <Settings className="w-4 h-4" />
                    Settings
                  </DropdownItem>
                  {session.user?.role === 'admin' && (
                    <DropdownItem key="admin" as={Link} href="/admin">
                      <Settings className="w-4 h-4" />
                      Admin Panel
                    </DropdownItem>
                  )}
                  <DropdownItem key="logout" color="danger" onPress={() => signOut()}>
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ) : (
              <div className="flex gap-2">
                <Button
                  as={Link}
                  href="/auth/login"
                  variant="light"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  href="/auth/register"
                  color="primary"
                  size="sm"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <Link
                className="w-full"
                href={item.href}
                size="lg"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </NextUINavbar>

      {/* Cart Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Shopping Cart ({cartItems} items)
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {cartItems === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-16 h-16 mx-auto text-default-300 mb-4" />
                      <p className="text-default-500">Your cart is empty</p>
                      <Button
                        as={Link}
                        href="/products"
                        color="primary"
                        className="mt-4"
                        onPress={onClose}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {/* Cart items would go here */}
                        <p className="text-center text-default-500">Cart items will be displayed here</p>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center text-lg font-semibold">
                          <span>Total:</span>
                          <span>{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            as={Link}
                            href="/cart"
                            variant="bordered"
                            className="flex-1"
                            onPress={onClose}
                          >
                            View Cart
                          </Button>
                          <Button
                            as={Link}
                            href="/checkout"
                            color="primary"
                            className="flex-1"
                            onPress={onClose}
                          >
                            Checkout
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
