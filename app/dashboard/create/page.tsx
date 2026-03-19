'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createEvent } from '@/lib/auth';

const EVENT_TYPES = [
  { value: 'wedding', icon: '💍', label: 'Boda' },
  { value: 'quinceañera', icon: '👑', label: 'XV Años' },
  { value: 'birthday', icon: '🎂', label: 'Cumpleaños' },
  { value: 'corporate', icon: '🏢', label: 'Corporativo' },
  { value: 'other', icon: '🎉', label: 'Otro' },
];

const FIELDS_BY_TYPE: Record<string, { label: string; placeholder: string; nameLabel?: string; namePlaceholder?: string }> = {
  wedding:      { label: 'Nombres de los novios', placeholder: 'Ej: Juan y María', nameLabel: 'Nombre del evento', namePlaceholder: 'Boda de Juan y María' },
  'quinceañera':{ label: 'Nombre de la quinceañera', placeholder: 'Ej: Valeria', nameLabel: 'Nombre del evento', namePlaceholder: 'XV Años de Valeria' },
  birthday:     { label: 'Nombre del festejado', placeholder: 'Ej: Carlos', nameLabel: 'Nombre del evento', namePlaceholder: 'Cumpleaños de Carlos' },
  corporate:    { label: 'Nombre del evento', placeholder: 'Ej: Gala Anual 2026', nameLabel: 'Título completo', namePlaceholder: 'Gala Anual Empresa 2026' },
  other:        { label: 'Nombre del evento', placeholder: 'Ej: Reunión Familiar', nameLabel: 'Título completo', namePlaceholder: 'Reunión Familiar 2026' },
};

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [type, setType] = useState('wedding');
  const [protagonistName, setProtagonistName] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fields = FIELDS_BY_TYPE[type] || FIELDS_BY_TYPE.other;

  function handleTypeSelect(val: string) {
    setType(val);
    // Auto-advance to step 2
    setTimeout(() => setStep(2), 200);
  }

  function generateTitle(): string {
    if (eventTitle.trim()) return eventTitle.trim();
    if (!protagonistName.trim()) return 'Mi Evento';
    switch (type) {
      case 'wedding': return `Boda de ${protagonistName.trim()}`;
      case 'quinceañera': return `XV Años de ${protagonistName.trim()}`;
      case 'birthday': return `Cumpleaños de ${protagonistName.trim()}`;
      default: return protagonistName.trim();
    }
  }

  async function handleCreate() {
    const title = generateTitle();
    setError('');
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const event: any = await createEvent(title, type);
      router.push(`/dashboard/${event.id}/edit`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear evento';
      setError(message);
      setLoading(false);
    }
  }

  const stepClass = (n: number) => {
    if (n < step) return 'wizard-step done';
    if (n === step) return 'wizard-step active';
    return 'wizard-step';
  };

  return (
    <div className="wizard-container">
      {/* Step indicators */}
      <div className="wizard-steps">
        <div className={stepClass(1)}>
          <span className="wizard-step-num">{step > 1 ? '✓' : '1'}</span>
          <span>Tipo</span>
        </div>
        <div className="wizard-sep" />
        <div className={stepClass(2)}>
          <span className="wizard-step-num">{step > 2 ? '✓' : '2'}</span>
          <span>Datos</span>
        </div>
        <div className="wizard-sep" />
        <div className={stepClass(3)}>
          <span className="wizard-step-num">3</span>
          <span>Crear</span>
        </div>
      </div>

      {/* ── Step 1: Select type ── */}
      {step === 1 && (
        <>
          <h2 className="wizard-title">¿Qué tipo de evento es?</h2>
          <p className="wizard-subtitle">Selecciona y pre-cargaremos un template listo para editar</p>
          <div className="wizard-types">
            {EVENT_TYPES.map((t) => (
              <div
                key={t.value}
                className={`wizard-type-card ${type === t.value ? 'selected' : ''}`}
                onClick={() => handleTypeSelect(t.value)}
              >
                <div className="wizard-type-icon">{t.icon}</div>
                <div className="wizard-type-label">{t.label}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Step 2: Basic info ── */}
      {step === 2 && (
        <>
          <h2 className="wizard-title">Datos básicos</h2>
          <p className="wizard-subtitle">Solo lo esencial — todo se puede editar después</p>
          <div className="wizard-form">
            <div className="form-field">
              <label>{fields.label}</label>
              <input
                type="text"
                placeholder={fields.placeholder}
                value={protagonistName}
                onChange={(e) => setProtagonistName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>Fecha del evento</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <div className="wizard-actions">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              ← Atrás
            </button>
            <button className="btn-primary" onClick={() => setStep(3)}>
              Siguiente →
            </button>
          </div>
        </>
      )}

      {/* ── Step 3: Confirm & Create ── */}
      {step === 3 && (
        <>
          <h2 className="wizard-title">¡Listo para crear!</h2>
          <p className="wizard-subtitle">Tu evento se creará con un template completo que podrás personalizar</p>

          <div className="wizard-form">
            <div style={{
              background: 'var(--dash-surface)',
              border: '1px solid var(--dash-border)',
              borderRadius: 'var(--dash-radius)',
              padding: '24px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                {EVENT_TYPES.find(t => t.value === type)?.icon}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--dash-text)', marginBottom: '4px' }}>
                {generateTitle()}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--dash-text-muted)' }}>
                {EVENT_TYPES.find(t => t.value === type)?.label}
                {date && ` · ${new Date(date + 'T12:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`}
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}
          </div>

          <div className="wizard-actions">
            <button className="btn-secondary" onClick={() => setStep(2)}>
              ← Atrás
            </button>
            <button className="btn-primary" onClick={handleCreate} disabled={loading}>
              {loading ? 'Creando...' : 'Crear mi evento 🚀'}
            </button>
          </div>
        </>
      )}

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Link href="/dashboard" style={{ color: 'var(--dash-text-muted)', fontSize: '13px', textDecoration: 'none' }}>
          ← Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
