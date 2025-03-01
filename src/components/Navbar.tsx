
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto py-4 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-semibold tracking-tight transition-colors"
          >
            <span className="text-primary">AI</span>Tool<span className="text-primary">Finder</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium link-underline">
              Home
            </Link>
            <Link to="/about" className="text-sm font-medium link-underline">
              About
            </Link>
            <Link to="/categories" className="text-sm font-medium link-underline">
              Categories
            </Link>
            <button className="text-sm font-medium flex items-center link-underline">
              <Search className="h-4 w-4 mr-1" />
              Search
            </button>
          </nav>
          
          <div className="flex items-center">
            <button className="py-2 px-4 text-sm font-medium transition-all duration-300 rounded-full hover:bg-gray-100">
              Sign In
            </button>
            <button className="ml-2 py-2 px-4 bg-primary text-white rounded-full text-sm font-medium transition-all duration-300 hover:shadow-medium">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
