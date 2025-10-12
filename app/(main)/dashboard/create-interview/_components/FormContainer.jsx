"use client"
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

import React, { useState, useEffect } from 'react'
import {InterviewType} from '@/services/Constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'


const FormContainer = ({formData, onHanleInputChange, setFormData}) => {
 
  
  // Local form state (synchronized with context)
  
  
  

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-300 shadow-sm">
      {/* Job Position */}
      <div>
        <h2 className="text-sm font-medium">Job Position</h2>
        <Input 
          placeholder="eg: Full stack Developer" 
          className={`mt-2 `}
          value={formData.jobPosition}
          onChange={(e) => onHanleInputChange('jobPosition', e.target.value)}
         
        />
        
      </div>

      {/* Job Description */}
      <div className='mt-5'>
        <h2 className="text-sm font-medium">Job Description</h2>
        <Textarea 
          placeholder="eg: Responsible for developing applications..." 
          className={`mt-2 h-[200px] `}
          value={formData.jobDescription}
          onChange={(e) => onHanleInputChange('jobDescription', e.target.value)}
          
        />
        
      </div>

      {/* Interview Duration */}
      <div className='mt-5'>
        <h2 className="text-sm font-medium">Interview Duration</h2>
        <Select 
          value={formData.interviewDuration}
          onValueChange={(value) => onHanleInputChange('interviewDuration', value)}
          
        >
          <SelectTrigger className={`w-full `}>
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 Minutes</SelectItem>
            <SelectItem value="30">30 Minutes</SelectItem>
            <SelectItem value="45">45 Minutes</SelectItem>
            <SelectItem value="60">60 Minutes</SelectItem>
          </SelectContent>
        </Select>
        
      </div>

            {/* Interview Types - Multiple Selection */}
            <div className='mt-5'>
                <h2 className="text-sm font-medium">Interview Type</h2>
                <p className="text-xs text-gray-500 mt-1">Select multiple types (click to toggle)</p>
            <div className='flex gap-3 flex-wrap mt-2'>
        {InterviewType.map((type, index) => {
            const isSelected = formData.interviewTypes.includes(type.title);
            return (
            <div
                key={index}
                className={`flex gap-2 p-2 px-4 items-center cursor-pointer border rounded-2xl transition-all duration-200 
                ${isSelected ? 'bg-blue-100 border-blue-500' : 'hover:bg-blue-100'}
                `}
                onClick={() => {
                const updatedTypes = isSelected
                    ? formData.interviewTypes.filter(t => t !== type.title)
                    : [...formData.interviewTypes, type.title];
                onHanleInputChange('interviewTypes', updatedTypes);
                }}
            >
                <type.icon className='h-4 w-4' />
                <span className="text-sm">{type.title}</span>
            </div>
            );
        })}
        </div>

   
    </div>

    

      

      {/* Generate Button */}
      <div className='mt-5 flex justify-end'>
        <Button >
          
          
        
         Generate Questions <ArrowRight className='ml-2' />
         
        </Button>
      </div>

      
    </div>
  )
}

export default FormContainer