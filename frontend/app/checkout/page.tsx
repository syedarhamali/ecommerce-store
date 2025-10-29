'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react'
import { 
  CreditCard, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Lock,
  CheckCircle,
  ArrowLeft,
  Truck,
  Shield
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Address {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentMethod {
  type: 'abhipay' | 'card' | 'cod'
  name: string
  description: string
  icon: React.ReactNode
}

const paymentMethods: PaymentMethod[] = [
  {
    type: 'abhipay',
    name: 'Abhipay',
    description: 'Secure payment with Abhipay',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    type: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay with your card',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    type: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: <Truck className="w-5 h-5" />
  }
]

const countries = [
  { key: 'US', label: 'United States' },
  { key: 'CA', label: 'Canada' },
  { key: 'GB', label: 'United Kingdom' },
  { key: 'AU', label: 'Australia' },
  { key: 'DE', label: 'Germany' },
  { key: 'FR', label: 'France' },
  { key: 'IT', label: 'Italy' },
  { key: 'ES', label: 'Spain' },
]

const states = [
  { key: 'CA', label: 'California' },
  { key: 'NY', label: 'New York' },
  { key: 'TX', label: 'Texas' },
  { key: 'FL', label: 'Florida' },
  { key: 'IL', label: 'Illinois' },
  { key: 'PA', label: 'Pennsylvania' },
  { key: 'OH', label: 'Ohio' },
  { key: 'GA', label: 'Georgia' },
]

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [address, setAddress] = useState<Address>({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  const [selectedPayment, setSelectedPayment] = useState<string>('abhipay')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const subtotal = getTotalPrice()
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }))
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setIsProcessing(true)

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (selectedPayment === 'abhipay') {
        await processAbhipayPayment()
      } else if (selectedPayment === 'card') {
        await processCardPayment()
      } else {
        // COD - no payment processing needed
        await processOrder()
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  const processAbhipayPayment = async () => {
    try {
      // Simulate Abhipay payment processing
      const abhipayConfig = {
        merchantId: process.env.NEXT_PUBLIC_ABHIPAY_MERCHANT_ID,
        publicKey: process.env.NEXT_PUBLIC_ABHIPAY_PUBLIC_KEY,
        amount: total,
        currency: 'USD',
        orderId: `ORD-${Date.now()}`,
        customerEmail: address.email,
        customerPhone: address.phone,
        returnUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`
      }

      // In a real implementation, you would integrate with Abhipay API here
      console.log('Processing Abhipay payment:', abhipayConfig)
      
      // Simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await processOrder()
    } catch (error) {
      throw new Error('Abhipay payment failed')
    }
  }

  const processCardPayment = async () => {
    try {
      // Simulate card payment processing
      console.log('Processing card payment')
      await new Promise(resolve => setTimeout(resolve, 1000))
      await processOrder()
    } catch (error) {
      throw new Error('Card payment failed')
    }
  }

  const processOrder = async () => {
    try {
      // Create order
      const orderData = {
        items: items,
        address: address,
        paymentMethod: selectedPayment,
        subtotal,
        shipping,
        tax,
        total,
        customerId: session?.user?.id,
        customerEmail: address.email
      }

      console.log('Creating order:', orderData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Clear cart
      clearCart()
      
      // Show success
      setOrderComplete(true)
      onOpen()
      
    } catch (error) {
      throw new Error('Order creation failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    
    for (const field of requiredFields) {
      if (!address[field as keyof Address]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }

    if (!address.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }

    return true
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardBody className="p-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Order Placed Successfully!</h1>
            <p className="text-foreground/60 mb-6">
              Thank you for your order. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-2">
              <Button
                as={Link}
                href="/orders"
                color="primary"
                className="w-full"
              >
                View My Orders
              </Button>
              <Button
                as={Link}
                href="/products"
                variant="bordered"
                className="w-full"
              >
                Continue Shopping
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            as={Link}
            href="/cart"
            variant="light"
            isIconOnly
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-foreground/60">Complete your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    label="First Name"
                    placeholder="Enter first name"
                    value={address.firstName}
                    onChange={(e) => handleAddressChange('firstName', e.target.value)}
                    startContent={<User className="w-4 h-4 text-default-400" />}
                    isRequired
                  />
                  <Input
                    label="Last Name"
                    placeholder="Enter last name"
                    value={address.lastName}
                    onChange={(e) => handleAddressChange('lastName', e.target.value)}
                    startContent={<User className="w-4 h-4 text-default-400" />}
                    isRequired
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter email"
                    value={address.email}
                    onChange={(e) => handleAddressChange('email', e.target.value)}
                    startContent={<Mail className="w-4 h-4 text-default-400" />}
                    isRequired
                  />
                  <Input
                    label="Phone"
                    placeholder="Enter phone number"
                    value={address.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    startContent={<Phone className="w-4 h-4 text-default-400" />}
                    isRequired
                  />
                </div>
                
                <Textarea
                  label="Address"
                  placeholder="Enter street address"
                  value={address.address}
                  onChange={(e) => handleAddressChange('address', e.target.value)}
                  className="mb-4"
                  isRequired
                />
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <Input
                    label="City"
                    placeholder="Enter city"
                    value={address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    isRequired
                  />
                  <Select
                    label="State"
                    placeholder="Select state"
                    selectedKeys={address.state ? [address.state] : []}
                    onSelectionChange={(keys) => handleAddressChange('state', Array.from(keys)[0] as string)}
                    isRequired
                  >
                    {states.map((state) => (
                      <SelectItem key={state.key} value={state.key}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="ZIP Code"
                    placeholder="Enter ZIP"
                    value={address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    isRequired
                  />
                </div>
                
                <Select
                  label="Country"
                  placeholder="Select country"
                  selectedKeys={[address.country]}
                  onSelectionChange={(keys) => handleAddressChange('country', Array.from(keys)[0] as string)}
                  isRequired
                >
                  {countries.map((country) => (
                    <SelectItem key={country.key} value={country.key}>
                      {country.label}
                    </SelectItem>
                  ))}
                </Select>
              </CardBody>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardBody className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.type}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPayment === method.type
                          ? 'border-primary bg-primary/5'
                          : 'border-default-200 hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedPayment(method.type)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          selectedPayment === method.type
                            ? 'bg-primary/10 text-primary'
                            : 'bg-default-100 text-default-600'
                        }`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{method.name}</p>
                          <p className="text-sm text-foreground/60">{method.description}</p>
                        </div>
                        {selectedPayment === method.type && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-foreground/60">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                
                <Divider className="my-4" />
                
                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                {shipping === 0 && (
                  <div className="mt-4 p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-2 text-success">
                      <Truck className="w-4 h-4" />
                      <span className="text-sm font-medium">Free shipping applied!</span>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Security Notice */}
            <Card className="bg-primary/5 border-primary/20">
              <CardBody className="p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Secure Checkout</span>
                </div>
                <p className="text-sm text-foreground/70 mt-1">
                  Your payment information is encrypted and secure. We never store your payment details.
                </p>
              </CardBody>
            </Card>

            {/* Place Order Button */}
            <Button
              color="primary"
              size="lg"
              className="w-full"
              onPress={handlePlaceOrder}
              isLoading={isProcessing}
              isDisabled={items.length === 0}
            >
              {isProcessing ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
            </Button>
          </div>
        </div>
      </div>

      {/* Order Success Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                Order Placed Successfully!
              </ModalHeader>
              <ModalBody>
                <p className="text-center text-foreground/70">
                  Thank you for your order. You will receive a confirmation email shortly.
                </p>
              </ModalBody>
              <ModalFooter className="justify-center">
                <Button
                  as={Link}
                  href="/orders"
                  color="primary"
                  className="w-full"
                  onPress={onClose}
                >
                  View My Orders
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
