"use client"

import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import FormContainer from './_components/FormContainer'


const CreateInterview = () => {
    const [step, setStep] = useState(1);
    const router = useRouter();
    const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    interviewDuration: '',
    interviewTypes: [] // Array to store multiple selected types
  })
  
  const onHanleInputChange =(field,value) =>{
    setFormData(prev =>({
      ...prev,
      [field]:value
    }))
    console.log(formData)

  }
    return (
        <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
            <div className='flex gap-5 items-center'>
                <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
                <h2 className="font-bold text-2xl">Create New Interview</h2>
            </div>
            
            <Progress value={step*33.33} className="my-5" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                    <FormContainer 
                    formData={formData}
                    onHanleInputChange={onHanleInputChange}
                    setFormData={setFormData}
                    />
                </div>
                <div>
                    
                </div>
            </div>
        </div>
  )
}

export default CreateInterview