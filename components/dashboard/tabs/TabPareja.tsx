'use client';

import { EventCustom } from '@/lib/types';

interface Props {
  custom: EventCustom;
  onCustomChange: (path: string, value: string) => void;
}

export default function TabPareja({ custom, onCustomChange }: Props) {
  return (
    <div className="builder-tab-content">
      <div className="b-section">
        <div className="b-section-title">Novio</div>
        <div className="b-row">
          <div className="b-field">
            <label>Nombre</label>
            <input
              value={custom.couple?.groom?.firstName || ''}
              onChange={(e) => onCustomChange('couple.groom.firstName', e.target.value)}
            />
          </div>
          <div className="b-field">
            <label>Apellido</label>
            <input
              value={custom.couple?.groom?.lastName || ''}
              onChange={(e) => onCustomChange('couple.groom.lastName', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="b-section">
        <div className="b-section-title">Novia</div>
        <div className="b-row">
          <div className="b-field">
            <label>Nombre</label>
            <input
              value={custom.couple?.bride?.firstName || ''}
              onChange={(e) => onCustomChange('couple.bride.firstName', e.target.value)}
            />
          </div>
          <div className="b-field">
            <label>Apellido</label>
            <input
              value={custom.couple?.bride?.lastName || ''}
              onChange={(e) => onCustomChange('couple.bride.lastName', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="b-section">
        <div className="b-section-title">Padres del Novio</div>
        <div className="b-row">
          <div className="b-field">
            <label>Padre</label>
            <input
              value={custom.parents?.groom?.father || ''}
              onChange={(e) => onCustomChange('parents.groom.father', e.target.value)}
            />
          </div>
          <div className="b-field">
            <label>Madre</label>
            <input
              value={custom.parents?.groom?.mother || ''}
              onChange={(e) => onCustomChange('parents.groom.mother', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="b-section">
        <div className="b-section-title">Padres de la Novia</div>
        <div className="b-row">
          <div className="b-field">
            <label>Padre</label>
            <input
              value={custom.parents?.bride?.father || ''}
              onChange={(e) => onCustomChange('parents.bride.father', e.target.value)}
            />
          </div>
          <div className="b-field">
            <label>Madre</label>
            <input
              value={custom.parents?.bride?.mother || ''}
              onChange={(e) => onCustomChange('parents.bride.mother', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
