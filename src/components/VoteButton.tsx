
import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

interface VoteButtonProps {
  initialUpvotes?: number;
  toolId: string;
}

const VoteButton: React.FC<VoteButtonProps> = ({ initialUpvotes = 0, toolId }) => {
  const [votes, setVotes] = useState(initialUpvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const handleVote = (type: 'up' | 'down') => {
    // If user clicks the same button they already clicked, remove their vote
    if (type === userVote) {
      setVotes(type === 'up' ? votes - 1 : votes + 1);
      setUserVote(null);
      toast.info("Vote removed");
      return;
    }

    // If user is changing their vote from up to down or vice versa
    if (userVote) {
      // Add 2 or subtract 2 depending on the change (to account for removing the old vote and adding the new one)
      setVotes(type === 'up' ? votes + 2 : votes - 2);
    } else {
      // User is voting for the first time
      setVotes(type === 'up' ? votes + 1 : votes - 1);
    }

    setUserVote(type);
    toast.success(`${type === 'up' ? 'Upvoted' : 'Downvoted'} successfully`);

    // In a real app, you would send this to your backend
    console.log(`User ${type}voted tool ${toolId}. New vote count: ${votes}`);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <button 
        onClick={() => handleVote('up')}
        className={`p-1 rounded-full transition-all duration-200 
          ${userVote === 'up' 
            ? 'bg-green-100 text-green-600' 
            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'}`}
        aria-label="Upvote"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
      
      <span className={`text-sm font-medium transition-all duration-200 ${
        votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-gray-500'
      }`}>
        {votes}
      </span>
      
      <button 
        onClick={() => handleVote('down')}
        className={`p-1 rounded-full transition-all duration-200 
          ${userVote === 'down' 
            ? 'bg-red-100 text-red-600' 
            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'}`}
        aria-label="Downvote"
      >
        <ArrowDown className="h-5 w-5" />
      </button>
    </div>
  );
};

export default VoteButton;
