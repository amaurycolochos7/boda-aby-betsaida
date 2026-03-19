import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Run this once to add payment columns — GET /api/payments/init
export async function GET() {
  try {
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free';
    `);
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payment_history (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        plan_type TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency TEXT DEFAULT 'MXN',
        payment_id TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `);

    return NextResponse.json({ ok: true, message: 'Payment tables ready' });
  } catch (error: unknown) {
    console.error('Migration error:', error);
    const msg = error instanceof Error ? error.message : 'Migration failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
