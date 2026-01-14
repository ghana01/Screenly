"use client"

import React, { useContext, useState, useRef } from 'react'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import axios from 'axios'
import { supabase } from '@/services/supabaseClient'
import VoiceInterview from './_components/VoiceInterview'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

const StartInterview = () => {
    const { interviewInfo } = useContext(InterviewDataContext)
    const [conversation, setConversation] = useState('')
    const [isCallActive, setIsCallActive] = useState(false)
    const [feedbackGenerated, setFeedbackGenerated] = useState(false)
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false)
    const { interview_id } = useParams()
    const Router = useRouter()
    
    const conversationRef = useRef('')
    const feedbackGeneratedRef = useRef(false)

    // Handle conversation updates from VoiceInterview component
    const handleConversationUpdate = (newConversation) => {
        setConversation(newConversation)
        conversationRef.current = newConversation
    }

    // Handle call status changes
    const handleCallStatusChange = (status) => {
        setIsCallActive(status)
    }

    // Handle interview end - generate feedback
    const handleInterviewEnd = async (finalConversation) => {
        if (feedbackGeneratedRef.current || !finalConversation?.trim()) {
            Router.push(`/interview/${interview_id}/completed`)
            return
        }

        feedbackGeneratedRef.current = true
        setFeedbackGenerated(true)
        setIsGeneratingFeedback(true)

        try {
            console.log('📝 Generating feedback...')
            
            // Generate feedback using AI
            const response = await axios.post('/api/ai-feedback', {
                conversation: finalConversation,
                jobPosition: interviewInfo?.interviewData?.jobPosition,
                jobDescription: interviewInfo?.interviewData?.jobDescription,
                questionList: interviewInfo?.interviewData?.questionList
            })

            const feedback = response.data.feedback || response.data.content

            // Save to database
            const { error } = await supabase
                .from('interview-feedback')
                .insert([{
                    interview_id: interview_id,
                    userName: interviewInfo?.userName,
                    userEmail: interviewInfo?.userEmail,
                    feedback: feedback,
                    conversation: finalConversation,
                    created_at: new Date().toISOString(),
                    recommended: feedback?.recommendation === 'Yes' || false
                }])

            if (error) {
                console.error('Database error:', error)
                toast.error('Failed to save feedback')
            } else {
                toast.success('Interview completed! Feedback generated.')
            }

            // Navigate to completed page
            Router.push(`/interview/${interview_id}/completed`)

        } catch (error) {
            console.error('Error generating feedback:', error)
            toast.error('Failed to generate feedback')
            feedbackGeneratedRef.current = false
            setFeedbackGenerated(false)
        } finally {
            setIsGeneratingFeedback(false)
        }
    }

    // Loading state
    if (!interviewInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-lg text-gray-600">Loading interview...</p>
                </div>
            </div>
        )
    }

    // Generating feedback state
    if (isGeneratingFeedback) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
                    <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Interview</h2>
                    <p className="text-gray-600">Please wait while we generate your feedback...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {interviewInfo?.interviewData?.jobPosition} Interview
                    </h1>
                    <p className="text-gray-500 mt-2">
                        AI-Powered Voice Interview • Free Edition
                    </p>
                </div>

                {/* Interview Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Candidate Info */}
                    <div className="flex items-center justify-center gap-4 mb-8 pb-6 border-b">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                            <Image 
                                src="/user-avatar.png" 
                                alt="Candidate"
                                fill
                                className="object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none'
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                {interviewInfo?.userName || 'Candidate'}
                            </h2>
                            <p className="text-gray-500">{interviewInfo?.userEmail}</p>
                        </div>
                    </div>

                    {/* Voice Interview Component */}
                    <VoiceInterview 
                        interviewInfo={interviewInfo}
                        onConversationUpdate={handleConversationUpdate}
                        onInterviewEnd={handleInterviewEnd}
                        onCallStatusChange={handleCallStatusChange}
                    />

                    {/* Interview Details */}
                    <div className="mt-8 pt-6 border-t">
                        <h3 className="font-semibold text-gray-700 mb-3">Interview Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Position:</span>
                                <p className="font-medium">{interviewInfo?.interviewData?.jobPosition}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Duration:</span>
                                <p className="font-medium">{interviewInfo?.interviewData?.interviewDuration || '30'} minutes</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Questions:</span>
                                <p className="font-medium">{interviewInfo?.interviewData?.questionList?.length || 0}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Type:</span>
                                <p className="font-medium">{interviewInfo?.interviewData?.interviewTypes?.join(', ') || 'General'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-6 bg-blue-50 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-800 mb-2">📋 Instructions</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Click "Start Interview" to begin</li>
                        <li>• Allow microphone access when prompted</li>
                        <li>• Speak clearly and wait for the AI to finish before responding</li>
                        <li>• Click "End Interview" when you're done</li>
                        <li>• Works best in Chrome or Edge browsers</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default StartInterview
