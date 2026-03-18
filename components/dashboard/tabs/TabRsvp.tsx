'use client';

import { EventCustom, WhatsAppContact } from '@/lib/types';

interface Props {
  custom: EventCustom;
  onCustomChange: (path: string, value: string) => void;
  onWhatsAppChange: (contacts: WhatsAppContact[]) => void;
}

export default function TabRsvp({ custom, onCustomChange, onWhatsAppChange }: Props) {
  const contacts = custom.whatsapp || [];

  function addContact() {
    onWhatsAppChange([...contacts, { label: '', number: '', active: true }]);
  }

  function removeContact(index: number) {
    onWhatsAppChange(contacts.filter((_, i) => i !== index));
  }

  function updateContact(index: number, field: keyof WhatsAppContact, value: string | boolean) {
    const updated = contacts.map((c, i) =>
      i === index ? { ...c, [field]: value } : c
    );
    onWhatsAppChange(updated);
  }

  return (
    <div className="builder-tab-content">
      <div className="b-section">
        <div className="b-section-title">Confirmación RSVP</div>
        <div className="b-field">
          <label>Nota de confirmación</label>
          <input
            value={custom.rsvp?.note || ''}
            onChange={(e) => onCustomChange('rsvp.note', e.target.value)}
            placeholder="Favor de confirmar antes del..."
          />
        </div>
        <div className="b-field">
          <label>Fecha límite</label>
          <input
            type="date"
            value={custom.rsvp?.deadline || ''}
            onChange={(e) => onCustomChange('rsvp.deadline', e.target.value)}
          />
        </div>
        <div className="b-field">
          <label>URL de confirmación</label>
          <input
            value={custom.rsvp?.confirmUrl || ''}
            onChange={(e) => onCustomChange('rsvp.confirmUrl', e.target.value)}
            placeholder="/confirm"
          />
          <div className="b-field-hint">Página donde el invitado ingresa su código</div>
        </div>
      </div>

      <div className="b-section">
        <div className="b-section-title">Contactos WhatsApp</div>
        <div className="b-wa-list">
          {contacts.map((contact, i) => (
            <div key={i} className="b-wa-item">
              <input
                value={contact.label}
                onChange={(e) => updateContact(i, 'label', e.target.value)}
                placeholder="Nombre"
              />
              <input
                value={contact.number}
                onChange={(e) => updateContact(i, 'number', e.target.value)}
                placeholder="529611234567"
              />
              <button type="button" className="b-wa-remove" onClick={() => removeContact(i)}>×</button>
            </div>
          ))}
        </div>
        <button type="button" className="b-add-btn" onClick={addContact}>
          + Agregar contacto
        </button>
      </div>
    </div>
  );
}
