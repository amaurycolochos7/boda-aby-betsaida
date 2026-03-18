'use client';

import MediaUploader from '../MediaUploader';

interface TabGaleriaProps {
  eventId: string;
  gallery: string[];
  onChange: (path: string, value: string[]) => void;
}

export default function TabGaleria({ eventId, gallery, onChange }: TabGaleriaProps) {
  return (
    <div className="tab-section">
      <h3>📸 Galería de fotos</h3>
      <p className="tab-hint">Sube hasta 20 imágenes para la galería del evento</p>

      <MediaUploader
        eventId={eventId}
        category="gallery"
        accept="image/*"
        multiple
        maxFiles={20}
        value={gallery || []}
        onChange={(urls) => onChange('custom.gallery', urls as string[])}
        label="Imágenes de la galería"
      />
    </div>
  );
}
