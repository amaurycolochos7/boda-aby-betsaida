'use client';

import { EventCore } from '@/lib/types';

interface Props {
  core: EventCore;
  onChange: (field: keyof EventCore, value: string) => void;
}

export default function TabEvento({ core, onChange }: Props) {
  return (
    <div className="builder-tab-content">
      <div className="b-section">
        <div className="b-section-title">Información General</div>
        <div className="b-field">
          <label>Título del evento</label>
          <input value={core.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Boda de..." />
        </div>
        <div className="b-row">
          <div className="b-field">
            <label>Slug (URL)</label>
            <input value={core.slug} onChange={(e) => onChange('slug', e.target.value)} placeholder="mi-evento" />
            <div className="b-field-hint">/event/{core.slug || '...'}</div>
          </div>
          <div className="b-field">
            <label>Tipo de evento</label>
            <select value={core.type} onChange={(e) => onChange('type', e.target.value)}>
              <option value="wedding">Boda</option>
              <option value="quinceañera">XV Años</option>
              <option value="birthday">Cumpleaños</option>
              <option value="corporate">Corporativo</option>
              <option value="other">Otro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="b-section">
        <div className="b-section-title">Fecha y Hora</div>
        <div className="b-row">
          <div className="b-field">
            <label>Fecha</label>
            <input type="date" value={core.date} onChange={(e) => onChange('date', e.target.value)} />
          </div>
          <div className="b-field">
            <label>Hora</label>
            <input type="time" value={core.time} onChange={(e) => onChange('time', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="b-section">
        <div className="b-section-title">Ubicación</div>
        <div className="b-field">
          <label>Lugar / Salón</label>
          <input value={core.venue} onChange={(e) => onChange('venue', e.target.value)} placeholder='Salón "El Jardín"' />
        </div>
        <div className="b-field">
          <label>Dirección completa</label>
          <input value={core.address} onChange={(e) => onChange('address', e.target.value)} placeholder="Calle, colonia, CP, ciudad" />
        </div>
        <div className="b-field">
          <label>Link de Google Maps</label>
          <input value={core.mapsUrl} onChange={(e) => onChange('mapsUrl', e.target.value)} placeholder="https://maps.app.goo.gl/..." />
        </div>
        <div className="b-field">
          <label>Teléfono de contacto</label>
          <input value={core.contactPhone} onChange={(e) => onChange('contactPhone', e.target.value)} placeholder="529611234567" />
        </div>
      </div>
    </div>
  );
}
