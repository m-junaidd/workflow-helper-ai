
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, tools } = await req.json();

    console.log(`Received query: "${query}"`);
    console.log(`Received ${tools?.length || 0} tools`);

    // Check for required inputs
    if (!query || !tools || tools.length === 0) {
      throw new Error('Query and tools are required');
    }

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    // Prepare tools data for the prompt
    const toolsData = tools.map(tool => {
      return {
        id: tool.id,
        name: tool.name,
        description: tool.description,
        category: tool.categories?.name || '',
        url: tool.url
      };
    });

    // Call Gemini API
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an AI tool recommendation system. Based on the user's query, recommend the most suitable AI tools from the provided list.
            
            User query: "${query}"
            
            Available tools:
            ${JSON.stringify(toolsData, null, 2)}
            
            Provide recommendations in this JSON format:
            {
              "general_advice": "Overall advice based on the query",
              "recommendations": [
                {
                  "tool_id": "id of the tool",
                  "reasons": "Why this tool is recommended for the query",
                  "usage_tips": "Tips on how to use this tool effectively"
                }
              ]
            }
            
            Choose up to 3 most relevant tools. Format your response as valid JSON only with no additional text.`
          }]
        }]
      })
    });

    if (!geminiResponse.ok) {
      console.error('Gemini API error status:', geminiResponse.status);
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status} ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini API response:', JSON.stringify(geminiData, null, 2));

    // Extract and parse the content
    const responseText = geminiData.candidates[0].content.parts[0].text;
    console.log('Raw response text:', responseText);

    // Strip any markdown formatting or extra text
    let cleanedText = responseText;
    if (responseText.includes('```json')) {
      cleanedText = responseText.split('```json')[1].split('```')[0].trim();
    } else if (responseText.includes('```')) {
      cleanedText = responseText.split('```')[1].split('```')[0].trim();
    }

    try {
      const recommendationData = JSON.parse(cleanedText);
      
      // Validate the parsed data
      if (!recommendationData.general_advice || !Array.isArray(recommendationData.recommendations)) {
        throw new Error('Invalid response format from Gemini');
      }
      
      // Return the recommendations
      return new Response(JSON.stringify(recommendationData), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.error('Error parsing Gemini response:', e);
      throw new Error('Failed to parse recommendation data');
    }
  } catch (error) {
    console.error('Error in get-ai-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
