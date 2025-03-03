
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';

const Hero: React.FC = () => {
  const [welcomeMessage, setWelcomeMessage] = useState<string>('');
  const [isLoadingMessage, setIsLoadingMessage] = useState<boolean>(true);

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        // Add proper Authorization header with anon key
        const { data, error } = await supabase.functions.invoke('get-welcome-message', {
          headers: {
            Authorization: `Bearer ${supabase.auth.session()?.access_token || ''}`
          }
        });
        
        if (error) {
          console.error('Error fetching welcome message:', error);
          setWelcomeMessage('Discover the perfect AI tools tailored to your specific needs and workflows.');
        } else {
          setWelcomeMessage(data.message || 'Find AI tools that transform how you work');
        }
      } catch (err) {
        console.error('Exception fetching welcome message:', err);
        setWelcomeMessage('Discover the perfect AI tools tailored to your specific needs and workflows.');
      } finally {
        setIsLoadingMessage(false);
      }
    };

    fetchWelcomeMessage();
  }, []);

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background decoration - subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/5 filter blur-3xl opacity-70 animate-float" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-primary/10 filter blur-3xl opacity-60 animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-2 inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium tracking-wide animate-fade-in">
            Discover the perfect AI tools for your tasks
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-scale-in">
            Find the <span className="text-gradient">AI tools</span> that elevate your workflow
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto animate-slide-up">
            {isLoadingMessage ? (
              <Skeleton className="h-6 w-full mx-auto" />
            ) : (
              welcomeMessage
            )}
          </p>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SearchBar />
          </div>
          
          <div className="mt-8 text-gray-500 text-sm animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Try: "I need to transcribe and summarize podcast episodes" or "Design a logo for my startup"
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
