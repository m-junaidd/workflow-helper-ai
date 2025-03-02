
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
      if (window.location.pathname === '/') {
        navigate(`/ai-recommendations?q=${encodeURIComponent(query)}`);
      } else if (window.location.pathname === '/ai-recommendations') {
        window.location.reload();
      } else {
        navigate(`/results?q=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative max-w-2xl mx-auto transition-all duration-300 ${
        isFocused ? 'transform scale-[1.02]' : ''
      }`}
    >
      <div className={`relative flex items-center glass-morphism rounded-2xl transition-all duration-300 ${
        isFocused ? 'shadow-medium ring-1 ring-primary/20' : 'shadow-soft'
      }`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={window.location.pathname === '/ai-recommendations' 
            ? "Describe your task or workflow for AI recommendations..." 
            : "Search for AI tools or describe your needs..."}
          className="flex-grow py-4 px-6 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none rounded-l-2xl"
        />
        <button
          type="submit"
          className="ml-2 mr-2 p-3 bg-primary text-white rounded-xl transition-all duration-300 hover:shadow-medium"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Subtle animated glow effect when focused */}
      {isFocused && (
        <div className="absolute inset-0 -z-10 bg-primary/5 rounded-2xl blur-lg animate-pulse-subtle"></div>
      )}
    </form>
  );
};

export default SearchBar;
