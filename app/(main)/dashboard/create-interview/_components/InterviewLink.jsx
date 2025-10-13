import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
export const InterviewLink = ({formData,interview_id}) => {

    const getInterviewLink =()=>{
        const url = process.env.NEXT_PUBLIC_HOSTED_URL+'/'+interview_id
        return url;
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
             <div className='mt-3 flex  gap-3 items-center'>
                    <Input  defaultValue={getInterviewLink()} disable={true}/>
                    <Button><Copy/> Copy Link</Button>
             </div>
             <hr className='my-7'  />
             <div className='flex gap-5'>  
                <h2 className='text-medium text-gray-500 flex gap-2 items-center'><Clock className="w-4 h-4"/>{formData.interviewDuration}</h2>
                <h2 className='text-medium text-gray-500 flex gap-2 items-center'><Clock className="w-4 h-4"/>10 question</h2>
                <h2 className='text-medium text-gray-500 flex gap-2 items-center'><Calender className="w-4 h-4"/>Expires:{da}</h2>
             </div>
        </div>
          
    </div>
  )
}
