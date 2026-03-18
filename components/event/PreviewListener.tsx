'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { EventCore, EventCustom } from '@/lib/types';

interface Props {
  children: (core: EventCore | null, custom: EventCustom | null) => React.ReactNode;
  initialCore: EventCore;
  initialCustom: EventCustom;
}

export default function PreviewListener({ children, initialCore, initialCustom }: Props) {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [core, setCore] = useState<EventCore | null>(null);
  const [custom, setCustom] = useState<EventCustom | null>(null);

  useEffect(() => {
    if (!isPreview) return;

    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'BUILDER_UPDATE') {
        const { core: newCore, custom: newCustom } = e.data.payload;
        setCore(newCore);
        setCustom(newCustom);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isPreview]);

  // Use received data if available, otherwise initialvalues
  return <>{children(core || initialCore, custom || initialCustom)}</>;
}
