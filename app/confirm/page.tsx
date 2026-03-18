'use client';

import { useState } from 'react';
import './confirm.css';

export default function ConfirmPage() {
  const [code, setCode] = useState(['', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [guestName, setGuestName] = useState('');

  function handleCodeChange(index: number, value: string) {
    if (value.length > 1) value = value.slice(-1);
    const upper = value.toUpperCase();
    const newCode = [...code];
    newCode[index] = upper;
    setCode(newCode);

    // Auto-focus next input
    if (upper && index < 3) {
      const next = document.getElementById(`code-${index + 1}`);
      next?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prev = document.getElementById(`code-${index - 1}`);
      prev?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 4) return;

    setStatus('loading');

    // Simulate verification — in a real system this would check Supabase
    setTimeout(() => {
      // Accept the demo code ESGW or any 4-char code for demo purposes
      if (fullCode === 'ESGW' || fullCode.length === 4) {
        setGuestName('Invitado');
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 800);
  }

  if (status === 'success') {
    return (
      <div className="confirm-page">
        <div className="confirm-card confirm-success">
          <div className="confirm-check-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="confirm-title-success">¡Asistencia Confirmada!</h1>
          <p className="confirm-subtitle-success">
            Gracias por confirmar, <strong>{guestName}</strong>.
          </p>
          <div className="confirm-details">
            <div className="confirm-detail-row">
              <span className="confirm-detail-label">Evento</span>
              <span className="confirm-detail-value">Boda Abidán &amp; Betsaida</span>
            </div>
            <div className="confirm-detail-row">
              <span className="confirm-detail-label">Fecha</span>
              <span className="confirm-detail-value">15 de Marzo del 2026</span>
            </div>
            <div className="confirm-detail-row">
              <span className="confirm-detail-label">Hora</span>
              <span className="confirm-detail-value">5:00 PM</span>
            </div>
            <div className="confirm-detail-row">
              <span className="confirm-detail-label">Código</span>
              <span className="confirm-detail-value confirm-code-badge">{code.join('')}</span>
            </div>
          </div>
          <p className="confirm-qr-note">
            Presenta este código o tu pase QR en la entrada del evento.
          </p>
          <a href="/event/abidan-betsaida" className="confirm-back-btn">
            Volver a la invitación
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <h1 className="confirm-title">Confirma tu Asistencia</h1>
        <p className="confirm-subtitle">
          Ingresa el código de 4 dígitos que recibiste en tu invitación
        </p>

        <form onSubmit={handleSubmit}>
          <div className="confirm-code-inputs">
            {code.map((digit, i) => (
              <input
                key={i}
                id={`code-${i}`}
                type="text"
                inputMode="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`confirm-code-input ${status === 'error' ? 'error' : ''}`}
                autoFocus={i === 0}
                autoComplete="off"
              />
            ))}
          </div>

          {status === 'error' && (
            <p className="confirm-error">Código inválido. Verifica e intenta de nuevo.</p>
          )}

          <button
            type="submit"
            className="confirm-submit"
            disabled={code.join('').length < 4 || status === 'loading'}
          >
            {status === 'loading' ? (
              <span className="confirm-spinner"></span>
            ) : (
              'Verificar Código'
            )}
          </button>
        </form>

        <p className="confirm-help">
          ¿No tienes tu código? Comunícate con los novios.
        </p>

        <a href="/event/abidan-betsaida" className="confirm-link">
          ← Volver a la invitación
        </a>
      </div>
    </div>
  );
}
