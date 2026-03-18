'use client';

import { useState } from 'react';
import { WhatsAppContact } from '@/lib/types';

interface RSVPModalProps {
  contacts: WhatsAppContact[];
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  rsvpNote?: string;
  confirmUrl?: string;
}

export default function RSVPModal({
  contacts,
  eventTitle,
  eventDate,
  eventTime,
  rsvpNote,
  confirmUrl,
}: RSVPModalProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);

  function openModal(contact: WhatsAppContact) {
    setSelectedContact(contact);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    setModalOpen(false);
    document.body.style.overflow = '';
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedContact) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get('name') as string)?.trim();
    const guests = formData.get('guests') as string;
    const note = (formData.get('note') as string)?.trim();

    if (!name || !guests) {
      alert('Por favor completa los campos requeridos.');
      return;
    }

    // Format date
    const dateFormatted = formatDateForMessage(eventDate);
    const timeFormatted = formatTimeForMessage(eventTime);

    let message = `Hola, soy ${name}. Confirmo mi asistencia a ${eventTitle} el ${dateFormatted} a las ${timeFormatted}. Asistiremos ${guests} persona(s).`;
    if (note) message += ` Nota: ${note}`;
    message += ' ¡Muchas gracias!';

    const url = `https://wa.me/${selectedContact.number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    closeModal();
    form.reset();
  }

  return (
    <>
      <section id="rsvp" className="rsvp-section">
        <div className="section-container">
          <h2 className="section-title animate-on-scroll">Confirma tu Asistencia</h2>
          <p className="section-subtitle animate-on-scroll">
            Tu presencia es muy importante para nosotros
          </p>

          <div className="rsvp-buttons animate-on-scroll">
            {confirmUrl && (
              <a href={confirmUrl} className="rsvp-btn primary" id="confirm-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>Confirmar Asistencia</span>
              </a>
            )}
          </div>

          {confirmUrl && (
            <p className="rsvp-info animate-on-scroll">
              Ingresa el código de 4 dígitos que te proporcionaron
              <br />
              para descargar tu pase de acceso con código QR
            </p>
          )}

          {rsvpNote && (
            <p className="rsvp-note animate-on-scroll">{rsvpNote}</p>
          )}
        </div>
      </section>

      {/* WhatsApp Modal */}
      {modalOpen && (
        <div id="whatsapp-modal" className="modal active">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h3 className="modal-title">Confirmar Asistencia</h3>
            <p className="modal-subtitle">Completa tus datos para confirmar</p>

            <form className="rsvp-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="guest-name">Tu Nombre *</label>
                <input type="text" id="guest-name" name="name" required placeholder="Nombre completo" />
              </div>
              <div className="form-group">
                <label htmlFor="guest-count">Número de Asistentes *</label>
                <select id="guest-count" name="guests" required>
                  <option value="">Selecciona</option>
                  <option value="1">1 persona</option>
                  <option value="2">2 personas</option>
                  <option value="3">3 personas</option>
                  <option value="4">4 personas</option>
                  <option value="5">5 personas</option>
                  <option value="6+">6 o más personas</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="guest-note">Mensaje o Nota (opcional)</label>
                <textarea id="guest-note" name="note" placeholder="¿Algún mensaje?"></textarea>
              </div>
              <button type="submit" className="form-submit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Abrir WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function formatDateForMessage(iso: string): string {
  const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} de ${months[month - 1]} de ${year}`;
}

function formatTimeForMessage(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const hour12 = h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}
