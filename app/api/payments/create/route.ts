import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { jwtVerify } from 'jose';
import { PLAN_PRICES, PlanType } from '@/lib/plans';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'eventcontrol-secret-key-2026');

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

async function getUserId(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('auth-token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.userId as string;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const { plan } = await req.json();

  if (!['pro', 'premium', 'organizer'].includes(plan)) {
    return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
  }

  const planType = plan as PlanType;
  const price = PLAN_PRICES[planType];
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://eventcontrol.site';

  const planNames: Record<string, string> = {
    pro: 'EventControl Pro',
    premium: 'EventControl Premium',
    organizer: 'EventControl Organizador (1 mes)',
  };

  try {
    const preference = new Preference(mp);
    const result = await preference.create({
      body: {
        items: [
          {
            id: `plan-${planType}`,
            title: planNames[planType] || 'EventControl',
            quantity: 1,
            unit_price: price.amount,
            currency_id: 'MXN',
          },
        ],
        metadata: {
          user_id: userId,
          plan_type: planType,
        },
        back_urls: {
          success: `${appUrl}/dashboard/upgrade?status=success&plan=${planType}`,
          failure: `${appUrl}/dashboard/upgrade?status=failure`,
          pending: `${appUrl}/dashboard/upgrade?status=pending`,
        },
        auto_return: 'approved',
        notification_url: `${appUrl}/api/payments/webhook`,
      },
    });

    return NextResponse.json({
      checkoutUrl: result.init_point,
      preferenceId: result.id,
    });
  } catch (error: unknown) {
    console.error('MercadoPago error:', error);
    const msg = error instanceof Error ? error.message : 'Error al crear pago';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
