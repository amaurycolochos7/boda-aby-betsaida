// ============================================================
// EventControl — Data Schema (2 Capas + Modulos)
// ============================================================

// ─── Helpers ─────────────────────────────────────────────────

export interface Person {
  firstName: string;
  lastName: string;
}

export interface Parents {
  father: string;
  mother: string;
}

export interface WhatsAppContact {
  label: string;
  number: string;
  active: boolean;
}

export interface TimelineItem {
  time: string;
  title: string;
  description?: string;
}

export interface Padrino {
  name: string;
  role: string;
  phone?: string;
  confirmed?: boolean;
}

// ─── Modulos activables por evento ──────────────────────────

export interface EventModules {
  padrinos: boolean;
  checklist: boolean;
  seating: boolean;
  checkin: boolean;
  proveedores: boolean;
}

export type EventType = 'wedding' | 'quinceañera' | 'birthday' | 'corporate' | 'other';

export const DEFAULT_MODULES: Record<EventType, EventModules> = {
  wedding:      { padrinos: true,  checklist: true,  seating: true,  checkin: true,  proveedores: true  },
  'quinceañera':{ padrinos: false, checklist: true,  seating: true,  checkin: true,  proveedores: true  },
  birthday:     { padrinos: false, checklist: true,  seating: false, checkin: false, proveedores: false },
  corporate:    { padrinos: false, checklist: true,  seating: true,  checkin: true,  proveedores: true  },
  other:        { padrinos: false, checklist: true,  seating: false, checkin: false, proveedores: false },
};

// ─── CAPA 1: EventCore (obligatorio) ────────────────────────

export interface EventCore {
  slug: string;
  type: EventType;
  title: string;
  date: string;        // ISO date: "2026-03-15"
  time: string;        // "17:00"
  timezone: string;    // "America/Mexico_City"
  venue: string;
  address: string;
  mapsUrl: string;
  heroImage: string;   // URL or path to hero background
  contactPhone: string;
}

// ─── CAPA 2: EventCustom (opcional) ─────────────────────────

export interface EventCustom {
  couple?: {
    groom: Person;
    bride: Person;
  };
  parents?: {
    groom: Parents;
    bride: Parents;
  };
  padrinos?: Padrino[];
  entryScreen?: {
    initials: string[];   // ["A", "B"]
    subtitle: string;     // "Nuestra Boda"
  };
  inviteText?: string;
  timeline?: TimelineItem[];
  gallery?: string[];         // URLs of gallery images
  coupleImages?: string[];    // URLs of couple section images
  heroImage?: string;         // Uploaded hero background image URL
  music?: string;             // URL of background audio
  whatsapp?: WhatsAppContact[];
  rsvp?: {
    note: string;
    deadline: string;
    confirmUrl?: string;      // "/confirm" or external
  };
  theme?: {
    heroPhrase: string;       // "Nos Casamos"
    fonts?: string[];
  };
  footer?: {
    names: string;
    message: string;
  };
}

// ─── Tipo completo ──────────────────────────────────────────

export interface EventConfig {
  core: EventCore;
  custom: EventCustom;
  modules?: EventModules;
}

// ─── Supabase row ───────────────────────────────────────────

export interface EventRow {
  id: string;
  slug: string;
  type: string;
  core: EventCore;
  custom: EventCustom;
  modules?: EventModules;
  is_active: boolean;
  views_count: number;
  last_viewed: string | null;
  created_at: string;
  updated_at: string;
}
