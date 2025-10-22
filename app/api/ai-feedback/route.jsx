import { FEEDBACK_PROMPT } from "@/services/Constants";
import OpenAI from 'openai';

export async function POST(request) {
    try {
        // Parse the request body
        const { conversation } = await request.json();
        
        // Validate input
        if (!conversation) {
            return new Response(JSON.stringify({
                error: 'Conversation data is required',
                success: false
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create the final prompt
        const FINAL_PROMPT = FEEDBACK_PROMPT.replace("{{conversation}}", JSON.stringify(conversation));
        
        // Validate API key
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('OPENROUTER_API_KEY is not set');
            return new Response(JSON.stringify({
                error: 'API configuration error',
                success: false
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Initialize OpenAI client
        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        });

        // Make API call
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini", // Updated to a more reliable model
            messages: [
                { role: "user", content: FINAL_PROMPT }
            ],
        });

        console.log('Full completion object:', completion);

        // Extract message content
        let messageContent;
        
        if (completion.choices && completion.choices[0] && completion.choices[0].message) {
            messageContent = completion.choices[0].message.content;
            console.log('AI Response:', completion.choices[0].message);
        } else {
            console.error('Unexpected response format:', completion);
            throw new Error('Unexpected API response format');
        }

        // Validate response content
        if (!messageContent) {
            throw new Error('Empty response from AI');
        }

        // Clean up the content
        const cleanContent = messageContent
            .replace(/｜begin▁of▁sentence｜>/g, '')
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        // Return successful response
        return new Response(JSON.stringify({
            success: true,
            content: cleanContent,
            feedback: cleanContent // Changed from 'questions' to 'feedback' for clarity
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('API Error:', error);
        
        // Return error response
        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to generate feedback',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}