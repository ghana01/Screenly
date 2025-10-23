import React from 'react'
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Users,
  FileText,
  Tag
} from 'lucide-react'
import moment from 'moment'
import CandidateList from './CandidateList'
import QuestionsList from './QuestionsList'

export const InterviewDetail = ({ interviewDetails }) => {
  if (!interviewDetails) return null;

  const candidatesCount = interviewDetails['interview-feedback']?.length || 0;
  const completedCandidates = interviewDetails['interview-feedback']?.filter(
    f => f.feedback
  ).length || 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="p-6">
          {/* Title and Status */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {interviewDetails.jobPosition}
                  </h1>
                  <p className="text-sm text-gray-500">Interview Details</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Active</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-semibold text-gray-800">{interviewDetails.interviewDuration} Minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-500">Created On</p>
                <p className="font-semibold text-gray-800">
                  {moment(interviewDetails.created_at).format('MMM DD, YYYY')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <Tag className="h-5 w-5 text-pink-600" />
              <div>
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-semibold text-gray-800">
                  {interviewDetails.interviewTypes?.join(' + ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-500">Candidates</p>
                <p className="font-semibold text-gray-800">{candidatesCount}</p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Job Description
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {interviewDetails.jobDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Interview Questions Section */}
      <QuestionsList questions={interviewDetails.questionList || []} />

      {/* Candidates Section */}
      <CandidateList 
        candidates={interviewDetails['interview-feedback'] || []} 
        interviewId={interviewDetails.interview_id}
      />
    </div>
  )
}