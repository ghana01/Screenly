"use client"
import React from "react"
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { AppSidebar } from "./_component/AppSidebar"
import WelcomeContainer from "./dashboard/_components/WelcomeContainer"
import { PanelLeft } from "lucide-react"

/**
 * Main Content Component that responds to sidebar state
 */
function MainContent({ children }) {
    const { open, isMobile } = useSidebar()
    
    return (
        <div 
            className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
                open && !isMobile ? 'md:ml-[16rem]' : 'ml-0'
            }`}
        >
            {/* Top Header Bar */}
            <header className="h-16 flex items-center gap-4 px-6 bg-white border-b shadow-sm sticky top-0 z-20">
                {/* Sidebar Toggle Button */}
                <SidebarTrigger className="h-10 w-10 flex items-center justify-center rounded-lg border bg-white hover:bg-gray-100 transition-colors">
                    <PanelLeft className="h-5 w-5" />
                </SidebarTrigger>
                
                {/* Welcome Section */}
                <div className="flex-1">
                    <WelcomeContainer />
                </div>
            </header>
            
            {/* Page Content */}
            <main className="flex-1 p-6 overflow-auto bg-gray-50">
                {children}
            </main>
        </div>
    )
}

/**
 * Dashboard Provider Component
 * - Professional sidebar layout with proper push behavior
 */
function DashboardProvider({ children }) {
    return (
        <SidebarProvider defaultOpen={true}>
            {/* Sidebar */}
            <AppSidebar />
            
            {/* Main Content Area - automatically adjusts when sidebar toggles */}
            <MainContent>{children}</MainContent>
        </SidebarProvider>
    )
}

export default DashboardProvider