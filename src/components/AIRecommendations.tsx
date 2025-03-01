
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ExternalLink, ThumbsUp, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null);
  const [tools, setTools] = useState<{ [key: string]: Tool }>({});
  const { user } = useAuth();

  // Fetch tools data
  const { isLoading: isLoadingTools } = useQuery({
    queryKey: ['tools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tools')
        .select(`
          *,
          categories(name)
        `)
        .eq('verified', true);
      
      if (error) throw error;
      
      // Create a lookup object for tools
      const toolsMap = (data || []).reduce((acc: { [key: string]: Tool }, tool: Tool) => {
        acc[tool.id] = tool;
        return acc;
      }, {});
      
      setTools(toolsMap);
      return data;
    },
    enabled: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter your needs or workflow to get recommendations");
      return;
    }
    
    setIsSubmitting(true);
    setRecommendations(null);
    
    try {
      const response = await fetch(
        `${import.meta.env.PROD ? "https://bnycgfzpfoiuwwnhxtjd.supabase.co" : ""}/functions/v1/gemini-recommendations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession()}`
          },
          body: JSON.stringify({
            query,
            toolsData: Object.values(tools),
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
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
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      <Card className="border-none shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-center">
            <span className="text-gradient">AI Tool Recommendations</span>
          </CardTitle>
          <CardDescription className="text-center text-base">
            Describe your task or workflow, and we'll recommend the best AI tools to help you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                placeholder="E.g., I need to write blog posts and create images for my website"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-4 h-auto text-base"
              />
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || isLoadingTools}
              className="w-full py-6"
            >
              <Zap className="mr-2" size={18} />
              {isSubmitting ? "Analyzing..." : "Get AI Recommendations"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isSubmitting && (
        <div className="mt-8 space-y-6">
          <Skeleton className="h-12 w-3/4 mx-auto" />
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
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
              {recommendations.error}
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-gray-800 mb-2">General Advice</h3>
                <p className="text-gray-700">{recommendations.general_advice}</p>
              </div>
              
              <h3 className="text-xl font-semibold mt-8 mb-4">Recommended Tools</h3>
              
              {recommendations.recommendations?.length > 0 ? (
                <div className="space-y-6">
                  {recommendations.recommendations.map((rec, index) => {
                    const tool = tools[rec.tool_id];
                    
                    if (!tool) {
                      return null;
                    }
                    
                    return (
                      <Card key={index} className="hover-card overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{tool.name}</CardTitle>
                            {tool.categories && (
                              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                {tool.categories.name}
                              </span>
                            )}
                          </div>
                          <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Why it's recommended:</h4>
                            <p className="text-gray-600">{rec.reasons}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-1">Usage tips:</h4>
                            <p className="text-gray-600">{rec.usage_tips}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(tool.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit Website
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSaveToFavorites(tool.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Save to Favorites
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
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
