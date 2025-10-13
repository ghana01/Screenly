"use client"

import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import {toast} from "sonner"
import {InterviewLink} from './_components/InterviewLink'

const CreateInterview = () => {
    const [step, setStep] = useState(3);
    const router = useRouter();
    const [formData, setFormData] = useState({
    jobPosition: '',
    jobDescription: '',
    interviewDuration: '',
    interviewTypes: [] // Array to store multiple selected types
  })

  const [interviewId,setInterviewId] = useState()
  
  const onHanleInputChange =(field,value) =>{
    setFormData(prev =>({
      ...prev,
      [field]:value
    }))
    console.log(formData)

  }
  const onGoToNext = () =>{
       if(!formData?.jobPosition || !formData?.jobDescription || !formData?.interviewDuration || !formData?.interviewTypes.length){
        toast('please enter all the details asked')
        return;
       }
       setStep(step+1);
  }
  const onCreateLink = (interview_id) =>{
    setInterviewId(interview_id)
    setStep(step+1)
  }
  
    return (
        <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56 w-full items-center'>
            <div className='flex gap-5 items-center'>
                <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
                <h2 className="font-bold text-2xl">Create New Interview</h2>
            </div>
            
          <Progress value={step*33.33} className="my-5" />
            
            
          {step ===1?<FormContainer 
          formData={formData}
          onHanleInputChange={onHanleInputChange}
          setFormData={setFormData}
          GoToNext={onGoToNext}
          />:step===2?<QuestionList formData={formData} onCreateLink={(interview_id)=>onCreateLink(interview_id)} />:
          step===3?<InterviewLink  interview_id={interviewId}
          formData={formData}
          />:null}
                
                
                    
                
            
        </div>
  )
}

export default CreateInterview