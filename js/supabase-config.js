// Supabase Configuration
const SUPABASE_URL = 'https://pwrixdojbrmtwyfmygys.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cml4ZG9qYnJtdHd5Zm15Z3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MTkyNTQsImV4cCI6MjA4MjE5NTI1NH0.xR7kmjDRiECOu7usPyzNKcg-dtIQCRNdnuI49Sl799U';

// Initialize Supabase client - only if not already initialized
if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

