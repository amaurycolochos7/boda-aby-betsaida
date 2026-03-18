'use client';

import { EventCustom } from '@/lib/types';
import MediaUploader from '../MediaUploader';

interface Props {
  custom: EventCustom;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCustomChange: (path: string, value: any) => void;
  eventId: string;
}

export default function TabFooter({ custom, onCustomChange, eventId }: Props) {
  return (
    <div className="builder-tab-content">
      <div className="b-section">
        <div className="b-section-title">Footer de la Invitación</div>
        <div className="b-field">
          <label>Nombres</label>
          <input
            value={custom.footer?.names || ''}
            onChange={(e) => onCustomChange('footer.names', e.target.value)}
            placeholder="Novio & Novia"
          />
        </div>
        <div className="b-field">
          <label>Mensaje final</label>
          <textarea
            value={custom.footer?.message || ''}
            onChange={(e) => onCustomChange('footer.message', e.target.value)}
            rows={3}
            placeholder="¡Gracias por ser parte de este momento especial!"
          />
        </div>
      </div>

      <div className="b-section">
        <div className="b-section-title">🎵 Música de Fondo</div>
        <MediaUploader
          eventId={eventId}
          category="music"
          accept="audio/*"
          value={custom.music || ''}
          onChange={(url) => onCustomChange('music', url)}
          label="Archivo MP3"
        />
        <div className="b-field" style={{ marginTop: '0.5rem' }}>
          <label>O pega una URL directa</label>
          <input
            value={custom.music || ''}
            onChange={(e) => onCustomChange('music', e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>
    </div>
  );
}
