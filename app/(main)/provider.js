"use client"
import React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_component/AppSidebar"
import WelcomeContainer from "./dashboard/_components/WelcomeContainer"
import { PanelLeft } from "lucide-react"

/**
 * Dashboard Provider Component
 * - Professional sidebar layout with proper push behavior
 */
function DashboardProvider({ children }) {
    return (
        <SidebarProvider defaultOpen={true}>
            {/* Sidebar */}
            <AppSidebar />
            
            {/* Main Content Area - This will automatically adjust when sidebar toggles */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
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
        </SidebarProvider>
    )
}

export default DashboardProvider