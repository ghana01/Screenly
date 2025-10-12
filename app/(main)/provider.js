import React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./_component/AppSidebar"
import WelcomeContainer from "./dashboard/_components/WelcomeContainer"


function DashboardProvider ({children}){
    
    return (
        
            <SidebarProvider>
                <AppSidebar />
                    <div className="w-full">
                        {/* <SidebarTrigger  /> */}
                        <WelcomeContainer />
                        {children}
                    
                    
                    </div>
                    </SidebarProvider>
        
    )
    }

export default DashboardProvider