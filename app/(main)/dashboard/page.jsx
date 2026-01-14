"use client"

import React, { useEffect, useState } from 'react'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import { 
    Users, 
    CheckCircle, 
    Clock, 
    TrendingUp,
    Calendar,
    Star,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase,
    UserCheck,
    BarChart3,
    Zap,
    Loader2
} from 'lucide-react'

function Dashboard (){
    const { user } = useUser()
    const [stats, setStats] = useState({
        totalInterviews: 0,
        completedInterviews: 0,
        pendingInterviews: 0,
        totalCandidates: 0,
        avgScore: 0,
        thisMonthInterviews: 0,
        lastMonthInterviews: 0
    })
    const [loading, setLoading] = useState(true)
    const [recentActivity, setRecentActivity] = useState([])

    useEffect(() => {
        if (user?.email) {
            fetchDashboardStats()
        } else {
            setLoading(false)
        }
    }, [user])

    const fetchDashboardStats = async () => {
        try {
            setLoading(true)
            
            // Fetch all interviews for this user
            const { data: interviews, error: interviewError } = await supabase
                .from('interview')
                .select(`
                    *,
                    interview-feedback (*)
                `)
                .eq('userEmail', user?.email)

            if (interviewError) {
                console.error('Error fetching interviews:', interviewError)
                return
            }

            // Calculate stats
            const totalInterviews = interviews?.length || 0
            
            // Get all feedback entries (candidates who completed interviews)
            let allFeedback = []
            interviews?.forEach(interview => {
                if (interview['interview-feedback']) {
                    allFeedback = [...allFeedback, ...interview['interview-feedback']]
                }
            })
            
            const completedInterviews = allFeedback.length
            const pendingInterviews = totalInterviews // Interviews created but waiting for candidates
            
            // Calculate average score from feedback
            let totalScore = 0
            let scoredCount = 0
            allFeedback.forEach(fb => {
                if (fb.feedback) {
                    // Ensure feedback is a string before using match
                    const feedbackText = typeof fb.feedback === 'string' 
                        ? fb.feedback 
                        : (fb.feedback?.summary || fb.feedback?.text || JSON.stringify(fb.feedback))
                    
                    if (typeof feedbackText === 'string') {
                        // Try to extract rating from feedback
                        const ratingMatch = feedbackText.match(/(\d+(\.\d+)?)\s*\/\s*10/) || 
                                           feedbackText.match(/rating[:\s]*(\d+(\.\d+)?)/i)
                        if (ratingMatch) {
                            totalScore += parseFloat(ratingMatch[1])
                            scoredCount++
                        }
                    }
                }
            })
            const avgScore = scoredCount > 0 ? (totalScore / scoredCount).toFixed(1) : 'N/A'

            // This month vs last month
            const now = new Date()
            const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

            const thisMonthInterviews = interviews?.filter(i => 
                new Date(i.created_at) >= thisMonthStart
            ).length || 0

            const lastMonthInterviews = interviews?.filter(i => {
                const date = new Date(i.created_at)
                return date >= lastMonthStart && date <= lastMonthEnd
            }).length || 0

            // Recent activity (last 5 feedbacks)
            const sortedFeedback = allFeedback
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5)

            setStats({
                totalInterviews,
                completedInterviews,
                pendingInterviews,
                totalCandidates: completedInterviews,
                avgScore,
                thisMonthInterviews,
                lastMonthInterviews
            })

            setRecentActivity(sortedFeedback)

        } catch (err) {
            console.error('Dashboard stats error:', err)
        } finally {
            setLoading(false)
        }
    }

    // Calculate percentage change
    const calculateChange = (current, previous) => {
        if (previous === 0) return current > 0 ? '+100%' : '0%'
        const change = ((current - previous) / previous) * 100
        return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`
    }

    const interviewChange = calculateChange(stats.thisMonthInterviews, stats.lastMonthInterviews)

    const statsCards = [
        {
            title: 'Total Interviews',
            value: stats.totalInterviews.toString(),
            subtitle: 'Created',
            icon: Briefcase,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Candidates',
            value: stats.totalCandidates.toString(),
            subtitle: 'Completed interviews',
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'This Month',
            value: stats.thisMonthInterviews.toString(),
            change: interviewChange,
            trend: stats.thisMonthInterviews >= stats.lastMonthInterviews ? 'up' : 'down',
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Avg. Score',
            value: stats.avgScore.toString(),
            subtitle: stats.avgScore !== 'N/A' ? 'out of 10' : 'No data yet',
            icon: Star,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        }
    ]

    return (
        <div className='w-full p-2'>
            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-xl border p-5 animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                                <div className="w-16 h-4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-12 h-8 bg-gray-200 rounded mb-2"></div>
                            <div className="w-24 h-4 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <div key={index} className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    {stat.change && (
                                        <div className={`flex items-center text-sm font-medium ${
                                            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {stat.change}
                                            {stat.trend === 'up' 
                                                ? <ArrowUpRight className="w-4 h-4" />
                                                : <ArrowDownRight className="w-4 h-4" />
                                            }
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-sm text-gray-500">{stat.subtitle || stat.title}</p>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* AI Power Banner */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Zap className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">AI-Powered Hiring</h3>
                            <p className="text-purple-200">Conduct interviews 24/7 with our intelligent voice AI</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold">{stats.totalInterviews}</p>
                            <p className="text-sm text-purple-200">Interviews Created</p>
                        </div>
                        <div className="w-px h-12 bg-white/30"></div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">{stats.totalCandidates}</p>
                            <p className="text-sm text-purple-200">Candidates Assessed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
                <div className="mb-8">
                    <h2 className='font-bold text-xl mb-4 flex items-center gap-2'>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Recent Candidates
                    </h2>
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <div className="divide-y">
                            {recentActivity.map((activity, idx) => (
                                <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                                            {(activity.userName || activity.email || 'C').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {activity.userName || activity.email?.split('@')[0] || 'Candidate'}
                                            </p>
                                            <p className="text-sm text-gray-500">{activity.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Completed
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(activity.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Options */}
            <h2 className='font-bold text-xl mb-4 flex items-center gap-2'>
                <Briefcase className="w-5 h-5 text-purple-600" />
                Quick Actions
            </h2>
            <CreateOptions />

            {/* Latest Interviews */}
            <h2 className='font-bold text-xl mt-8 mb-4 flex items-center gap-2'>
                <TrendingUp className="w-5 h-5 text-purple-600" />
                Your Interviews
            </h2>
            <LatestInterviewsList/>

            {/* Pro Tip */}
            {stats.totalInterviews === 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Star className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-medium text-blue-900">Get Started!</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Create your first AI interview and share the link with candidates. 
                                They can complete the interview anytime, and you&apos;ll get detailed feedback automatically.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Dashboard

