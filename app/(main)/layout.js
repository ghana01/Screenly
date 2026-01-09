"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/app/provider"
import DashboardProvider from "./provider"

/**
 * Dashboard Layout Component
 * - Authentication protection
 * - Professional layout with sidebar
 */
function DashboardLayout({ children }) {
    const { user, isLoading } = useUser()
    const router = useRouter()

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/auth')
        }
    }, [user, isLoading, router])

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        )
    }

    // Don't render if not authenticated
    if (!user) {
        return null
    }

    return (
        <DashboardProvider>
            {children}
        </DashboardProvider>
    )
}

export default DashboardLayout