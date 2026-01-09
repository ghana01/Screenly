import { QUESTIONS_PROMPT } from "@/services/Constants"
import OpenAI from "openai"

export async function POST(req) { 
    try {
        let body;
        try {
            body = await req.json()
        } catch (parseError) {
            console.error('Failed to parse request body:', parseError)
            return new Response(JSON.stringify({
                error: 'Invalid JSON in request body'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const {jobPosition, jobDescription, interviewDuration, interviewTypes} = body
        
        console.log('Received request:', { jobPosition, jobDescription, interviewDuration, interviewTypes })
        
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
                error: 'Server configuration error',
                details: 'API key not configured'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        console.log('API Key exists:', !!process.env.OPENROUTER_API_KEY)

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        })

        console.log('Calling OpenRouter API...')
        
        let completion;
        try {
            completion = await openai.chat.completions.create({
                model: "google/gemini-2.0-flash-001",  // Using stable model
                messages: [
                    { role: "user", content: FINAL_PROMPT }
                ],
            })
        } catch (apiError) {
            console.error('OpenRouter API Error:', apiError.message)
            console.error('Full API Error:', apiError)
            return new Response(JSON.stringify({
                error: 'AI API call failed',
                details: apiError.message
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        console.log('Full completion object:', JSON.stringify(completion, null, 2))
        
        let messageContent;
        
        if (completion.choices && completion.choices[0] && completion.choices[0].message) {
            messageContent = completion.choices[0].message.content;
        } else {
            console.error('Unexpected response format:', completion)
            return new Response(JSON.stringify({
                error: 'Unexpected API response format',
                details: 'Could not extract message from response'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Clean up the content
        let cleanContent = messageContent
            .replace(/｜begin▁of▁sentence｜>/g, '')
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim()
        
        console.log('Clean content:', cleanContent)
        
        return new Response(JSON.stringify({
            success: true,
            content: cleanContent,
            questions: cleanContent
        }), {
            status: 200,      
            headers: { 'Content-Type': 'application/json' }
        })
        
    } catch(error) {
        console.error('Unhandled API Error:', error.message)
        console.error('Error stack:', error.stack)
        return new Response(JSON.stringify({
            error: 'Failed to generate questions',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}