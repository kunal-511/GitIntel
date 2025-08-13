"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { 
  ArrowLeft,
  CreditCard,
  Download,
  Calendar,
  Crown,
  Zap,
  Check,
  Star
} from 'lucide-react'

interface Plan {
  id: string
  name: string
  price: number
  interval: string
  features: string[]
  recommended?: boolean
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    features: [
      '100 API requests/month',
      'Basic repository analysis',
      'Community support',
      'Standard rate limits'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    interval: 'month',
    recommended: true,
    features: [
      '10,000 API requests/month',
      'Advanced analytics',
      'Priority support',
      'Custom webhooks',
      'Export data',
      'Higher rate limits'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29,
    interval: 'month',
    features: [
      'Unlimited API requests',
      'White-label options',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment',
      'Advanced security'
    ]
  }
]

export default function BillingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [currentPlan, setCurrentPlan] = useState('free')
  const [billingHistory, ] = useState([
    {
      id: '1',
      date: '2024-01-15',
      amount: 9.00,
      plan: 'Pro',
      status: 'paid'
    },
    {
      id: '2',
      date: '2023-12-15',
      amount: 9.00,
      plan: 'Pro',
      status: 'paid'
    }
  ])
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    // Set current plan from session
    setCurrentPlan(session.user.plan?.toLowerCase() || 'free')
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading billing information...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handlePlanChange = async (planId: string) => {
    setLoading(true)
    try {
      // Simulate API call for plan change
      await new Promise(resolve => setTimeout(resolve, 2000))
      setCurrentPlan(planId)
      alert(`Successfully ${planId === 'free' ? 'downgraded to' : 'upgraded to'} ${planId} plan!`)
    } catch (error) {
      alert('Failed to change plan. Please try again.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'pro':
        return <Zap className="w-5 h-5 text-blue-400" />
      case 'enterprise':
        return <Crown className="w-5 h-5 text-purple-400" />
      default:
        return <Star className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-neutral-300 hover:text-neutral-100">
              <Link href="/profile">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-100">Billing & Subscription</h1>
              <p className="text-neutral-400">Manage your subscription and billing information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Current Plan */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-200">
              <CreditCard className="w-5 h-5" />
              Current Plan
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Your active subscription plan and usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-neutral-800/50 rounded-lg">
              <div className="flex items-center gap-4">
                {getPlanIcon(currentPlan)}
                <div>
                  <h3 className="text-xl font-semibold text-neutral-100 capitalize">
                    {currentPlan} Plan
                  </h3>
                  <p className="text-neutral-400">
                    {currentPlan === 'free' 
                      ? 'Free forever' 
                      : `$${plans.find(p => p.id === currentPlan)?.price}/month`
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${
                  currentPlan === 'free' ? 'bg-gray-600' : 
                  currentPlan === 'pro' ? 'bg-blue-600' : 'bg-purple-600'
                } text-white`}>
                  Active
                </Badge>
                {currentPlan !== 'free' && (
                  <p className="text-sm text-neutral-400 mt-1">
                    Next billing: {formatDate('2024-02-15')}
                  </p>
                )}
              </div>
            </div>
            
            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-neutral-800/30 rounded-lg">
                <h4 className="text-sm font-medium text-neutral-300">API Requests</h4>
                <div className="mt-2">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-neutral-100">247</span>
                    <span className="text-sm text-neutral-400">
                      / {currentPlan === 'free' ? '100' : currentPlan === 'pro' ? '10,000' : '∞'}
                    </span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ 
                        width: currentPlan === 'free' ? '100%' : '2.47%' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-neutral-800/30 rounded-lg">
                <h4 className="text-sm font-medium text-neutral-300">Storage Used</h4>
                <div className="mt-2">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-bold text-neutral-100">1.2</span>
                    <span className="text-sm text-neutral-400">GB</span>
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2 mt-2">
                    <div className="bg-green-400 h-2 rounded-full w-1/4"></div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-neutral-800/30 rounded-lg">
                <h4 className="text-sm font-medium text-neutral-300">Support Level</h4>
                <div className="mt-2">
                  <span className="text-lg font-semibold text-neutral-100">
                    {currentPlan === 'free' ? 'Community' : 
                     currentPlan === 'pro' ? 'Priority' : 'Dedicated'}
                  </span>
                  <p className="text-sm text-neutral-400 mt-1">
                    {currentPlan === 'free' ? 'Best effort' : 
                     currentPlan === 'pro' ? '24h response' : '1h response'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-neutral-200">Available Plans</CardTitle>
            <CardDescription className="text-neutral-400">
              Choose the plan that best fits your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`relative p-6 rounded-lg border ${
                    plan.recommended 
                      ? 'border-blue-500 bg-blue-900/10' 
                      : 'border-neutral-700 bg-neutral-800/50'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-blue-100">Recommended</Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-neutral-100">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-neutral-100">${plan.price}</span>
                      <span className="text-neutral-400">/{plan.interval}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-neutral-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant={currentPlan === plan.id ? "outline" : "default"}
                    disabled={currentPlan === plan.id || loading}
                    onClick={() => handlePlanChange(plan.id)}
                  >
                    {loading ? 'Processing...' : 
                     currentPlan === plan.id ? 'Current Plan' : 
                     currentPlan === 'free' ? 'Upgrade' : 'Change Plan'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-200">
              <Calendar className="w-5 h-5" />
              Billing History
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Your payment history and invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            {billingHistory.length > 0 ? (
              <div className="space-y-4">
                {billingHistory.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-100">
                          {invoice.plan} Plan
                        </p>
                        <p className="text-sm text-neutral-400">
                          {formatDate(invoice.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-neutral-100">
                          ${invoice.amount.toFixed(2)}
                        </p>
                        <Badge className={
                          invoice.status === 'paid' 
                            ? 'bg-green-600 text-green-100' 
                            : 'bg-red-600 text-red-100'
                        }>
                          {invoice.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" className="border-neutral-700">
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400">No billing history yet</p>
                <p className="text-sm text-neutral-500 mt-1">
                  Upgrade to a paid plan to see your billing history here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 