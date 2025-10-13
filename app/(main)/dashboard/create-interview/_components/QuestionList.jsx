"use client"
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react'
import React, { use, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/provider'
import QuestionListContainer from './QuestionListContainer'
import { v4 as uuid } from 'uuid'
const QuestionList = ({ formData, onCreateLink}) => {
    const [loading, setLoading] = React.useState(false)
    const [questionList, setQuestionList] = React.useState([])
    const [error, setError] = React.useState(null)
   const {user} =useUser()
   const [saveLoading,setSaveLoading] = React.useState(false)
    useEffect(() => {
        if (formData && Object.keys(formData).length > 0) {
            GenerateQuestionList()
        }
    }, [formData])

    const testAPI = async () => {
        try {
            console.log("Testing API connection...")
            const result = await axios.post('/api/test', formData)
            console.log('Test API Response:', result.data)
            toast.success('API connection successful!')
        } catch (error) {
            console.error('Test API Error:', error)
            toast.error('API connection failed')
        }
    }

   const GenerateQuestionList = async () => {
    setLoading(true)
    setError(null) // Clear any previous errors
    setQuestionList([]) // Clear previous questions
    
    console.log('Sending form data:', formData)
    
    try {
        const result = await axios.post('/api/ai-model', formData)
        
        console.log('API Response:', result.data)
        
        if (result.data.success) {
            // Try to parse the content as JSON (if it's a JSON string)
            let questions;
            try {
                // Remove markdown code blocks if present
                let cleanContent = result.data.content;
                if (cleanContent.startsWith('```json')) {
                    cleanContent = cleanContent.replace(/```json\n/, '').replace(/\n```$/, '');
                }
                
                const parsedData = JSON.parse(cleanContent)
                console.log('Parsed data:', parsedData)
                
                // Extract the array from the parsed JSON
                questions = parsedData.interviewQuestions || []
                console.log('Questions array:', questions)
                
                // Only set questions if we have valid data
                if (questions.length > 0) {
                    setQuestionList(questions)
                    setError(null) // Clear any errors on success
                    toast.success('Questions generated successfully!')
                } else {
                    throw new Error('No questions generated')
                }
                
            } catch (parseError) {
                console.log('Parse error:', parseError)
                throw new Error('Failed to parse response')
            }
        } else {
            throw new Error(result.data.error || 'Failed to generate questions')
        }
        
    } catch (error) {
        console.log('Error generating questions:', error)
        console.log('Error response:', error.response?.data)
        
        // Only set error if we don't have questions already
        if (questionList.length === 0) {
            const errorMessage = error.response?.data?.error || error.message || 'Server error'
            const errorDetails = error.response?.data?.details || ''
            
            setError(`${errorMessage}${errorDetails ? ': ' + errorDetails : ''}`)
            toast.error(`Error: ${errorMessage}`)
        }
    } finally {
        setLoading(false)
    }
}

const onFinish = async() => {

    try {
        const interview_id = uuid();
        setSaveLoading(true)
        if(!questionList || questionList.length ===0){
            console.log('No questions to save')
            return;
        }
        
        const { data, error } = await supabase
            .from('interview')
            .insert([
                { 
                    ...formData,
                    questionList: questionList,
                    userEmail: user?.email,
                    interview_id: interview_id
                },
            ])
            .select()
            setSaveLoading(false)

            onCreateLink(interview_id)
        
        if (error) {
            console.error('Database error:', error);
            toast.error('Failed to save interview');
        } else {
            console.log('Inserted data:', data);
            toast.success('Interview saved successfully!');
        }
        
    } catch (err) {
        console.error('Error saving interview:', err);
        toast.error('Failed to save interview');
    }
}


    return (
        <div className="p-4">
            {/* Debug section */}
           

            {loading && (
                <div className='p-5 bg-blue-100 rounded-xl border-primary flex gap-5 items-center'>
                    <Loader2Icon className="animate-spin mr-2 h-4 w-4" />
                    <div>
                        <h2 className='font-medium'>Generating Questions...</h2>
                        <p className='text-primary'>Our AI is crafting personalized questions based on your job position and description.</p>
                    </div>
                </div>
            )}

            {error && (
                <div className='p-5 bg-red-100 rounded-xl border-red-500'>
                    <div>
                        <h2 className='font-medium text-red-700'>Error</h2>
                        <p className='text-red-600 text-sm'>{error}</p>
                        <button 
                            onClick={GenerateQuestionList}
                            className='mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm'
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {questionList && !loading && !error && (
                <div>
                    <QuestionListContainer questionList={questionList} />
                </div>
                
            )}
            <div className='mt-5 flex justify-end'>

                <Button onClick={onFinish} disabled={questionList.length === 0 || saveLoading}
                {...saveLoading && <Loader2Icon className="animate-spin mr-2 h-4 w-4" />}
                >Create Interview Link  && Finish</Button>
            </div>
        </div>
    )
}

export default QuestionList