-- ========================================================================
-- EventControl — Tabla de Eventos (Multi-Evento)
-- ========================================================================
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- DESPUÉS de ejecutar crear-base-datos.sql (no afecta tablas existentes)
-- ========================================================================

-- Tabla principal de eventos
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    type TEXT DEFAULT 'wedding' CHECK (type IN ('wedding', 'quinceañera', 'birthday', 'corporate', 'other')),
    
    -- Data en 2 capas (JSONB)
    core JSONB NOT NULL,        -- EventCore: datos obligatorios
    custom JSONB DEFAULT '{}',  -- EventCustom: datos opcionales
    
    -- Estado
    is_active BOOLEAN DEFAULT true,
    
    -- Métricas
    views_count INTEGER DEFAULT 0,
    last_viewed TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);

-- Habilitar RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas: lectura pública (solo eventos activos), escritura autenticada
CREATE POLICY "public_read_events" ON events 
    FOR SELECT TO anon, authenticated 
    USING (is_active = true);

CREATE POLICY "auth_write_events" ON events 
    FOR ALL TO authenticated 
    USING (true) WITH CHECK (true);

-- Política para actualizar views (público)
CREATE POLICY "public_update_views" ON events 
    FOR UPDATE TO anon 
    USING (true) 
    WITH CHECK (true);

-- ========================================================================
-- Verificar
-- ========================================================================
SELECT 'events table created successfully' AS status;
