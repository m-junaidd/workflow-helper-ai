
import React, { useState } from 'react';
import VoteButton from './VoteButton';

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  upvotes: number;
  imageUrl?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  id,
  name,
  description,
  category,
  url,
  upvotes,
  imageUrl
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`group flex rounded-2xl overflow-hidden bg-white hover-card transition-all duration-300 border border-gray-100 ${
        isHovered ? 'shadow-medium' : 'shadow-soft'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-shrink-0 w-16 flex items-start justify-center pt-6 pl-4">
        <VoteButton toolId={id} initialUpvotes={upvotes} />
      </div>
      
      <div className="flex-grow p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center mb-3">
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                {category}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>
            
            <p className="mt-2 text-gray-600 text-sm line-clamp-2">
              {description}
            </p>
          </div>
          
          {imageUrl && (
            <div className="ml-4 flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-gray-100">
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline"
          >
            Visit Website
          </a>
          
          <div className="text-xs text-gray-500">
            Updated 2 days ago
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
