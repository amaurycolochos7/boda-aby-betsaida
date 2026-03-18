import { EventConfig } from './types';

/**
 * Demo event — Boda Abidán & Betsaida
 * Used as fallback when slug is not found in DB
 */
export const DEMO_EVENT: EventConfig = {
  core: {
    slug: 'abidan-betsaida',
    type: 'wedding',
    title: 'Boda de Abidán & Betsaida',
    date: '2026-03-15',
    time: '17:00',
    timezone: 'America/Mexico_City',
    venue: 'Salón "El Jardín"',
    address: '12a. Nte. Pte. 467, Niño de Atocha, 29037 Tuxtla Gutiérrez, Chiapas',
    mapsUrl: 'https://maps.app.goo.gl/mL1mwfXS7GEA8cqx6',
    heroImage: '/images/hero-couple.jpg',
    contactPhone: '529613030443',
  },
  custom: {
    couple: {
      groom: { firstName: 'Abidán', lastName: 'Rodríguez Hernández' },
      bride: { firstName: 'Betsaida', lastName: 'Guadalupe Villafuerte Hernández' },
    },
    parents: {
      groom: { father: 'Elmer Rodríguez Constantino', mother: 'Martha Lilia Hernández Gutiérrez' },
      bride: { father: 'Genaro Villafuerte Santis', mother: 'Filadelfia Hernández Villatoro' },
    },
    entryScreen: {
      initials: ['A', 'B'],
      subtitle: 'Nuestra Boda',
    },
    inviteText:
      'Con inmensa alegría nos complace invitarlos a este día tan especial en el qué uniremos nuestras vidas para siempre porque nuestro amor es tan fuerte como la muerte y sus llamas son un fuego ardiente, la llama de Jah, por eso anhelamos ponernos como un sello sobre nuestros corazones (Eclesiastés 8:6)',
    timeline: [
      { time: '5:00 p.m.', title: 'Ceremonia Civil' },
      { time: '5:30 p.m.', title: 'Discurso de boda' },
      { time: '6:00 p.m.', title: 'Recepción' },
      { time: '6:20 p.m.', title: 'Fotos con los invitados' },
      { time: '6:30 p.m.', title: '¡Que empiece la fiesta!' },
      { time: '7:20 p.m.', title: 'Vals' },
      { time: '7:30 p.m.', title: 'Cena', description: '¡Buen provecho!' },
      { time: '8:00 p.m.', title: '¡Que siga la fiesta!' },
      { time: '11:00 p.m.', title: 'Pastel' },
      { time: '12:30 a.m.', title: 'Fin de la fiesta', description: 'gracias por acompañarnos' },
    ],
    gallery: Array.from({ length: 19 }, (_, i) =>
      `/images/gallery/gallery-${String(i + 1).padStart(2, '0')}.jpg`
    ),
    coupleImages: [
      '/images/couple-landscape.jpg',
      '/images/couple-stairs.jpg',
      '/images/couple-pond.jpg',
      '/images/couple-sunflowers.jpg',
      '/images/couple-arches.jpg',
    ],
    music: '/music/background.mp3',
    whatsapp: [
      { label: 'Novia', number: '529613030443', active: true },
      { label: 'Novio', number: '529611030648', active: true },
    ],
    rsvp: {
      note: 'Favor de confirmar antes del 1 de marzo de 2026',
      deadline: '2026-03-01',
      confirmUrl: '/confirm',
    },
    theme: {
      heroPhrase: 'Nos Casamos',
    },
    footer: {
      names: 'Abidán & Betsaida',
      message: '¡Gracias por ser parte de este amor que comienza y no conoce final!',
    },
  },
};
