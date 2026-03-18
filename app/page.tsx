import Link from 'next/link';

import './landing.css';

export default function LandingPage() {
  return (
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

      {/* ── Hero (Clean White) ─────────────────────────────── */}
      <section className="ec-hero">
        <div className="ec-hero-content">
          <h1 className="ec-hero-title">
            Organiza cualquier evento sin caos
          </h1>
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
            <img
              src="/images/dashboard-preview.png"
              alt="Panel de EventControl"
              className="ec-hero-mockup-img"
            />
          </div>
        </div>
      </section>

      {/* ── Feature Stats ──────────────────────────────────── */}
      <section className="ec-features">
        <div className="ec-features-inner">
          <div className="ec-feature">
            <div className="ec-feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div>
              <strong>+200 invitados</strong>
              <span>gestionados</span>
            </div>
          </div>
          <div className="ec-feature">
            <div className="ec-feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm11-2h2v3h-2v-3zm3 0h2v2h-2v-2zm-3 5h2v3h-2v-3zm3-2h2v2h-2v-2zm2 3h2v2h-2v-2z"/></svg>
            </div>
            <div>
              <strong>Acceso con QR</strong>
              <span>en segundos</span>
            </div>
          </div>
          <div className="ec-feature">
            <div className="ec-feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
            </div>
            <div>
              <strong>Panel en</strong>
              <span>tiempo real</span>
            </div>
          </div>
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
              <iframe
                className="ec-demo-iframe"
                src="/event/abidan-betsaida"
                title="Demo EventControl"
                loading="lazy"
              />
            </div>
            <div className="ec-phone-bar"></div>
          </div>
        </div>
      </section>

      {/* ── Validation ─────────────────────────────────────── */}
      <section className="ec-validation">
        <p>
          <strong>+100 invitados confirmados</strong> en un evento real.
          <span className="ec-val-sub">Sin listas manuales. Sin errores.</span>
        </p>
      </section>

      {/* ── Comparte ───────────────────────────────────────── */}
      <section className="ec-section ec-section-alt">
        <div className="ec-section-inner">
          <div>
            <p className="ec-section-label">Comparte</p>
            <h3 className="ec-section-title">Tu evento, listo para enviar</h3>
            <p className="ec-section-desc">
              Un enlace con toda la informacion. Compartelo por WhatsApp
              y tus invitados confirman desde ahi.
            </p>
          </div>
          <div className="ec-section-visual">
            <div className="wa-phone">
              <div className="wa-header">
                <span className="wa-back">&larr;</span>
                <div className="wa-avatar">A</div>
                <div className="wa-contact-info">
                  <div className="wa-contact-name">Abidan</div>
                  <div className="wa-contact-status">en linea</div>
                </div>
              </div>
              <div className="wa-chat">
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
                    Esperamos contar con su presencia!
                  </p>
                  <div className="wa-bubble-meta">
                    <span className="wa-time">10:32 a.m.</span>
                  </div>
                </div>
                <div className="wa-bubble-out">
                  <p className="wa-bubble-text">
                    Hola Abidan! Gracias por la invitacion, confirmare enseguida
                  </p>
                  <div className="wa-bubble-meta">
                    <span className="wa-time">2:14 p.m.</span>
                    <span className="wa-check">&#10003;&#10003;</span>
                  </div>
                </div>
              </div>
              <div className="wa-input">
                <div className="wa-input-field">Mensaje</div>
                <div className="wa-input-send">&#9654;</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Controla ───────────────────────────────────────── */}
      <section className="ec-section">
        <div className="ec-section-inner reverse">
          <div>
            <p className="ec-section-label">Controla</p>
            <h3 className="ec-section-title">Sabe quien viene y quien falta</h3>
            <p className="ec-section-desc">
              Cada confirmacion llega al instante. Sin perseguir respuestas,
              sin hojas de calculo.
            </p>
          </div>
          <div className="ec-section-visual">
            <div className="ec-list">
              <div className="ec-list-header">
                <span className="ec-list-header-title">Invitados</span>
                <span className="ec-list-header-count">87 / 110</span>
              </div>
              <div className="ec-list-items">
                <div className="ec-list-row">
                  <div className="ec-list-left">
                    <span className="ec-list-dot ec-list-dot-green"></span>
                    <span className="ec-list-name">Maria Lopez</span>
                  </div>
                  <span className="ec-list-meta">2 personas</span>
                </div>
                <div className="ec-list-row">
                  <div className="ec-list-left">
                    <span className="ec-list-dot ec-list-dot-green"></span>
                    <span className="ec-list-name">Carlos Rivera</span>
                  </div>
                  <span className="ec-list-meta">4 personas</span>
                </div>
                <div className="ec-list-row">
                  <div className="ec-list-left">
                    <span className="ec-list-dot ec-list-dot-amber"></span>
                    <span className="ec-list-name">Ana Torres</span>
                  </div>
                  <span className="ec-list-meta">Pendiente</span>
                </div>
                <div className="ec-list-row">
                  <div className="ec-list-left">
                    <span className="ec-list-dot ec-list-dot-green"></span>
                    <span className="ec-list-name">Luis Mendez</span>
                  </div>
                  <span className="ec-list-meta">3 personas</span>
                </div>
                <div className="ec-list-row">
                  <div className="ec-list-left">
                    <span className="ec-list-dot ec-list-dot-green"></span>
                    <span className="ec-list-name">Fernanda Vega</span>
                  </div>
                  <span className="ec-list-meta">2 personas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Organiza ───────────────────────────────────────── */}
      <section className="ec-section ec-section-alt">
        <div className="ec-section-inner">
          <div>
            <p className="ec-section-label">Organiza</p>
            <h3 className="ec-section-title">Todo en un solo lugar</h3>
            <p className="ec-section-desc">
              Confirmaciones, accesos, mesas y vistas de tu evento.
              Un resumen claro de lo que importa.
            </p>
          </div>
          <div className="ec-section-visual">
            <div className="ec-panel">
              <div className="ec-panel-header">Resumen del evento</div>
              <div className="ec-panel-body">
                <div className="ec-panel-row">
                  <span className="ec-panel-label">Confirmados</span>
                  <span className="ec-panel-value">87</span>
                </div>
                <div className="ec-panel-row">
                  <span className="ec-panel-label">Pendientes</span>
                  <span className="ec-panel-value">23</span>
                </div>
                <div className="ec-panel-row">
                  <span className="ec-panel-label">Vistas</span>
                  <span className="ec-panel-value">342</span>
                </div>
                <div className="ec-panel-row">
                  <span className="ec-panel-label">Mesas</span>
                  <span className="ec-panel-value">12</span>
                </div>
                <div className="ec-panel-bar-section">
                  <div className="ec-panel-bar-info">
                    <span>Capacidad</span>
                    <span>79%</span>
                  </div>
                  <div className="ec-panel-bar-track">
                    <div className="ec-panel-bar-fill"></div>
                  </div>
                </div>
              </div>
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
  );
}
