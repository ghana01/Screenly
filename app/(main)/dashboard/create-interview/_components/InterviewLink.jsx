import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import {Copy} from "lucide-react"
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { Slack } from 'lucide-react' 
import { MessageCircle } from 'lucide-react'
import { Clock } from 'lucide-react'
import { Calendar } from 'lucide-react' 
import { ArrowLeft } from 'lucide-react'
import { Plus } from 'lucide-react'
import {toast} from "sonner"
import Link from 'next/link'

export const InterviewLink = ({formData,interview_id}) => {

    const getInterviewLink =()=>{
        const url = process.env.NEXT_PUBLIC_HOSTED_URL+'/'+interview_id
        return url;
    }

    // Add this function to calculate expiry date
    const getExpiryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 30); // Add 30 days
        return date.toLocaleDateString(); // Format: MM/DD/YYYY
    }
    const onCopyLink = async () => {
      await navigator.clipboard.writeText(getInterviewLink());
      toast.success('Link copied to clipboard!');
    }

  return (
    <div className='flex items-center justify-center flex-col mt-10'>
        <Image src="/check.png" alt="Success" width={100} height={100} className='mx-auto  '/>
        <h2 className='text-2xl font-bold text-center mt-4'>Interview Created Successfully!</h2>
        <p className='text-center mt-4'>Your interview "{formData.interviewTitle}" has been created.</p>  
        <p className='text-center mt-2'>Share this link with your candidates:</p>
        <div className='w-full p-7 mt-5 rounded-xl bg-white'>   
             <div className='flex items-center justify-between'>
                <h2 className="fond-bold"> Interview Link   </h2>
                <h2 className='pl-1 px-2 text-primary bg-blue-50 rounded-2xl'>Valid for 30 Day</h2>
             </div>
             <div className='mt-3 flex  gap-3 items-center cursor-pointer'>
                    <Input  defaultValue={getInterviewLink()} disabled={true}/>
                    <Button  onClick={() =>onCopyLink()}><Copy/> Copy Link</Button>
             </div>
             <hr className='my-7'  />
             <div className='flex gap-5'>  
                <h2 className='text-medium text-gray-500 flex gap-2 items-center'><Clock className="w-4 h-4"/>{formData.interviewDuration}</h2>
                <h2 className='text-medium text-gray-500 flex gap-2 items-center'><Clock className="w-4 h-4"/>10 question</h2>
                <h2 className='text-medium text-gray-500 flex gap-2 items-center'><Calendar className="w-4 h-4"/>Expires: {getExpiryDate()}</h2>
             </div>   
        </div>
        <div className='mt-5 bg-white p-5 rounded-lg w-full '>
               <h2>share Via</h2>
               <div className='flex justify-between items-center'>
                  <Button variant={'outline'} ><Mail/>Email</Button>
                  <Button variant={'outline'}><Slack/>Slack</Button>
                  <Button variant={'outline'}><MessageCircle/>WhatsApp</Button>
               </div>
             </div>
             <div  className="mt-5 flex gap-3 items-center justify-between w-full">
              <Link href={'/dashboard'}>
                   <Button  variant={'outline'}><ArrowLeft/>Back to Dashboard</Button>
                   
              </Link>
              <Link href={'/create-interview'}>
                   <Button><Plus/>Create  Another Interview</Button>
              </Link>
             
             </div>
    </div>
  )
}