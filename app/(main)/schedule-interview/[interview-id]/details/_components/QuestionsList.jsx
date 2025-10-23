import React from 'react'
import { HelpCircle, Tag } from 'lucide-react'

const QuestionsList = ({ questions }) => {
  // Group questions by type
  const groupedQuestions = questions.reduce((acc, q) => {
    const type = q.InterviewType || 'General';
    if (!acc[type]) acc[type] = [];
    acc[type].push(q);
    return acc;
  }, {});

  const typeColors = {
    'Technical': 'bg-blue-100 text-blue-700 border-blue-300',
    'Problem Solving': 'bg-purple-100 text-purple-700 border-purple-300',
    'Experience': 'bg-green-100 text-green-700 border-green-300',
    'General': 'bg-gray-100 text-gray-700 border-gray-300'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-600" />
          Interview Questions
          <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            {questions.length}
          </span>
        </h2>
      </div>

      {/* Questions by Type */}
      <div className="p-6 space-y-6">
        {Object.entries(groupedQuestions).map(([type, typeQuestions]) => (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-gray-600" />
              <h3 className="font-semibold text-gray-800">{type}</h3>
              <span className="text-sm text-gray-500">({typeQuestions.length})</span>
            </div>
            
            <div className="space-y-3">
              {typeQuestions.map((q, idx) => (
                <div 
                  key={idx}
                  className="group p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 leading-relaxed">
                        {q.question}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium border ${typeColors[type] || typeColors['General']}`}>
                        {type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionsList