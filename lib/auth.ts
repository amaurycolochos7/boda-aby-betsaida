import { EventCore, EventCustom } from './types';

// ─── Auth helpers (Client-Side → API Routes) ────────────────

export async function signUp(email: string, password: string) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al registrar');
  return data;
}

export async function signIn(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');
  return data;
}

export async function signOut() {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export async function getSession() {
  const res = await fetch('/api/auth/session');
  const data = await res.json();
  if (!data.user) return null;
  return { user: data.user };
}

export async function getUser() {
  const session = await getSession();
  return session?.user || null;
}

// ─── Event CRUD (Client-Side → API Routes) ──────────────────

export async function getUserEvents() {
  const res = await fetch('/api/events');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al obtener eventos');
  return data;
}

export async function createEvent(title: string, type: string = 'wedding') {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, type }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear evento');
  return data;
}

export async function updateEvent(id: string, core: EventCore, custom: EventCustom) {
  const res = await fetch(`/api/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ core, custom }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al guardar');
  return data;
}

export async function deleteEvent(id: string) {
  const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Error al eliminar');
  }
}

export async function getEventById(id: string) {
  const res = await fetch(`/api/events/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al obtener evento');
  return data;
}
