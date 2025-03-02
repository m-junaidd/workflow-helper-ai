
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, toolsData } = await req.json();

    if (!geminiApiKey) {
      throw new Error('Missing Gemini API key');
    }

    console.log(`Processing recommendation request for query: ${query}`);
    console.log(`Tools data available: ${toolsData.length} tools`);

    // Prepare a prompt that helps Gemini understand the task
    const prompt = `
    You are an AI tools expert. Based on the following user needs:
    "${query}"

    Please recommend the most suitable AI tools from this list:
    ${JSON.stringify(toolsData)}

    Focus on how these tools can save time and increase productivity for this specific need.
    Return your response in this JSON format:
    {
      "recommendations": [
        {
          "tool_id": "id_of_the_tool",
          "reasons": "Specific reasons why this tool is recommended for the user's needs",
          "usage_tips": "Practical tips on how to use this tool to save time and increase productivity"
        }
      ],
      "general_advice": "General advice about using AI tools for this specific need"
    }
    `;

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      }),
    });

    const data = await response.json();
    console.log("Received response from Gemini API");
    
    // Extract and return the recommendation data
    let recommendations;
    try {
      const text = data.candidates[0].content.parts[0].text;
      console.log("Raw Gemini response:", text.substring(0, 200) + "...");
      
      // Extract JSON from the text response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
        console.log("Successfully parsed recommendations");
      } else {
        throw new Error('Could not parse JSON from response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      recommendations = {
        error: 'Failed to parse recommendations',
        rawResponse: data
      };
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
