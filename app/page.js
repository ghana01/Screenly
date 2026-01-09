"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from '@/app/provider'

/**
 * Root Page Component
 * - Redirects authenticated users to dashboard
 * - Redirects unauthenticated users to login page
 * - Handles URL hash cleanup after OAuth redirect
 */
export default function Home() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    // CHANGED: Remove hash from URL if present (OAuth redirect cleanup)
    if (typeof window !== 'undefined' && window.location.hash) {
      // Replace URL without hash to fix CSS loading issues
      window.history.replaceState(null, '', window.location.pathname)
    }

    // CHANGED: Redirect based on authentication status
    if (user) {
      // User is logged in, go to dashboard
      router.replace('/dashboard')
    } else {
      // Small delay to allow auth state to initialize
      const timer = setTimeout(() => {
        if (!user) {
          router.replace('/auth')
        }
      }, 1500) // Wait 1.5 seconds for auth to initialize
      
      return () => clearTimeout(timer)
    }
  }, [user, router])

  // CHANGED: Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
