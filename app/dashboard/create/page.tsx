'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createEvent } from '@/lib/auth';

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [type, setType] = useState('wedding');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setError('');
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const event: any = await createEvent(title.trim(), type);
      router.push(`/dashboard/${event.id}/edit`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear evento';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="dash-header">
        <h1>Crear Nuevo Evento</h1>
        <div className="dash-header-actions">
          <Link href="/dashboard" className="btn-secondary">
            ← Volver
          </Link>
        </div>
      </div>

      <div className="event-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Información Básica</h3>

            {error && (
              <div className="auth-error" style={{ marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <div className="form-grid">
              <div className="form-field full">
                <label htmlFor="title">Nombre del evento *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Ej: Boda de Juan y María"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="type">Tipo de evento</label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="wedding">Boda</option>
                  <option value="quinceañera">XV Años</option>
                  <option value="birthday">Cumpleaños</option>
                  <option value="corporate">Corporativo</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section" style={{ background: 'transparent', border: 'none', padding: '0' }}>
            <p style={{ color: 'var(--dash-text-muted)', fontSize: '14px', margin: '0 0 16px' }}>
              Se creará con un template base de {type === 'wedding' ? 'boda' : 'evento'}. 
              Podrás personalizar todos los detalles después.
            </p>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading || !title.trim()}>
                {loading ? 'Creando...' : 'Crear y Personalizar'}
              </button>
              <Link href="/dashboard" className="btn-secondary">
                Cancelar
              </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
