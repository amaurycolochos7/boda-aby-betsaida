'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getEventById, updateEvent } from '@/lib/auth';
import { EventCore, EventCustom } from '@/lib/types';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  // Core fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState('wedding');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('17:00');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [mapsUrl, setMapsUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Custom fields
  const [groomFirst, setGroomFirst] = useState('');
  const [groomLast, setGroomLast] = useState('');
  const [brideFirst, setBrideFirst] = useState('');
  const [brideLast, setBrideLast] = useState('');
  const [groomFather, setGroomFather] = useState('');
  const [groomMother, setGroomMother] = useState('');
  const [brideFather, setBrideFather] = useState('');
  const [brideMother, setBrideMother] = useState('');
  const [heroPhrase, setHeroPhrase] = useState('');
  const [inviteText, setInviteText] = useState('');
  const [initials, setInitials] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [footerNames, setFooterNames] = useState('');
  const [footerMessage, setFooterMessage] = useState('');
  const [rsvpNote, setRsvpNote] = useState('');
  const [rsvpDeadline, setRsvpDeadline] = useState('');

  useEffect(() => {
    loadEvent();
  }, [id]);

  async function loadEvent() {
    try {
      const event = await getEventById(id);
      if (!event) {
        router.push('/dashboard');
        return;
      }

      const core = event.core as EventCore;
      const custom = (event.custom || {}) as EventCustom;

      // Core
      setTitle(core.title || '');
      setSlug(core.slug || '');
      setType(core.type || 'wedding');
      setDate(core.date || '');
      setTime(core.time || '17:00');
      setVenue(core.venue || '');
      setAddress(core.address || '');
      setMapsUrl(core.mapsUrl || '');
      setContactPhone(core.contactPhone || '');

      // Custom
      setGroomFirst(custom.couple?.groom?.firstName || '');
      setGroomLast(custom.couple?.groom?.lastName || '');
      setBrideFirst(custom.couple?.bride?.firstName || '');
      setBrideLast(custom.couple?.bride?.lastName || '');
      setGroomFather(custom.parents?.groom?.father || '');
      setGroomMother(custom.parents?.groom?.mother || '');
      setBrideFather(custom.parents?.bride?.father || '');
      setBrideMother(custom.parents?.bride?.mother || '');
      setHeroPhrase(custom.theme?.heroPhrase || '');
      setInviteText(custom.inviteText || '');
      setInitials((custom.entryScreen?.initials || []).join(', '));
      setSubtitle(custom.entryScreen?.subtitle || '');
      setFooterNames(custom.footer?.names || '');
      setFooterMessage(custom.footer?.message || '');
      setRsvpNote(custom.rsvp?.note || '');
      setRsvpDeadline(custom.rsvp?.deadline || '');
    } catch (err) {
      console.error(err);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const core: EventCore = {
        slug,
        type: type as EventCore['type'],
        title,
        date,
        time,
        timezone: 'America/Mexico_City',
        venue,
        address,
        mapsUrl,
        heroImage: '/images/hero-couple.jpg',
        contactPhone,
      };

      const initialsArr = initials.split(',').map((s) => s.trim()).filter(Boolean);

      const custom: EventCustom = {
        couple: {
          groom: { firstName: groomFirst, lastName: groomLast },
          bride: { firstName: brideFirst, lastName: brideLast },
        },
        parents: {
          groom: { father: groomFather, mother: groomMother },
          bride: { father: brideFather, mother: brideMother },
        },
        entryScreen: {
          initials: initialsArr.length === 2 ? initialsArr : [groomFirst.charAt(0) || 'N', brideFirst.charAt(0) || 'N'],
          subtitle: subtitle || 'Nuestra Boda',
        },
        inviteText,
        theme: { heroPhrase: heroPhrase || 'Nos Casamos' },
        footer: {
          names: footerNames || `${groomFirst} & ${brideFirst}`,
          message: footerMessage,
        },
        rsvp: rsvpNote ? {
          note: rsvpNote,
          deadline: rsvpDeadline,
        } : undefined,
        // Preserve existing data that's not in the form
        timeline: [],
        gallery: [],
        coupleImages: [],
        music: '',
        whatsapp: [],
      };

      await updateEvent(id, core, custom);
      showToast('¡Evento guardado!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al guardar';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  }

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
        <h1>Editar Evento</h1>
        <div className="dash-header-actions">
          <a href={`/event/${slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Ver Evento ↗
          </a>
          <Link href="/dashboard" className="btn-secondary">
            ← Volver
          </Link>
        </div>
      </div>

      <div className="event-form">
        <form onSubmit={handleSave}>
          {error && (
            <div className="auth-error" style={{ marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {/* ─── Core: Datos del Evento ──────────────────────── */}
          <div className="form-section">
            <h3>Datos del Evento</h3>
            <div className="form-grid">
              <div className="form-field full">
                <label>Título del evento</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Slug (URL)</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="wedding">Boda</option>
                  <option value="quinceañera">XV Años</option>
                  <option value="birthday">Cumpleaños</option>
                  <option value="corporate">Corporativo</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              <div className="form-field">
                <label>Fecha</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="form-field">
                <label>Hora</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
              </div>
              <div className="form-field full">
                <label>Lugar / Salón</label>
                <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder='Ej: Salón "El Jardín"' />
              </div>
              <div className="form-field full">
                <label>Dirección completa</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, colonia, CP, ciudad" />
              </div>
              <div className="form-field">
                <label>Link de Google Maps</label>
                <input value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..." />
              </div>
              <div className="form-field">
                <label>Teléfono de contacto</label>
                <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="529611234567" />
              </div>
            </div>
          </div>

          {/* ─── Custom: Pareja ──────────────────────────────── */}
          <div className="form-section">
            <h3>Pareja</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Nombre del novio</label>
                <input value={groomFirst} onChange={(e) => setGroomFirst(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Apellido del novio</label>
                <input value={groomLast} onChange={(e) => setGroomLast(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Nombre de la novia</label>
                <input value={brideFirst} onChange={(e) => setBrideFirst(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Apellido de la novia</label>
                <input value={brideLast} onChange={(e) => setBrideLast(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ─── Custom: Padres ──────────────────────────────── */}
          <div className="form-section">
            <h3>Padres</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Padre del novio</label>
                <input value={groomFather} onChange={(e) => setGroomFather(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Madre del novio</label>
                <input value={groomMother} onChange={(e) => setGroomMother(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Padre de la novia</label>
                <input value={brideFather} onChange={(e) => setBrideFather(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Madre de la novia</label>
                <input value={brideMother} onChange={(e) => setBrideMother(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ─── Custom: Personalización ─────────────────────── */}
          <div className="form-section">
            <h3>Personalización</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Frase del Hero</label>
                <input value={heroPhrase} onChange={(e) => setHeroPhrase(e.target.value)} placeholder="Nos Casamos" />
              </div>
              <div className="form-field">
                <label>Iniciales (separadas por coma)</label>
                <input value={initials} onChange={(e) => setInitials(e.target.value)} placeholder="A, B" />
              </div>
              <div className="form-field">
                <label>Subtítulo entrada</label>
                <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Nuestra Boda" />
              </div>
              <div className="form-field full">
                <label>Texto de invitación</label>
                <textarea value={inviteText} onChange={(e) => setInviteText(e.target.value)} rows={4} />
              </div>
            </div>
          </div>

          {/* ─── Custom: Footer & RSVP ───────────────────────── */}
          <div className="form-section">
            <h3>Footer y Confirmación</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Nombres del footer</label>
                <input value={footerNames} onChange={(e) => setFooterNames(e.target.value)} placeholder="Novio & Novia" />
              </div>
              <div className="form-field full">
                <label>Mensaje del footer</label>
                <input value={footerMessage} onChange={(e) => setFooterMessage(e.target.value)} />
              </div>
              <div className="form-field full">
                <label>Nota de confirmación (RSVP)</label>
                <input value={rsvpNote} onChange={(e) => setRsvpNote(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Fecha límite RSVP</label>
                <input type="date" value={rsvpDeadline} onChange={(e) => setRsvpDeadline(e.target.value)} />
              </div>
            </div>
          </div>

          {/* ─── Save ────────────────────────────────────────── */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <a href={`/event/${slug}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Vista Previa ↗
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
