
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// Default messages to use when API call fails
const DEFAULT_MESSAGES = [
  "Discover the perfect AI tools tailored to your specific needs and workflows.",
  "Find AI solutions that transform how you work, create, and solve problems.",
  "Leverage AI technology to automate tasks and boost your productivity.",
  "Navigate the AI landscape with personalized tool recommendations.",
  "Enhance your workflow with AI tools specifically matched to your requirements."
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // If no API key is set, return a random default message
    if (!GEMINI_API_KEY) {
      console.log('No GEMINI_API_KEY found, using default welcome message');
      const randomMessage = DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)];
      return new Response(JSON.stringify({ message: randomMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Call Gemini API to generate a welcome message
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate a short, engaging welcome message for the landing page of an AI tool recommendation website. 
            The message should be approximately 10-15 words, highlighting how AI tools can enhance workflows and productivity.
            Don't use quotes or special formatting. Keep it concise and impactful.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 50,
        }
      })
    });

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', geminiResponse.status);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    
    // Extract the generated text
    const generatedText = geminiData.candidates[0].content.parts[0].text.trim();
    
    // Clean up the text (remove quotes if present)
    const cleanedText = generatedText.replace(/^["']|["']$/g, '');
    
    console.log('Generated welcome message:', cleanedText);
    
    return new Response(JSON.stringify({ message: cleanedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in get-welcome-message function:', error);
    
    // Return a random default message on error
    const randomMessage = DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)];
    
    return new Response(JSON.stringify({ 
      message: randomMessage,
      error: error.message 
    }), {
      status: 200, // Still return 200 with fallback message
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
