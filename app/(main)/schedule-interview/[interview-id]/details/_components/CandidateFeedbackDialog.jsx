import React from 'react'
import { Award, TrendingUp, CheckCircle2, Star, X, Briefcase } from 'lucide-react'
import moment from 'moment'

const CandidateFeedbackDialog = ({ candidate, onClose }) => {
  if (!candidate) return null

  const feedback = candidate?.feedback?.feedback || candidate?.feedback || {}
  const ratings = feedback.rating || {}
  const userName = candidate?.userName || 'Candidate'
  const email = candidate?.email
  
  // Calculate overall rating
  const ratingValues = Object.values(ratings).filter(v => typeof v === 'number')
  const overallRating = ratingValues.length > 0
    ? (ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1)
    : '0.0'

  // Rating configuration with colors
  const ratingConfig = {
    technicalSkills: { label: 'Technical Skills', color: 'blue' },
    communication: { label: 'Communication', color: 'green' },
    problemSolving: { label: 'Problem Solving', color: 'purple' },
    experience: { label: 'Experience', color: 'orange' }
  }

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-700' },
      green: { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-700' },
      purple: { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-700' },
      orange: { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-700' }
    }
    return colors[color] || colors.blue
  }

  const isRecommended = feedback.Recommendation?.toLowerCase().includes('recommended') || 
                        feedback.Recommendation?.toLowerCase().includes('hire')

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        
        <div className="p-6">
          <div className="flex items-start justify-between">
            {/* Candidate Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{userName}</h2>
                <p className="text-sm text-gray-500">{email}</p>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 shadow-md">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {overallRating}
              </div>
              <div className="text-xs text-gray-600 font-medium">/ 10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Skills Assessment */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Skills Assessment
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(ratings).map(([key, value]) => {
              const config = ratingConfig[key] || { label: key, color: 'blue' }
              const colors = getColorClasses(config.color)
              
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      {config.label}
                    </span>
                    <span className={`text-xl font-bold ${colors.text}`}>
                      {value}/10
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${colors.bg} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${value * 10}%` }}
                    >
                      <div className="h-full w-full bg-gradient-to-r from-transparent to-white/30"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-600" />
            Performance Summary
          </h3>
          
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-700 leading-relaxed">
              {feedback.summery || feedback.summary || 'No summary available'}
            </p>
          </div>
        </div>

        {/* Recommendation */}
        <div className={`rounded-xl shadow-lg overflow-hidden ${
          isRecommended 
            ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300' 
            : 'bg-gradient-to-br from-orange-50 to-amber-100 border-2 border-orange-300'
        }`}>
          <div className="p-6">
            <div className="flex items-start gap-3 mb-3">
              {isRecommended ? (
                <div className="bg-green-500 rounded-full p-2 shadow-lg">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              ) : (
                <div className="bg-orange-500 rounded-full p-2 shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className={`text-xl font-bold mb-1 ${
                  isRecommended ? 'text-green-800' : 'text-orange-800'
                }`}>
                  {feedback.Recommendation || 'No recommendation'}
                </h3>
                
                {feedback.RecommendationMsg && (
                  <p className={`leading-relaxed ${
                    isRecommended ? 'text-green-700' : 'text-orange-700'
                  }`}>
                    {feedback.RecommendationMsg}
                  </p>
                )}
              </div>
            </div>

            {isRecommended && (
              <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-4">
                Proceed to Offer
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          Report generated on {moment(candidate.created_at).format('MMMM DD, YYYY [at] HH:mm')}
        </div>
      </div>
    </div>
  )
}

export default CandidateFeedbackDialog