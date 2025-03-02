
import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface VoteButtonProps {
  initialUpvotes?: number;
  toolId: string;
}

const VoteButton: React.FC<VoteButtonProps> = ({ initialUpvotes = 0, toolId }) => {
  const [votes, setVotes] = useState(initialUpvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserVote();
    }
  }, [user, toolId]);

  const fetchUserVote = async () => {
    try {
      const { data, error } = await supabase
        .from('votes')
        .select('vote_type')
        .eq('user_id', user?.id)
        .eq('tool_id', toolId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUserVote(data.vote_type as 'up' | 'down');
      }
    } catch (error) {
      console.error('Error fetching user vote:', error);
    }
  };

  const handleVote = async (type: 'up' | 'down') => {
    if (isVoting) return; // Prevent multiple clicks
    
    if (!user) {
      toast.error('Please sign in to vote');
      navigate('/auth');
      return;
    }

    setIsVoting(true);
    
    try {
      // If user clicks the same button they already clicked, remove their vote
      if (type === userVote) {
        // Delete the vote from the database
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', toolId);

        if (deleteError) throw deleteError;

        // Update tool's vote count
        const voteChange = type === 'up' ? -1 : 1;
        
        const { error: updateError } = await supabase
          .from('tools')
          .update({ 
            upvotes: type === 'up' ? votes - 1 : votes,
            downvotes: type === 'down' ? supabase.rpc('decrement', { x: 1 }) : undefined 
          })
          .eq('id', toolId);

        if (updateError) throw updateError;

        // Update local state
        setVotes(type === 'up' ? votes - 1 : votes + 1);
        setUserVote(null);
        toast.info("Vote removed");
        return;
      }

      // If user is changing their vote
      if (userVote) {
        // Delete the old vote
        const { error: deleteError } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', toolId);

        if (deleteError) throw deleteError;

        // Update the tool's vote counts (remove old vote, add new vote)
        const { error: updateError } = await supabase
          .from('tools')
          .update({ 
            upvotes: type === 'up' ? votes + 1 : (userVote === 'up' ? votes - 1 : votes),
            downvotes: type === 'down' ? supabase.rpc('increment', { x: 1 }) : 
                      (userVote === 'down' ? supabase.rpc('decrement', { x: 1 }) : undefined)  
          })
          .eq('id', toolId);

        if (updateError) throw updateError;
        
        // Add the new vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert({ user_id: user.id, tool_id: toolId, vote_type: type });

        if (insertError) throw insertError;

        // Update local state
        setVotes(type === 'up' ? 
          (userVote === 'up' ? votes : votes + 2) : 
          (userVote === 'down' ? votes : votes - 2));
      } else {
        // User is voting for the first time
        // Add the vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert({ user_id: user.id, tool_id: toolId, vote_type: type });

        if (insertError) throw insertError;

        // Update the tool's vote count
        const { error: updateError } = await supabase
          .from('tools')
          .update({ 
            upvotes: type === 'up' ? supabase.rpc('increment', { x: 1 }) : undefined,
            downvotes: type === 'down' ? supabase.rpc('increment', { x: 1 }) : undefined 
          })
          .eq('id', toolId);

        if (updateError) throw updateError;

        // Update local state
        setVotes(type === 'up' ? votes + 1 : votes - 1);
      }

      setUserVote(type);
      toast.success(`${type === 'up' ? 'Upvoted' : 'Downvoted'} successfully`);
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to save your vote');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <button 
        onClick={() => handleVote('up')}
        disabled={isVoting}
        className={`p-1 rounded-full transition-all duration-200 
          ${userVote === 'up' 
            ? 'bg-green-100 text-green-600' 
            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'} 
          ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
        disabled={isVoting}
        className={`p-1 rounded-full transition-all duration-200 
          ${userVote === 'down' 
            ? 'bg-red-100 text-red-600' 
            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'}
          ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        aria-label="Downvote"
      >
        <ArrowDown className="h-5 w-5" />
      </button>
    </div>
  );
};

export default VoteButton;
