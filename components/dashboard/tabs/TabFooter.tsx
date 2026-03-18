'use client';

import { EventCustom } from '@/lib/types';

interface Props {
  custom: EventCustom;
  onCustomChange: (path: string, value: string) => void;
}

export default function TabFooter({ custom, onCustomChange }: Props) {
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
        <div className="b-section-title">Música de Fondo</div>
        <div className="b-field">
          <label>URL del audio</label>
          <input
            value={custom.music || ''}
            onChange={(e) => onCustomChange('music', e.target.value)}
            placeholder="https://..."
          />
          <div className="b-field-hint">URL directa a un archivo MP3</div>
        </div>
      </div>
    </div>
  );
}
