import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { upgradePlan, PLAN_PRICES, PlanType } from '@/lib/plans';

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // MercadoPago sends different notification types
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: 'No payment ID' }, { status: 400 });
    }

    // Fetch the payment details from MercadoPago
    const payment = new Payment(mp);
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status !== 'approved') {
      return NextResponse.json({ ok: true, status: paymentData.status });
    }

    // Extract metadata
    const userId = paymentData.metadata?.user_id;
    const planType = paymentData.metadata?.plan_type as PlanType;

    if (!userId || !planType) {
      console.error('Missing metadata in payment:', paymentId);
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
    }

    const price = PLAN_PRICES[planType];
    if (!price) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Upgrade the user's plan
    await upgradePlan(userId, planType, String(paymentId), price.amount);

    console.log(`✅ Plan upgraded: user=${userId} plan=${planType} payment=${paymentId}`);

    return NextResponse.json({ ok: true, upgraded: true });
  } catch (error: unknown) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
