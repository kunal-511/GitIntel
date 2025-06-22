"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Mail, 
  Calendar, 
  Settings, 
  Edit,
  Trophy,
  Activity,
  BookMarked,
  Clock,
  ArrowLeft
} from 'lucide-react'

interface UserStats {
  searchesCount: number
  comparisonsCount: number
  favoriteRepos: number
  joinDate: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    // Simulate loading user stats (you can replace with actual API call)
    setTimeout(() => {
      setUserStats({
        searchesCount: 42,
        comparisonsCount: 15,
        favoriteRepos: 8,
        joinDate: new Date().toISOString() // Using current date as placeholder
      })
      setLoading(false)
    }, 1000)
  }, [session, status, router])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPlanColor = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'pro':
        return 'bg-blue-600 text-blue-100'
      case 'enterprise':
        return 'bg-purple-600 text-purple-100'
      default:
        return 'bg-gray-600 text-gray-100'
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm" className="text-neutral-300 hover:text-neutral-100">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Image */}
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
              <Link href="/profile/edit">
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-neutral-100">
                  {session.user.name || 'User'}
                </h1>
                <Badge className={`w-fit ${getPlanColor(session.user.plan || 'FREE')}`}>
                  {session.user.plan || 'FREE'} Plan
                </Badge>
              </div>
              
              <div className="space-y-2 text-neutral-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{session.user.email}</span>
                </div>
                {userStats && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(userStats.joinDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button asChild variant="outline" className="border-neutral-700">
                <Link href="/profile/edit">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-200">
                    Repository Searches
                  </CardTitle>
                  <Activity className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    {userStats?.searchesCount || 0}
                  </div>
                  <p className="text-xs text-neutral-400">
                    Total searches performed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-200">
                    Comparisons Made
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    {userStats?.comparisonsCount || 0}
                  </div>
                  <p className="text-xs text-neutral-400">
                    Repository comparisons
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-200">
                    Favorite Repos
                  </CardTitle>
                  <BookMarked className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">
                    {userStats?.favoriteRepos || 0}
                  </div>
                  <p className="text-xs text-neutral-400">
                    Bookmarked repositories
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-neutral-200">
                    Account Age
                  </CardTitle>
                  <Clock className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    {userStats ? Math.floor((Date.now() - new Date(userStats.joinDate).getTime()) / (1000 * 60 * 60 * 24)) : 0}
                  </div>
                  <p className="text-xs text-neutral-400">
                    Days since joining
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-200">Recent Activity</CardTitle>
                <CardDescription className="text-neutral-400">
                  Your latest GitIntel actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-200">Searched for &quot;react&quot; repositories</p>
                      <p className="text-xs text-neutral-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-200">Compared Next.js vs React</p>
                      <p className="text-xs text-neutral-400">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-200">Bookmarked facebook/react repository</p>
                      <p className="text-xs text-neutral-400">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Information */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-200">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Email Status
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm text-neutral-200">Verified</span>
                  </div>
                </div>
                
                <Separator className="bg-neutral-700" />
                
                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    Two-Factor Authentication
                  </label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-neutral-200">Disabled</span>
                    <Button size="sm" variant="outline" className="text-xs border-neutral-700">
                      Enable
                    </Button>
                  </div>
                </div>

                <Separator className="bg-neutral-700" />

                <div>
                  <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                    API Access
                  </label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-neutral-200">
                      {session.user.plan === 'FREE' ? 'Limited' : 'Full Access'}
                    </span>
                    {session.user.plan === 'FREE' && (
                      <Button size="sm" variant="outline" className="text-xs border-neutral-700">
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-200">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild variant="outline" className="w-full justify-start border-neutral-700">
                  <Link href="/profile/edit">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-neutral-700">
                  <Link href="/profile/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start border-neutral-700">
                  <Link href="/profile/billing">
                    <Trophy className="w-4 h-4 mr-2" />
                    Billing & Plans
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 