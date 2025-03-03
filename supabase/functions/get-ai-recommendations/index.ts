
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.4.0';

// Environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

serve(async (req) => {
  try {
    // Get the query from the request
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'No query provided' }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Query the tools table
    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('*');
    
    if (error) {
      console.error('Error fetching tools:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        },
      );
    }
    
    // Simple search function that checks if the query appears in name, description, or category
    const searchResults = tools.filter(tool => {
      const searchText = query.toLowerCase();
      return (
        tool.name.toLowerCase().includes(searchText) ||
        tool.description.toLowerCase().includes(searchText) ||
        tool.category.toLowerCase().includes(searchText)
      );
    });
    
    return new Response(
      JSON.stringify({
        results: searchResults,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Exception in get-ai-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});
