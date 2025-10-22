
"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { CheckCircle, Home, FileText } from 'lucide-react'
import { toast } from 'sonner'

const InterviewCompleted = () => {
    const { interview_id } = useParams()
    const router = useRouter()
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 lg:p-20">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-20 w-20 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Interview Completed! 🎉
                    </h1>
                    <p className="text-gray-600">
                        Thank you for completing the interview. Here's your feedback.
                    </p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your feedback...</p>
                    </div>
                ) : feedback ? (
                    <>
                        {/* Ratings Section */}
                        {parsedFeedback.rating && (
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Ratings</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(parsedFeedback.rating).map(([key, value]) => (
                                        <div key={key} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </span>
                                                <span className="text-lg font-bold text-blue-600">
                                                    {value}/10
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div 
                                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                                    style={{ width: `${value * 10}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary Section */}
                        {parsedFeedback.summery && (
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {parsedFeedback.summery}
                                </p>
                            </div>
                        )}

                        {/* Recommendation Section */}
                        {parsedFeedback.Recommendation && (
                            <div className={`rounded-xl shadow-lg p-8 mb-8 ${
                                parsedFeedback.Recommendation.toLowerCase().includes('yes') || 
                                parsedFeedback.Recommendation.toLowerCase().includes('recommended')
                                    ? 'bg-green-50 border-2 border-green-500'
                                    : 'bg-yellow-50 border-2 border-yellow-500'
                            }`}>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommendation</h2>
                                <p className="text-xl font-semibold mb-2">
                                    {parsedFeedback.Recommendation}
                                </p>
                                {parsedFeedback.RecommendationMsg && (
                                    <p className="text-gray-700">
                                        {parsedFeedback.RecommendationMsg}
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No feedback available yet.</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        <Home className="h-5 w-5" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

export default InterviewCompleted