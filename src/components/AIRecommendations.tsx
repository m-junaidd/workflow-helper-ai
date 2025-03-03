
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ToolCard from './ToolCard';
import { getToolsByQuery, Tool } from '../utils/mockData';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, getAuthHeader } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

const AIRecommendations: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [recommendations, setRecommendations] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations(searchQuery);
  }, [searchQuery]);

  const fetchRecommendations = async (searchQuery: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching AI recommendations for:', searchQuery);
      
      const { data, error } = await supabase.functions.invoke(
        'get-ai-recommendations',
        {
          body: { query: searchQuery },
          headers: getAuthHeader()
        }
      );

      if (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to fetch recommendations. Falling back to mock data.');
        const mockResults = getToolsByQuery(searchQuery);
        setRecommendations(mockResults);
      } else if (data && data.results) {
        setRecommendations(data.results);
      } else {
        // If no results, fallback to mock data
        console.log('No results found, using mock data as fallback');
        const mockResults = getToolsByQuery(searchQuery);
        setRecommendations(mockResults);
      }
    } catch (err) {
      console.error('Exception fetching recommendations:', err);
      setError('An unexpected error occurred. Falling back to mock data.');
      const mockResults = getToolsByQuery(searchQuery);
      setRecommendations(mockResults);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <a href="/" className="inline-flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </a>
      </div>

      <h1 className="text-3xl font-semibold mb-4">
        AI Tool Recommendations for: &quot;{searchQuery}&quot;
      </h1>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-md">
          <p className="text-amber-700">{error}</p>
        </div>
      )}

      {!isLoading && !error && recommendations.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">
            No AI tools found for the query &quot;{searchQuery}&quot;.
          </p>
          <a href="/" className="text-blue-500 hover:text-blue-700">
            Try a different search
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map(tool => (
          <ToolCard 
            key={tool.id} 
            id={tool.id}
            name={tool.name}
            description={tool.description}
            category={tool.category}
            url={tool.url}
            upvotes={tool.upvotes || 0}
            imageUrl={tool.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
