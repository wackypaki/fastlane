import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://thpphchqfvljxfqofzsc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocHBoY2hxZnZsanhmcW9menNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4NTc3MjMsImV4cCI6MjAzNzQzMzcyM30.-T35epDMvaZ7J9_qMbP7woAlUWwbvxPTJt7T0cVorEA';
export const supabase = createClient(supabaseUrl, supabaseKey);