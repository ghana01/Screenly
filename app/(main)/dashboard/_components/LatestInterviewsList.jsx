"use client"
import React,{useState} from 'react'
import { Camera, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
const LatestInterviewsList = () => {

    const [InterviewsList, setInterviewsList] = useState([])
  return (
    <div className='my-3'>
        <h2 className="font-bold text-2xl">Previously Scheduled Interviews</h2>

        {InterviewsList?.length === 0 &&
         <div className="p-5 flex flex-col items-center justify-center border border-gray-300 rounded-lg mt-5">
            <Video className="h-10 w-10 text-primary" />
            <h2 className="font-bold text-lg">No Interviews Scheduled</h2>
            <p className="text-slate-500">You have not scheduled any interviews yet. Click the button below to schedule your first interview.</p>   
            <Button className={"cursor-pointer"}>Create New Interview</Button>

            </div>}
    </div>
  )
}

export default LatestInterviewsList