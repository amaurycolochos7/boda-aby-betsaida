import pool from './db';
import { EventConfig, EventRow, DEFAULT_MODULES, EventType } from './types';
import { DEMO_EVENT } from './demo-event';

// ─── Fetch Event by Slug (Server-Side → PostgreSQL) ─────────

export async function getEventBySlug(slug: string): Promise<EventConfig | null> {
  try {
    const result = await pool.query(
      'SELECT * FROM events WHERE slug = $1 AND is_active = true LIMIT 1',
      [slug]
    );

    if (result.rows.length === 0) {
      // Fallback: if slug matches demo event, return demo
      if (slug === DEMO_EVENT.core.slug) {
        return DEMO_EVENT;
      }
      return null;
    }

    const row = result.rows[0] as EventRow;

    // Increment views (fire-and-forget)
    pool.query(
      'UPDATE events SET views_count = views_count + 1, last_viewed = now() WHERE id = $1',
      [row.id]
    ).catch(() => {});

    const eventType = (row.core.type || 'other') as EventType;

    return {
      core: row.core,
      custom: row.custom || {},
      modules: row.modules || DEFAULT_MODULES[eventType],
    };
  } catch {
    // If events table doesn't exist yet, fallback to demo
    if (slug === DEMO_EVENT.core.slug) {
      return DEMO_EVENT;
    }
    return null;
  }
}
