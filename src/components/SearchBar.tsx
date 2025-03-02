
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/ai-recommendations?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form 
        onSubmit={handleSubmit}
        className={`relative transition-all duration-300 ${
          isFocused ? 'transform scale-[1.02]' : ''
        }`}
      >
        <div className={`relative bg-white shadow-xl rounded-2xl transition-all duration-300 ${
          isFocused ? 'ring-2 ring-blue-500/30' : 'ring-1 ring-gray-200'
        }`}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Describe your work or task for AI tool recommendations..."
            className="w-full py-6 px-8 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-2xl text-lg"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 bg-blue-600 text-white rounded-xl transition-all duration-300 hover:bg-blue-700"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* Subtle animated glow effect when focused */}
        {isFocused && (
          <div className="absolute inset-0 -z-10 bg-blue-600/5 rounded-2xl blur-lg animate-pulse-subtle"></div>
        )}
      </form>
      
      <div className="text-center mt-4 text-gray-500 text-sm">
        Examples: "I'm a student looking for tools to help with assignments" • "I need to create marketing content"
      </div>
    </div>
  );
};

export default SearchBar;
