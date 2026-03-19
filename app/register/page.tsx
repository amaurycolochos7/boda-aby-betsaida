'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth';
import '../dashboard.css';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<'form' | 'transition'>('form');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      // Auto-login ya incluido en el API — mostrar micro-feedback
      setPhase('transition');
      setTimeout(() => router.push('/dashboard/create'), 2200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // ── Micro-feedback transition ─────────────────────────────
  if (phase === 'transition') {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="onboard-transition">
            <div className="onboard-check">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="onboard-title">¡Cuenta creada!</h2>
            <p className="onboard-sub">Vamos a crear tu primer evento...</p>
            <div className="onboard-progress">
              <div className="onboard-progress-bar" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>EventControl</h1>
          <p>Crea tu cuenta para empezar</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirm-password">Confirmar Contraseña</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
