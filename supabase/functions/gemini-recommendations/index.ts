
// Follow imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    // Parse request body
    const { query, toolsData } = await req.json();
    
    // Validate inputs
    if (!query || !query.trim()) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!toolsData || !Array.isArray(toolsData) || toolsData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Tools data is missing or invalid' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'API configuration error. Please contact support.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log(`Processing recommendation request for query: ${query}`);
    console.log(`Tools data available: ${toolsData.length} tools`);

    // Prepare a prompt that helps Gemini understand the task
    const prompt = `
    You are an AI tool recommendation expert. Your job is to analyze a user's workflow needs and recommend the best AI tools to help them.

    You will be given a list of available AI tools with their details, and a user query describing their workflow needs.
    
    USER QUERY: "${query}"
    
    AVAILABLE TOOLS (${toolsData.length} tools):
    ${JSON.stringify(toolsData, null, 2)}
    
    INSTRUCTIONS:
    1. Analyze the user's needs carefully.
    2. Select 2-5 tools from the available list that would best help with their specific workflow.
    3. For each tool, explain WHY it's recommended (relating to the specific user needs) and provide practical USAGE TIPS.
    4. Also provide general advice that applies to their overall workflow.
    5. Return your response in the following JSON format:
    
    {
      "recommendations": [
        {
          "tool_id": "the-tool-uuid",
          "reasons": "Clear explanation of why this tool is recommended for their specific needs",
          "usage_tips": "Practical tips on how they can use this tool effectively for their workflow"
        }
      ],
      "general_advice": "Overall advice about their workflow"
    }
    
    IMPORTANT: Your output must be valid, parseable JSON. Make sure all tool_ids are exact matches from the provided data.
    Do not include any tools that aren't in the provided list.
    `;

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': geminiApiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      return new Response(
        JSON.stringify({ error: 'Error processing your request. Please try again later.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const data = await response.json();
    console.log("Received response from Gemini API");
    
    // Extract and return the recommendation data
    let recommendations;
    try {
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response structure from Gemini API');
      }
      
      const text = data.candidates[0].content.parts[0].text;
      console.log("Raw Gemini response:", text.substring(0, 200) + "...");
      
      // Extract JSON from the text response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
        console.log("Successfully parsed recommendations");
        
        // Validate the structure of the recommendations
        if (!recommendations.recommendations || !Array.isArray(recommendations.recommendations)) {
          throw new Error('Missing recommendations array in parsed response');
        }
        
        if (!recommendations.general_advice) {
          recommendations.general_advice = "Focus on integrating these tools into your workflow to maximize productivity.";
        }
        
        // Verify tool_ids exist in provided tools
        const validToolIds = new Set(toolsData.map(tool => tool.id));
        recommendations.recommendations = recommendations.recommendations.filter(rec => {
          const isValid = validToolIds.has(rec.tool_id);
          if (!isValid) {
            console.warn(`Removing invalid tool_id from recommendations: ${rec.tool_id}`);
          }
          return isValid;
        });
      } else {
        throw new Error('Could not parse JSON from response');
      }
    } catch (error) {
      console.error("Error processing Gemini response:", error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to process recommendations. Please try again with a more specific query.',
          debug: error.message
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Unhandled error in edge function:", error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
