"use client"
import { Info, Phone, Timer } from "lucide-react"
import React, { useEffect, useRef, useState, useContext } from 'react'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { Mic } from "lucide-react"
import Image from "next/image"
import Vapi from '@vapi-ai/web'
import AlertConformation from "./_components/AlertConformation"
import { toast } from "sonner"
import axios from "axios"
import { supabase } from "@/services/supabaseClient"
import { useRouter, useParams } from "next/navigation"

const StartInterview = () => {
    const { interviewInfo } = useContext(InterviewDataContext)
    const [activeUser, setActiveUser] = useState(false)
    const [conversation, setConversation] = useState('')
    const [isCallActive, setIsCallActive] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const [feedbackGenerated, setFeedbackGenerated] = useState(false)
    const { interview_id } = useParams()
    const Router = useRouter()
    const vapiRef = useRef(null)
    const conversationRef = useRef('')
    const cleanupRef = useRef(false)
    const feedbackGeneratedRef = useRef(false)

    // Update conversation ref when conversation changes
    useEffect(() => {
        conversationRef.current = conversation
    }, [conversation])

    // Initialize VAPI once and prevent duplicate instances
    useEffect(() => {
        let vapi = null

        const initializeVapi = async () => {
            // Prevent duplicate initialization
            if (vapiRef.current || cleanupRef.current || isInitialized) {
                console.log('VAPI already initialized or cleaned up')
                return
            }

            try {
                // Create VAPI instance with proper config
                vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY)
                vapiRef.current = vapi
                setIsInitialized(true)

                // Set up event listeners
                vapi.on('call-start', () => {
                    if (cleanupRef.current) return
                    console.log('Interview started')
                    setIsCallActive(true)
                    toast.success('Interview Started')
                })
                
                vapi.on('speech-start', () => {
                    if (cleanupRef.current) return
                    setActiveUser(false)
                })
                
                vapi.on('speech-end', () => {
                    if (cleanupRef.current) return
                    setActiveUser(true)
                })
                
                vapi.on('call-end', () => {
                    if (cleanupRef.current) return
                    console.log('Interview ended')
                    setIsCallActive(false)
                    setActiveUser(false)
                    toast.info('Interview Ended')
                    
                    // Only generate feedback once
                    if (!feedbackGeneratedRef.current) {
                        GenerateFeedBack()
                    }
                })
                
                vapi.on('message', (message) => {
                    if (message.type === 'transcript' && !cleanupRef.current) {
                        setConversation(prev => {
                            const newLine = `${message.role}: ${message.transcript}`
                            return prev ? `${prev}\n${newLine}` : newLine
                        })
                    }
                })

                vapi.on('error', (error) => {
                    // Filter out "Meeting has ended" errors as they're normal
                    if (error.errorMsg !== 'Meeting has ended' && !cleanupRef.current) {
                        console.error('VAPI Error:', error)
                        toast.error('Interview error occurred')
                    }
                })

            } catch (error) {
                console.error('Failed to initialize VAPI:', error)
                toast.error('Failed to initialize interview system')
            }
        }

        initializeVapi()

        // Cleanup function
        return () => {
            cleanupRef.current = true
            setIsInitialized(false)
            
            if (vapi) {
                try {
                    vapi.stop()
                    vapi.off("call-start",()=>{
                        console.log('Removed call-start listener')
                    })
                    vapi.off("speech-start",()=>{
                        console.log('Removed speech-start listener')
                    })
                    vapi.off("speech-end",()=>{
                        console.log('Removed speech-end listener')
                    })
                    vapi.off("speech-end",()=>{
                        console.log('Removed speech-end listener')
                    })
                    
                   
                 //   vapi.removeAllListeners()
                } catch (error) {
                    console.error('Error during cleanup:', error)
                }
                vapiRef.current = null
            }
        }
    }, []) // Empty dependency array - runs once

    // Start call when interview info is available
    useEffect(() => {
        if (interviewInfo && vapiRef.current && !isCallActive && isInitialized && !cleanupRef.current) {
            startCall()
        }
    }, [interviewInfo, isInitialized, isCallActive])

    const startCall = async () => {
        const vapi = vapiRef.current
        if (!vapi || isCallActive || cleanupRef.current) return

        let questionList = ''
        interviewInfo?.interviewData?.questionList?.forEach((item) => {
            questionList = item?.question + ',' + questionList
        })

        const assistantOptions = {
            name: "AI Recruiter",
            firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}?`,
            transcriber: {
                provider: "deepgram",
                model: "nova-2",
                language: "en-US",
            },
            voice: {
                provider: "playht",
                voiceId: "jennifer",
            },
            model: {
                provider: "openai",
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `
                            You are an AI voice assistant conducting interviews.
                            Your job is to ask candidates provided interview questions and assess their responses.
                            Begin with a friendly introduction, setting a relaxed yet professional tone.
                            Ask one question at a time and wait for responses before proceeding.
                            
                            Questions: ${questionList}
                            
                            Guidelines:
                            ✅ Be friendly, engaging, and professional
                            ✅ Keep responses natural and conversational
                            ✅ Provide brief, encouraging feedback after each answer
                            ✅ If candidates struggle, offer gentle hints
                            ✅ After 5-7 questions, wrap up with a positive summary
                            ✅ Keep the interview focused on the job position
                            ✅ If the interview is ended, stop immediately and don't continue
                        `.trim(),
                    },
                ],
            },
        }
        
        try {
            await vapi.start(assistantOptions)
        } catch (error) {
            console.error('Error starting interview:', error)
            toast.error('Failed to start interview')
        }
    }

    const stopInterview = () => {
        const vapi = vapiRef.current
        if (vapi && (isCallActive || isInitialized)) {
            try {
                // Mark as cleaned up to prevent further processing
                cleanupRef.current = true
                setIsCallActive(false)
                setActiveUser(false)
                
                vapi.stop()
                toast.info('Interview stopped manually')
                
                // Generate feedback immediately if conversation exists and not already generated
                if (conversationRef.current?.trim() && !feedbackGeneratedRef.current) {
                    GenerateFeedBack()
                }
            } catch (error) {
                console.error('Error stopping interview:', error)
                toast.error('Failed to stop interview')
            }
        }
    }

    const GenerateFeedBack = async () => {
        // Prevent duplicate feedback generation
        if (feedbackGeneratedRef.current || feedbackGenerated) {
            console.log('Feedback already generated, skipping...')
            return
        }

        feedbackGeneratedRef.current = true
        setFeedbackGenerated(true)

        const finalConversation = conversationRef.current
        
        if (!finalConversation?.trim()) {
            toast.error('No conversation data available for feedback')
            return
        }

        try {
            const loadingToast = toast.loading('Generating feedback...')
            
            const result = await axios.post('/api/ai-feedback', {
                conversation: finalConversation
            })
            
            if (result?.data?.success) {
                const feedback = result.data.content || result.data.feedback
                toast.success('Feedback generated successfully!', { id: loadingToast })
                console.log('Generated feedback:', feedback)
                
                // Save to database
                const { data, error } = await supabase
                    .from('interview-feedback')
                    .insert([
                        { 
                            userName: interviewInfo?.userName,
                            email: interviewInfo?.email,
                            interview_id: interview_id, 
                            feedback: JSON.parse(feedback),
                            recommended: false
                        },
                    ])
                    .select()

                console.log('Supabase insert response:', data)

                if (error) {
                    throw new Error('Failed to save feedback to database: ' + error.message)
                }

                toast.success('Feedback saved successfully!')
                
                // Navigate to completion page
                Router.replace(`/interview/${interview_id}/completed`)
                
            } else {
                toast.error('Failed to generate feedback', { id: loadingToast })
            }
            
        } catch (error) {
            console.error('Error generating feedback:', error)
            toast.error('Failed to generate feedback: ' + error.message)
            
            // Reset feedback flags on error so user can retry
            feedbackGeneratedRef.current = false
            setFeedbackGenerated(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 lg:p-20">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">
                            AI Interview Session
                        </h1>
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Timer className="h-5 w-5" />
                                <span>{interviewInfo?.interviewData?.interviewDuration} mins</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                <span>{interviewInfo?.interviewData?.interviewTypes}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* AI Interviewer */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="h-80 flex flex-col items-center justify-center p-6">
                            <div className="relative mb-4">
                                {!activeUser && isCallActive && (
                                    <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
                                )}
                                <Image 
                                    src="/ai-interviewer.jpg" 
                                    alt="AI Interviewer" 
                                    width={120} 
                                    height={120}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">AI Recruiter</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                {!activeUser && isCallActive ? 'Speaking...' : 'Listening...'}
                            </p>
                        </div>
                    </div>

                    {/* Candidate */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="h-80 flex flex-col items-center justify-center p-6">
                            <div className="relative mb-4">
                                {activeUser && isCallActive && (
                                    <span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping" />
                                )}
                                <Image 
                                    src="/student.jpeg" 
                                    alt="Candidate" 
                                    width={120} 
                                    height={120}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {interviewInfo?.userName}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">
                                {activeUser && isCallActive ? 'Speaking...' : 'Listening...'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-center gap-6">
                        {/* Microphone */}
                        <div className="relative group">
                            <Mic className={`h-14 w-14 p-4 rounded-full cursor-pointer transition-all duration-200 ${
                                isCallActive 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
                            }`} />
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                Microphone
                            </span>
                        </div>

                        {/* Stop Call Button - Only show when call is active */}
                        {isCallActive && !feedbackGenerated && (
                            <AlertConformation stopCall={stopInterview}>
                                <div className="relative group">
                                    <Phone className="h-14 w-14 p-4 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 transition-all duration-200" />
                                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        End Interview
                                    </span>
                                </div>
                            </AlertConformation>
                        )}
                    </div>

                    {/* Status */}
                    <div className="text-center mt-6">
                        <p className="text-lg font-medium text-gray-700">
                            {feedbackGenerated ? 'Interview completed' :
                             isCallActive ? 'Interview in progress...' : 
                             isInitialized ? 'Ready to start interview' : 'Initializing...'}
                        </p>
                        {conversation.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                                Conversation: {conversation.length} characters recorded
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartInterview