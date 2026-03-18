'use client';

import MediaUploader from '../MediaUploader';

interface TabFotosProps {
  eventId: string;
  coupleImages: string[];
  onChange: (path: string, value: string[]) => void;
}

export default function TabFotos({ eventId, coupleImages, onChange }: TabFotosProps) {
  return (
    <div className="tab-section">
      <h3>💑 Fotos de la pareja</h3>
      <p className="tab-hint">Sube hasta 6 fotos de la pareja</p>

      <MediaUploader
        eventId={eventId}
        category="couple"
        accept="image/*"
        multiple
        maxFiles={6}
        value={coupleImages || []}
        onChange={(urls) => onChange('custom.coupleImages', urls as string[])}
        label="Fotos de pareja"
      />
    </div>
  );
}
