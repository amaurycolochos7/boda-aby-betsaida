'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { getEventById, updateEvent } from '@/lib/auth';
import { EventCore, EventCustom, WhatsAppContact } from '@/lib/types';
import TabEvento from './tabs/TabEvento';
import TabPareja from './tabs/TabPareja';
import TabDiseno from './tabs/TabDiseno';
import TabRsvp from './tabs/TabRsvp';
import TabFooter from './tabs/TabFooter';
import TabGaleria from './tabs/TabGaleria';
import TabFotos from './tabs/TabFotos';
import '@/app/dashboard/builder.css';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type DeviceMode = 'desktop' | 'mobile';

interface Props {
  eventId: string;
}

// Deep-set a nested path in an object (e.g., "couple.groom.firstName")
function deepSet<T>(obj: T, path: string, value: unknown): T {
  const clone = JSON.parse(JSON.stringify(obj));
  const keys = path.split('.');
  let current: Record<string, unknown> = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === undefined || current[key] === null) {
      // If next key is a number, create array; otherwise object
      current[key] = isNaN(Number(keys[i + 1])) ? {} : [];
    }
    current = current[key] as Record<string, unknown>;
  }
  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
  return clone;
}

export default function BuilderLayout({ eventId }: Props) {
  const [loading, setLoading] = useState(true);
  const [core, setCore] = useState<EventCore | null>(null);
  const [custom, setCustom] = useState<EventCustom | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChanges = useRef(false);

  const tabs = ['Evento', 'Pareja', 'Diseño', 'Galería', 'Fotos', 'RSVP', 'Footer'];

  // ─── Load Event ──────────────────────────────────────────
  useEffect(() => {
    loadEvent();
  }, [eventId]);

  async function loadEvent() {
    try {
      const event = await getEventById(eventId);
      if (!event) return;
      setCore(event.core as EventCore);
      setCustom((event.custom || {}) as EventCustom);
    } catch (err) {
      console.error('Failed to load event:', err);
    } finally {
      setLoading(false);
    }
  }

  // ─── Auto-save ───────────────────────────────────────────
  const doSave = useCallback(async () => {
    if (!core || !custom || !hasChanges.current) return;
    setSaveStatus('saving');
    try {
      await updateEvent(eventId, core, custom);
      setSaveStatus('saved');
      hasChanges.current = false;
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  }, [core, custom, eventId]);

  function scheduleSave() {
    hasChanges.current = true;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(doSave, 2000);
  }

  // ─── Sync preview ────────────────────────────────────────
  function syncPreview() {
    if (iframeRef.current?.contentWindow && core && custom) {
      iframeRef.current.contentWindow.postMessage(
        { type: 'BUILDER_UPDATE', payload: { core, custom } },
        '*'
      );
    }
  }

  useEffect(() => {
    if (core && custom) syncPreview();
  }, [core, custom]);

  // ─── Handlers ────────────────────────────────────────────
  function handleCoreChange(field: keyof EventCore, value: string) {
    if (!core) return;
    setCore({ ...core, [field]: value });
    scheduleSave();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleCustomChange(path: string, value: any) {
    if (!custom) return;
    setCustom(deepSet(custom, path, value));
    scheduleSave();
  }

  function handleWhatsAppChange(contacts: WhatsAppContact[]) {
    if (!custom) return;
    setCustom({ ...custom, whatsapp: contacts });
    scheduleSave();
  }

  function handleManualSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    doSave();
  }

  // ─── Keyboard shortcut ──────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [core, custom]);

  if (loading || !core || !custom) {
    return (
      <div className="builder" style={{ placeItems: 'center', display: 'grid' }}>
        <div className="dash-spinner"></div>
      </div>
    );
  }

  const previewUrl = `/event/${core.slug}?preview=true`;

  const saveLabels: Record<SaveStatus, string> = {
    idle: '',
    saving: 'Guardando...',
    saved: '✓ Guardado',
    error: '⚠ Error al guardar',
  };

  return (
    <div className="builder">
      {/* ─── Top Bar ───────────────────────────────────────── */}
      <div className="builder-topbar">
        <div className="builder-topbar-left">
          <Link href="/dashboard" className="builder-back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver
          </Link>
          <span className="builder-event-name">{core.title}</span>
        </div>
        <div className="builder-topbar-right">
          {saveStatus !== 'idle' && (
            <div className={`builder-save-status ${saveStatus}`}>
              <span className="builder-save-dot"></span>
              {saveLabels[saveStatus]}
            </div>
          )}
          <button type="button" className="builder-btn builder-btn-ghost" onClick={handleManualSave}>
            Guardar
          </button>
          <a
            href={`/event/${core.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="builder-btn builder-btn-primary"
          >
            Ver Evento ↗
          </a>
        </div>
      </div>

      {/* ─── Mobile Tabs ──────────────────────────────────── */}
      <div className="builder-mobile-tabs">
        <button
          className={`builder-mobile-tab ${mobileView === 'edit' ? 'active' : ''}`}
          onClick={() => setMobileView('edit')}
        >
          Editar
        </button>
        <button
          className={`builder-mobile-tab ${mobileView === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileView('preview')}
        >
          Preview
        </button>
      </div>

      {/* ─── Panel (Left) ─────────────────────────────────── */}
      <div className={`builder-panel ${mobileView !== 'edit' ? 'hidden' : ''}`}>
        <div className="builder-tabs">
          {tabs.map((label, i) => (
            <button
              key={label}
              className={`builder-tab ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 0 && (
          <TabEvento core={core} onChange={handleCoreChange} />
        )}
        {activeTab === 1 && (
          <TabPareja custom={custom} onCustomChange={handleCustomChange} />
        )}
        {activeTab === 2 && (
          <TabDiseno custom={custom} onCustomChange={handleCustomChange} />
        )}
        {activeTab === 3 && (
          <TabGaleria
            eventId={eventId}
            gallery={custom.gallery || []}
            onChange={handleCustomChange}
          />
        )}
        {activeTab === 4 && (
          <TabFotos
            eventId={eventId}
            coupleImages={custom.coupleImages || []}
            onChange={handleCustomChange}
          />
        )}
        {activeTab === 5 && (
          <TabRsvp
            custom={custom}
            onCustomChange={handleCustomChange}
            onWhatsAppChange={handleWhatsAppChange}
          />
        )}
        {activeTab === 6 && (
          <TabFooter custom={custom} onCustomChange={handleCustomChange} eventId={eventId} />
        )}
      </div>

      {/* ─── Preview (Right) ──────────────────────────────── */}
      <div className={`builder-preview ${mobileView !== 'preview' ? 'hidden' : ''}`}>
        <div className="builder-preview-toolbar">
          <button
            className={`builder-device-btn ${deviceMode === 'desktop' ? 'active' : ''}`}
            onClick={() => setDeviceMode('desktop')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Desktop
          </button>
          <button
            className={`builder-device-btn ${deviceMode === 'mobile' ? 'active' : ''}`}
            onClick={() => setDeviceMode('mobile')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            Móvil
          </button>
        </div>
        <div className="builder-preview-container">
          <div className={`builder-preview-frame ${deviceMode}`}>
            <iframe
              ref={iframeRef}
              className="builder-preview-iframe"
              src={previewUrl}
              title="Preview"
              onLoad={syncPreview}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
