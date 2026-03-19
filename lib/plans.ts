import pool from './db';

// ─── Plan Types ─────────────────────────────────────────────

export type PlanType = 'free' | 'pro' | 'premium' | 'organizer';

export interface PlanConfig {
  name: string;
  maxEvents: number;
  maxPhotos: number;
  subdomain: boolean;
  qrCheckin: boolean;
  removeBranding: boolean;
  prioritySupport: boolean;
  unlimitedSubdomains: boolean;
}

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    name: 'Inicio',
    maxEvents: 1,
    maxPhotos: 10,
    subdomain: false,
    qrCheckin: false,
    removeBranding: false,
    prioritySupport: false,
    unlimitedSubdomains: false,
  },
  pro: {
    name: 'Pro',
    maxEvents: 3,
    maxPhotos: 999,
    subdomain: true,
    qrCheckin: false,
    removeBranding: false,
    prioritySupport: false,
    unlimitedSubdomains: false,
  },
  premium: {
    name: 'Premium',
    maxEvents: 5,
    maxPhotos: 999,
    subdomain: true,
    qrCheckin: true,
    removeBranding: true,
    prioritySupport: true,
    unlimitedSubdomains: false,
  },
  organizer: {
    name: 'Organizador',
    maxEvents: 999,
    maxPhotos: 999,
    subdomain: true,
    qrCheckin: true,
    removeBranding: true,
    prioritySupport: true,
    unlimitedSubdomains: true,
  },
};

export const PLAN_PRICES: Record<PlanType, { amount: number; period: string }> = {
  free:      { amount: 0,    period: 'gratis' },
  pro:       { amount: 499,  period: 'unico' },
  premium:   { amount: 899,  period: 'unico' },
  organizer: { amount: 1499, period: 'mensual' },
};

// ─── Feature Gating ─────────────────────────────────────────

export function canUseFeature(plan: PlanType, feature: keyof PlanConfig): boolean {
  const config = PLANS[plan] || PLANS.free;
  const val = config[feature];
  if (typeof val === 'boolean') return val;
  return true;
}

export function getPlanConfig(plan: string): PlanConfig {
  return PLANS[plan as PlanType] || PLANS.free;
}

export function isPlanExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false; // free plan never expires
  return new Date(expiresAt) < new Date();
}

export function getEffectivePlan(planType: string, expiresAt: string | null): PlanType {
  if (planType === 'free') return 'free';
  if (isPlanExpired(expiresAt)) return 'free';
  return planType as PlanType;
}

// ─── DB Helpers ─────────────────────────────────────────────

export async function getUserPlan(userId: string): Promise<{ plan: PlanType; expiresAt: string | null }> {
  const result = await pool.query(
    'SELECT plan_type, plan_expires_at FROM users WHERE id = $1',
    [userId]
  );
  if (result.rows.length === 0) return { plan: 'free', expiresAt: null };
  const row = result.rows[0];
  const plan = getEffectivePlan(row.plan_type || 'free', row.plan_expires_at);
  return { plan, expiresAt: row.plan_expires_at };
}

export async function upgradePlan(userId: string, planType: PlanType, paymentId: string, amount: number): Promise<void> {
  const expiresAt = planType === 'organizer'
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days for monthly
    : planType === 'pro'
      ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000) // 6 months
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year for premium

  await pool.query(
    'UPDATE users SET plan_type = $1, plan_expires_at = $2 WHERE id = $3',
    [planType, expiresAt.toISOString(), userId]
  );

  await pool.query(
    `INSERT INTO payment_history (user_id, plan_type, amount, currency, payment_id, status)
     VALUES ($1, $2, $3, 'MXN', $4, 'approved')`,
    [userId, planType, amount, paymentId]
  );
}
