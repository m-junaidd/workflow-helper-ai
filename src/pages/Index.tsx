
import React from 'react';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import ToolCard from '../components/ToolCard';
import { mockTools } from '../utils/mockData';

const Index: React.FC = () => {
  const topTools = mockTools.sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);

  return (
    <Layout>
      <Hero />
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Top-Rated AI Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the most popular AI tools that are helping professionals automate their workflows and boost productivity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {topTools.map((tool, index) => (
              <div 
                key={tool.id} 
                className="animate-fade-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ToolCard {...tool} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium shadow-soft hover:shadow-medium transition-all duration-300">
              View All Tools
            </button>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-600 mb-12">
              Our AI-powered platform makes it simple to find the perfect tools for your workflow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl hover:bg-white hover:shadow-soft transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Describe Your Task</h3>
              <p className="text-gray-600">
                Simply describe what you're trying to accomplish in plain language
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl hover:bg-white hover:shadow-soft transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get AI Recommendations</h3>
              <p className="text-gray-600">
                Our AI analyzes your needs and suggests the most relevant tools
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl hover:bg-white hover:shadow-soft transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Boost Your Productivity</h3>
              <p className="text-gray-600">
                Integrate the perfect AI tools and transform your workflow
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
