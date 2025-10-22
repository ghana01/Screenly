"use client"
import React,{useEffect, useState} from 'react'
import { Camera, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import InterviewCard from './InterviewCard'
const LatestInterviewsList = () => {

    const [InterviewsList, setInterviewsList] = useState([])
    const {user} =useUser();
    useEffect(() =>{
        GetInterviewList();
    },[user])
    const GetInterviewList = async () => {

      let { data: interview, error } = await supabase
        .from('interview')
        .select('*')
        .eq('userEmail', user?.email)
        .order('created_at', { ascending: false })
        .limit(6)

        console.log(interview)
      setInterviewsList(interview);
    }
    
  return (
    <div className='my-5'>
        <h2 className="font-bold text-2xl">Previously Scheduled Interviews</h2>

        {InterviewsList?.length === 0 &&
         <div className="p-5 flex flex-col items-center justify-center border border-gray-300 rounded-lg mt-5">
            <Video className="h-10 w-10 text-primary" />
            <h2 className="font-bold text-lg">No Interviews Scheduled</h2>
            <p className="text-slate-500">You have not scheduled any interviews yet. Click the button below to schedule your first interview.</p>   
            <Button className={"cursor-pointer"}>Create New Interview</Button>

            </div>}
            {InterviewsList &&
              <div className='grid grid-cols-2 mt-5 xl:grid-cols-3 gap-5'>
                {InterviewsList.map((interview,index) =>(
                   <InterviewCard key={index} interview={interview} />
                        
                ))}
              </div>
            }
    </div>
  )
}

export default LatestInterviewsList