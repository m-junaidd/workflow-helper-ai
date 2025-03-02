
import React, { useState, useEffect } from 'react';
import VoteButton from './VoteButton';
import { Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  upvotes: number;
  imageUrl?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  id,
  name,
  description,
  category,
  url,
  upvotes,
  imageUrl
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, id]);

  const checkIfFavorite = async () => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select()
        .eq('user_id', user?.id)
        .eq('tool_id', id)
        .maybeSingle();

      if (error) throw error;
      
      setIsFavorite(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      navigate('/auth');
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', id);

        if (error) throw error;
        
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            tool_id: id
          });

        if (error) throw error;
        
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`group flex rounded-2xl overflow-hidden bg-white transition-all duration-300 border border-gray-100 ${
        isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0 w-16 flex items-start justify-center pt-6 pl-4">
        <VoteButton toolId={id} initialUpvotes={upvotes} />
      </div>
      
      <div className="flex-grow p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center mb-3">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                {category}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-300">
              {name}
            </h3>
            
            <p className="mt-2 text-gray-600 text-sm line-clamp-2">
              {description}
            </p>
          </div>
          
          {imageUrl && (
            <div className="ml-4 flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-gray-100">
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <Button 
            variant="outline"
            size="sm"
            className="text-sm font-medium text-blue-600 hover:bg-blue-50 border-blue-200"
            onClick={() => window.open(url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleFavorite}
              disabled={isLoading}
              className={`p-1.5 rounded-full transition-all duration-200 ${
                isFavorite 
                  ? 'text-yellow-500 hover:bg-yellow-50' 
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
