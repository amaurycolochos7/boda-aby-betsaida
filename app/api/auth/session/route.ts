import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';
import { getEffectivePlan } from '@/lib/plans';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'eventcontrol-secret-key-2026');

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    // Fetch plan info from DB
    let plan = 'free';
    let planExpiresAt = null;
    try {
      const result = await pool.query(
        'SELECT plan_type, plan_expires_at FROM users WHERE id = $1',
        [userId]
      );
      if (result.rows.length > 0) {
        plan = getEffectivePlan(result.rows[0].plan_type || 'free', result.rows[0].plan_expires_at);
        planExpiresAt = result.rows[0].plan_expires_at;
      }
    } catch {
      // If column doesn't exist yet, default to free
    }

    return NextResponse.json({
      user: {
        id: userId,
        email: payload.email,
        plan,
        planExpiresAt,
      },
    });
  } catch {
    // Token expired or invalid
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.delete('auth-token');
    return response;
  }
}
