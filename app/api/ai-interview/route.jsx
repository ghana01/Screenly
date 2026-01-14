import OpenAI from "openai"

export async function POST(req) {
    try {
        const body = await req.json()
        const { systemPrompt, userMessage, conversationHistory } = body

        if (!userMessage) {
            return new Response(JSON.stringify({
                error: 'No user message provided'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Check if API key exists
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('OPENROUTER_API_KEY is not set')
            return new Response(JSON.stringify({
                error: 'API key not configured'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
        })

        // Build messages array
        const messages = [
            {
                role: "system",
                content: systemPrompt || "You are a professional AI interviewer. Be concise, encouraging, and professional."
            }
        ]

        // Add conversation history
        if (conversationHistory && conversationHistory.length > 0) {
            conversationHistory.forEach(msg => {
                messages.push({
                    role: msg.role === 'AI' ? 'assistant' : 'user',
                    content: msg.content
                })
            })
        }

        // Add current user message
        messages.push({
            role: "user",
            content: userMessage
        })

        console.log('🎤 AI Interview - Processing message:', userMessage.substring(0, 50) + '...')

        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.0-flash-001",
            messages: messages,
            max_tokens: 200, // Keep responses concise for voice
            temperature: 0.7,
        })

        const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I didn't catch that. Could you please repeat?"

        console.log('🤖 AI Response:', aiResponse.substring(0, 50) + '...')

        return new Response(JSON.stringify({
            success: true,
            response: aiResponse
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })

    } catch (error) {
        console.error('AI Interview API Error:', error)
        return new Response(JSON.stringify({
            error: 'Failed to get AI response',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
