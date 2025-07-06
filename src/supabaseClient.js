import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rjodccbbyvijdyilicqu.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqb2RjY2JieXZpamR5aWxpY3F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTM3OTMsImV4cCI6MjA1ODAyOTc5M30.dR_LoP1Z3ReQcOsaznRUv67i00t8-ryF-99AcxCO1FU'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
