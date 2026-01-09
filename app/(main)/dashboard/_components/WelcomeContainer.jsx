"use client"

import React from 'react'
import { useUser } from '@/app/provider'
import Image from 'next/image'

const WelcomeContainer = () => {
    const { user } = useUser();
    
    if (!user) return null;

    return (
        <div className='flex items-center justify-between w-full'>
            <div>
                <h2 className='text-lg font-semibold text-gray-800'>
                    Welcome Back, {user?.name}
                </h2>
                <p className='text-sm text-gray-500'>AI-Driven Interview Platform</p>
            </div>
            {user?.picture && (
                <Image 
                    src={user.picture} 
                    alt={user?.name || 'User'} 
                    width={42} 
                    height={42}
                    className='rounded-full border-2 border-gray-200'
                />
            )}
        </div>
    )
}

export default WelcomeContainer