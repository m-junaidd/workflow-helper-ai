
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = 'https://bnycgfzpfoiuwwnhxtjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJueWNnZnpwZm9pdXd3bmh4dGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4Mjc4MTQsImV4cCI6MjA1NjQwMzgxNH0.FnSsLndEpMA0CkI-u-_7jXP6NxAsj4yXn3Ft-NqqdBQ';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
