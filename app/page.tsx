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
              {/* WhatsApp Header */}
              <div className="wa-header">
                <div className="wa-header-left">
                  <svg className="wa-icon" viewBox="0 0 24 24" fill="#fff"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
                  <div className="wa-avatar">A</div>
                  <div className="wa-contact-info">
                    <div className="wa-contact-name">Abidan</div>
                    <div className="wa-contact-status">en línea</div>
                  </div>
                </div>
                <div className="wa-header-right">
                  <svg className="wa-icon" viewBox="0 0 24 24" fill="#fff"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                  <svg className="wa-icon" viewBox="0 0 24 24" fill="#fff"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  <svg className="wa-icon" viewBox="0 0 24 24" fill="#fff"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </div>
              </div>

              {/* WhatsApp Chat Area */}
              <div className="wa-chat">
                <div className="wa-wallpaper"></div>
                <div className="wa-messages">
                  <div className="wa-date-chip">HOY</div>
                  <div className="wa-bubble-in">
                    <div className="wa-link-preview">
                      <div className="wa-link-preview-bar"></div>
                      <div className="wa-link-preview-body">
                        <div className="wa-link-preview-domain">eventcontrol.site</div>
                        <div className="wa-link-preview-title">Boda Abidán y Betsaida</div>
                        <div className="wa-link-preview-desc">Te invitamos a celebrar con nosotros</div>
                      </div>
                    </div>
                    <p className="wa-bubble-text">
                      Hola <strong>María López</strong>, nos da mucha alegría invitarlos a nuestra boda.<br /><br />
                      Para ver los detalles y <strong>confirmar su asistencia</strong>, por favor ingresa:<br />
                      <span className="wa-link-url">eventcontrol.site/event/abidan-betsaida</span><br /><br />
                      Tu código de acceso es: <strong>ESGW</strong><br /><br />
                      ¡Esperamos contar con su presencia!
                    </p>
                    <div className="wa-bubble-meta">
                      <span className="wa-time">10:32 a.m.</span>
                    </div>
                  </div>
                  <div className="wa-bubble-out">
                    <p className="wa-bubble-text">
                      ¡Hola Abidán! Gracias por la invitación, confirmaré enseguida 🎉
                    </p>
                    <div className="wa-bubble-meta">
                      <span className="wa-time">2:14 p.m.</span>
                      <svg className="wa-check-icon" viewBox="0 0 16 11" fill="#53bdeb"><path d="M11.071.653a.457.457 0 00-.304-.102.493.493 0 00-.381.178l-6.19 7.636-2.405-2.272a.463.463 0 00-.336-.146.47.47 0 00-.343.146l-.311.31a.445.445 0 00-.14.337c0 .136.046.254.14.337l2.995 2.83a.48.48 0 00.347.153c.14 0 .265-.06.377-.176l6.683-8.253a.456.456 0 00.108-.305.456.456 0 00-.108-.305l-.132-.368z"/><path d="M14.871.653a.457.457 0 00-.304-.102.493.493 0 00-.381.178l-6.19 7.636-1.2-1.134-.349.427 1.486 1.4a.48.48 0 00.347.153c.14 0 .265-.06.377-.176l6.683-8.253a.456.456 0 00.108-.305.456.456 0 00-.108-.305l-.469-.519z"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Input Bar */}
              <div className="wa-input">
                <div className="wa-input-field">
                  <svg className="wa-input-icon" viewBox="0 0 24 24" fill="#8696a0"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
                  <span className="wa-input-placeholder">Mensaje</span>
                </div>
                <div className="wa-input-actions">
                  <svg className="wa-input-icon" viewBox="0 0 24 24" fill="#8696a0"><path d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 003.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.501.501 1.171.802 1.823.802a1.585 1.585 0 001.173-.496l5.852-5.851-.354-.354-5.851 5.85a1.182 1.182 0 01-1.632.07c-.822-.826-.905-1.94-.214-2.632l7.916-7.915c1.258-1.258 3.406-1.143 4.785.235 1.379 1.38 1.495 3.527.236 4.786l-9.547 9.547a5.09 5.09 0 01-3.618 1.5 5.09 5.09 0 01-3.618-1.5 5.09 5.09 0 01-1.5-3.618v-.001z"/></svg>
                  <svg className="wa-input-icon" viewBox="0 0 24 24" fill="#8696a0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 3h2v2h-2V5zm4 14H9v-1l1-1v-4H9v-1l3-1h1v6l1 1v1z"/></svg>
                  <svg className="wa-input-icon wa-camera-icon" viewBox="0 0 24 24" fill="#8696a0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-6l2.03-2.71L11 14l2.47-3.29L17 15H7z"/></svg>
                </div>
                <div className="wa-mic-btn">
                  <svg viewBox="0 0 24 24" fill="#fff"><path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
                </div>
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
