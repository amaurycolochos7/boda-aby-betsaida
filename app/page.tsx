import Link from 'next/link';
import { ScrollAnimator, FAQList, TestimonialCarousel, AnimatedURL } from '@/components/landing/LandingInteractive';
import type { Metadata } from 'next';

import './landing.css';

const CheckIcon = () => (
  <svg className="ec-pricing-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
);

export const metadata: Metadata = {
  title: 'EventControl — Organiza cualquier evento sin caos',
  description: 'Invitaciones digitales, confirmaciones, control de invitados y logistica completa. Todo en un solo sistema para bodas, fiestas y eventos profesionales.',
  openGraph: {
    title: 'EventControl — Organiza cualquier evento sin caos',
    description: 'Invitaciones digitales, confirmaciones por WhatsApp, control de invitados en tiempo real.',
    url: 'https://eventcontrol.site',
    siteName: 'EventControl',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EventControl',
    description: 'Organiza cualquier evento sin caos. Invitaciones digitales y control completo.',
  },
};

export default function LandingPage() {
  return (
    <ScrollAnimator>
    <div className="ec">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="ec-header">
        <div className="ec-header-inner">
          <span className="ec-logo">EventControl</span>
          <nav className="ec-nav">
            <Link href="/login" className="ec-nav-link">Iniciar sesion</Link>
            <Link href="/register" className="ec-nav-btn">Crear cuenta</Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="ec-hero">
        <div className="ec-hero-content">
          <h1 className="ec-hero-title">Organiza cualquier evento sin caos</h1>
          <p className="ec-hero-sub">
            Invitados, confirmaciones, accesos y logistica en un solo sistema.<br />
            Sin Excel, sin listas perdidas.
          </p>
          <div className="ec-hero-btns">
            <Link href="/register" className="btn-dark">Crear mi evento</Link>
            <a href="#demo" className="btn-ghost">Ver demo real</a>
          </div>
        </div>
        <div className="ec-hero-mockup">
          <div className="ec-hero-mockup-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/dashboard-preview.png" alt="Panel de EventControl" className="ec-hero-mockup-img" />
          </div>
        </div>
      </section>

      {/* ── Feature Stats ──────────────────────────────────── */}
      <section className="ec-features">
        <div className="ec-features-inner">
          <div className="ec-feature">
            <div className="ec-feature-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>
            <div><strong>+200 invitados</strong><span>gestionados</span></div>
          </div>
          <div className="ec-feature">
            <div className="ec-feature-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11-2h2v3h-2v-3zm3 0h2v2h-2v-2zm-3 5h2v3h-2v-3zm3-2h2v2h-2v-2zm2 3h2v2h-2v-2z"/></svg></div>
            <div><strong>Acceso con QR</strong><span>en segundos</span></div>
          </div>
          <div className="ec-feature">
            <div className="ec-feature-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg></div>
            <div><strong>Panel en</strong><span>tiempo real</span></div>
          </div>
        </div>
      </section>

      {/* ── Tu Propio Sitio (HERO FEATURE) ─────────────────── */}
      <section className="ec-subdomain">
        <div className="ec-subdomain-inner ec-animate">
          <p className="ec-subdomain-label">Tu propio sitio</p>
          <h2 className="ec-subdomain-title">Tu evento tiene su propia direccion web</h2>
          <p className="ec-subdomain-sub">Facil de compartir, facil de recordar. Cada evento con su identidad unica.</p>
          <AnimatedURL />
        </div>
      </section>

      {/* ── Demo (Phone) ───────────────────────────────────── */}
      <section id="demo" className="ec-demo">
        <p className="ec-demo-label">Producto real</p>
        <h2 className="ec-demo-heading">Un evento real, funcionando</h2>
        <p className="ec-demo-sub">Creado con EventControl y usado con invitados reales</p>
        <div className="ec-demo-device">
          <div className="ec-phone">
            <div className="ec-phone-notch"></div>
            <div className="ec-phone-screen">
              <iframe className="ec-demo-iframe" src="/event/abidan-betsaida" title="Demo EventControl" loading="lazy" />
            </div>
            <div className="ec-phone-bar"></div>
          </div>
        </div>
      </section>

      {/* ── Validation ─────────────────────────────────────── */}
      <section className="ec-validation">
        <p><strong>+100 invitados confirmados</strong> en un evento real.<span className="ec-val-sub">Sin listas manuales. Sin errores.</span></p>
      </section>

      {/* ── Comparte ───────────────────────────────────────── */}
      <section className="ec-section ec-section-alt">
        <div className="ec-section-inner ec-animate">
          <div>
            <p className="ec-section-label">Comparte</p>
            <h3 className="ec-section-title">Tu evento, listo para enviar</h3>
            <p className="ec-section-desc">Un enlace con toda la informacion. Compartelo por WhatsApp y tus invitados confirman desde ahi.</p>
          </div>
          <div className="ec-section-visual">
            <div className="wa-phone">
              <div className="wa-header">
                <div className="wa-header-left">
                  <svg className="wa-icon" viewBox="0 0 24 24" fill="#fff"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                  <div className="wa-avatar">A</div>
                  <div className="wa-contact-info"><div className="wa-contact-name">Abidan</div><div className="wa-contact-status">en linea</div></div>
                </div>
                <div className="wa-header-right">
                  <svg className="wa-icon" viewBox="0 0 24 24" fill="#fff"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                  <svg className="wa-icon" viewBox="0 0 24 24" fill="#fff"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <svg className="wa-icon" viewBox="0 0 24 24" fill="#fff"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
              </div>
              <div className="wa-chat">
                <div className="wa-wallpaper"></div>
                <div className="wa-messages">
                  <div className="wa-date-chip">HOY</div>
                  <div className="wa-bubble-in">
                    <div className="wa-link-preview">
                      <div className="wa-link-preview-bar"></div>
                      <div className="wa-link-preview-body">
                        <div className="wa-link-preview-domain">eventcontrol.site</div>
                        <div className="wa-link-preview-title">Boda Abidan y Betsaida</div>
                        <div className="wa-link-preview-desc">Te invitamos a celebrar con nosotros</div>
                      </div>
                    </div>
                    <p className="wa-bubble-text">
                      Hola <strong>Maria Lopez</strong>, nos da mucha alegria invitarlos a nuestra boda.<br /><br />
                      Para ver los detalles y <strong>confirmar su asistencia</strong>, por favor ingresa:<br />
                      <span className="wa-link-url">eventcontrol.site/event/abidan-betsaida</span><br /><br />
                      Tu codigo de acceso es: <strong>ESGW</strong><br /><br />
                      Esperamos contar con su presencia.
                    </p>
                    <div className="wa-bubble-meta"><span className="wa-time">10:32 a.m.</span></div>
                  </div>
                  <div className="wa-bubble-out">
                    <p className="wa-bubble-text">Hola Abidan, gracias por la invitacion. Confirmare enseguida.</p>
                    <div className="wa-bubble-meta">
                      <span className="wa-time">2:14 p.m.</span>
                      <svg className="wa-check-icon" viewBox="0 0 16 11" fill="#53bdeb"><path d="M11.071.653a.457.457 0 00-.304-.102.493.493 0 00-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 00-.336-.146.47.47 0 00-.343.146l-.311.31a.445.445 0 00-.14.337c0 .136.046.254.14.337l2.995 2.83a.48.48 0 00.347.153c.14 0 .265-.06.377-.176l6.683-8.253a.456.456 0 00.108-.305.456.456 0 00-.108-.305l-.132-.368z"/><path d="M14.871.653a.457.457 0 00-.304-.102.493.493 0 00-.381.178l-6.19 7.636-1.2-1.134-.349.427 1.486 1.4a.48.48 0 00.347.153c.14 0 .265-.06.377-.176l6.683-8.253a.456.456 0 00.108-.305.456.456 0 00-.108-.305l-.469-.519z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="wa-input">
                <div className="wa-input-field">
                  <svg className="wa-input-icon" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.5"><circle cx="12" cy="12" r="9.5" /><circle cx="9" cy="10" r="1.2" fill="#54656f" stroke="none" /><circle cx="15" cy="10" r="1.2" fill="#54656f" stroke="none" /><path d="M8.5 14.5c.8 1.5 2 2.5 3.5 2.5s2.7-1 3.5-2.5" strokeLinecap="round" /></svg>
                  <span className="wa-input-placeholder">Mensaje</span>
                </div>
                <div className="wa-input-actions">
                  <svg className="wa-input-icon wa-clip-icon" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.6" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
                  <svg className="wa-input-icon" viewBox="0 0 24 24" fill="none" stroke="#54656f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
                </div>
                <div className="wa-mic-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0014 0" /><line x1="12" y1="17" x2="12" y2="21" /><line x1="8" y1="21" x2="16" y2="21" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Controla ───────────────────────────────────────── */}
      <section className="ec-section">
        <div className="ec-section-inner reverse ec-animate">
          <div>
            <p className="ec-section-label">Controla</p>
            <h3 className="ec-section-title">Sabe quien viene y quien falta</h3>
            <p className="ec-section-desc">Cada confirmacion llega al instante. Sin perseguir respuestas, sin hojas de calculo.</p>
          </div>
          <div className="ec-section-visual">
            <div className="ec-list">
              <div className="ec-list-header"><span className="ec-list-header-title">Invitados</span><span className="ec-list-header-count">87 / 110</span></div>
              <div className="ec-list-items">
                <div className="ec-list-row"><div className="ec-list-left"><span className="ec-list-dot ec-list-dot-green"></span><span className="ec-list-name">Maria Lopez</span></div><span className="ec-list-meta">2 personas</span></div>
                <div className="ec-list-row"><div className="ec-list-left"><span className="ec-list-dot ec-list-dot-green"></span><span className="ec-list-name">Carlos Rivera</span></div><span className="ec-list-meta">4 personas</span></div>
                <div className="ec-list-row"><div className="ec-list-left"><span className="ec-list-dot ec-list-dot-amber"></span><span className="ec-list-name">Ana Torres</span></div><span className="ec-list-meta">Pendiente</span></div>
                <div className="ec-list-row"><div className="ec-list-left"><span className="ec-list-dot ec-list-dot-green"></span><span className="ec-list-name">Luis Mendez</span></div><span className="ec-list-meta">3 personas</span></div>
                <div className="ec-list-row"><div className="ec-list-left"><span className="ec-list-dot ec-list-dot-green"></span><span className="ec-list-name">Fernanda Vega</span></div><span className="ec-list-meta">2 personas</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Organiza ───────────────────────────────────────── */}
      <section className="ec-section ec-section-alt">
        <div className="ec-section-inner ec-animate">
          <div>
            <p className="ec-section-label">Organiza</p>
            <h3 className="ec-section-title">Todo en un solo lugar</h3>
            <p className="ec-section-desc">Confirmaciones, accesos, mesas y vistas de tu evento. Un resumen claro de lo que importa.</p>
          </div>
          <div className="ec-section-visual">
            <div className="ec-panel">
              <div className="ec-panel-header">Resumen del evento</div>
              <div className="ec-panel-body">
                <div className="ec-panel-row"><span className="ec-panel-label">Confirmados</span><span className="ec-panel-value">87</span></div>
                <div className="ec-panel-row"><span className="ec-panel-label">Pendientes</span><span className="ec-panel-value">23</span></div>
                <div className="ec-panel-row"><span className="ec-panel-label">Vistas</span><span className="ec-panel-value">342</span></div>
                <div className="ec-panel-row"><span className="ec-panel-label">Mesas</span><span className="ec-panel-value">12</span></div>
                <div className="ec-panel-bar-section">
                  <div className="ec-panel-bar-info"><span>Capacidad</span><span>79%</span></div>
                  <div className="ec-panel-bar-track"><div className="ec-panel-bar-fill"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials (Carousel + Video) ────────────────── */}
      <section className="ec-testimonials">
        <div className="ec-testimonials-inner">
          <p className="ec-testimonials-label ec-animate">Testimonios</p>
          <h2 className="ec-testimonials-title ec-animate">Lo que dicen quienes lo usan</h2>

          <div className="ec-testimonials-split ec-animate">
            <TestimonialCarousel items={[
              { stars: 5, text: 'Organizamos nuestra boda para 200 invitados y fue increible tener todo en un solo lugar. Las confirmaciones llegaban al instante.', initials: 'ML', name: 'Maria y Luis', role: 'Boda en Guadalajara' },
              { stars: 5, text: 'Como organizadora, EventControl me permite manejar varios eventos al mismo tiempo sin perder el control.', initials: 'CR', name: 'Carolina Reyes', role: 'Organizadora de eventos' },
              { stars: 5, text: 'La invitacion digital quedo hermosa. El sistema de mesas nos ahorro horas de trabajo.', initials: 'AF', name: 'Andrea y Fernando', role: 'Boda en Monterrey' },
            ]} />

            <div className="ec-testimonials-video">
              <div className="ec-video-placeholder">
                <svg className="ec-video-play" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" />
                  <polygon points="26,20 46,32 26,44" fill="currentColor" />
                </svg>
                <p className="ec-video-label">Video testimonio</p>
                <p className="ec-video-sub">Proximamente</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="ec-faq">
        <div className="ec-faq-inner">
          <p className="ec-faq-label ec-animate">Preguntas frecuentes</p>
          <h2 className="ec-faq-title ec-animate">Todo lo que necesitas saber</h2>
          <div className="ec-faq-list ec-animate">
            <FAQList items={[
              { question: 'Que tipo de eventos puedo crear?', answer: 'Bodas, quinceaneras, cumpleanos, eventos corporativos y cualquier tipo de celebracion. El sistema se adapta a lo que necesites.' },
              { question: 'Puedo editar mi invitacion despues de crearla?', answer: 'Si. Puedes modificar textos, imagenes, musica, galeria y todos los detalles de tu evento en cualquier momento desde el panel de control.' },
              { question: 'Como confirman los invitados su asistencia?', answer: 'Compartes un enlace unico por WhatsApp o redes sociales. Tus invitados abren el enlace, ven la invitacion completa y confirman directamente desde ahi. Tu ves las confirmaciones en tiempo real.' },
              { question: 'Necesito conocimientos tecnicos para usarlo?', answer: 'No. El sistema esta disenado para que cualquier persona pueda crear y administrar su evento. Todo funciona desde un panel visual, sin necesidad de programar nada.' },
              { question: 'Que incluye la galeria de fotos?', answer: 'Puedes subir imagenes de la pareja, del lugar, y crear una galeria completa con hasta 20 fotos que tus invitados pueden ver desde la invitacion.' },
              { question: 'Funciona para organizadores profesionales?', answer: 'Si. El plan Organizador esta pensado para quienes se dedican a organizar eventos. Permite crear multiples eventos, usar tu propia marca y manejar todo desde un solo panel.' },
            ]} />
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section id="pricing" className="ec-pricing">
        <div className="ec-pricing-inner">
          <p className="ec-pricing-label ec-animate">Planes</p>
          <h2 className="ec-pricing-title ec-animate">Elige el plan que necesitas</h2>
          <p className="ec-pricing-sub ec-animate">Desde parejas hasta organizadores profesionales</p>

          <div className="ec-pricing-grid">
            <div className="ec-pricing-card ec-animate">
              <div className="ec-pricing-plan">Inicio</div>
              <div className="ec-pricing-price">Gratis</div>
              <div className="ec-pricing-price-note">1 evento, activo 3 meses</div>
              <p className="ec-pricing-desc">Tu primera invitacion digital, lista en minutos.</p>
              <ul className="ec-pricing-features">
                <li><CheckIcon /> Invitacion digital personalizada</li>
                <li><CheckIcon /> Confirmaciones por WhatsApp</li>
                <li><CheckIcon /> Galeria de hasta 10 fotos</li>
                <li><CheckIcon /> Musica de fondo y cuenta regresiva</li>
              </ul>
              <Link href="/register" className="ec-pricing-cta ec-pricing-cta-outline">Comenzar gratis</Link>
            </div>

            <div className="ec-pricing-card ec-pricing-featured ec-animate ec-animate-delay-1">
              <div className="ec-pricing-badge">Popular</div>
              <div className="ec-pricing-plan">Pro</div>
              <div className="ec-pricing-price">$499</div>
              <div className="ec-pricing-price-note">Pago unico · Activo 6 meses</div>
              <p className="ec-pricing-desc">Control total de tu evento, desde invitados hasta proveedores.</p>
              <ul className="ec-pricing-features">
                <li><CheckIcon /> Todo lo de Inicio</li>
                <li><CheckIcon /> Subdominio propio (tuboda.eventcontrol.site)</li>
                <li><CheckIcon /> Padrinos, cortejo y mesas</li>
                <li><CheckIcon /> Proveedores y presupuesto</li>
                <li><CheckIcon /> Itinerario detallado</li>
              </ul>
              <Link href="/register" className="ec-pricing-cta ec-pricing-cta-dark">Elegir Pro</Link>
            </div>

            <div className="ec-pricing-card ec-animate ec-animate-delay-2">
              <div className="ec-pricing-plan">Premium</div>
              <div className="ec-pricing-price">$899</div>
              <div className="ec-pricing-price-note">Pago unico · Activo 1 año</div>
              <p className="ec-pricing-desc">Tu evento con funciones exclusivas y personalizacion avanzada.</p>
              <ul className="ec-pricing-features">
                <li><CheckIcon /> Todo lo de Pro</li>
                <li><CheckIcon /> Subdominio propio (tuboda.eventcontrol.site)</li>
                <li><CheckIcon /> Acceso con QR para invitados</li>
                <li><CheckIcon /> Sin marca de EventControl</li>
                <li><CheckIcon /> Soporte prioritario</li>
              </ul>
              <Link href="/register" className="ec-pricing-cta ec-pricing-cta-sage">Elegir Premium</Link>
            </div>

            <div className="ec-pricing-card ec-animate ec-animate-delay-3">
              <div className="ec-pricing-plan">Organizador</div>
              <div className="ec-pricing-price">$1,499</div>
              <div className="ec-pricing-price-note">Por mes · Eventos ilimitados</div>
              <p className="ec-pricing-desc">Para profesionales que manejan multiples eventos a la vez.</p>
              <ul className="ec-pricing-features">
                <li><CheckIcon /> Todas las funciones Premium</li>
                <li><CheckIcon /> Subdominios ilimitados para cada cliente</li>
                <li><CheckIcon /> Eventos y clientes ilimitados</li>
                <li><CheckIcon /> Tu marca en cada invitacion</li>
                <li><CheckIcon /> Reportes y soporte dedicado</li>
              </ul>
              <Link href="/register" className="ec-pricing-cta ec-pricing-cta-dark">Contactar ventas</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ──────────────────────────────────────── */}
      <section className="ec-cta">
        <h2 className="ec-cta-title">Crea tu evento</h2>
        <Link href="/register" className="btn-cta-white">Crear evento</Link>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="ec-footer">EventControl</footer>
    </div>
    </ScrollAnimator>
  );
}
