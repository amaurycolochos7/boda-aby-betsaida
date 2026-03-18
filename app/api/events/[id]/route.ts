import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'eventcontrol-secret-key-2026');

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('auth-token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/events/[id]
export async function GET(req: NextRequest, context: RouteContext) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await context.params;
  const result = await pool.query(
    'SELECT * FROM events WHERE id = $1 AND user_id = $2',
    [id, userId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

// PUT /api/events/[id]
export async function PUT(req: NextRequest, context: RouteContext) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await context.params;
  const { core, custom } = await req.json();

  const result = await pool.query(
    `UPDATE events
     SET core = $1, custom = $2, slug = $3, type = $4, updated_at = now()
     WHERE id = $5 AND user_id = $6
     RETURNING *`,
    [JSON.stringify(core), JSON.stringify(custom), core.slug, core.type, id, userId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

// DELETE /api/events/[id]
export async function DELETE(req: NextRequest, context: RouteContext) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { id } = await context.params;
  await pool.query(
    'DELETE FROM events WHERE id = $1 AND user_id = $2',
    [id, userId]
  );

  return NextResponse.json({ ok: true });
}
