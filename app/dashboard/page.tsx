'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserEvents, deleteEvent } from '@/lib/auth';

interface EventRow {
  id: string;
  slug: string;
  type: string;
  core: { title: string; date: string; venue: string; time: string };
  is_active: boolean;
  views_count: number;
  last_viewed: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const data = await getUserEvents();
      setEvents(data as EventRow[]);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`¿Eliminar "${title}"? Esta acción no se puede deshacer.`)) return;

    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      showToast('Evento eliminado');
    } catch (err) {
      console.error(err);
      showToast('Error al eliminar');
    }
  }

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  }

  function formatDate(iso: string): string {
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const [year, month, day] = iso.split('-').map(Number);
    return `${day} ${months[month - 1]} ${year}`;
  }

  function formatTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h > 12 ? h - 12 : h;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  }

  const typeLabels: Record<string, string> = {
    wedding: 'Boda',
    'quinceañera': 'XV Años',
    birthday: 'Cumpleaños',
    corporate: 'Corporativo',
    other: 'Otro',
  };

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner"></div>
      </div>
    );
  }

  return (
    <>
      {toast && <div className="dash-toast">{toast}</div>}

      <div className="dash-header">
        <h1>Mis Eventos</h1>
        <div className="dash-header-actions">
          <Link href="/dashboard/upgrade" className="btn-secondary">
            Planes
          </Link>
          <Link href="/dashboard/create" className="btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nuevo Evento
          </Link>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <h3>No tienes eventos todavía</h3>
          <p>Crea tu primer evento y comparte el enlace con tus invitados</p>
          <Link href="/dashboard/create" className="btn-primary">
            Crear mi primer evento
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-card-header">
                <div>
                  <h3 className="event-card-title">{event.core.title}</h3>
                  <span className="event-card-type">
                    {typeLabels[event.type] || event.type}
                  </span>
                </div>
              </div>

              <div className="event-card-meta">
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {formatDate(event.core.date)} • {formatTime(event.core.time)}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {event.core.venue}
                </span>
                <span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  /event/{event.slug}
                </span>
              </div>

              <div className="event-card-stats">
                <div className="event-stat">
                  <div className="event-stat-value">{event.views_count || 0}</div>
                  <div className="event-stat-label">Vistas</div>
                </div>
                <div className="event-stat">
                  <div className="event-stat-value">
                    {event.is_active ? '✓' : '✗'}
                  </div>
                  <div className="event-stat-label">Activo</div>
                </div>
              </div>

              <div className="event-card-actions">
                <a
                  href={`/event/${event.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Ver
                </a>
                <Link href={`/dashboard/${event.id}/edit`} className="btn-primary">
                  Editar
                </Link>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(event.id, event.core.title)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
