
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for CORS preflight')
    return new Response(null, {
      headers: corsHeaders,
    })
  }

  try {
    // Parse the request body
    const requestData = await req.json()
    const query = requestData.query || ''
    
    console.log(`Processing AI recommendations request for query: "${query}"`)

    if (!query) {
      return new Response(
        JSON.stringify({ 
          error: 'Query parameter is required' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Get tools from database that match the query
    console.log('Fetching tools from database...')
    const { data: tools, error } = await supabase
      .from('tools')
      .select(`
        *,
        categories(name)
      `)
      .order('upvotes', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    // Format the tools for the frontend
    const formattedTools = tools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category: tool.categories?.name || 'Uncategorized',
      url: tool.url,
      upvotes: tool.upvotes,
      imageUrl: tool.image_url
    }))

    // In a real implementation, you might use Gemini to filter or rank these results
    // For now, we'll just return the database results
    console.log(`Returning ${formattedTools.length} tool recommendations`)
    
    return new Response(
      JSON.stringify({
        results: formattedTools,
        query,
        source: 'database'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in get-ai-recommendations function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
