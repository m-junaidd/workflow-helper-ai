
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ToolCard from '../components/ToolCard';
import SearchBar from '../components/SearchBar';
import { getToolsByQuery, Tool } from '../utils/mockData';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchTools = () => {
      setLoading(true);
      console.log('Fetching results for query:', searchQuery);
      
      setTimeout(() => {
        try {
          const results = getToolsByQuery(searchQuery);
          console.log(`Found ${results.length} matching tools`);
          setTools(results);
          
          // Log results to help debugging
          if (results.length === 0) {
            console.log('No results found, you might want to check the search function');
            toast.info("No exact matches found. Showing recommended tools.");
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching tools:', error);
          toast.error('Something went wrong while searching for tools');
          setLoading(false);
        }
      }, 800); // Simulate network delay
    };

    fetchTools();
  }, [searchQuery]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </button>
          
          <h1 className="text-2xl font-bold mb-6">
            Results for: <span className="text-primary">"{searchQuery}"</span>
          </h1>
          
          <div className="mb-8">
            <SearchBar />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-32 bg-gray-100 rounded-2xl"></div>
            ))}
          </div>
        ) : tools.length > 0 ? (
          <div className="space-y-4">
            {tools.map((tool) => (
              <div key={tool.id} className="animate-fade-in">
                <ToolCard {...tool} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any AI tools matching your search.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Try a different search
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Results;
