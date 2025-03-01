
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import ToolCard from '@/components/ToolCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [favoriteTools, setFavoriteTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      fetchFavoriteTools();
    }
  }, [profile]);

  const fetchFavoriteTools = async () => {
    try {
      setIsLoading(true);
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('tool_id')
        .eq('user_id', profile.id);

      if (favoritesError) throw favoritesError;

      if (favorites && favorites.length > 0) {
        const toolIds = favorites.map(fav => fav.tool_id);
        
        const { data: tools, error: toolsError } = await supabase
          .from('tools')
          .select(`
            *,
            categories(name)
          `)
          .in('id', toolIds);

        if (toolsError) throw toolsError;
        setFavoriteTools(tools || []);
      } else {
        setFavoriteTools([]);
      }
    } catch (error) {
      console.error('Error fetching favorite tools:', error);
      toast.error('Failed to load favorite tools');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (toolId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', profile.id)
        .eq('tool_id', toolId);

      if (error) throw error;
      
      setFavoriteTools(prevTools => prevTools.filter(tool => tool.id !== toolId));
      toast.success('Tool removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          {profile && (
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold text-primary mr-4">
                {profile.username ? profile.username.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.username || 'User'}</h2>
                <p className="text-gray-600">Role: {profile.role}</p>
              </div>
              <div className="ml-auto">
                <Button variant="outline" onClick={signOut}>Sign Out</Button>
              </div>
            </div>
          )}
        </div>

        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">My Favorite Tools</h2>
          
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-32 bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          ) : favoriteTools.length > 0 ? (
            <div className="space-y-4">
              {favoriteTools.map((tool) => (
                <div key={tool.id} className="relative">
                  <ToolCard 
                    id={tool.id}
                    name={tool.name}
                    description={tool.description}
                    category={tool.categories?.name || 'Uncategorized'}
                    url={tool.url}
                    upvotes={tool.upvotes}
                    imageUrl={tool.image_url}
                  />
                  <button 
                    onClick={() => removeFavorite(tool.id)}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">You haven't added any favorite tools yet</p>
              <Button onClick={() => window.location.href = '/'}>
                Discover Tools
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
