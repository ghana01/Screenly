"use client"
import React, { useEffect, useState } from 'react'
import { Video } from 'lucide-react'
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'
import InterviewCard from '@/app/(main)/dashboard/_components/InterviewCard'
import { useRouter } from 'next/navigation'

function AllInterviewPage() {
  const [InterviewsList, setInterviewsList] = useState([])
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user])

  const GetInterviewList = async () => {
    let { data: interview, error } = await supabase
      .from('interview')
      .select('*')
      .eq('userEmail', user?.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching interviews:', error)
      return
    }

    console.log(interview)
    setInterviewsList(interview || []);
  }

  return (
    <div className='my-5 px-4 max-w-7xl mx-auto'>
      <h2 className="font-bold text-3xl text-gray-800 mb-6">All Previously Scheduled Interviews</h2>

      {InterviewsList?.length === 0 ? (
        <div className="p-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl mt-5 bg-gray-50">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Video className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="font-bold text-xl text-gray-800 mb-2">No Interviews Scheduled</h2>
          <p className="text-gray-600 text-center max-w-md mb-6">
            You have not scheduled any interviews yet. Click the button below to schedule your first interview.
          </p>   
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Create New Interview
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5 gap-6'>
          {InterviewsList.map((interview, index) => (
            <InterviewCard key={interview.interview_id || index} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AllInterviewPage;