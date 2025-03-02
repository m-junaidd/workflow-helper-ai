
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ExternalLink, Zap, Lightbulb, BookmarkCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Recommendation {
  tool_id: string;
  reasons: string;
  usage_tips: string;
}

interface RecommendationsResponse {
  recommendations: Recommendation[];
  general_advice: string;
  error?: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  image_url?: string;
  categories?: { name: string };
}

const AIRecommendations = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [tools, setTools] = useState<{ [key: string]: Tool }>({});
  const { user } = useAuth();

  // Fetch tools data
  const { isLoading: isLoadingTools, data: toolsData } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select(`
          *,
          categories(name)
        `)
        .eq('is_verified', true);
      
      if (error) {
        console.error('Error fetching tools:', error);
        throw error;
      }
      
      // Create a lookup object for tools
      const toolsMap = (data || []).reduce((acc: { [key: string]: Tool }, tool: Tool) => {
        acc[tool.id] = tool;
        return acc;
      }, {});
      
      setTools(toolsMap);
      return data;
    },
  });

  // Submit the query automatically if it comes from URL parameters
  useEffect(() => {
    if (initialQuery && !isLoadingTools && toolsData) {
      handleSubmit(new Event('submit') as unknown as React.FormEvent);
    }
  }, [initialQuery, isLoadingTools, toolsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please describe your work or tasks to get AI tool recommendations");
      return;
    }
    
    setIsSubmitting(true);
    setRecommendations(null);
    
    try {
      console.log('Submitting query:', query);
      console.log('Available tools:', Object.values(tools).length);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || "https://bnycgfzpfoiuwwnhxtjd.supabase.co"}/functions/v1/gemini-recommendations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`
          },
          body: JSON.stringify({
            query,
            toolsData: Object.values(tools),
          }),
        }
      );
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      // Check if the response contains an error
      if (data.error) {
        toast.error(data.error || "Failed to get recommendations. Please try again.");
        return;
      }
      
      setRecommendations(data);
      toast.success("AI recommendations generated successfully!");
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error("Failed to get recommendations. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveToFavorites = async (toolId: string) => {
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    try {
      // Check if already favorited
      const { data: existingFavorite } = await supabase
        .from('favorites')
        .select()
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .maybeSingle();

      if (existingFavorite) {
        toast.info("This tool is already in your favorites!");
        return;
      }

      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          tool_id: toolId
        });

      if (error) throw error;
      toast.success("Added to favorites!");
    } catch (error) {
      console.error('Error saving favorite:', error);
      toast.error("Failed to add to favorites");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="text-blue-600">Find the Perfect AI Tools</span>
          <span className="text-gray-800"> for Your Workflow</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tell us about your work or task, and we'll recommend the best AI tools to boost your productivity
        </p>
      </div>
    
      <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-white mb-10">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center text-blue-600">
            <span className="flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
              AI Tool Advisor
            </span>
          </CardTitle>
          <CardDescription className="text-center text-base">
            Describe what you're trying to accomplish, and our AI will find the best tools for you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="E.g., I'm a student who needs help with research and writing assignments..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-4 min-h-[120px] text-base bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 rounded-xl"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || isLoadingTools || !query.trim()}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Zap className="mr-2" size={18} />
              {isSubmitting ? "Finding the best tools..." : "Get AI Recommendations"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isSubmitting && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-blue-600 font-medium">Analyzing your needs...</p>
          </div>
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations && !isSubmitting && (
        <div className="mt-8 space-y-6">
          {recommendations.error ? (
            <div className="p-6 bg-red-50 text-red-600 rounded-lg border border-red-100">
              <h3 className="font-bold mb-2">Error</h3>
              <p>{recommendations.error}</p>
              <p className="mt-2 text-sm">Please try again with a more specific description of your needs.</p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-md border border-blue-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                  <Lightbulb className="mr-2 text-blue-600" size={20} />
                  General Advice
                </h3>
                <p className="text-gray-700">{recommendations.general_advice}</p>
              </div>
              
              <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Recommended Tools</h3>
              
              {recommendations.recommendations?.length > 0 ? (
                <div className="space-y-6">
                  {recommendations.recommendations.map((rec, index) => {
                    const tool = tools[rec.tool_id];
                    
                    if (!tool) {
                      console.warn('Tool not found:', rec.tool_id);
                      return null;
                    }
                    
                    return (
                      <Card key={index} className="overflow-hidden border border-blue-100 hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-white">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-blue-700">{tool.name}</CardTitle>
                            {tool.categories && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                                {tool.categories.name}
                              </span>
                            )}
                          </div>
                          <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Why it's recommended for you:</h4>
                            <p className="text-gray-600">{rec.reasons}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">How to use it effectively:</h4>
                            <p className="text-gray-600">{rec.usage_tips}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2 border-t border-gray-100">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(tool.url, '_blank')}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit Website
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSaveToFavorites(tool.id)}
                            className="hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                          >
                            <BookmarkCheck className="h-4 w-4 mr-2" />
                            Save to Favorites
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-600">No specific tools recommended for your query.</p>
                  <p className="text-gray-500 mt-2">Try being more specific about your needs.</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
