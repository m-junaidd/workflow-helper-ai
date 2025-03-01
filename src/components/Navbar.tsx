
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, LogOut, Wrench, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-soft' : 'bg-transparent'
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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link to="/results" className="text-sm font-medium flex items-center hover:text-primary transition-colors">
              <Search className="h-4 w-4 mr-1" />
              Search
            </Link>
          </nav>
          
          {/* User Menu or Auth Buttons */}
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {profile?.username ? profile.username.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuLabel>
                    {profile?.username || 'My Account'}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center">
                <Link to="/auth" className="py-2 px-4 text-sm font-medium transition-all duration-300 rounded-full hover:bg-gray-100">
                  Sign In
                </Link>
                <Link to="/auth" className="ml-2 py-2 px-4 bg-primary text-white rounded-full text-sm font-medium transition-all duration-300 hover:shadow-medium">
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden ml-4">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col h-full py-6">
                  <div className="flex-1 space-y-4">
                    <Link to="/" className="block py-2 text-sm font-medium hover:text-primary">
                      Home
                    </Link>
                    <Link to="/categories" className="block py-2 text-sm font-medium hover:text-primary">
                      Categories
                    </Link>
                    <Link to="/results" className="block py-2 text-sm font-medium flex items-center hover:text-primary">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Link>
                  </div>
                  
                  {!user && (
                    <div className="mt-8 space-y-3">
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/auth">Sign In</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link to="/auth">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
