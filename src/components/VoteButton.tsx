
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
    if (!user) {
      toast.error('Please sign in to vote');
      navigate('/auth');
      return;
    }

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
        const updateField = type === 'up' ? 'upvotes' : 'downvotes';
        
        const { error: updateError } = await supabase
          .from('tools')
          .update({ [updateField]: supabase.rpc('decrement', { x: 1 }) })
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
        const oldField = userVote === 'up' ? 'upvotes' : 'downvotes';
        const newField = type === 'up' ? 'upvotes' : 'downvotes';
        
        const { error: updateOldError } = await supabase
          .from('tools')
          .update({ [oldField]: supabase.rpc('decrement', { x: 1 }) })
          .eq('id', toolId);

        if (updateOldError) throw updateOldError;
        
        const { error: updateNewError } = await supabase
          .from('tools')
          .update({ [newField]: supabase.rpc('increment', { x: 1 }) })
          .eq('id', toolId);

        if (updateNewError) throw updateNewError;

        // Add the new vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert({ user_id: user.id, tool_id: toolId, vote_type: type });

        if (insertError) throw insertError;

        // Update local state
        setVotes(type === 'up' ? votes + 2 : votes - 2);
      } else {
        // User is voting for the first time
        // Add the vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert({ user_id: user.id, tool_id: toolId, vote_type: type });

        if (insertError) throw insertError;

        // Update the tool's vote count
        const updateField = type === 'up' ? 'upvotes' : 'downvotes';
        
        const { error: updateError } = await supabase
          .from('tools')
          .update({ [updateField]: supabase.rpc('increment', { x: 1 }) })
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
    }
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
