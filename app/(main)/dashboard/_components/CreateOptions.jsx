  "use client"
  import React from 'react'
  import { Video,Phone } from 'lucide-react'
  import Link from 'next/link'
  const CreateOptions = () => {
    return (
      <div className='grid grid-cols-2 gap-5'>
        
          <Link className='bg-white border border-gray-300 rounded-lg p-5 cursor-pointer'
          href={'/dashboard/create-interview'}  >  
              <Video className='p-3 text-primary bg-blue-100 rounded-lg w-13 h-13' />
              <h2 className='font-bold'>Create New Interview</h2>
              <p className='text-slate-500'> Create Ai interiew and schedule for candidate</p>
          
          </Link>
        
          
        


        <Link className='bg-white border border-gray-300 rounded-lg p-5 cursor-pointer'
        href={'/dashboard/create-interview'}>
          <Phone className='p-3 text-primary bg-blue-100 rounded-lg w-13 h-13' />
          <h2 className='font-bold'>Create Phone Screening Call</h2>
          <p className='text-slate-500'> Schedule phone screaning call with candidate</p>

        </Link>

        

      </div>
    )
  }

  export default CreateOptions