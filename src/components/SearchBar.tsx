
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSubmitting(true);
      console.log('Submitting search query:', query);
      // Add a slight delay to show loading state
      setTimeout(() => {
        navigate(`/ai-recommendations?q=${encodeURIComponent(query)}`);
        setIsSubmitting(false);
      }, 300);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div className={`relative bg-white shadow-lg rounded-lg border ${
          isFocused ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'
        }`}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe what you're trying to accomplish, and our AI will find the best tools for you"
            className="w-full py-4 px-5 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-t-lg text-base min-h-[120px] resize-none"
            rows={4}
          />
        </div>
        
        <button
          type="submit"
          disabled={!query.trim() || isSubmitting}
          className={`w-full py-4 px-5 rounded-lg flex items-center justify-center text-white font-medium transition-colors ${
            query.trim() && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              Get AI Recommendations
            </>
          )}
        </button>
      </form>
      
      <div className="text-center mt-4 text-gray-500 text-sm">
        Examples: "I'm a student looking for tools to help with assignments" • "I need to create marketing content"
      </div>
    </div>
  );
};

export default SearchBar;
