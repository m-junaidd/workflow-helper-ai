
import React from 'react';
import SearchBar from './SearchBar';

const Hero: React.FC = () => {
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
            Describe your tasks in plain language, and our AI will suggest the perfect tools to automate your work and boost your productivity.
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
