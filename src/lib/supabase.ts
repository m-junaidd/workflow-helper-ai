
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://bnycgfzpfoiuwwnhxtjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJueWNnZnpwZm9pdXd3bmh4dGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4Mjc4MTQsImV4cCI6MjA1NjQwMzgxNH0.FnSsLndEpMA0CkI-u-_7jXP6NxAsj4yXn3Ft-NqqdBQ';

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get authorization header for edge functions
export const getAuthHeader = () => {
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
      .maybeSingle();
    
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

// Helper function to check if a user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error('Exception checking authentication status:', error);
    return false;
  }
};

// Helper function for handling general Supabase errors
export const handleSupabaseError = (error: any, fallbackMessage: string = 'An error occurred'): string => {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return fallbackMessage;
};

// Log client initialization for debugging
console.log('Supabase client initialized');
