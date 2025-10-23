"use client"
import React, { useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from '@/services/supabaseClient'
import { useUser } from '@/app/provider'
import { InterviewDetail } from "./_components/InterviewDetail"
import { Loader2 } from "lucide-react"

function InterviewDetailsPage() {
    const { 'interview-id': interview_id } = useParams();
    const { user } = useUser();
    const [interviewDetails, setInterviewDetails] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (user && interview_id) {
            GetInterviewDetails();
        }
    }, [user, interview_id])

    const GetInterviewDetails = async () => {
        try {
            setLoading(true);
            
            const { data, error } = await supabase
                .from('interview')
                .select(`
                    jobPosition,
                    jobDescription,
                    interviewDuration,
                    interview_id,
                    created_at,
                    interviewTypes,
                    questionList,
                    interview-feedback (
                        email,
                        userName,
                        feedback,
                        created_at
                    )
                `)
                .eq('interview_id', interview_id)
                .eq('userEmail', user?.email)
                .single()

            if (error) {
                console.error('Error fetching interview details:', error);
                return;
            }

            console.log('Fetched interview detail:', data);
            setInterviewDetails(data);
            
        } catch (err) {
            console.error('Unexpected error:', err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!interviewDetails) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">Interview not found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <InterviewDetail interviewDetails={interviewDetails} />
        </div>
    )
}

export default InterviewDetailsPage;