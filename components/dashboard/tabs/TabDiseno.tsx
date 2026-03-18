'use client';

import { EventCustom } from '@/lib/types';

interface Props {
  custom: EventCustom;
  onCustomChange: (path: string, value: string) => void;
}

export default function TabDiseno({ custom, onCustomChange }: Props) {
  return (
    <div className="builder-tab-content">
      <div className="b-section">
        <div className="b-section-title">Pantalla de Entrada</div>
        <div className="b-row">
          <div className="b-field">
            <label>Inicial 1</label>
            <input
              value={custom.entryScreen?.initials?.[0] || ''}
              onChange={(e) => onCustomChange('entryScreen.initials.0', e.target.value)}
              maxLength={2}
              placeholder="A"
            />
          </div>
          <div className="b-field">
            <label>Inicial 2</label>
            <input
              value={custom.entryScreen?.initials?.[1] || ''}
              onChange={(e) => onCustomChange('entryScreen.initials.1', e.target.value)}
              maxLength={2}
              placeholder="B"
            />
          </div>
        </div>
        <div className="b-field">
          <label>Subtítulo</label>
          <input
            value={custom.entryScreen?.subtitle || ''}
            onChange={(e) => onCustomChange('entryScreen.subtitle', e.target.value)}
            placeholder="Nuestra Boda"
          />
        </div>
      </div>

      <div className="b-section">
        <div className="b-section-title">Hero</div>
        <div className="b-field">
          <label>Frase principal</label>
          <input
            value={custom.theme?.heroPhrase || ''}
            onChange={(e) => onCustomChange('theme.heroPhrase', e.target.value)}
            placeholder="Nos Casamos"
          />
        </div>
      </div>

      <div className="b-section">
        <div className="b-section-title">Texto de Invitación</div>
        <div className="b-field">
          <label>Mensaje de invitación</label>
          <textarea
            value={custom.inviteText || ''}
            onChange={(e) => onCustomChange('inviteText', e.target.value)}
            rows={5}
            placeholder="Con la bendición de Dios y de nuestros padres..."
          />
        </div>
      </div>
    </div>
  );
}
