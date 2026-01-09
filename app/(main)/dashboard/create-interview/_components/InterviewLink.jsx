import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Copy, Mail, Slack, MessageCircle, Clock, Calendar, ArrowLeft, Plus } from "lucide-react"
import { Button } from '@/components/ui/button'
import { toast } from "sonner"
import Link from 'next/link'

export const InterviewLink = ({ formData, interview_id }) => {

    // CHANGED: Fixed the interview link URL path
    const getInterviewLink = () => {
        const baseUrl = process.env.NEXT_PUBLIC_HOSTED_URL || window.location.origin
        const url = `${baseUrl}/interview/${interview_id}`
        return url;
    }

    // Calculate expiry date (30 days from now)
    const getExpiryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 30);
        return date.toLocaleDateString();
    }

    const onCopyLink = async () => {
        await navigator.clipboard.writeText(getInterviewLink());
        toast.success('Link copied to clipboard!');
    }

    return (
        <div className='flex items-center justify-center flex-col mt-10'>
            <Image src="/check.png" alt="Success" width={100} height={100} className='mx-auto' />
            <h2 className='text-2xl font-bold text-center mt-4'>Interview Created Successfully!</h2>
            <p className='text-center mt-4'>Your interview for "{formData?.jobPosition}" has been created.</p>
            <p className='text-center mt-2'>Share this link with your candidates:</p>
            <div className='w-full p-7 mt-5 rounded-xl bg-white'>
                <div className='flex items-center justify-between'>
                    <h2 className="font-bold">Interview Link</h2>
                    <h2 className='pl-1 px-2 text-primary bg-blue-50 rounded-2xl text-sm'>Valid for 30 Days</h2>
                </div>
                <div className='mt-3 flex gap-3 items-center'>
                    <Input defaultValue={getInterviewLink()} disabled={true} />
                    <Button onClick={onCopyLink}><Copy className="mr-2 h-4 w-4" /> Copy Link</Button>
                </div>
                <hr className='my-7' />
                <div className='flex gap-5 flex-wrap'>
                    <h2 className='text-medium text-gray-500 flex gap-2 items-center'>
                        <Clock className="w-4 h-4" />{formData?.interviewDuration} Minutes
                    </h2>
                    <h2 className='text-medium text-gray-500 flex gap-2 items-center'>
                        <Calendar className="w-4 h-4" />Expires: {getExpiryDate()}
                    </h2>
                </div>
            </div>
            <div className='mt-5 bg-white p-5 rounded-lg w-full'>
                <h2 className='font-medium mb-3'>Share Via</h2>
                <div className='flex gap-3 flex-wrap'>
                    <Button variant={'outline'}><Mail className="mr-2 h-4 w-4" />Email</Button>
                    <Button variant={'outline'}><Slack className="mr-2 h-4 w-4" />Slack</Button>
                    <Button variant={'outline'}><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</Button>
                </div>
            </div>
            <div className="mt-5 flex gap-3 items-center justify-between w-full">
                <Link href={'/dashboard'}>
                    <Button variant={'outline'}><ArrowLeft className="mr-2 h-4 w-4" />Back to Dashboard</Button>
                </Link>
                {/* CHANGED: Fixed the link path */}
                <Link href={'/dashboard/create-interview'}>
                    <Button><Plus className="mr-2 h-4 w-4" />Create Another Interview</Button>
                </Link>
            </div>
        </div>
    )
}