import { QUESTIONS_PROMPT } from "@/services/Constants"
import OpenAI from "openai"

export async function POST(req) { 
    try {
        const {jobPosition, jobDescription, interviewDuration, interviewTypes} = await req.json()
        
        // Validate required fields
        if(!jobPosition || !jobDescription || !interviewDuration || !interviewTypes?.length) {
            return new Response(JSON.stringify({
                error: 'Missing required fields',
                details: 'All fields (jobPosition, jobDescription, interviewDuration, interviewTypes) are required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Create the prompt
        const FINAL_PROMPT = QUESTIONS_PROMPT
            .replace('{{jobPosition}}', jobPosition)
            .replace('{{jobDescription}}', jobDescription)
            .replace('{{interviewDuration}}', interviewDuration)
            .replace('{{interviewTypes}}', interviewTypes.join(', '))
        
        console.log('Final Prompt:', FINAL_PROMPT)

        // Check if API key exists
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('OPENROUTER_API_KEY is not set')
            return new Response(JSON.stringify({
                error: 'Server configuration error'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        })

        const completion = await openai.chat.completions.create({
            model: "meituan/longcat-flash-chat:free",
            messages: [
                { role: "user", content: FINAL_PROMPT }
            ],
        })

        // Updated: Handle the response structure correctly
        console.log('Full completion object:', completion)
        
        let messageContent;
        
        // Check if it's the standard OpenAI format
        if (completion.choices && completion.choices[0] && completion.choices[0].message) {
            messageContent = completion.choices[0].message.content;
            console.log('Using standard format - AI Response:', completion.choices[0].message)
        }
        // Check if the response is directly the message object (which seems to be your case)
        else if (completion.content) {
            messageContent = completion.content;
            console.log('Using direct format - AI Response:', completion)
        }
        // Fallback: if the completion itself has the message properties
        else if (completion.role && completion.content) {
            messageContent = completion.content;
            console.log('Using message format - AI Response:', completion)
        }
        else {
            console.error('Unexpected response format:', completion)
            throw new Error('Unexpected API response format')
        }

        // Clean up the content (remove any trailing tokens)
        const cleanContent = messageContent.replace(/｜begin▁of▁sentence｜>/g, '').trim()
        
        // Return the content directly
        return new Response(JSON.stringify({
            success: true,
            content: cleanContent,
            questions: cleanContent
        }), {
            status: 200,      
            headers: { 'Content-Type': 'application/json' }
        })
        
    } catch(error) {
        console.error('API Error:', error)
        return new Response(JSON.stringify({
            error: 'Failed to generate questions',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}