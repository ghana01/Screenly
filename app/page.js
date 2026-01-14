"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from '@/app/provider'
import { supabase } from '@/services/supabaseClient'

/**
 * Root Page Component
 * - Redirects authenticated users to dashboard
 * - Redirects unauthenticated users to login page
 * - Handles URL hash cleanup after OAuth redirect
 */
export default function Home() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [isProcessingAuth, setIsProcessingAuth] = useState(true)

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if this is an OAuth callback (has hash with access_token)
      if (typeof window !== 'undefined' && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        
        if (accessToken) {
          console.log('🔐 Processing OAuth callback...')
          
          // Let Supabase process the OAuth callback
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Auth callback error:', error)
          } else if (data.session) {
            console.log('✅ Session established, redirecting to dashboard')
            // Clean URL and redirect
            window.history.replaceState(null, '', '/')
            router.replace('/dashboard')
            return
          }
          
          // Clean up the hash
          window.history.replaceState(null, '', window.location.pathname)
        }
      }
      
      setIsProcessingAuth(false)
    }

    handleAuthCallback()
  }, [router])

  useEffect(() => {
    // Don't redirect while still processing auth or loading
    if (isProcessingAuth || isLoading) return

    if (user) {
      router.replace('/dashboard')
    } else {
      router.replace('/auth')
    }
  }, [user, isLoading, isProcessingAuth, router])

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
