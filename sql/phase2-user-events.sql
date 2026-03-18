-- ========================================================================
-- EventControl — Fase 2: Agregar user_id a events + RLS por usuario
-- ========================================================================
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- DESPUÉS de ejecutar create-events-table.sql
-- ========================================================================

-- Agregar columna user_id
ALTER TABLE events ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Índice para buscar eventos por usuario
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

-- ========================================================================
-- Actualizar políticas RLS para que usuarios solo editen sus eventos
-- ========================================================================

-- Eliminar política anterior de escritura
DROP POLICY IF EXISTS "auth_write_events" ON events;

-- Nueva: usuarios autenticados solo pueden insertar con su user_id
CREATE POLICY "auth_insert_own_events" ON events
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Nueva: usuarios solo pueden editar/eliminar sus propios eventos
CREATE POLICY "auth_update_own_events" ON events
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "auth_delete_own_events" ON events
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Mantener lectura pública (ya existe public_read_events)
-- Mantener actualización de views pública (ya existe public_update_views)

SELECT 'Phase 2 migration completed' AS status;
