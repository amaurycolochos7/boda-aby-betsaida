import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/supabase';
import EventShell from '@/components/event/EventShell';
import Countdown from '@/components/event/Countdown';
import Gallery from '@/components/event/Gallery';
import RSVPModal from '@/components/event/RSVPModal';
import type { Metadata } from 'next';

// ─── Dynamic Metadata ───────────────────────────────────────

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: 'Evento no encontrado' };

  return {
    title: event.core.title,
    description: `${event.core.title} — ${formatDate(event.core.date)} en ${event.core.venue}`,
    openGraph: {
      title: event.core.title,
      description: `¡Te invitamos! ${formatDate(event.core.date)}`,
      images: [event.core.heroImage],
    },
  };
}

// ─── Page Component ─────────────────────────────────────────

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const { core, custom } = event;
  const dateFormatted = formatDate(core.date);
  const timeFormatted = formatTime(core.time);

  return (
    <EventShell event={event}>
      {/* ========== HERO SECTION ========== */}
      <section id="hero" className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="ornament-top"></div>
          {custom.theme?.heroPhrase && (
            <p className="hero-phrase animate-on-scroll">{custom.theme.heroPhrase}</p>
          )}
          <h1 className="hero-names animate-on-scroll">
            {custom.couple ? (
              <>
                <span className="name groom-name">
                  <span className="alt-font">{custom.couple.groom.firstName.charAt(0)}</span>
                  {custom.couple.groom.firstName.slice(1)}
                </span>
                <span className="ampersand">&amp;</span>
                <span className="name bride-name">{custom.couple.bride.firstName}</span>
              </>
            ) : (
              <span className="name">{core.title}</span>
            )}
          </h1>
          <div className="hero-line animate-on-scroll"></div>
          <p className="hero-date animate-on-scroll">{dateFormatted}</p>
          <div className="ornament-bottom"></div>
        </div>
        <div className="scroll-indicator"><span></span></div>
      </section>

      {/* ========== INVITATION TEXT ========== */}
      {custom.inviteText && (
        <section className="invitation-text-section">
          <div className="section-container">
            <p className="invitation-message animate-on-scroll">
              {custom.inviteText}
            </p>
          </div>
        </section>
      )}

      {/* ========== COUPLE IMAGE 1 ========== */}
      {custom.coupleImages?.[0] && (
        <section className="couple-image-section">
          <div className="couple-image-container animate-on-scroll">
            <img src={custom.coupleImages[0]} alt={core.title} className="couple-full-image" />
          </div>
        </section>
      )}

      {/* ========== COUNTDOWN ========== */}
      <Countdown
        targetDate={core.date}
        targetTime={core.time}
        timezone={core.timezone}
      />

      {/* ========== COUPLE IMAGE 2 ========== */}
      {custom.coupleImages?.[1] && (
        <section className="couple-image-section">
          <div className="couple-image-container animate-on-scroll">
            <img src={custom.coupleImages[1]} alt={core.title} className="couple-full-image" />
          </div>
        </section>
      )}

      {/* ========== FAMILIES ========== */}
      {custom.parents && (
        <section id="families" className="families-section">
          <div className="section-container">
            <h2 className="section-title animate-on-scroll">Nuestros Padres</h2>
            <div className="families-grid">
              <div className="family-card animate-on-scroll">
                <div className="family-ornament"></div>
                <h3 className="family-title">Padres del Novio</h3>
                <div className="parents-names">
                  <p className="parent-name">{custom.parents.groom.father}</p>
                  <span className="parent-separator">&amp;</span>
                  <p className="parent-name">{custom.parents.groom.mother}</p>
                </div>
              </div>
              <div className="family-card animate-on-scroll delay-1">
                <div className="family-ornament"></div>
                <h3 className="family-title">Padres de la Novia</h3>
                <div className="parents-names">
                  <p className="parent-name">{custom.parents.bride.father}</p>
                  <span className="parent-separator">&amp;</span>
                  <p className="parent-name">{custom.parents.bride.mother}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== COUPLE IMAGE 3 ========== */}
      {custom.coupleImages?.[2] && (
        <section className="couple-image-section">
          <div className="couple-image-container animate-on-scroll">
            <img src={custom.coupleImages[2]} alt={core.title} className="couple-full-image" />
          </div>
        </section>
      )}

      {/* ========== EVENT DETAILS ========== */}
      <section id="event" className="event-section">
        <div className="section-container">
          <h2 className="section-title animate-on-scroll">Detalles del Evento</h2>
          <div className="event-cards">
            {/* Fecha */}
            <div className="event-card animate-on-scroll">
              <div className="event-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="8" y="12" width="48" height="44" rx="4" />
                  <line x1="8" y1="24" x2="56" y2="24" />
                  <line x1="20" y1="6" x2="20" y2="16" />
                  <line x1="44" y1="6" x2="44" y2="16" />
                  <rect x="16" y="32" width="8" height="8" rx="1" />
                  <rect x="28" y="32" width="8" height="8" rx="1" />
                  <rect x="40" y="32" width="8" height="8" rx="1" />
                  <rect x="16" y="44" width="8" height="8" rx="1" />
                  <rect x="28" y="44" width="8" height="8" rx="1" />
                </svg>
              </div>
              <h3 className="event-card-title">Fecha</h3>
              <p className="event-card-text">{formatDateShort(core.date)}</p>
              <p className="event-card-subtext">{core.date.split('-')[0]}</p>
            </div>

            {/* Hora */}
            <div className="event-card animate-on-scroll delay-1">
              <div className="event-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="32" cy="32" r="26" />
                  <circle cx="32" cy="32" r="3" />
                  <line x1="32" y1="12" x2="32" y2="16" />
                  <line x1="32" y1="48" x2="32" y2="52" />
                  <line x1="12" y1="32" x2="16" y2="32" />
                  <line x1="48" y1="32" x2="52" y2="32" />
                  <line x1="32" y1="32" x2="32" y2="20" />
                  <line x1="32" y1="32" x2="42" y2="38" />
                </svg>
              </div>
              <h3 className="event-card-title">Hora</h3>
              <p className="event-card-text">{timeFormatted}</p>
              <p className="event-card-subtext">Puntualidad</p>
            </div>

            {/* Ceremonia */}
            <div className="event-card animate-on-scroll delay-2">
              <div className="event-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 28 L32 10 L58 28" />
                  <rect x="10" y="28" width="44" height="28" rx="1" />
                  <rect x="26" y="38" width="12" height="18" />
                  <line x1="32" y1="38" x2="32" y2="56" />
                  <rect x="14" y="34" width="8" height="10" />
                  <line x1="18" y1="34" x2="18" y2="44" />
                  <rect x="42" y="34" width="8" height="10" />
                  <line x1="46" y1="34" x2="46" y2="44" />
                </svg>
              </div>
              <h3 className="event-card-title">Ceremonia</h3>
              <p className="event-card-text">{core.venue}</p>
              <p className="event-card-subtext">Ceremonia Civil y Discurso</p>
            </div>

            {/* Recepción */}
            <div className="event-card animate-on-scroll delay-3">
              <div className="event-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M32 8 L32 56" />
                  <path d="M32 8 C24 16, 20 28, 20 40" />
                  <path d="M32 8 C40 16, 44 28, 44 40" />
                  <path d="M16 12 L20 20 L12 20 Z" />
                  <path d="M48 12 L52 20 L44 20 Z" />
                  <circle cx="10" cy="16" r="2" />
                  <circle cx="54" cy="16" r="2" />
                  <circle cx="18" cy="8" r="2" />
                  <circle cx="46" cy="8" r="2" />
                  <ellipse cx="32" cy="56" rx="12" ry="4" />
                </svg>
              </div>
              <h3 className="event-card-title">Recepción</h3>
              <p className="event-card-text">{core.venue}</p>
              <p className="event-card-subtext">Fiesta y Celebración</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COUPLE IMAGE 4 ========== */}
      {custom.coupleImages?.[3] && (
        <section className="couple-image-section">
          <div className="couple-image-container animate-on-scroll">
            <img src={custom.coupleImages[3]} alt={core.title} className="couple-full-image" />
          </div>
        </section>
      )}

      {/* ========== LOCATION ========== */}
      <section id="location" className="location-section">
        <div className="section-container">
          <h2 className="section-title animate-on-scroll">Ubicación</h2>
          <p className="section-subtitle animate-on-scroll">{core.venue}</p>
          <div className="map-container animate-on-scroll">
            <div className="map-address">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M32 4 C18 4, 8 16, 8 28 C8 44, 32 60, 32 60 C32 60, 56 44, 56 28 C56 16, 46 4, 32 4 Z" />
                <circle cx="32" cy="26" r="8" />
              </svg>
              <p className="address-text">{core.address.split(',').slice(0, 2).join(',')}</p>
              <span className="address-city">{core.address.split(',').slice(2).join(',').trim()}</span>
            </div>
          </div>
          <div className="location-buttons animate-on-scroll">
            <a href={core.mapsUrl} className="location-btn" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 C7 2, 3 6.5, 3 11 C3 18, 12 22, 12 22 C12 22, 21 18, 21 11 C21 6.5, 17 2, 12 2 Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>Cómo Llegar</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========== COUPLE IMAGE 5 ========== */}
      {custom.coupleImages?.[4] && (
        <section className="couple-image-section">
          <div className="couple-image-container animate-on-scroll">
            <img src={custom.coupleImages[4]} alt={core.title} className="couple-full-image" />
          </div>
        </section>
      )}

      {/* ========== TIMELINE ========== */}
      {custom.timeline && custom.timeline.length > 0 && (
        <section id="timeline" className="timeline-section">
          <div className="section-container">
            <h2 className="section-title animate-on-scroll">Itinerario</h2>
            <div className="timeline">
              {custom.timeline.map((item, i) => (
                <div key={i} className={`timeline-item animate-on-scroll ${i > 0 ? `delay-${(i % 5) + 1}` : ''}`}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <span className="timeline-time">{item.time}</span>
                    <h3 className="timeline-title">{item.title}</h3>
                    {item.description && <p className="timeline-desc">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== GALLERY ========== */}
      {custom.gallery && custom.gallery.length > 0 && (
        <Gallery images={custom.gallery} />
      )}

      {/* ========== RSVP ========== */}
      {custom.whatsapp && custom.rsvp && (
        <RSVPModal
          contacts={custom.whatsapp}
          eventTitle={core.title}
          eventDate={core.date}
          eventTime={core.time}
          rsvpNote={custom.rsvp.note}
          confirmUrl={custom.rsvp.confirmUrl}
        />
      )}

      {/* ========== FOOTER ========== */}
      <footer className="footer">
        <div className="footer-ornament"></div>
        <p className="footer-names">{custom.footer?.names || core.title}</p>
        <p className="footer-date">{dateFormatted}</p>
        <p className="footer-thanks">{custom.footer?.message || ''}</p>
      </footer>
    </EventShell>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(iso: string): string {
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} de ${months[month - 1]} del ${year}`;
}

function formatDateShort(iso: string): string {
  const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const d = new Date(iso + 'T12:00:00');
  return `${days[d.getDay()]}, ${d.getDate()} de ${months[d.getMonth()]}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}
