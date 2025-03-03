
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
    // Redirect to AI recommendations page
    navigate(`/ai-recommendations?q=${encodeURIComponent(searchQuery)}`);
  }, [searchQuery, navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-blue-600 font-medium">Redirecting to AI recommendations...</p>
        </div>
      </div>
    </Layout>
  );
};

export default Results;
