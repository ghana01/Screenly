"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, MicOff, Volume2, Phone, PhoneOff, Loader2, Clock, CheckCircle, Send } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'

// Storage key prefix for interview state
const getStorageKey = (interviewId) => `interview_state_${interviewId}`

// Voice Interview Component using Web Speech API (FREE alternative to VAPI)
const VoiceInterview = ({ 
    interviewInfo, 
    onConversationUpdate, 
    onInterviewEnd,
    onCallStatusChange,
    interviewId
}) => {
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isCallActive, setIsCallActive] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [conversation, setConversation] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answeredQuestions, setAnsweredQuestions] = useState([])
    const [isResuming, setIsResuming] = useState(false)
    
    // Timer state
    const [remainingTime, setRemainingTime] = useState(null)
    const [timerStarted, setTimerStarted] = useState(false)
    
    const recognitionRef = useRef(null)
    const synthRef = useRef(null)
    const conversationRef = useRef([])
    const timerRef = useRef(null)
    const startTimeRef = useRef(null)
    const isRecognitionRunning = useRef(false)
    const saveTimeoutRef = useRef(null)

    // Get total interview duration in seconds
    const getTotalDuration = () => {
        const duration = interviewInfo?.interviewData?.interviewDuration || 30
        return duration * 60 // Convert minutes to seconds
    }

    // Get total questions
    const getTotalQuestions = () => {
        return interviewInfo?.interviewData?.questionList?.length || 0
    }

    // Debounced save state to localStorage
    const saveState = useCallback(() => {
        if (!interviewId || !isCallActive) return
        
        // Debounce saves to prevent too many writes
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }
        
        saveTimeoutRef.current = setTimeout(() => {
            const state = {
                conversation: conversationRef.current,
                currentQuestionIndex,
                answeredQuestions,
                remainingTime,
                startTime: startTimeRef.current,
                isCallActive,
                lastUpdated: Date.now()
            }
            
            try {
                localStorage.setItem(getStorageKey(interviewId), JSON.stringify(state))
                console.log('💾 Interview state saved')
            } catch (error) {
                console.error('Failed to save state:', error)
            }
        }, 2000) // Save at most every 2 seconds
    }, [interviewId, currentQuestionIndex, answeredQuestions, remainingTime, isCallActive])

    // Load state from localStorage
    const loadState = useCallback(() => {
        if (!interviewId) return null
        
        try {
            const saved = localStorage.getItem(getStorageKey(interviewId))
            if (saved) {
                const state = JSON.parse(saved)
                // Check if state is less than 2 hours old
                if (Date.now() - state.lastUpdated < 2 * 60 * 60 * 1000) {
                    console.log('📂 Found saved interview state')
                    return state
                }
            }
        } catch (error) {
            console.error('Failed to load state:', error)
        }
        return null
    }, [interviewId])

    // Clear saved state
    const clearState = useCallback(() => {
        if (!interviewId) return
        try {
            localStorage.removeItem(getStorageKey(interviewId))
            console.log('🗑️ Interview state cleared')
        } catch (error) {
            console.error('Failed to clear state:', error)
        }
    }, [interviewId])

    // Check for saved state on mount
    useEffect(() => {
        const savedState = loadState()
        if (savedState && savedState.conversation?.length > 0) {
            setIsResuming(true)
            setConversation(savedState.conversation)
            conversationRef.current = savedState.conversation
            setCurrentQuestionIndex(savedState.currentQuestionIndex || 0)
            setAnsweredQuestions(savedState.answeredQuestions || [])
            
            // Calculate remaining time based on elapsed time
            if (savedState.startTime) {
                const elapsed = Math.floor((Date.now() - savedState.startTime) / 1000)
                const remaining = getTotalDuration() - elapsed
                setRemainingTime(Math.max(0, remaining))
                startTimeRef.current = savedState.startTime
            } else {
                setRemainingTime(savedState.remainingTime || getTotalDuration())
            }
            
            toast.info('Resuming your interview from where you left off...')
        }
    }, [loadState])

    // Save state when conversation changes (debounced)
    useEffect(() => {
        if (isCallActive && conversation.length > 0) {
            saveState()
        }
    }, [conversation, isCallActive, saveState])

    // Timer countdown
    useEffect(() => {
        if (isCallActive && timerStarted && remainingTime > 0) {
            timerRef.current = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        handleTimeUp()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isCallActive, timerStarted])

    // Handle time up
    const handleTimeUp = async () => {
        console.log('⏰ Interview time is up!')
        toast.warning('Time is up! Completing your interview...')
        
        stopRecognition()
        
        // Speak closing message
        await speak("Your interview time is up. Thank you for your responses. We will now generate your feedback.")
        
        // End interview
        completeInterview()
    }

    // Stop recognition safely
    const stopRecognition = () => {
        if (recognitionRef.current && isRecognitionRunning.current) {
            try {
                recognitionRef.current.stop()
            } catch (e) {
                // Ignore errors when stopping
            }
        }
        isRecognitionRunning.current = false
        setIsListening(false)
    }

    // Start recognition safely
    const startRecognition = () => {
        if (recognitionRef.current && !isRecognitionRunning.current && !isSpeaking) {
            try {
                recognitionRef.current.start()
                isRecognitionRunning.current = true
                setIsListening(true)
            } catch (e) {
                console.log('Recognition start error (can be ignored):', e.message)
            }
        }
    }

    // Complete the interview
    const completeInterview = () => {
        setIsCallActive(false)
        setIsListening(false)
        setIsSpeaking(false)
        setTimerStarted(false)
        onCallStatusChange?.(false)
        
        if (timerRef.current) {
            clearInterval(timerRef.current)
        }
        
        stopRecognition()
        
        if (synthRef.current) {
            synthRef.current.cancel()
        }
        
        // Clear saved state since interview is complete
        clearState()
        
        const formattedConversation = conversationRef.current
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n')
        
        onInterviewEnd?.(formattedConversation)
        toast.success('Interview completed!')
    }

    // Format time for display
    const formatTime = (seconds) => {
        if (seconds === null) return '--:--'
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Initialize Speech Recognition (only once)
    useEffect(() => {
        if (typeof window === 'undefined') return
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition()
            recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = 'en-US'
            
            recognition.onstart = () => {
                isRecognitionRunning.current = true
                setIsListening(true)
            }
            
            recognition.onresult = (event) => {
                let finalTranscript = ''
                let interimTranscript = ''
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const text = event.results[i][0].transcript
                    if (event.results[i].isFinal) {
                        finalTranscript += text
                    } else {
                        interimTranscript += text
                    }
                }
                
                setTranscript(interimTranscript || finalTranscript)
                
                if (finalTranscript) {
                    handleUserResponse(finalTranscript)
                }
            }
            
            recognition.onerror = (event) => {
                // Only log non-aborted errors
                if (event.error !== 'aborted' && event.error !== 'no-speech') {
                    console.error('Speech recognition error:', event.error)
                    if (event.error === 'not-allowed') {
                        toast.error('Microphone access denied. Please allow microphone access.')
                    }
                }
            }
            
            recognition.onend = () => {
                isRecognitionRunning.current = false
                setIsListening(false)
                // Don't auto-restart here - let speak() handle it
            }
            
            recognitionRef.current = recognition
        } else {
            toast.error('Speech recognition not supported. Please use Chrome or Edge.')
        }
        
        synthRef.current = window.speechSynthesis
        
        return () => {
            stopRecognition()
            if (synthRef.current) {
                synthRef.current.cancel()
            }
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
        }
    }, [])

    // Update conversation ref and parent
    useEffect(() => {
        conversationRef.current = conversation
        if (onConversationUpdate) {
            const formattedConversation = conversation
                .map(msg => `${msg.role}: ${msg.content}`)
                .join('\n')
            onConversationUpdate(formattedConversation)
        }
    }, [conversation, onConversationUpdate])

    // Speak text using Speech Synthesis
    const speak = useCallback((text) => {
        return new Promise((resolve) => {
            if (!synthRef.current) {
                resolve()
                return
            }
            
            // Cancel any ongoing speech
            synthRef.current.cancel()
            
            // Stop listening while speaking
            stopRecognition()
            
            setIsSpeaking(true)
            
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.rate = 1.0
            utterance.pitch = 1.0
            utterance.volume = 1.0
            
            // Try to use a natural voice
            const voices = synthRef.current.getVoices()
            const preferredVoice = voices.find(v => 
                v.name.includes('Google') || 
                v.name.includes('Samantha') || 
                v.name.includes('Microsoft Zira') ||
                (v.lang === 'en-US' && v.name.includes('Female'))
            ) || voices.find(v => v.lang === 'en-US')
            
            if (preferredVoice) {
                utterance.voice = preferredVoice
            }
            
            utterance.onend = () => {
                setIsSpeaking(false)
                // Resume listening after speaking with a delay
                if (isCallActive) {
                    setTimeout(() => {
                        startRecognition()
                    }, 500)
                }
                resolve()
            }
            
            utterance.onerror = (e) => {
                // Only log real errors, not interruptions
                if (e.error !== 'interrupted' && e.error !== 'canceled') {
                    console.error('Speech synthesis error:', e.error)
                }
                setIsSpeaking(false)
                resolve()
            }
            
            synthRef.current.speak(utterance)
        })
    }, [isCallActive])

    // Get AI response from OpenRouter
    const getAIResponse = async (userMessage) => {
        setIsProcessing(true)
        
        try {
            const questionList = interviewInfo?.interviewData?.questionList?.map(q => q.question).join('\n- ') || ''
            const currentQ = interviewInfo?.interviewData?.questionList?.[currentQuestionIndex]?.question || ''
            const nextQ = interviewInfo?.interviewData?.questionList?.[currentQuestionIndex + 1]?.question || ''
            
            const systemPrompt = `You are an AI interviewer conducting a job interview for the position of ${interviewInfo?.interviewData?.jobPosition || 'the role'}.

Current Question (#${currentQuestionIndex + 1}): ${currentQ}
Next Question: ${nextQ || 'This is the last question'}
Total Questions: ${getTotalQuestions()}
Questions Answered: ${answeredQuestions.length}
Remaining Time: ${formatTime(remainingTime)}

All Questions:
- ${questionList}

Current conversation:
${conversationRef.current.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n')}

Candidate's response: "${userMessage}"

Guidelines:
- Provide brief feedback on the answer (1-2 sentences)
- Then ask the next question naturally
- If this was the last question, thank them and say the interview is complete
- Keep responses concise for voice
- Be encouraging but professional`

            const response = await axios.post('/api/ai-interview', {
                systemPrompt,
                userMessage,
                conversationHistory: conversationRef.current.slice(-6)
            })
            
            return response.data.response
            
        } catch (error) {
            console.error('AI response error:', error)
            return "I apologize, but I'm having trouble processing. Could you please repeat that?"
        } finally {
            setIsProcessing(false)
        }
    }

    // Handle user's spoken response
    const handleUserResponse = async (userText) => {
        if (!userText.trim() || isProcessing || isSpeaking) return
        
        setTranscript('')
        stopRecognition()
        
        // Add user message
        const userMessage = { role: 'User', content: userText }
        setConversation(prev => [...prev, userMessage])
        
        // Track answered question
        if (!answeredQuestions.includes(currentQuestionIndex)) {
            setAnsweredQuestions(prev => [...prev, currentQuestionIndex])
        }
        
        // Move to next question
        setCurrentQuestionIndex(prev => prev + 1)
        
        // Get AI response
        const aiResponse = await getAIResponse(userText)
        
        // Add AI response
        const aiMessage = { role: 'AI', content: aiResponse }
        setConversation(prev => [...prev, aiMessage])
        
        // Speak the response
        await speak(aiResponse)
        
        // Check if interview should end
        const isComplete = aiResponse.toLowerCase().includes('thank you for your time') || 
            aiResponse.toLowerCase().includes('concludes our interview') ||
            aiResponse.toLowerCase().includes('interview is complete') ||
            currentQuestionIndex + 1 >= getTotalQuestions()
        
        if (isComplete) {
            setTimeout(() => {
                completeInterview()
            }, 2000)
        }
    }

    // Start the interview
    const startInterview = async () => {
        setIsCallActive(true)
        onCallStatusChange?.(true)
        
        // Initialize timer
        if (!remainingTime) {
            setRemainingTime(getTotalDuration())
        }
        startTimeRef.current = startTimeRef.current || Date.now()
        setTimerStarted(true)
        
        let greeting
        if (isResuming && conversation.length > 0) {
            greeting = `Welcome back ${interviewInfo?.userName || 'there'}! Let's continue your interview. ${
                currentQuestionIndex < getTotalQuestions() 
                    ? `Here's your next question: ${interviewInfo?.interviewData?.questionList?.[currentQuestionIndex]?.question}`
                    : "Let me wrap up your interview."
            }`
            setIsResuming(false)
        } else {
            const firstQuestion = interviewInfo?.interviewData?.questionList?.[0]?.question || 'Tell me about yourself.'
            greeting = `Hello ${interviewInfo?.userName || 'there'}! I'm your AI interviewer today for the ${interviewInfo?.interviewData?.jobPosition || 'position'} role. We have ${getTotalQuestions()} questions and ${interviewInfo?.interviewData?.interviewDuration || 30} minutes. Let's begin! ${firstQuestion}`
            
            const greetingMessage = { role: 'AI', content: greeting }
            setConversation([greetingMessage])
        }
        
        await speak(greeting)
        toast.success('Interview started! Speak clearly into your microphone.')
    }

    // Manual submit interview
    const submitInterview = async () => {
        console.log('📤 User submitted interview manually')
        toast.info('Submitting your interview...')
        
        stopRecognition()
        
        await speak("Thank you for participating in this interview. We will now generate your feedback.")
        completeInterview()
    }

    // Pause interview
    const pauseInterview = () => {
        stopRecognition()
        setIsCallActive(false)
        setTimerStarted(false)
        onCallStatusChange?.(false)
        
        if (timerRef.current) {
            clearInterval(timerRef.current)
        }
        
        if (synthRef.current) {
            synthRef.current.cancel()
        }
        
        // Force save state
        if (interviewId) {
            const state = {
                conversation: conversationRef.current,
                currentQuestionIndex,
                answeredQuestions,
                remainingTime,
                startTime: startTimeRef.current,
                isCallActive: false,
                lastUpdated: Date.now()
            }
            localStorage.setItem(getStorageKey(interviewId), JSON.stringify(state))
        }
        
        toast.info('Interview paused. You can resume anytime.')
    }

    // Toggle microphone
    const toggleMicrophone = () => {
        if (isListening) {
            stopRecognition()
        } else {
            startRecognition()
        }
    }

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Timer and Progress */}
            <div className="w-full flex flex-wrap justify-center gap-4">
                {/* Timer */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    remainingTime !== null && remainingTime < 60 
                        ? 'bg-red-100 text-red-700' 
                        : remainingTime !== null && remainingTime < 300 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                }`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-medium">{formatTime(remainingTime)}</span>
                </div>
                
                {/* Progress */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>{answeredQuestions.length}/{getTotalQuestions()} Questions</span>
                </div>
                
                {/* Status */}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isCallActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                    <div className={`w-3 h-3 rounded-full ${
                        isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`}></div>
                    {isCallActive ? 'Interview Active' : isResuming ? 'Ready to Resume' : 'Ready to Start'}
                </div>
                
                {isProcessing && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                    </div>
                )}
            </div>

            {/* Resume Notice */}
            {isResuming && !isCallActive && (
                <div className="w-full max-w-md p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800 text-center">
                        📋 We found your previous session. Click &quot;Resume Interview&quot; to continue where you left off.
                    </p>
                </div>
            )}

            {/* Speaking/Listening Status */}
            <div className="flex gap-8 items-center">
                <div className={`flex flex-col items-center p-4 rounded-xl ${
                    isSpeaking ? 'bg-blue-50 border-2 border-blue-400' : 'bg-gray-50'
                }`}>
                    <Volume2 className={`w-8 h-8 ${isSpeaking ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
                    <span className="text-sm mt-2">{isSpeaking ? 'AI Speaking...' : 'AI Ready'}</span>
                </div>
                
                <div className={`flex flex-col items-center p-4 rounded-xl ${
                    isListening ? 'bg-green-50 border-2 border-green-400' : 'bg-gray-50'
                }`}>
                    <Mic className={`w-8 h-8 ${isListening ? 'text-green-500 animate-pulse' : 'text-gray-400'}`} />
                    <span className="text-sm mt-2">{isListening ? 'Listening...' : 'Mic Off'}</span>
                </div>
            </div>

            {/* Live Transcript */}
            {transcript && (
                <div className="w-full max-w-md p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                        <span className="font-medium">You&apos;re saying: </span>
                        {transcript}
                    </p>
                </div>
            )}

            {/* Conversation Display */}
            {conversation.length > 0 && (
                <div className="w-full max-w-2xl max-h-60 overflow-y-auto bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-3">Conversation:</h3>
                    {conversation.map((msg, idx) => (
                        <div key={idx} className={`mb-2 p-2 rounded ${
                            msg.role === 'AI' ? 'bg-blue-50 text-blue-800' : 'bg-green-50 text-green-800'
                        }`}>
                            <span className="font-medium">{msg.role}: </span>
                            {msg.content}
                        </div>
                    ))}
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4">
                {!isCallActive ? (
                    <button
                        onClick={startInterview}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        {isResuming ? 'Resume Interview' : 'Start Interview'}
                    </button>
                ) : (
                    <>
                        <button
                            onClick={toggleMicrophone}
                            disabled={isSpeaking || isProcessing}
                            className={`flex items-center gap-2 px-4 py-3 rounded-full font-medium transition-colors ${
                                isListening 
                                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            } ${(isSpeaking || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                            {isListening ? 'Mute' : 'Unmute'}
                        </button>
                        
                        <button
                            onClick={submitInterview}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors"
                        >
                            <Send className="w-5 h-5" />
                            Submit Interview
                        </button>
                        
                        <button
                            onClick={pauseInterview}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-colors"
                        >
                            <PhoneOff className="w-5 h-5" />
                            Pause
                        </button>
                    </>
                )}
            </div>

            {/* Browser Support Notice */}
            <p className="text-xs text-gray-500 text-center max-w-md">
                💡 For best experience, use Chrome or Edge. Your progress is automatically saved.
            </p>
        </div>
    )
}

export default VoiceInterview
