"use client"

import { useState, useEffect, useContext } from 'react'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import { 
    CreditCard, 
    Check, 
    Zap, 
    Crown, 
    Building2, 
    Users, 
    Clock, 
    FileText, 
    BarChart3, 
    Shield, 
    Sparkles,
    ChevronRight,
    Download,
    Calendar,
    Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const BillingPage = () => {
    const { user } = useUser()
    const [currentPlan, setCurrentPlan] = useState('free')
    const [billingCycle, setBillingCycle] = useState('monthly')
    const [loading, setLoading] = useState(true)
    const [usageStats, setUsageStats] = useState({
        interviewsUsed: 0,
        interviewsLimit: 10, // Free tier limit
        candidatesAssessed: 0,
        storageUsed: 0
    })

    useEffect(() => {
        if (user?.email) {
            fetchUsageStats()
        } else {
            setLoading(false)
        }
    }, [user])

    const fetchUsageStats = async () => {
        try {
            setLoading(true)
            
            // Get current month's start
            const now = new Date()
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

            // Fetch interviews for this user this month
            const { data: interviews, error } = await supabase
                .from('interview')
                .select(`
                    *,
                    interview-feedback (*)
                `)
                .eq('userEmail', user?.email)

            if (error) {
                console.error('Error fetching usage:', error)
                return
            }

            // Count this month's interviews
            const thisMonthInterviews = interviews?.filter(i => 
                new Date(i.created_at) >= new Date(monthStart)
            ).length || 0

            // Count total candidates
            let totalCandidates = 0
            interviews?.forEach(interview => {
                if (interview['interview-feedback']) {
                    totalCandidates += interview['interview-feedback'].length
                }
            })

            // Estimate storage (rough calculation based on feedback count)
            const storageUsed = (totalCandidates * 0.05).toFixed(2) // ~50KB per feedback

            setUsageStats({
                interviewsUsed: thisMonthInterviews,
                interviewsLimit: currentPlan === 'free' ? 10 : currentPlan === 'pro' ? 200 : 999,
                candidatesAssessed: totalCandidates,
                storageUsed: parseFloat(storageUsed)
            })

        } catch (err) {
            console.error('Usage stats error:', err)
        } finally {
            setLoading(false)
        }
    }

    const plans = [
        {
            id: 'starter',
            name: 'Starter',
            icon: Zap,
            description: 'Perfect for small teams getting started',
            monthlyPrice: 29,
            yearlyPrice: 290,
            features: [
                '50 AI interviews/month',
                '5 team members',
                'Basic analytics',
                'Email support',
                'Standard voice AI',
                '7-day data retention'
            ],
            color: 'bg-blue-500',
            popular: false
        },
        {
            id: 'pro',
            name: 'Professional',
            icon: Crown,
            description: 'For growing teams with advanced needs',
            monthlyPrice: 79,
            yearlyPrice: 790,
            features: [
                '200 AI interviews/month',
                '15 team members',
                'Advanced analytics & reports',
                'Priority email & chat support',
                'Premium voice AI with accents',
                '30-day data retention',
                'Custom interview templates',
                'Candidate scoring & ranking'
            ],
            color: 'bg-purple-500',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            icon: Building2,
            description: 'For large organizations with custom needs',
            monthlyPrice: 199,
            yearlyPrice: 1990,
            features: [
                'Unlimited AI interviews',
                'Unlimited team members',
                'Custom AI training',
                'Dedicated account manager',
                '24/7 phone & video support',
                'Unlimited data retention',
                'API access & integrations',
                'SSO & advanced security',
                'Custom branding',
                'On-premise deployment option'
            ],
            color: 'bg-orange-500',
            popular: false
        }
    ]

    const handleUpgrade = (planId) => {
        toast.success(`Upgrade to ${planId} plan initiated! Contact us to complete your upgrade.`)
    }

    const handleDownloadInvoice = (invoiceId) => {
        toast.success(`Downloading ${invoiceId}...`)
    }

    // Get plan details
    const getPlanName = () => {
        switch(currentPlan) {
            case 'starter': return 'Starter'
            case 'pro': return 'Professional'
            case 'enterprise': return 'Enterprise'
            default: return 'Free Trial'
        }
    }

    const getPlanPrice = () => {
        switch(currentPlan) {
            case 'starter': return '$29'
            case 'pro': return '$79'
            case 'enterprise': return '$199'
            default: return '$0'
        }
    }

    const getInterviewLimit = () => {
        switch(currentPlan) {
            case 'starter': return 50
            case 'pro': return 200
            case 'enterprise': return 999
            default: return 10
        }
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Billing & Plans</h1>
                <p className="text-gray-600 mt-2">Manage your subscription and view your usage</p>
            </div>

            {/* Current Plan Overview */}
            <div className={`rounded-2xl p-6 mb-8 text-white ${
                currentPlan === 'free' 
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600'
            }`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {currentPlan === 'free' ? <Zap className="w-6 h-6" /> : <Crown className="w-6 h-6" />}
                            <span className="text-white/70 text-sm font-medium">Current Plan</span>
                        </div>
                        <h2 className="text-2xl font-bold">{getPlanName()}</h2>
                        <p className="text-white/70 mt-1">
                            {currentPlan === 'free' 
                                ? `${usageStats.interviewsUsed}/${getInterviewLimit()} interviews used this month` 
                                : 'Unlimited interviews this month'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{getPlanPrice()}<span className="text-lg font-normal">/month</span></div>
                        {currentPlan === 'free' && (
                            <Button 
                                className="mt-2 bg-white text-purple-600 hover:bg-purple-50"
                                onClick={() => toast.info('Contact us to upgrade your plan!')}
                            >
                                Upgrade Now
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Usage Stats */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl border p-5 animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="w-full h-2 bg-gray-200 rounded-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-700">AI Interviews</span>
                            </div>
                            <span className="text-sm text-gray-500">This month</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-2xl font-bold text-gray-900">{usageStats.interviewsUsed}</span>
                            <span className="text-gray-500"> / {getInterviewLimit()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className={`h-2 rounded-full transition-all ${
                                    usageStats.interviewsUsed >= getInterviewLimit() ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min((usageStats.interviewsUsed / getInterviewLimit()) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            {getInterviewLimit() - usageStats.interviewsUsed > 0 
                                ? `${getInterviewLimit() - usageStats.interviewsUsed} interviews remaining`
                                : 'Limit reached - Upgrade to continue'}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="font-medium text-gray-700">Candidates</span>
                            </div>
                            <span className="text-sm text-gray-500">Total</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-2xl font-bold text-gray-900">{usageStats.candidatesAssessed}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Candidates assessed via AI interviews</p>
                    </div>

                    <div className="bg-white rounded-xl border p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="font-medium text-gray-700">Storage</span>
                            </div>
                            <span className="text-sm text-gray-500">Data & Reports</span>
                        </div>
                        <div className="mb-2">
                            <span className="text-2xl font-bold text-gray-900">{usageStats.storageUsed} MB</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Feedback and interview data</p>
                    </div>
                </div>
            )}

            {/* Billing Cycle Toggle */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-1 rounded-full inline-flex">
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                            billingCycle === 'monthly' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                            billingCycle === 'yearly' 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Yearly
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Save 17%</span>
                    </button>
                </div>
            </div>

            {/* Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {plans.map((plan) => {
                    const Icon = plan.icon
                    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice
                    const isCurrentPlan = plan.id === currentPlan
                    
                    return (
                        <div 
                            key={plan.id}
                            className={`relative bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
                                plan.popular ? 'border-purple-500 shadow-lg' : 'border-gray-200'
                            } ${isCurrentPlan ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Most Popular
                                    </span>
                                </div>
                            )}
                            
                            <div className={`w-12 h-12 ${plan.color} rounded-xl flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                            <p className="text-gray-500 text-sm mt-1 mb-4">{plan.description}</p>
                            
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-gray-900">${price}</span>
                                <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                            </div>
                            
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            
                            <Button 
                                className={`w-full ${
                                    isCurrentPlan 
                                        ? 'bg-gray-100 text-gray-500 cursor-default hover:bg-gray-100' 
                                        : plan.popular 
                                            ? 'bg-purple-600 hover:bg-purple-700' 
                                            : ''
                                }`}
                                variant={isCurrentPlan ? 'outline' : plan.popular ? 'default' : 'outline'}
                                onClick={() => !isCurrentPlan && handleUpgrade(plan.id)}
                                disabled={isCurrentPlan}
                            >
                                {isCurrentPlan ? 'Current Plan' : 'Upgrade'}
                            </Button>
                        </div>
                    )
                })}
            </div>

            {/* Features Comparison */}
            <div className="bg-white rounded-xl border p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Why Upgrade?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">More Interviews</h4>
                        <p className="text-sm text-gray-500">Conduct unlimited AI interviews with premium plans</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <BarChart3 className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Advanced Analytics</h4>
                        <p className="text-sm text-gray-500">Get detailed insights and candidate comparisons</p>
                    </div>
                    <div className="text-center p-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">Priority Support</h4>
                        <p className="text-sm text-gray-500">Get help faster with dedicated support channels</p>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">Need a custom plan?</h3>
                <p className="text-gray-600 text-sm mb-4">
                    Contact us for enterprise pricing, custom integrations, or volume discounts.
                </p>
                <Button onClick={() => toast.info('Contact us at support@aiinterview.com')}>
                    Contact Sales
                </Button>
            </div>
        </div>
    )
}

export default BillingPage
