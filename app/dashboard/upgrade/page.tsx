'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';

interface PlanCard {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

const PLAN_CARDS: PlanCard[] = [
  {
    id: 'free',
    name: 'Inicio',
    price: 'Gratis',
    period: '',
    features: ['1 evento', '10 fotos máximo', 'Link básico', 'Marca EventControl'],
    cta: 'Plan actual',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$499',
    period: 'pago único',
    features: ['3 eventos', 'Fotos ilimitadas', 'Subdominio propio', 'Padrinos y mesas', 'Soporte por WhatsApp'],
    cta: 'Upgrade a Pro',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$899',
    period: 'pago único',
    highlight: true,
    features: ['5 eventos', 'Fotos ilimitadas', 'Subdominio propio', 'QR Check-in', 'Sin marca EventControl', 'Soporte prioritario'],
    cta: 'Upgrade a Premium',
  },
  {
    id: 'organizer',
    name: 'Organizador',
    price: '$1,499',
    period: '/mes',
    features: ['Eventos ilimitados', 'Subdominios ilimitados', 'QR Check-in', 'Tu propia marca', 'Panel multi-cliente', 'Soporte VIP'],
    cta: 'Upgrade a Organizador',
  },
];

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const plan = searchParams.get('plan');

  const [currentPlan, setCurrentPlan] = useState('free');
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadPlan();
  }, []);

  async function loadPlan() {
    const session = await getSession();
    if (session?.user?.plan) {
      setCurrentPlan(session.user.plan);
    }
  }

  async function handleUpgrade(planId: string) {
    if (planId === 'free' || planId === currentPlan) return;

    setLoading(planId);
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setToast(data.error || 'Error al crear pago');
        setLoading(null);
      }
    } catch {
      setToast('Error de conexión');
      setLoading(null);
    }
  }

  return (
    <>
      <div className="dash-header">
        <h1>Planes y Precios</h1>
        <div className="dash-header-actions">
          <Link href="/dashboard" className="btn-secondary">← Dashboard</Link>
        </div>
      </div>

      {/* Status messages */}
      {status === 'success' && (
        <div className="upgrade-status success">
          <span className="upgrade-status-icon">✓</span>
          <div>
            <strong>¡Pago exitoso!</strong>
            <p>Tu plan ha sido actualizado a {plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Premium'}. Disfruta de las nuevas funciones.</p>
          </div>
        </div>
      )}
      {status === 'failure' && (
        <div className="upgrade-status error">
          <span className="upgrade-status-icon">✕</span>
          <div>
            <strong>Pago no completado</strong>
            <p>No se pudo procesar el pago. Intenta de nuevo o usa otro método de pago.</p>
          </div>
        </div>
      )}
      {status === 'pending' && (
        <div className="upgrade-status pending">
          <span className="upgrade-status-icon">⏳</span>
          <div>
            <strong>Pago pendiente</strong>
            <p>Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
          </div>
        </div>
      )}

      {toast && (
        <div className="upgrade-status error" style={{ cursor: 'pointer' }} onClick={() => setToast('')}>
          {toast}
        </div>
      )}

      {/* Plan cards */}
      <div className="upgrade-grid">
        {PLAN_CARDS.map((p) => {
          const isCurrent = p.id === currentPlan;
          const isDowngrade = getPlanRank(p.id) <= getPlanRank(currentPlan) && p.id !== 'free';

          return (
            <div
              key={p.id}
              className={`upgrade-card ${p.highlight ? 'highlight' : ''} ${isCurrent ? 'current' : ''}`}
            >
              {p.highlight && <div className="upgrade-badge">Más popular</div>}
              {isCurrent && <div className="upgrade-badge current-badge">Tu plan</div>}

              <h3 className="upgrade-card-name">{p.name}</h3>
              <div className="upgrade-card-price">
                {p.price}
                {p.period && <span className="upgrade-card-period">{p.period}</span>}
              </div>

              <ul className="upgrade-card-features">
                {p.features.map((f, i) => (
                  <li key={i}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`upgrade-card-btn ${isCurrent ? 'current' : ''} ${p.highlight && !isCurrent ? 'highlight' : ''}`}
                disabled={isCurrent || isDowngrade || loading !== null}
                onClick={() => handleUpgrade(p.id)}
              >
                {loading === p.id ? 'Procesando...' : isCurrent ? 'Plan actual' : isDowngrade ? 'Incluido' : p.cta}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--dash-text-muted)', fontSize: '13px' }}>
        Pagos seguros con MercadoPago · Tarjeta, OXXO, transferencia
      </div>
    </>
  );
}

function getPlanRank(plan: string): number {
  const ranks: Record<string, number> = { free: 0, pro: 1, premium: 2, organizer: 3 };
  return ranks[plan] ?? 0;
}
