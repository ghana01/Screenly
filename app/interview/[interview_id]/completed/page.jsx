
"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { CheckCircle, FileText, Lightbulb, TrendingUp, Star, ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'

const InterviewCompleted = () => {
    const { interview_id } = useParams()
    const [feedback, setFeedback] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                console.log('📊 Fetching feedback for interview:', interview_id)
                
                const { data, error } = await supabase
                    .from('interview-feedback')
                    .select('*')
                    .eq('interview_id', interview_id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                if (error) {
                    console.error('Error fetching feedback:', error)
                    toast.error('Could not load feedback')
                } else {
                    console.log('✅ Feedback loaded:', data)
                    setFeedback(data)
                }
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setLoading(false)
            }
        }

        if (interview_id) {
            fetchFeedback()
        }
    }, [interview_id])

    const parsedFeedback = feedback?.feedback?.feedback || feedback?.feedback || {}

    // Extract improvement areas from feedback
    const getImprovementTips = () => {
        const tips = []
        
        // Check ratings and suggest improvements for lower scores
        if (parsedFeedback.rating) {
            Object.entries(parsedFeedback.rating).forEach(([key, value]) => {
                if (value < 7) {
                    const formattedKey = key.replace(/([A-Z])/g, ' $1').trim()
                    tips.push({
                        area: formattedKey,
                        score: value,
                        suggestion: `Consider strengthening your ${formattedKey.toLowerCase()} skills for future interviews.`
                    })
                }
            })
        }
        
        return tips
    }

    // Get strengths (high-scoring areas)
    const getStrengths = () => {
        const strengths = []
        
        if (parsedFeedback.rating) {
            Object.entries(parsedFeedback.rating).forEach(([key, value]) => {
                if (value >= 7) {
                    const formattedKey = key.replace(/([A-Z])/g, ' $1').trim()
                    strengths.push({
                        area: formattedKey,
                        score: value
                    })
                }
            })
        }
        
        return strengths
    }

    const improvementTips = getImprovementTips()
    const strengths = getStrengths()

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 lg:p-20">
            <div className="max-w-3xl mx-auto">
                {/* Success Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 p-4 rounded-full">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Thank You! 🎉
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Your Interview Has Been Successfully Submitted
                    </p>
                    <p className="text-gray-500">
                        The recruiter will review your responses and get back to you soon.
                    </p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your feedback...</p>
                    </div>
                ) : feedback ? (
                    <>
                        {/* Your Strengths */}
                        {strengths.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-green-100 p-2 rounded-lg">
                                        <ThumbsUp className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Your Strengths</h2>
                                </div>
                                <div className="space-y-4">
                                    {strengths.map((strength, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                                            <Star className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="font-medium text-gray-800 capitalize">
                                                    {strength.area}
                                                </span>
                                            </div>
                                            <span className="text-green-600 font-bold">{strength.score}/10</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Areas to Improve */}
                        {improvementTips.length > 0 && (
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <TrendingUp className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Areas to Improve</h2>
                                </div>
                                <div className="space-y-4">
                                    {improvementTips.map((tip, index) => (
                                        <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Lightbulb className="h-5 w-5 text-blue-500" />
                                                <span className="font-semibold text-gray-800 capitalize">{tip.area}</span>
                                                <span className="text-sm text-gray-500">({tip.score}/10)</span>
                                            </div>
                                            <p className="text-gray-600 text-sm ml-7">{tip.suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary - Improvement focused */}
                        {parsedFeedback.summery && (
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <FileText className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Feedback Summary</h2>
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    {parsedFeedback.summery}
                                </p>
                            </div>
                        )}

                        {/* Tips for Future */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 mb-6 text-white">
                            <h2 className="text-xl font-bold mb-4">💡 Tips for Future Interviews</h2>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="mt-1">•</span>
                                    <span>Practice speaking clearly and at a steady pace</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1">•</span>
                                    <span>Use specific examples from your experience to support your answers</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1">•</span>
                                    <span>Research the company and role thoroughly before interviews</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-1">•</span>
                                    <span>Prepare questions to ask the interviewer</span>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Your feedback is being processed. Check back soon!</p>
                    </div>
                )}

                {/* Thank You Message - No Dashboard Button for Candidates */}
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Thank You for Your Time! 🙏
                    </h3>
                    <p className="text-gray-600 mb-4">
                        We appreciate you taking the time to complete this interview. 
                        The hiring team will review your responses carefully.
                    </p>
                    <p className="text-sm text-gray-500">
                        You can safely close this window now.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default InterviewCompleted