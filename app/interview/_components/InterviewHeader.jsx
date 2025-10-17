import React from 'react'
import Image from 'next/image'

const InterviewHeader = () => {
  return (
    <div className='p-4 shadow-md'>
        <Image 
          src='/logo.png' 
          alt='logo' 
          width={200} 
          height={200} 
          className='w-[140px] h-[140px]'  // Make sure this is w-[140px] not wp[140px]
        />
    </div>
  )
}

export default InterviewHeader