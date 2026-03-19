import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';
import { EventCore, EventCustom } from '@/lib/types';

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

// GET /api/events — list all events for the user
export async function GET(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const result = await pool.query(
    'SELECT * FROM events WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return NextResponse.json(result.rows);
}

// POST /api/events — create a new event
export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { title, type = 'wedding' } = await req.json();

  const slug = generateSlug(title);

  const core: EventCore = {
    slug,
    type: type as EventCore['type'],
    title,
    date: getFutureDate(90),
    time: '17:00',
    timezone: 'America/Mexico_City',
    venue: 'Por definir',
    address: 'Por definir',
    mapsUrl: '',
    heroImage: '/images/hero-couple.jpg',
    contactPhone: '',
  };

  const custom: EventCustom = getTemplateByType(type as EventCore['type']);

  const result = await pool.query(
    `INSERT INTO events (slug, type, core, custom, user_id, is_active)
     VALUES ($1, $2, $3, $4, $5, true)
     RETURNING *`,
    [slug, type, JSON.stringify(core), JSON.stringify(custom), userId]
  );

  return NextResponse.json(result.rows[0]);
}

// ─── Helpers ────────────────────────────────────────────────

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

function getFutureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getTemplateByType(type: EventCore['type']): EventCustom {
  switch (type) {
    case 'wedding': return getWeddingTemplate();
    case 'quinceañera': return getQuinceTemplate();
    case 'birthday': return getBirthdayTemplate();
    case 'corporate': return getCorporateTemplate();
    default: return getDefaultTemplate();
  }
}

function getWeddingTemplate(): EventCustom {
  return {
    couple: {
      groom: { firstName: 'Novio', lastName: '' },
      bride: { firstName: 'Novia', lastName: '' },
    },
    parents: {
      groom: { father: 'Padre del novio', mother: 'Madre del novio' },
      bride: { father: 'Padre de la novia', mother: 'Madre de la novia' },
    },
    entryScreen: { initials: ['N', 'N'], subtitle: 'Nuestra Boda' },
    inviteText: 'Con inmensa alegría nos complace invitarlos a este día tan especial.',
    timeline: [
      { time: '5:00 p.m.', title: 'Ceremonia' },
      { time: '6:00 p.m.', title: 'Recepción' },
      { time: '7:00 p.m.', title: 'Cena' },
      { time: '8:00 p.m.', title: 'Fiesta' },
    ],
    gallery: [],
    coupleImages: [],
    music: '',
    whatsapp: [],
    rsvp: {
      note: 'Favor de confirmar tu asistencia',
      deadline: getFutureDate(60),
    },
    theme: { heroPhrase: 'Nos Casamos' },
    footer: {
      names: 'Novio & Novia',
      message: '¡Gracias por ser parte de nuestra celebración!',
    },
  };
}

function getQuinceTemplate(): EventCustom {
  return {
    entryScreen: { initials: ['XV'], subtitle: 'Mis Quince Años' },
    inviteText: 'Con la bendición de Dios y de mis padres, te invito a celebrar conmigo este día tan especial.',
    timeline: [
      { time: '4:00 p.m.', title: 'Misa de Acción de Gracias' },
      { time: '5:30 p.m.', title: 'Recepción' },
      { time: '6:00 p.m.', title: 'Vals' },
      { time: '6:30 p.m.', title: 'Brindis' },
      { time: '7:00 p.m.', title: 'Cena' },
      { time: '8:00 p.m.', title: '¡Fiesta!' },
    ],
    gallery: [],
    coupleImages: [],
    music: '',
    whatsapp: [],
    rsvp: {
      note: 'Favor de confirmar tu asistencia',
      deadline: getFutureDate(45),
    },
    theme: { heroPhrase: 'Mis XV Años' },
    footer: {
      names: 'Quinceañera',
      message: '¡Gracias por acompañarme en este día tan especial!',
    },
  };
}

function getBirthdayTemplate(): EventCustom {
  return {
    entryScreen: { initials: ['🎂'], subtitle: '¡Estás Invitado!' },
    inviteText: 'Te invitamos a celebrar con nosotros este día tan especial. ¡Tu presencia es el mejor regalo!',
    timeline: [
      { time: '3:00 p.m.', title: 'Llegada de invitados' },
      { time: '4:00 p.m.', title: 'Juegos y actividades' },
      { time: '5:00 p.m.', title: 'Pastel y piñata' },
      { time: '6:00 p.m.', title: '¡Fiesta!' },
    ],
    gallery: [],
    coupleImages: [],
    music: '',
    whatsapp: [],
    rsvp: {
      note: 'Favor de confirmar tu asistencia',
      deadline: getFutureDate(30),
    },
    theme: { heroPhrase: '¡Celebremos!' },
    footer: {
      names: 'Festejado',
      message: '¡Gracias por celebrar con nosotros!',
    },
  };
}

function getCorporateTemplate(): EventCustom {
  return {
    entryScreen: { initials: ['EC'], subtitle: 'Evento Corporativo' },
    inviteText: 'Nos complace extenderle la invitación a este importante evento. Su presencia es de gran valor para nosotros.',
    timeline: [
      { time: '9:00 a.m.', title: 'Registro' },
      { time: '9:30 a.m.', title: 'Bienvenida' },
      { time: '10:00 a.m.', title: 'Conferencias' },
      { time: '1:00 p.m.', title: 'Comida' },
      { time: '3:00 p.m.', title: 'Networking' },
    ],
    gallery: [],
    coupleImages: [],
    music: '',
    whatsapp: [],
    rsvp: {
      note: 'Favor de confirmar su asistencia',
      deadline: getFutureDate(30),
    },
    theme: { heroPhrase: 'Bienvenido' },
    footer: {
      names: 'Organizador',
      message: 'Agradecemos su presencia.',
    },
  };
}

function getDefaultTemplate(): EventCustom {
  return {
    entryScreen: { initials: ['🎉'], subtitle: '¡Estás Invitado!' },
    inviteText: 'Te invitamos a celebrar con nosotros.',
    timeline: [
      { time: '5:00 p.m.', title: 'Inicio' },
      { time: '6:00 p.m.', title: 'Evento principal' },
      { time: '8:00 p.m.', title: 'Cierre' },
    ],
    gallery: [],
    coupleImages: [],
    music: '',
    whatsapp: [],
    rsvp: {
      note: 'Favor de confirmar tu asistencia',
      deadline: getFutureDate(30),
    },
    theme: { heroPhrase: '¡Celebremos!' },
    footer: {
      names: 'Evento',
      message: '¡Gracias por acompañarnos!',
    },
  };
}

