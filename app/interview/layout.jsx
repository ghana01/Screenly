"use client"
import { InterviewDataContext } from "@/context/InterviewDataContext"
import InterviewHeader from "./_components/interviewHeader"
import React from 'react'

// Change from named export to default export
export default function InterviewLayout({children}) {
    const [interviewInfo, setInterviewInfo] = React.useState();
  return (
    <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
      <div className="bg-secondary">
        <InterviewHeader />
        {children}
      </div>
    </InterviewDataContext.Provider>
  )
}
    

