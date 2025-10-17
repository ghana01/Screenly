"use client"
import { Info, Phone, Timer } from "lucide-react"
import React, { useEffect } from 'react'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { Mic } from "lucide-react"
import Image from "next/image"
import Vapi from '@vapi-ai/web';
import AlertConformation from "./_components/AlertConformation"
import { toast } from "sonner"

const StartInterview = () => {
    const { interviewInfo, setInterviewInfo} = React.useContext(InterviewDataContext);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY); // Add NEXT_PUBLIC_ prefix
    const [activeUser, setActiveUser] = React.useState(false);
    useEffect(() => {
        if (interviewInfo) {
            startCall();
        }
    }, [interviewInfo])

    const startCall = async() => {
        let questionList = '';
        interviewInfo?.interviewData?.questionList?.forEach((item, index) => {
            questionList = item?.question + ',' + questionList
        })
        console.log('questions', questionList)

        const assistantOptions = {
            name: "AI Recruiter",
            firstMessage: "Hi " + interviewInfo?.userName + ", how are you? Ready for your interview on " + interviewInfo?.interviewData?.jobPosition + "?",
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
            Your job is to ask candidates provided interview questions, assess their responses.
            Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
            "Hey there! Welcome to your ${interviewInfo?.interviewData?.jobPosition} interview. Let's get started with a few questions!"
            Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
            Questions: ${questionList}
            If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
            "Need a hint? Think about how React tracks component updates!"
            Provide brief, encouraging feedback after each answer. Example:
            "Nice! That's a solid answer."
            "Hmm, not quite! Want to try again?"
            Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
            After 5–7 questions, wrap up the interview smoothly by summarizing their performance. Example:
            "That was great! You handled some tough questions well. Keep sharpening your skills!"
            End on a positive note:
            "Thanks for chatting! Hope to see you crushing projects soon!"
            Key Guidelines:
            ✅ Be friendly, engaging, and witty
            ✅ Keep responses short and natural, like a real conversation
            ✅ Adapt based on the candidate's confidence level
            ✅ Ensure the interview remains focused on the job position
            `.trim(),
                    },
                ],
            },
        };
        
        try {
            vapi.start(assistantOptions);
        } catch (error) {
            console.error('Error starting interview:', error);
        }
    }

    const stopInterview = () => {
        try {
            vapi.stop();
        } catch (error) {
            console.error('Error stopping interview:', error);
        }
    }
    vapi.on('call-start', () => {
        console.log('Assitant call started')
        toast('Interview Started')
        
    });
    
    vapi.on('speech-start', () => {
        console.log('Assitant speech started')
        setActiveUser(false)
    });
    vapi.on('speech-end', () => {
        console.log('Assitant speech ended')
        setActiveUser(true)
    })
    vapi.on('call-end', () => {
        console.log('Assitant call ended')
        toast('Interview Ended')
    })

    return (
        <div className="p-20 lg:px-48 xl:px-56">
            <h2 className="font-bold text-xl flex justify-between">AI Interview Session {/* Fixed: test-xl → text-xl */}
                <span className="flex gap-2 items-center">
                    <Timer/> {interviewInfo?.interviewData?.interviewDuration} mins | <Info className='inline mb-1'/> {interviewInfo?.interviewData?.interviewTypes}
                </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
                <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
                    <div className="relative">   
                      { !activeUser &&<span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping"/>}
                        <Image src={"/ai-interviewer.jpg"} alt='ai-interviewer' width={100} height={100} 
                         className='w-[60px] h-[60px] rounded-full object-cover'/>
                    </div>
                    
                    <h2>AI Recruiter</h2>
                </div>
            
                <div className="bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center">
                    <div className="relative">
                    { activeUser &&<span className="absolute inset-0 rounded-full bg-green-500 opacity-75 animate-ping"/>}
                         <Image src={"/student.jpeg"} alt='student' width={100} height={100} 
                          className='w-[60px] h-[60px] rounded-full object-cover'/>
                    </div>
                   
                    <h2>{interviewInfo?.userName}</h2>
                </div>
            </div>
            
            <div className="flex items-center gap-5 justify-center mt-3">
                <Mic className="h-12 w-12 p-3 bg-gray-300 rounded-full cursor-pointer hover:bg-gray-400 transition-all duration-200"/>
                <AlertConformation stopCall={() => stopInterview()}>
                    <Phone className="h-12 w-12 p-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 text-white ml-5 transition-all duration-200"/>
                </AlertConformation>
            </div>
            <h2 className="text-center mt-5 text-gray-500">Interview in progress...</h2>
        </div>
    )
}

export default StartInterview