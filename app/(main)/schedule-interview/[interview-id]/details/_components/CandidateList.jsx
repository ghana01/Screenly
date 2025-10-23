import React, { useState } from 'react'
import { Users, Calendar, Mail, FileCheck, Clock, X } from 'lucide-react'
import moment from 'moment'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import CandidateFeedbackDialog from './CandidateFeedbackDialog'

const CandidateList = ({ candidates, interviewId }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getStatusConfig = (feedback) => {
    if (feedback?.feedback) {
      return {
        label: 'Completed',
        color: 'bg-green-100 text-green-700 border-green-300',
        dotColor: 'bg-green-500'
      };
    }
    return {
      label: 'Pending',
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      dotColor: 'bg-orange-500'
    };
  };

  const getRating = (candidate) => {
    const feedbackData = candidate?.feedback?.feedback || candidate?.feedback;
    
    if (!feedbackData?.rating) {
      return null;
    }

    const ratings = feedbackData.rating;
    const values = Object.values(ratings).filter(v => typeof v === 'number');
    
    if (values.length === 0) {
      return null;
    }

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return avg.toFixed(1);
  };

  const handleViewReport = (candidate) => {
    setSelectedCandidate(candidate)
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="h-6 w-6 text-purple-600" />
              Candidates
              <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                {candidates.length}
              </span>
            </h2>
          </div>
        </div>

        {/* Candidates List */}
        <div className="p-6">
          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No candidates yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Share the interview link to invite candidates
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((candidate, idx) => {
                const status = getStatusConfig(candidate);
                const rating = getRating(candidate);

                return (
                  <div 
                    key={idx}
                    className="group p-5 bg-gradient-to-br from-white to-gray-50 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Candidate Info */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {candidate.userName?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 h-4 w-4 ${status.dotColor} rounded-full border-2 border-white`}></div>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {candidate.userName || 'Anonymous User'}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              <span>{candidate.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{moment(candidate.created_at).format('MMM DD, YYYY')}</span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${status.color}`}>
                              <div className={`h-1.5 w-1.5 ${status.dotColor} rounded-full`}></div>
                              {status.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rating & Actions */}
                      <div className="flex flex-col items-end gap-2">
                        {rating && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                            <FileCheck className="h-4 w-4 text-blue-600" />
                            <span className="font-bold text-blue-700">{rating}/10</span>
                          </div>
                        )}

                        {candidate.feedback && (
                          <button 
                            onClick={() => handleViewReport(candidate)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            View Report
                          </button>
                        )}

                        {!candidate.feedback && (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 rounded-lg text-xs text-orange-600">
                            <Clock className="h-3 w-3" />
                            <span>Scheduled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {/* ✅ Added VisuallyHidden DialogTitle for accessibility */}
          <VisuallyHidden>
            <DialogTitle>
              Candidate Feedback Report - {selectedCandidate?.userName || 'Candidate'}
            </DialogTitle>
          </VisuallyHidden>
          
          <CandidateFeedbackDialog 
            candidate={selectedCandidate} 
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CandidateList