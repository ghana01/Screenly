"use client"
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/provider'
import QuestionListContainer from './QuestionListContainer'
import { v4 as uuid } from 'uuid'

const QuestionList = ({ formData, onCreateLink}) => {
    const [loading, setLoading] = React.useState(false)
    const [questionList, setQuestionList] = React.useState([])
    const [error, setError] = React.useState(null)
    const {user} = useUser()
    const [saveLoading, setSaveLoading] = React.useState(false)

    useEffect(() => {
        if (formData && Object.keys(formData).length > 0) {
            GenerateQuestionList()
        }
    }, [formData])

    const GenerateQuestionList = async () => {
        setLoading(true)
        setError(null)
        setQuestionList([])
        
        try {
            const result = await axios.post('/api/ai-model', formData)
            
            if (result.data.success) {
                let questions;
                try {
                    // Remove markdown code blocks if present
                    let cleanContent = result.data.content;
                    if (cleanContent.startsWith('```json')) {
                        cleanContent = cleanContent.replace(/```json\n/, '').replace(/\n```$/, '');
                    }
                    
                    const parsedData = JSON.parse(cleanContent)
                    questions = parsedData.interviewQuestions || []
                    
                    if (questions.length > 0) {
                        setQuestionList(questions)
                        setError(null)
                        toast.success('Questions generated successfully!')
                    } else {
                        throw new Error('No questions generated')
                    }
                    
                } catch (parseError) {
                    throw new Error('Failed to parse response')
                }
            } else {
                throw new Error(result.data.error || 'Failed to generate questions')
            }
            
        } catch (error) {
            if (questionList.length === 0) {
                const errorMessage = error.response?.data?.error || error.message || 'Server error'
                setError(errorMessage)
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
            
            console.log('🔍 Debug - Starting onFinish')
            console.log('🔍 Debug - questionList:', questionList?.length, 'questions')
            console.log('🔍 Debug - user:', user)
            console.log('🔍 Debug - user.email:', user?.email)
            
            if(!questionList || questionList.length === 0){
                setSaveLoading(false)
                toast.error('No questions available to save')
                return;
            }
            
            if(!user?.email) {
                setSaveLoading(false)
                toast.error('Please sign in to save interview')
                console.log('🔍 Debug - No user email found, returning')
                return;
            }
            
            const dataToInsert = {
                jobPosition: formData.jobPosition,
                jobDescription: formData.jobDescription,
                interviewDuration: formData.interviewDuration,
                interviewTypes: formData.interviewTypes,
                questionList: questionList,
                userEmail: user.email,
                interview_id: interview_id
            }
            
            console.log('🔍 Debug - Inserting data:', dataToInsert)
            
            const { data, error } = await supabase
                .from('interview')
                .insert([dataToInsert])
                .select()
            
            console.log('🔍 Debug - Supabase response:', { data, error })
            
            if (error) {
                console.error('Database error:', error);
                toast.error(`Database error: ${error.message}`);
                setSaveLoading(false)
            } else if (data && data.length > 0) {
                toast.success('Interview saved successfully!');
                setSaveLoading(false)
                onCreateLink(interview_id)
            } else {
                toast.error('Unexpected database response')
                setSaveLoading(false)
            }
            
        } catch (err) {
            console.error('Error:', err);
            toast.error(`Unexpected error: ${err.message}`);
            setSaveLoading(false)
        }
    }

    return (
        <div className="p-4">
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
                <Button 
                    onClick={onFinish} 
                    disabled={questionList.length === 0 || saveLoading}
                >
                    {saveLoading && <Loader2Icon className="animate-spin mr-2 h-4 w-4" />}
                    Create Interview Link && Finish
                </Button>
            </div>
        </div>
    )
}

export default QuestionList