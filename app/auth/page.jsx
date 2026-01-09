"use client"
import React, { useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { supabase } from '@/services/supabaseClient'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/provider'

function Login() {
    const router = useRouter()
    const { user } = useUser()

    // CHANGED: Redirect to dashboard if already logged in
    useEffect(() => {
        if (user) {
            router.replace('/dashboard')
        }
    }, [user, router])

    const handleLoginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // CHANGED: Set redirect URL to remove hash from callback
                redirectTo: `${window.location.origin}/`
            }
        })
        if (error) console.log('Error: ', error.message)
    }

    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className='flex flex-col items-center border rounded-2xl p-10 shadow-lg'>
                <Image src={'/logo.png'} alt="Logo" width={200} height={50}
                    className='w-[120px]'
                />

                <div className='flex flex-col items-center mt-8 space-y-4 rounded-2xl shadow-md'>
                    <Image src={'/login-2.jpeg'} alt="login" width={600} height={400}
                        className='w-full h-[250px] rounded-2xl object-cover'
                    />
                    <h2 className='font-bold text-2xl text-center'>welcome to AI Interview Voice-Agent</h2>
                    <p className='font-bold text-gray-500 text-center'>Experience the future of interviews with our AI-powered voice agent.</p>
                    <Button
                        onClick={handleLoginWithGoogle}
                        className='mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
                        Login in with Google
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Login