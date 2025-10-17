"use client"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' // Missing
import { Clock, Loader2Icon, Video } from 'lucide-react' // Missing Clock and Video
import Image from 'next/image' // Missing
import { Info } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { InterviewDataContext } from '@/context/InterviewDataContext'

const Interview = () => {
    const {interviewInfo, setInterviewInfo} = React.useContext(InterviewDataContext);
    const {interview_id} =  useParams();
    console.log(interview_id)
    const [interviewData,setInterviewData] = React.useState({});
    const [userName,setUserName] = React.useState();
    const [loading,setLoading] = React.useState(false);
    const Router = useRouter();
    

      useEffect(()=>{
       interview_id && GetInterviewDetail();
      },[interview_id])
    const GetInterviewDetail = async () => {
    try {
        setLoading(true)
        let { data: interview, error } = await supabase
            .from('interview')
            .select("jobPosition, jobDescription, interviewDuration, interviewTypes")
            .eq('interview_id', interview_id)
        
        console.log('Database response:', interview) // Add this to debug
        
        if (interview && interview.length > 0) {
            setInterviewData(interview[0])
            console.log('Interview data set:', interview[0])
        } else {
            toast('Incorrect Interview link')
            setInterviewData({}) // Keep it as empty object
        }
        
        setLoading(false) // Always set loading to false
        
    } catch(e) {
        console.error('Error:', e) // Add this to see actual error
        setLoading(false)
        toast('Incorrect Interview link')
        setInterviewData({})
    }
}
    const onJoinInterview = async()=>{
        setLoading(true)
        let { data: interview, error } = await supabase
            .from('interview')
            .select('*')
            .eq('interview_id', interview_id)
            console.log(interview[0])
            setInterviewInfo({
                userName:userName,
                interviewData:interview[0]
            })
            Router.push('/interview/'+interview_id+'/start')
            setLoading(false)
    }
  return (
    <div className='px-10 md:px-28 lg:px-48 xl:px-64 mt-16 mb-20'>

        <div  className='flex flex-col items-center justify-center border rounded-xl bg-white p-7 lg:px-32 xl:px-54'>
             <Image src='/logo.png' alt='logo' width={200} height={100} className='w-[140px] h-[140px]'/>

             <h2 className='mt-3'>AI-POWERED INTERVIEW PLATFORM</h2>

        <Image  src={"/interview.jpg"} alt='interview' width={500} height={400} className='w-[300px] my-6'/>
        <h2 className='font-bold text-xl '>{interviewData.jobPosition}</h2>
        <h2 className='flex  gap-2 items-center text-gray-500 mt-3'><Clock/> {interviewData.interviewDuration} Minutes</h2>

        <div className='w-full'>
            <h2>ENTER YOUR FULL NAME</h2>
            <Input placeholder='Your Full Name' className='mt-3'
            onChange={(e)=>setUserName(e.target.value)}
            />
        </div>
                    
        </div>
        <div className='p-3 bg-blue-100 flex gap-4 rounded-2xl '>
             <Info className='text-primary h-5 w-5'/>
             <div>
            <h2 className='font-bold'>Before you begin</h2>
            <ul className='list-disc px-5 mt-3 text-gray-500'>
                <li className='text-sm text-primary'>Ensure you are in a quiet environment</li>
                <li className='text-sm text-primary'>Test your microphone and camera</li>
                <li className='text-sm text-primary'>Have a stable internet connection</li>
                <li className='text-sm text-primary'>Be prepared to answer questions about your resume and experience</li>
            </ul>

        </div>
        </div>
        <Button className="mt-5 w-full bg-primary text-white font-bold"
        disabled={loading || !userName}
        onClick={()=>onJoinInterview()}
        > <Video/>{loading && <Loader2Icon  />}  Join Interview</Button>
       
        

    </div>
  )
}

export default Interview