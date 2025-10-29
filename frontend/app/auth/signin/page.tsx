'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Divider,
  Checkbox,
} from '@nextui-org/react'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Invalid credentials. Please try again.')
      } else {
        toast.success('Successfully signed in!')
        const session = await getSession()
        if (session?.user?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      toast.error('Failed to sign in with Google')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
          <p className="mt-2 text-foreground/60">
            Sign in to your account to continue shopping
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-0">
            <h3 className="text-xl font-semibold text-center w-full">Sign In</h3>
          </CardHeader>
          <CardBody className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                label="Email address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                startContent={<Mail className="w-4 h-4 text-default-400" />}
                isRequired
                variant="bordered"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                startContent={<Lock className="w-4 h-4 text-default-400" />}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? (
                      <EyeOff className="w-4 h-4 text-default-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-default-400" />
                    )}
                  </button>
                }
                type={isVisible ? 'text' : 'password'}
                isRequired
                variant="bordered"
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  isSelected={rememberMe}
                  onValueChange={setRememberMe}
                  size="sm"
                >
                  Remember me
                </Checkbox>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:text-primary-600"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <Divider />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background px-2 text-sm text-foreground/60">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="bordered"
              className="w-full"
              size="lg"
              onPress={handleGoogleSignIn}
              isLoading={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center">
              <p className="text-sm text-foreground/60">
                Don't have an account?{' '}
                <Link
                  href="/auth/signup"
                  className="text-primary hover:text-primary-600 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
