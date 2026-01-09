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
    const [feedbackGenerated, setFeedbackGenerated] = useState(false)
    const { interview_id } = useParams()
    const Router = useRouter()
    
    const vapiRef = useRef(null)
    const conversationRef = useRef('')
    const feedbackGeneratedRef = useRef(false)
    const isInitializingRef = useRef(false)

    // Update conversation ref when conversation changes
    useEffect(() => {
        conversationRef.current = conversation
    }, [conversation])

    // Initialize VAPI and start call
    useEffect(() => {
        if (!interviewInfo || isInitializingRef.current) {
            return;
        }

        let vapi = null;
        let mounted = true;

        const initializeAndStartInterview = async () => {
            try {
                isInitializingRef.current = true;
                console.log('🎙️ Initializing VAPI...');
                
                // Create VAPI instance
                vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
                vapiRef.current = vapi;

                // Set up event listeners
                vapi.on('call-start', () => {
                    if (!mounted) return;
                    console.log('✅ Interview started');
                    setIsCallActive(true);
                    toast.success('Interview Started');
                });
                
                vapi.on('speech-start', () => {
                    if (!mounted) return;
                    setActiveUser(false);
                });
                
                vapi.on('speech-end', () => {
                    if (!mounted) return;
                    setActiveUser(true);
                });
                
                vapi.on('call-end', () => {
                    if (!mounted) return;
                    console.log('📞 Interview ended');
                    setIsCallActive(false);
                    setActiveUser(false);
                    toast.info('Interview Ended');
                    
                    // Generate feedback only once
                    if (!feedbackGeneratedRef.current && conversationRef.current?.trim()) {
                        GenerateFeedBack();
                    }
                });
                
                vapi.on('message', (message) => {
                    if (!mounted) return;
                    if (message.type === 'transcript') {
                        setConversation(prev => {
                            const newLine = `${message.role}: ${message.transcript}`;
                            return prev ? `${prev}\n${newLine}` : newLine;
                        });
                    }
                });

                vapi.on('error', (error) => {
                    if (!mounted) return;
                    if (error.errorMsg !== 'Meeting has ended') {
                        console.error('VAPI Error:', error);
                        toast.error('Interview error occurred');
                    }
                });

                // Prepare question list
                let questionList = '';
                interviewInfo?.interviewData?.questionList?.forEach((item) => {
                    questionList = item?.question + ', ' + questionList;
                });

                // Start the call
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
                };
                
                console.log('🚀 Starting interview call...');
                await vapi.start(assistantOptions);
                
            } catch (error) {
                console.error('❌ Failed to initialize VAPI:', error);
                toast.error('Failed to start interview. Please refresh and try again.');
                isInitializingRef.current = false;
            }
        };

        initializeAndStartInterview();

        // Cleanup function
        return () => {
            mounted = false;
            isInitializingRef.current = false;
            
            if (vapi) {
                try {
                    console.log('🧹 Cleaning up VAPI...');
                    vapi.stop();
                } catch (error) {
                    console.error('Error during cleanup:', error);
                }
                vapiRef.current = null;
            }
        };
    }, [interviewInfo]); // Only depend on interviewInfo

    const stopInterview = () => {
        const vapi = vapiRef.current;
        if (vapi && isCallActive) {
            try {
                console.log('⏹️ Stopping interview manually...');
                setIsCallActive(false);
                setActiveUser(false);
                
                vapi.stop();
                toast.info('Interview stopped');
                
                // Generate feedback immediately if conversation exists
                if (conversationRef.current?.trim() && !feedbackGeneratedRef.current) {
                    GenerateFeedBack();
                }
            } catch (error) {
                console.error('Error stopping interview:', error);
                toast.error('Failed to stop interview');
            }
        }
    };

    const GenerateFeedBack = async () => {
        // Prevent duplicate feedback generation
        if (feedbackGeneratedRef.current || feedbackGenerated) {
            console.log('⚠️ Feedback already generated, skipping...');
            return;
        }

        feedbackGeneratedRef.current = true;
        setFeedbackGenerated(true);

        const finalConversation = conversationRef.current;
        
        if (!finalConversation?.trim()) {
            toast.error('No conversation data available for feedback');
            Router.replace(`/interview/${interview_id}/completed`);
            return;
        }

        try {
            const loadingToast = toast.loading('Generating feedback...');
            
            console.log('📝 Generating AI feedback...');
            const result = await axios.post('/api/ai-feedback', {
                conversation: finalConversation
            });
            
            if (result?.data?.success) {
                const feedbackString = result.data.content || result.data.feedback;
                toast.success('Feedback generated successfully!', { id: loadingToast });
                
                console.log('💾 Saving feedback to database...');
                
                // Safely parse feedback JSON
                let parsedFeedback;
                try {
                    parsedFeedback = typeof feedbackString === 'string' 
                        ? JSON.parse(feedbackString) 
                        : feedbackString;
                } catch (parseError) {
                    console.error('Failed to parse feedback:', parseError);
                    parsedFeedback = { raw: feedbackString };
                }
                
                // Save to database
                const { data, error } = await supabase
                    .from('interview-feedback')
                    .insert([
                        { 
                            userName: interviewInfo?.userName,
                            email: interviewInfo?.userEmail,
                            interview_id: interview_id, 
                            feedback: parsedFeedback,
                            recommended: false
                        },
                    ])
                    .select();

                if (error) {
                    console.error('Database error:', error);
                    throw new Error('Failed to save feedback: ' + error.message);
                }

                console.log('✅ Feedback saved successfully');
                toast.success('Feedback saved!');
                
                // Navigate to completion page
                Router.replace(`/interview/${interview_id}/completed`);
                
            } else {
                throw new Error('Failed to generate feedback');
            }
            
        } catch (error) {
            console.error('❌ Error generating feedback:', error);
            toast.error('Failed to generate feedback: ' + error.message);
            
            // Reset flags on error so user can retry
            feedbackGeneratedRef.current = false;
            setFeedbackGenerated(false);
            
            // Still navigate to completion page after a delay
            setTimeout(() => {
                Router.replace(`/interview/${interview_id}/completed`);
            }, 2000);
        }
    };

    // Redirect if no interview info
    if (!interviewInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">No Interview Information Found</h2>
                    <p className="text-gray-600">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 lg:p-20">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                AI Interview Session
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Interviewing: {interviewInfo?.userName}
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Timer className="h-5 w-5" />
                                <span>{interviewInfo?.interviewData?.interviewDuration} mins</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                <span>{interviewInfo?.interviewData?.interviewTypes?.join(', ')}</span>
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
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">AI Recruiter</h3>
                            <p className="text-sm text-gray-500 mt-2">
                                {!activeUser && isCallActive ? '🎤 Speaking...' : '👂 Listening...'}
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
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {interviewInfo?.userName}
                            </h3>
                            <p className="text-sm text-gray-500 mt-2">
                                {activeUser && isCallActive ? '🎤 Speaking...' : '👂 Listening...'}
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
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {isCallActive ? 'Microphone Active' : 'Microphone Inactive'}
                            </span>
                        </div>

                        {/* Stop Call Button */}
                        {isCallActive && !feedbackGenerated && (
                            <AlertConformation stopCall={stopInterview}>
                                <div className="relative group">
                                    <Phone className="h-14 w-14 p-4 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 transition-all duration-200" />
                                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        End Interview
                                    </span>
                                </div>
                            </AlertConformation>
                        )}
                    </div>

                    {/* Status */}
                    <div className="text-center mt-8">
                        <p className="text-lg font-medium text-gray-700">
                            {feedbackGenerated ? '✅ Interview completed' :
                             isCallActive ? '🎙️ Interview in progress...' : 
                             '⏳ Initializing interview...'}
                        </p>
                        {conversation.length > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                                📝 Conversation: {conversation.length} characters recorded
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StartInterview;