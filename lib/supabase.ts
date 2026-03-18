import { createClient } from '@supabase/supabase-js';
import { EventConfig, EventRow } from './types';
import { DEMO_EVENT } from './demo-event';

// ─── Supabase Client ────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pwrixdojbrmtwyfmygys.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3cml4ZG9qYnJtdHd5Zm15Z3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MTkyNTQsImV4cCI6MjA4MjE5NTI1NH0.xR7kmjDRiECOu7usPyzNKcg-dtIQCRNdnuI49Sl799U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Fetch Event by Slug ────────────────────────────────────

export async function getEventBySlug(slug: string): Promise<EventConfig | null> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      // Fallback: if slug matches demo event, return demo
      if (slug === DEMO_EVENT.core.slug) {
        return DEMO_EVENT;
      }
      return null;
    }

    const row = data as EventRow;

    // Increment views (fire-and-forget)
    supabase
      .from('events')
      .update({
        views_count: (row.views_count || 0) + 1,
        last_viewed: new Date().toISOString(),
      })
      .eq('id', row.id)
      .then();

    return {
      core: row.core,
      custom: row.custom || {},
    };
  } catch {
    // If events table doesn't exist yet, fallback to demo
    if (slug === DEMO_EVENT.core.slug) {
      return DEMO_EVENT;
    }
    return null;
  }
}
