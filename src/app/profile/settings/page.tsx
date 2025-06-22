"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Shield,
  Trash2,
  AlertTriangle,
  Settings,
  Bell,
  Key,
  Database,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: false,
    securityAlerts: true,
    dataCollection: true
  })
  
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    // Simulate loading user settings
    setTimeout(() => {
      setApiKey('gitintel_' + Math.random().toString(36).substring(7) + '_' + Date.now().toString(36))
    }, 500)
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const saveSettings = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess('Settings saved successfully!')
    } catch (error) {
      setError('Failed to save settings')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewApiKey = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setApiKey('gitintel_' + Math.random().toString(36).substring(7) + '_' + Date.now().toString(36))
      setSuccess('New API key generated successfully!')
    } catch (error) {
      setError('Failed to generate new API key')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Account deletion requested. You will receive an email with further instructions.')
    } catch (error) {
      setError('Failed to process account deletion request')
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
              <h1 className="text-2xl font-bold text-neutral-100">Account Settings</h1>
              <p className="text-neutral-400">Manage your account preferences and security</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Notifications */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-200">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Configure how you receive notifications from GitIntel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-neutral-200">Email Notifications</Label>
                <p className="text-sm text-neutral-400">Receive email updates about your account activity</p>
              </div>
              <Button
                variant={settings.emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                className="border-neutral-700"
              >
                {settings.emailNotifications ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <Separator className="bg-neutral-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-neutral-200">Weekly Digest</Label>
                <p className="text-sm text-neutral-400">Get a weekly summary of repository insights</p>
              </div>
              <Button
                variant={settings.weeklyDigest ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('weeklyDigest', !settings.weeklyDigest)}
                className="border-neutral-700"
              >
                {settings.weeklyDigest ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <Separator className="bg-neutral-700" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-neutral-200">Security Alerts</Label>
                <p className="text-sm text-neutral-400">Important security notifications about your account</p>
              </div>
              <Button
                variant={settings.securityAlerts ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('securityAlerts', !settings.securityAlerts)}
                className="border-neutral-700"
              >
                {settings.securityAlerts ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Access */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-200">
              <Key className="w-5 h-5" />
              API Access
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Manage your API keys and access tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-neutral-200">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    readOnly
                    className="bg-neutral-800 border-neutral-700 text-neutral-100 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-7 w-7 p-0"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  onClick={generateNewApiKey}
                  disabled={loading}
                  className="border-neutral-700"
                >
                  Regenerate
                </Button>
              </div>
              <p className="text-xs text-neutral-400">
                Keep your API key secure. It provides access to your GitIntel account.
              </p>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-neutral-800/50 rounded-lg">
              <Badge className="bg-blue-600 text-blue-100">
                {session.user.plan || 'FREE'} Plan
              </Badge>
              <span className="text-sm text-neutral-300">
                {session.user.plan === 'FREE' ? '100 requests/month' : 'Unlimited requests'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-200">
              <Database className="w-5 h-5" />
              Privacy & Data
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Control how your data is collected and used
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-neutral-200">Analytics & Usage Data</Label>
                <p className="text-sm text-neutral-400">Help improve GitIntel by sharing anonymous usage data</p>
              </div>
              <Button
                variant={settings.dataCollection ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('dataCollection', !settings.dataCollection)}
                className="border-neutral-700"
              >
                {settings.dataCollection ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <Separator className="bg-neutral-700" />
            
            <div className="space-y-3">
              <Label className="text-neutral-200">Data Export</Label>
              <p className="text-sm text-neutral-400">
                Download a copy of all your data stored in GitIntel
              </p>
              <Button variant="outline" className="border-neutral-700">
                Request Data Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-200">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Advanced security settings for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-neutral-200">Two-Factor Authentication</Label>
              <p className="text-sm text-neutral-400">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" className="border-neutral-700">
                Enable 2FA
              </Button>
            </div>
            
            <Separator className="bg-neutral-700" />
            
            <div className="space-y-3">
              <Label className="text-neutral-200">Active Sessions</Label>
              <p className="text-sm text-neutral-400">
                View and manage devices that are signed into your account
              </p>
              <Button variant="outline" className="border-neutral-700">
                Manage Sessions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-neutral-900 border-red-800 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="text-red-400">Delete Account</Label>
              <p className="text-sm text-neutral-400">
                Permanently delete your GitIntel account and all associated data. This action cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                onClick={deleteAccount}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-green-600 bg-green-900/20">
            <Settings className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={loading} className="min-w-32">
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
} 