
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for CORS preflight')
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    // Get the API key from env
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set')
      return fallbackResponse()
    }

    console.log('Generating welcome message using Gemini API')
    
    // Prepare the prompt for Gemini
    const prompt = `
      Generate a single concise, engaging welcome message for an AI tools discovery platform 
      called "AI Toolbox". The message should encourage users to explore AI tools that can 
      help them with their workflows. Keep it under 100 characters and make it sound inviting.
      Do not include quotation marks.
    `

    // Make request to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 100,
          },
        }),
      }
    )

    if (!response.ok) {
      console.error('Gemini API error:', await response.text())
      return fallbackResponse()
    }

    const data = await response.json()
    
    // Extract the message from Gemini's response
    let message = 'Discover the perfect AI tools tailored to your specific needs and workflows.'
    
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      message = data.candidates[0].content.parts[0].text.trim()
    }
    
    console.log('Generated welcome message:', message)

    return new Response(
      JSON.stringify({
        message,
        source: 'gemini'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating welcome message:', error)
    return fallbackResponse()
  }

  function fallbackResponse() {
    return new Response(
      JSON.stringify({
        message: 'Discover the perfect AI tools tailored to your specific needs and workflows.',
        source: 'fallback'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
