import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pwrixdojbrmtwyfmygys.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cml4ZG9qYnJtdHd5Zm15Z3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MTkyNTQsImV4cCI6MjA4MjE5NTI1NH0.xR7kmjDRiECOu7usPyzNKcg-dtIQCRNdnuI49Sl799U';

/**
 * Browser-side Supabase client (singleton)
 * Used for auth and dashboard operations
 */
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowser() {
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return client;
}
