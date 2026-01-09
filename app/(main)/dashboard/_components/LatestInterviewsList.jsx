"use client"
import React, { useEffect, useState } from 'react'
import { Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import InterviewCard from './InterviewCard'
import Link from 'next/link'
import { toast } from 'sonner'

const LatestInterviewsList = () => {
    const [InterviewsList, setInterviewsList] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useUser();

    useEffect(() => {
        // Only fetch if user exists
        if (user?.email) {
            GetInterviewList();
        } else {
            setLoading(false);
        }
    }, [user])

    const GetInterviewList = async () => {
        try {
            setLoading(true)
            
            const { data: interviews, error } = await supabase
                .from('interview')
                .select(`
                    *,
                    interview-feedback (email, userName)
                `)
                .eq('userEmail', user?.email)
                .order('created_at', { ascending: false })
                .limit(6)

            if (error) {
                console.error('Error fetching interviews:', error)
                toast.error('Failed to load interviews')
                setInterviewsList([])
                return
            }

            setInterviewsList(interviews || []);
        } catch (err) {
            console.error('Unexpected error:', err)
            toast.error('Something went wrong')
            setInterviewsList([])
        } finally {
            setLoading(false)
        }
    }

    // CHANGED: Show loading skeleton while fetching
    if (loading) {
        return (
            <div className='my-5'>
                <h2 className="font-bold text-2xl">Previously Scheduled Interviews</h2>
                <div className="flex items-center justify-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    return (
        <div className='my-5'>
            <h2 className="font-bold text-2xl">Previously Scheduled Interviews</h2>

            {InterviewsList?.length === 0 ? (
                <div className="p-5 flex flex-col items-center justify-center border border-gray-300 rounded-lg mt-5 bg-white">
                    <Video className="h-10 w-10 text-primary" />
                    <h2 className="font-bold text-lg">No Interviews Scheduled</h2>
                    <p className="text-slate-500">You have not scheduled any interviews yet. Click the button below to schedule your first interview.</p>
                    <Link href="/dashboard/create-interview">
                        <Button className="mt-3 cursor-pointer">Create New Interview</Button>
                    </Link>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-5 gap-5'>
                    {InterviewsList.map((interview, index) => (
                        <InterviewCard key={interview.interview_id || index} interview={interview} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default LatestInterviewsList