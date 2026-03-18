import { getSupabaseBrowser } from './supabase-browser';
import { EventCore, EventCustom } from './types';

const supabase = getSupabaseBrowser();

// ─── Auth helpers ───────────────────────────────────────────

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// ─── Event CRUD ─────────────────────────────────────────────

export async function getUserEvents() {
  const user = await getUser();
  if (!user) throw new Error('No autenticado');

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createEvent(title: string, type: string = 'wedding') {
  const user = await getUser();
  if (!user) throw new Error('No autenticado');

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

  const custom: EventCustom = type === 'wedding' ? getWeddingTemplate() : {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('events') as any)
    .insert({
      slug,
      type,
      core,
      custom,
      user_id: user.id,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data as any;
}

export async function updateEvent(id: string, core: EventCore, custom: EventCustom) {
  const user = await getUser();
  if (!user) throw new Error('No autenticado');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('events') as any)
    .update({
      core,
      custom,
      slug: core.slug,
      type: core.type,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as any;
}

export async function deleteEvent(id: string) {
  const user = await getUser();
  if (!user) throw new Error('No autenticado');

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
}

export async function getEventById(id: string) {
  const user = await getUser();
  if (!user) throw new Error('No autenticado');

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any;
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
    entryScreen: {
      initials: ['N', 'N'],
      subtitle: 'Nuestra Boda',
    },
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
    theme: {
      heroPhrase: 'Nos Casamos',
    },
    footer: {
      names: 'Novio & Novia',
      message: '¡Gracias por ser parte de nuestra celebración!',
    },
  };
}
