import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { writeFile, mkdir, unlink, readdir, stat } from 'fs/promises';
import path from 'path';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'eventcontrol-secret-key-2026');
const UPLOADS_DIR = process.env.UPLOADS_DIR || '/app/uploads';

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

// POST /api/upload — upload a file
export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const eventId = formData.get('eventId') as string | null;
  const category = formData.get('category') as string | null; // hero, gallery, couple, music

  if (!file || !eventId || !category) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Archivo muy grande (máx 10MB)' }, { status: 400 });
  }

  // Create directory structure: /uploads/{eventId}/{category}/
  const dir = path.join(UPLOADS_DIR, eventId, category);
  await mkdir(dir, { recursive: true });

  // Generate unique filename
  const ext = path.extname(file.name) || '.jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filepath = path.join(dir, filename);

  // Write file to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  // Return the public URL
  const url = `/api/uploads/${eventId}/${category}/${filename}`;

  return NextResponse.json({ url, filename });
}

// DELETE /api/upload — delete a file
export async function DELETE(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { url } = await req.json();
  if (!url) {
    return NextResponse.json({ error: 'URL requerida' }, { status: 400 });
  }

  // Extract path from URL: /api/uploads/{eventId}/{category}/{filename}
  const match = url.match(/\/api\/uploads\/(.+)/);
  if (!match) {
    return NextResponse.json({ error: 'URL inválida' }, { status: 400 });
  }

  const filepath = path.join(UPLOADS_DIR, match[1]);

  try {
    await unlink(filepath);
  } catch {
    // File might not exist, that's ok
  }

  return NextResponse.json({ ok: true });
}

// GET /api/upload?eventId=xxx&category=yyy — list files
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const eventId = req.nextUrl.searchParams.get('eventId');
  const category = req.nextUrl.searchParams.get('category');

  if (!eventId) {
    return NextResponse.json({ error: 'eventId requerido' }, { status: 400 });
  }

  const dir = path.join(UPLOADS_DIR, eventId, category || '');

  try {
    const dirStat = await stat(dir);
    if (!dirStat.isDirectory()) return NextResponse.json([]);

    const files = await readdir(dir);
    const urls = files.map(f => `/api/uploads/${eventId}/${category || ''}/${f}`);
    return NextResponse.json(urls);
  } catch {
    return NextResponse.json([]);
  }
}
