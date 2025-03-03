
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://bnycgfzpfoiuwwnhxtjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJueWNnZnpwZm9pdXd3bmh4dGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4Mjc4MTQsImV4cCI6MjA1NjQwMzgxNH0.FnSsLndEpMA0CkI-u-_7jXP6NxAsj4yXn3Ft-NqqdBQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get authorization header for edge functions
export const getAuthHeader = () => {
  const session = supabase.auth.getSession();
  return {
    Authorization: `Bearer ${supabaseAnonKey}`
  };
};

// Helper function to check if a user is an admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    return data?.role === 'admin';
  } catch (error) {
    console.error('Exception checking admin status:', error);
    return false;
  }
};
