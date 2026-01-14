"use client"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Clock, Loader2Icon, Video, Info, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { toast } from 'sonner'
import { InterviewDataContext } from '@/context/InterviewDataContext'

const Interview = () => {
    const { interviewInfo, setInterviewInfo } = React.useContext(InterviewDataContext);
    const { interview_id } = useParams();
    const [interviewData, setInterviewData] = useState({});
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [checkingSubmission, setCheckingSubmission] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (interview_id) {
            GetInterviewDetail();
        }
    }, [interview_id])

    // Check if this email has already submitted
    useEffect(() => {
        const checkPreviousSubmission = async () => {
            if (!email?.trim() || !interview_id) return;
            
            setCheckingSubmission(true);
            try {
                const { data, error } = await supabase
                    .from('interview-feedback')
                    .select('id')
                    .eq('interview_id', interview_id)
                    .eq('userEmail', email.trim())
                    .limit(1);

                if (data && data.length > 0) {
                    setHasSubmitted(true);
                } else {
                    setHasSubmitted(false);
                }
            } catch (e) {
                console.error('Error checking submission:', e);
            } finally {
                setCheckingSubmission(false);
            }
        };

        // Debounce the check
        const timer = setTimeout(checkPreviousSubmission, 500);
        return () => clearTimeout(timer);
    }, [email, interview_id])

    const GetInterviewDetail = async () => {
        try {
            setLoading(true)
            let { data: interview, error } = await supabase
                .from('interview')
                .select("jobPosition, jobDescription, interviewDuration, interviewTypes")
                .eq('interview_id', interview_id)

            console.log('Database response:', interview)

            if (interview && interview.length > 0) {
                setInterviewData(interview[0])
                console.log('Interview data set:', interview[0])
            } else {
                toast.error('Incorrect Interview link')
                setInterviewData({})
            }
        } catch (e) {
            console.error('Error:', e)
            toast.error('Incorrect Interview link')
            setInterviewData({})
        } finally {
            setLoading(false)
        }
    }

    const onJoinInterview = async () => {
        // CHANGED: Added validation for both fields
        if (!userName?.trim() || !email?.trim()) {
            toast.error('Please enter your name and email')
            return
        }

        setLoading(true)
        try {
            let { data: interview, error } = await supabase
                .from('interview')
                .select('*')
                .eq('interview_id', interview_id)

            if (error || !interview?.[0]) {
                toast.error('Interview not found')
                setLoading(false)
                return
            }

            console.log(interview[0])
            setInterviewInfo({
                userEmail: email,
                userName: userName,
                interviewData: interview[0]
            })
            router.push('/interview/' + interview_id + '/start')
        } catch (e) {
            console.error('Error joining interview:', e)
            toast.error('Failed to join interview')
        } finally {
            setLoading(false)
        }
    }

    // CHANGED: Show loading state
    if (loading && !interviewData?.jobPosition) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className='px-10 md:px-28 lg:px-48 xl:px-64 mt-16 mb-20'>
            <div className='flex flex-col items-center justify-center border rounded-xl bg-white p-7 lg:px-32 xl:px-54'>
                <Image src='/logo.png' alt='logo' width={200} height={100} className='w-[140px]' />
                <h2 className='mt-3'>AI-POWERED INTERVIEW PLATFORM</h2>
                <Image src={"/interview.jpg"} alt='interview' width={500} height={400} className='w-[300px] my-6' />
                <h2 className='font-bold text-xl'>{interviewData?.jobPosition}</h2>
                <h2 className='flex gap-2 items-center text-gray-500 mt-3'>
                    <Clock /> {interviewData?.interviewDuration} Minutes
                </h2>

                <div className='w-full mt-5'>
                    <h2 className='font-medium'>ENTER YOUR FULL NAME</h2>
                    <Input 
                        placeholder='Your Full Name' 
                        className='mt-2'
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                </div>
                <div className='w-full mt-4'>
                    <h2 className='font-medium'>ENTER EMAIL</h2>
                    <Input 
                        placeholder='Your Email eg: yourname@gmail.com' 
                        className='mt-2'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className='p-3 bg-blue-100 flex gap-4 rounded-2xl mt-5'>
                <Info className='text-primary h-5 w-5 flex-shrink-0 mt-1' />
                <div>
                    <h2 className='font-bold'>Before you begin</h2>
                    <ul className='list-disc px-5 mt-3 text-gray-500'>
                        <li className='text-sm'>Ensure you are in a quiet environment</li>
                        <li className='text-sm'>Test your microphone and camera</li>
                        <li className='text-sm'>Have a stable internet connection</li>
                        <li className='text-sm'>Be prepared to answer questions about your resume and experience</li>
                    </ul>
                </div>
            </div>

            {/* Already Submitted Message */}
            {hasSubmitted && (
                <div className='p-4 bg-green-100 border border-green-300 flex gap-4 rounded-2xl mt-5'>
                    <CheckCircle className='text-green-600 h-6 w-6 flex-shrink-0 mt-1' />
                    <div>
                        <h2 className='font-bold text-green-800'>Interview Already Completed</h2>
                        <p className='text-green-700 text-sm mt-1'>
                            You have already submitted your interview for this position. 
                            Thank you for your participation!
                        </p>
                    </div>
                </div>
            )}

            <Button 
                className="mt-5 w-full font-bold"
                disabled={loading || !userName?.trim() || !email?.trim() || hasSubmitted || checkingSubmission}
                onClick={onJoinInterview}
            >
                {checkingSubmission ? (
                    <>
                        <Loader2Icon className="animate-spin mr-2" />
                        Checking...
                    </>
                ) : hasSubmitted ? (
                    <>
                        <CheckCircle className="mr-2" />
                        Already Submitted
                    </>
                ) : (
                    <>
                        <Video className="mr-2" />
                        {loading && <Loader2Icon className="animate-spin mr-2" />}
                        Join Interview
                    </>
                )}
            </Button>
        </div>
    )
}

export default Interview