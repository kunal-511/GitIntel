"use client"

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Github, } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'

// Loading component for Suspense fallback
function SignInLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <Card className="w-full max-w-md bg-neutral-900 border-blue-900/40">
        <CardHeader className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <CardTitle className="text-2xl font-bold text-blue-200">Loading...</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}

// Main sign-in component that uses useSearchParams
function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const error = searchParams.get('error')
    const verified = searchParams.get('verified')
    
    if (verified) {
      setSuccess('Email verified successfully! You can now sign in.')
    } else if (error) {
      switch (error) {
        case 'CredentialsSignin':
          setError('Invalid email or password')
          break
        case 'missing-token':
          setError('Verification token is missing')
          break
        case 'invalid-token':
          setError('Invalid verification token')
          break
        case 'expired-token':
          setError('Verification token has expired')
          break
        case 'token-used':
          setError('Verification token has already been used')
          break
        case 'user-not-found':
          setError('User not found')
          break
        case 'verification-failed':
          setError('Email verification failed')
          break
        case 'OAuthSignin':
          setError('OAuth provider configuration error. Please check your setup.')
          break
        case 'OAuthCallback':
          setError('OAuth callback error. Please try again.')
          break
        default:
          setError('An error occurred during sign in')
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Check if user is authenticated
        const session = await getSession()
        if (session) {
          router.push('/')
          router.refresh()
        }
      }
    } catch (error) {
      setError('An error occurred during sign in')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await signIn(provider, { callbackUrl: '/' })
    } catch (error) {
      setError(`Failed to sign in with ${provider}`)
      setLoading(false)
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <Card className="w-full max-w-md bg-neutral-900 border-blue-900/40">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-200">Welcome Back</CardTitle>
          <CardDescription className="text-neutral-400">
            Sign in to your GitIntel account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-neutral-700 hover:bg-neutral-800"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-neutral-700 hover:bg-neutral-800"
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading}
            >
              <Github className="w-5 h-5 mr-2" />
              Continue with GitHub
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-900 px-2 text-neutral-400">Or continue with</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-200">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-neutral-800 border-neutral-700 text-neutral-100"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-200">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-neutral-800 border-neutral-700 text-neutral-100 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="border-green-600 bg-green-900/20">
                <AlertDescription className="text-green-400">{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-neutral-400 text-sm">
              Don&apos;t have an account?
              <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default function SignInPage() {
  return (
    <Suspense fallback={<SignInLoadingFallback />}>
      <SignInForm />
    </Suspense>
  )
} 