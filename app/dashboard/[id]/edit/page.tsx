'use client';

import { use } from 'react';
import BuilderLayout from '@/components/dashboard/BuilderLayout';

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <BuilderLayout eventId={id} />;
}
