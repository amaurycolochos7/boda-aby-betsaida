'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { EventConfig } from '@/lib/types';

interface EventShellProps {
  event: EventConfig;
  children: ReactNode;
}

export default function EventShell({ event, children }: EventShellProps) {
  const [entered, setEntered] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ─── Entry Screen → Show Content ──────────────────────────
  function handleEnter() {
    // Start music
    if (audioRef.current && event.custom.music) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
    setEntered(true);
  }

  // ─── Scroll: show hamburger + animate elements ────────────
  useEffect(() => {
    if (!entered) return;

    // Initial check for visible elements
    requestAnimationFrame(() => checkScrollAnimations());

    function handleScroll() {
      // Show menu toggle after scrolling past hero
      setMenuVisible(window.scrollY > 400);
      checkScrollAnimations();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [entered]);

  function checkScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.classList.add('visible');
      }
    });
  }

  // ─── Navigation ───────────────────────────────────────────
  function openNav() {
    setNavOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    setNavOpen(false);
    document.body.style.overflow = '';
  }

  function scrollToSection(id: string) {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({ top: section.offsetTop - 20, behavior: 'smooth' });
    }
    closeNav();
  }

  // ─── ESC key to close nav ─────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeNav();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const { custom } = event;
  const entryInitials = custom.entryScreen?.initials || ['E', 'C'];
  const entrySubtitle = custom.entryScreen?.subtitle || 'Evento';
  const dateFormatted = formatDate(event.core.date);

  return (
    <>
      {/* Background Music */}
      {custom.music && (
        <audio ref={audioRef} loop preload="none">
          <source src={custom.music} type="audio/mpeg" />
        </audio>
      )}

      {/* ==================== ENTRY SCREEN ==================== */}
      {!entered && (
        <div id="entry-screen" className="entry-screen">
          <div className="entry-overlay"></div>
          <div className="entry-content">
            <p className="entry-subtitle fade-in">{entrySubtitle}</p>
            <div className="entry-initials fade-in delay-1">
              <span className="initial">{entryInitials[0]}</span>
              <span className="separator"></span>
              <span className="initial">{entryInitials[1]}</span>
            </div>
            <p className="entry-date fade-in delay-2">{dateFormatted}</p>
            <p id="guest-pass" className="guest-pass fade-in delay-2"></p>
            <button
              id="enter-btn"
              className="enter-btn fade-in delay-3"
              onClick={handleEnter}
            >
              <span>ENTRAR</span>
            </button>
          </div>
          <div className="entry-ornament top-left"></div>
          <div className="entry-ornament top-right"></div>
          <div className="entry-ornament bottom-left"></div>
          <div className="entry-ornament bottom-right"></div>
        </div>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <div
        id="main-content"
        className={`main-content ${entered ? 'show' : 'hidden'}`}
      >
        {/* Hamburger Menu Button */}
        <button
          id="menu-toggle"
          className={`menu-toggle ${menuVisible ? 'visible' : ''} ${navOpen ? 'active' : ''}`}
          aria-label="Abrir menú"
          onClick={() => (navOpen ? closeNav() : openNav())}
        >
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>

        {/* Slide-out Navigation */}
        <nav
          id="floating-nav"
          className={`floating-nav ${navOpen ? 'active' : ''}`}
        >
          <div className="nav-overlay" onClick={closeNav}></div>
          <div className="nav-panel">
            <button className="nav-close" onClick={closeNav}>
              &times;
            </button>
            <ul>
              <li><a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Inicio</a></li>
              <li><a href="#countdown" onClick={(e) => { e.preventDefault(); scrollToSection('countdown'); }}>Cuenta Regresiva</a></li>
              {custom.parents && <li><a href="#families" onClick={(e) => { e.preventDefault(); scrollToSection('families'); }}>Familias</a></li>}
              <li><a href="#event" onClick={(e) => { e.preventDefault(); scrollToSection('event'); }}>Evento</a></li>
              {custom.timeline && <li><a href="#timeline" onClick={(e) => { e.preventDefault(); scrollToSection('timeline'); }}>Itinerario</a></li>}
              {custom.gallery && <li><a href="#gallery" onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }}>Galería</a></li>}
              {custom.rsvp && <li><a href="#rsvp" onClick={(e) => { e.preventDefault(); scrollToSection('rsvp'); }}>Confirmar</a></li>}
            </ul>
          </div>
        </nav>

        {children}
      </div>
    </>
  );
}

// ─── Helpers ─────────────────────────────────────────────────

function formatDate(isoDate: string): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${day} de ${months[month - 1]} del ${year}`;
}
