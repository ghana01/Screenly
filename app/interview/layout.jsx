"use client"
import { InterviewDataContext } from "@/context/InterviewDataContext"
// CHANGED: Fixed import path case sensitivity (InterviewHeader not interviewHeader)
import InterviewHeader from "./_components/InterviewHeader"
import React from 'react'

// Interview Layout - Wraps all interview pages with context and header
export default function InterviewLayout({ children }) {
    const [interviewInfo, setInterviewInfo] = React.useState();
    
    return (
        <InterviewDataContext.Provider value={{ interviewInfo, setInterviewInfo }}>
            <div className="bg-secondary min-h-screen">
                <InterviewHeader />
                {children}
            </div>
        </InterviewDataContext.Provider>
    )
}
    

