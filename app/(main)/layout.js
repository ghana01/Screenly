import React from "react"
import DashboardProvider from "./provider"

function DashboardLayout ({children}){

    return(
        <div className="bg-secondary w-full">
            <DashboardProvider>
                <div className="w-full">
                    {children}
                </div>
                
            </DashboardProvider>
        </div>
    )
}


export default DashboardLayout