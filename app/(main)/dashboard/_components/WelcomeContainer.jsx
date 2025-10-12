"use client"

import React from 'react'
import {useUser} from '@/app/provider'
import Image from 'next/image'

const WelcomeContainer = () => {

    const {user} =useUser();
  return (
    <div className='flex justify-between items-center rounded-2xl shadow-md'>
        <div className=' p-3 '>

            <h2 className='text-lg font-bold'>Welcome Back,{user?.name}</h2>
            <h2 className='text-gray-500'>AI-Driven Interview </h2>
        </div>
     {user && <Image src={user?.picture} alt={user?.name} width={100} height={100}
      className='rounded-full mt-5'/>}

  
    </div>
  )
   
}

export default WelcomeContainer