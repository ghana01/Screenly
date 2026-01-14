"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'

/**
 * OAuth Callback Handler
 * Handles the redirect from Google OAuth and processes the auth token
 */
export default function AuthCallback() {
    const router = useRouter()

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Check if there's a hash with access token
                if (typeof window !== 'undefined' && window.location.hash) {
                    const hashParams = new URLSearchParams(window.location.hash.substring(1))
                    const accessToken = hashParams.get('access_token')
                    
                    if (accessToken) {
                        console.log('🔐 Processing OAuth callback...')
                        
                        // Get session from Supabase
                        const { data, error } = await supabase.auth.getSession()
                        
                        if (error) {
                            console.error('Auth callback error:', error)
                            router.replace('/auth')
                            return
                        }
                        
                        if (data.session) {
                            console.log('✅ Session established, redirecting to dashboard')
                            router.replace('/dashboard')
                            return
                        }
                    }
                }
                
                // No valid token, check if user is already authenticated
                const { data: { user } } = await supabase.auth.getUser()
                
                if (user) {
                    router.replace('/dashboard')
                } else {
                    router.replace('/auth')
                }
            } catch (error) {
                console.error('Callback error:', error)
                router.replace('/auth')
            }
        }

        handleCallback()
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Completing sign in...</p>
            </div>
        </div>
    )
}
