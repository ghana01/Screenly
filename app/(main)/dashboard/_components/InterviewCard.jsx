import moment from 'moment/moment';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Send, Calendar, Clock, Briefcase } from 'lucide-react';
import {toast} from "sonner"
const InterviewCard = ({ interview, viewDetail }) => {
    const url =process.env.NEXT_PUBLIC_HOSTED_URL +'/interview/'+interview?.interview_id
    const copyLink =() =>{
        
        navigator.clipboard.writeText(url);
        toast('copied')
    }
    // here  i want to send the interview link to the candidate mail id
    const onSend = () =>{
    window.location.href ="mailto:ghanshanyam@gmail.com?subject=AI Interview Link&body=interview LINK" +url  
        toast('sent')
    }
  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          {/* Icon Circle with gradient */}
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          {/* Date Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {moment(interview.created_at).format('DD/MM/YYYY')}
            </span>
          </div>
        </div>

        {/* Job Position */}
        <h2 className="font-bold text-xl text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {interview?.jobPosition}
        </h2>
        
        {/* Interview Details */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {interview?.interviewDuration} mins
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg">
            <span className="text-sm font-medium text-purple-700">
              {interview?.interviewTypes || 'Technical'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full">   
          <Button onClick={copyLink}
            variant="outline" 
            className="flex-1 group/btn hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <Copy className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Copy Link
          </Button>
          <Button  onClick={onSend}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Send className="h-4 w-4 mr-2" />
            Send LINK     {/* i want to send th mail  interview link to the interview mail onClick={onSend} */}
          </Button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:h-1.5 transition-all duration-300"></div>
    </div>
  );
}  

export default InterviewCard;