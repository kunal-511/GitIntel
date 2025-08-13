"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Camera,
  Save,
  X,
  Check,
  AlertCircle
} from 'lucide-react'

export default function EditProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    // Pre-fill form with user data
    setFormData(prev => ({
      ...prev,
      name: session.user.name || '',
      email: session.user.email || ''
    }))
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update profile')
      } else {
        setSuccess('Profile updated successfully!')
        // Update the session with new data
        await update({
          ...session,
          user: {
            ...session.user,
            name: formData.name,
            email: formData.email
          }
        })
      }
    } catch (error) {
      setError('An error occurred while updating profile')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to update password')
      } else {
        setSuccess('Password updated successfully!')
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
        setShowPasswordSection(false)
      }
    } catch (error) {
      setError('An error occurred while updating password')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-neutral-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-neutral-300 hover:text-neutral-100">
              <Link href="/profile">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-100">Edit Profile</h1>
              <p className="text-neutral-400">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-200">Profile Photo</CardTitle>
                <CardDescription className="text-neutral-400">
                  Update your profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || session.user.email}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-blue-600 object-cover"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-full bg-blue-600 flex items-center justify-center border-4 border-blue-400">
                      <span className="text-4xl font-bold text-white">
                        {session.user.name?.charAt(0)?.toUpperCase() || session.user.email?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-neutral-400">Click to change photo</p>
                  <p className="text-xs text-neutral-500 mt-1">
                    JPG, PNG or GIF. Max 5MB
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forms Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-200">Profile Information</CardTitle>
                <CardDescription className="text-neutral-400">
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-neutral-200">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-neutral-800 border-neutral-700 text-neutral-100"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-neutral-200">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-neutral-800 border-neutral-700 text-neutral-100"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm text-neutral-300">Email verified</span>
                    <Badge className="bg-blue-600 text-blue-100">
                      {session.user.plan || 'FREE'} Plan
                    </Badge>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {success && (
                    <Alert className="border-green-600 bg-green-900/20">
                      <Check className="h-4 w-4 text-green-400" />
                      <AlertDescription className="text-green-400">{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" disabled={loading} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Password Section */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-neutral-200">Password</CardTitle>
                    <CardDescription className="text-neutral-400">
                      Change your account password
                    </CardDescription>
                  </div>
                  {!showPasswordSection && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordSection(true)}
                      className="border-neutral-700"
                    >
                      Change Password
                    </Button>
                  )}
                </div>
              </CardHeader>
              
              {showPasswordSection && (
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-neutral-200">
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="bg-neutral-800 border-neutral-700 text-neutral-100"
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-neutral-200">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="bg-neutral-800 border-neutral-700 text-neutral-100"
                          placeholder="Enter new password"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-neutral-200">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="bg-neutral-800 border-neutral-700 text-neutral-100"
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="submit" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Updating...' : 'Update Password'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowPasswordSection(false)
                          setFormData(prev => ({
                            ...prev,
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          }))
                          setError('')
                          setSuccess('')
                        }}
                        className="border-neutral-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 