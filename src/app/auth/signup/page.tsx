"use client"

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Github, Check } from 'lucide-react'
import { FcGoogle } from 'react-icons/fc'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required')
      return false
    }
    
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!validateForm()) return
    
    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'An error occurred during registration')
      } else {
        setSuccess(data.message)
        setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      }
    } catch (error) {
      setError('An error occurred during registration')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      await signIn(provider, { callbackUrl: '/' })
      console.error(error)
    } catch (error) {
      setError(`Failed to sign up with ${provider}`)
      setLoading(false)
      console.error(error)
    }
  }

  const passwordRequirements = [
    { label: 'At least 6 characters', met: formData.password.length >= 6 },
    { label: 'Passwords match', met: formData.password === formData.confirmPassword && formData.confirmPassword !== '' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-8">
      <Card className="w-full max-w-md bg-neutral-900 border-blue-900/40">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-200">Create Account</CardTitle>
          <CardDescription className="text-neutral-400">
            Sign up for GitIntel to access advanced features
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-neutral-700 hover:bg-neutral-800"
              onClick={() => handleOAuthSignUp('google')}
              disabled={loading}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>
            
            <Button
              variant="outline"
              className="w-full border-neutral-700 hover:bg-neutral-800"
              onClick={() => handleOAuthSignUp('github')}
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
              <span className="bg-neutral-900 px-2 text-neutral-400">Or continue with email</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neutral-200">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-neutral-800 border-neutral-700 text-neutral-100"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="bg-neutral-800 border-neutral-700 text-neutral-100 pr-10"
                  placeholder="Create a password"
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-neutral-200">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="bg-neutral-800 border-neutral-700 text-neutral-100 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="space-y-2">
                <Label className="text-neutral-300 text-xs">Password Requirements:</Label>
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <Check 
                        className={`w-3 h-3 ${req.met ? 'text-green-400' : 'text-neutral-500'}`} 
                      />
                      <span className={req.met ? 'text-green-400' : 'text-neutral-400'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center">
            <div className="text-sm text-neutral-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 