-- ========================================================================
-- POLÍTICAS DE SEGURIDAD A NIVEL DE FILA (RLS) - SISTEMA DE INVITACIONES
-- ========================================================================
-- 
-- Este archivo configura la seguridad de la base de datos para el sistema
-- de gestión de invitaciones de boda. Ejecutar en Supabase SQL Editor.
--
-- [!] IMPORTANTE: Leer todos los comentarios antes de ejecutar
-- ========================================================================

-- ========================================================================
-- PASO 1: ACTIVAR RLS EN TODAS LAS TABLAS
-- ========================================================================
-- RLS protege los datos asegurando que solo usuarios autorizados puedan 
-- acceder a la información según las políticas definidas más abajo.
-- ========================================================================

ALTER TABLE event_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE entry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;


-- ========================================================================
-- PASO 2: POLÍTICAS PARA LA TABLA "event_config"
-- ========================================================================
-- Propósito: Almacena configuración general del evento (fecha, nombre, etc.)
-- Acceso:
--   [LECTURA] LECTURA: Todos (público y autenticado) - necesario para mostrar info
--   [ESCRITURA] ESCRITURA: Solo usuarios autenticados - para proteger configuración
-- ========================================================================

-- Permitir que CUALQUIERA lea la configuración del evento
-- Justificación: La página de invitación pública necesita mostrar nombre,
-- fecha y ubicación del evento sin requerir login
CREATE POLICY "public_lectura_configuracion_evento"
ON event_config FOR SELECT
TO authenticated, anon
USING (true);

-- Solo usuarios autenticados pueden actualizar la configuración
-- Justificación: Protege datos sensibles, solo administradores logueados
CREATE POLICY "admin_actualizar_configuracion_evento"
ON event_config FOR UPDATE
TO authenticated
USING (true);

-- Solo usuarios autenticados pueden insertar nueva configuración
-- Justificación: Previene que usuarios anónimos creen configuraciones falsas
CREATE POLICY "admin_crear_configuracion_evento"
ON event_config FOR INSERT
TO authenticated
WITH CHECK (true);


-- ========================================================================
-- PASO 3: POLÍTICAS PARA LA TABLA "tables"
-- ========================================================================
-- Propósito: Gestiona las mesas del evento y su capacidad
-- Acceso:
--   [LECTURA] LECTURA: Todos - necesario para asignación de mesas en invitaciones
--   [ESCRITURA] ESCRITURA: Solo autenticados - para administrar mesas
-- ========================================================================

-- Permitir que CUALQUIERA lea información de las mesas
-- Justificación: La página de confirmación necesita mostrar mesas disponibles
CREATE POLICY "public_lectura_mesas"
ON tables FOR SELECT
TO authenticated, anon
USING (true);

-- Solo usuarios autenticados pueden gestionar (crear/actualizar/eliminar) mesas
-- Justificación: Solo administradores deben poder modificar la distribución
CREATE POLICY "admin_gestion_completa_mesas"
ON tables FOR ALL
TO authenticated
USING (true);


-- ========================================================================
-- PASO 4: POLÍTICAS PARA LA TABLA "guest_passes"
-- ========================================================================
-- Propósito: Almacena los códigos de invitación de cada familia/grupo
-- Acceso:
--   [LECTURA] LECTURA: Todos - necesario para verificar códigos al confirmar asistencia
--   [ESCRITURA] ESCRITURA: Solo autenticados - protege creación de invitaciones
--   [ELIMINACIÓN] ELIMINACIÓN: Solo autenticados - control total para administradores
--   🔄 ACTUALIZACIÓN: Mixto - permite actualizar estado de confirmación
-- ========================================================================

-- Permitir que CUALQUIERA lea los pases de invitado
-- Justificación: El sistema de confirmación pública necesita validar códigos
-- y recuperar información de la familia al ingresar el código
CREATE POLICY "public_lectura_invitaciones"
ON guest_passes FOR SELECT
TO authenticated, anon
USING (true);

-- Solo usuarios autenticados pueden crear nuevos pases de invitado
-- Justificación: Solo administradores deben poder generar invitaciones
CREATE POLICY "admin_crear_invitaciones"
ON guest_passes FOR INSERT
TO authenticated
WITH CHECK (true);

-- Permitir que CUALQUIERA actualice pases (para confirmaciones)
-- Justificación: Los invitados necesitan cambiar su estado de "pendiente" 
-- a "confirmado" desde la página pública de confirmación
CREATE POLICY "public_actualizar_confirmacion_invitacion"
ON guest_passes FOR UPDATE
TO authenticated, anon
USING (true);

-- Solo usuarios autenticados pueden eliminar pases
-- Justificación: Control de administrador para gestionar invitaciones
CREATE POLICY "admin_eliminar_invitaciones"
ON guest_passes FOR DELETE
TO authenticated
USING (true);


-- ========================================================================
-- PASO 5: POLÍTICAS PARA LA TABLA "entry_logs"
-- ========================================================================
-- Propósito: Registra el acceso de invitados al evento (control de entrada)
-- Acceso:
--   [LECTURA] LECTURA: Todos - necesario para mostrar lista en tiempo real
--   [ESCRITURA] ESCRITURA: Solo autenticados - registra entrada de invitados
-- ========================================================================

-- Permitir que CUALQUIERA lea los registros de entrada
-- Justificación: La página de monitoreo en vivo necesita mostrar quién ha
-- ingresado al evento sin requerir autenticación
CREATE POLICY "public_lectura_registros_entrada"
ON entry_logs FOR SELECT
TO authenticated, anon
USING (true);

-- Solo usuarios autenticados pueden crear registros de entrada
-- Justificación: Solo el personal de control de acceso debe registrar entradas
CREATE POLICY "access_control_crear_registro_entrada"
ON entry_logs FOR INSERT
TO authenticated
WITH CHECK (true);


-- ========================================================================
-- PASO 6: POLÍTICAS PARA LA TABLA "invitation_downloads"
-- ========================================================================
-- Propósito: Rastrea cuándo los invitados descargan su invitación digital
-- Acceso:
--   [LECTURA] LECTURA: Solo autenticados - estadísticas para administradores
--   [ESCRITURA] ESCRITURA: Todos - permite rastrear descargas públicas
-- ========================================================================

-- Permitir que CUALQUIERA registre una descarga
-- Justificación: Los invitados descargan invitaciones desde la página pública
-- y el sistema necesita rastrear estas descargas para estadísticas
CREATE POLICY "public_registrar_descarga_invitacion"
ON invitation_downloads FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Solo usuarios autenticados pueden leer estadísticas de descargas
-- Justificación: Información analítica solo para administradores
CREATE POLICY "admin_lectura_estadisticas_descargas"
ON invitation_downloads FOR SELECT
TO authenticated
USING (true);


-- ========================================================================
-- PASO 7: POLÍTICAS PARA LA TABLA "user_profiles"
-- ========================================================================
-- Propósito: Almacena perfiles de usuarios administradores del sistema
-- Acceso:
--   [LECTURA] LECTURA: Solo el propio usuario - privacidad total
--   [ESCRITURA] ESCRITURA: Solo el propio usuario - cada quien gestiona su perfil
-- ========================================================================

-- Los usuarios solo pueden leer su propio perfil
-- Justificación: Privacidad - ningún usuario debe ver datos de otros
CREATE POLICY "usuario_lectura_propio_perfil"
ON user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Los usuarios solo pueden crear su propio perfil
-- Justificación: Evita que usuarios creen perfiles para otros
CREATE POLICY "usuario_crear_propio_perfil"
ON user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Los usuarios solo pueden actualizar su propio perfil
-- Justificación: Evita modificaciones no autorizadas de perfiles ajenos
CREATE POLICY "usuario_actualizar_propio_perfil"
ON user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);


-- ========================================================================
-- PASO 8: CREAR USUARIOS ADMINISTRADORES INICIALES
-- ========================================================================
-- [!] INSTRUCCIONES:
-- 1. Primero, crear estos usuarios en el dashboard de Supabase Authentication
-- 2. Copiar los UUIDs generados por Supabase para cada usuario
-- 3. Reemplazar los UUIDs en este script con los UUIDs reales
-- 4. Ejecutar este script para asignar los roles correctos
-- 
-- ROLES DISPONIBLES:
--   • 'groom' (novio): Abidan - acceso completo a dashboard de administración
--   • 'bride' (novia): Betsaida - acceso completo a dashboard de administración  
--   • 'access_control' (recepción): Control de acceso al evento
-- ========================================================================

-- [!] REEMPLAZAR ESTOS UUIDs CON LOS REALES DESPUÉS DE CREAR USUARIOS
-- [!] Los UUIDs actuales son de ejemplo y deben actualizarse

-- Configurar perfil del NOVIO (Abidan)
INSERT INTO user_profiles (id, email, first_name, role)
VALUES (
    '375c26ed-628d-49bb-a9d9-aee27ea64f45',  -- [!] ACTUALIZAR con UUID real
    'abi@miboda.com',                          -- Email del novio
    'Abidan',                                  -- Nombre del novio
    'groom'                                    -- [ROL] novio
)
ON CONFLICT (id) DO UPDATE 
SET role = 'groom', first_name = 'Abidan';

-- Configurar perfil de la NOVIA (Betsaida)
INSERT INTO user_profiles (id, email, first_name, role)
VALUES (
    '40cb3f00-02af-481c-89ac-6a4127b69100',  -- [!] ACTUALIZAR con UUID real
    'betsi@miboda.com',                        -- Email de la novia
    'Betsaida',                                -- Nombre de la novia
    'bride'                                    -- [ROL] novia
)
ON CONFLICT (id) DO UPDATE 
SET role = 'bride', first_name = 'Betsaida';

-- Configurar perfil del CONTROL DE ACCESO (Recepción)
INSERT INTO user_profiles (id, email, first_name, role)
VALUES (
    'e1049ca1-3d66-4cf5-ab4e-08d5362c76c1',  -- [!] ACTUALIZAR con UUID real
    'recepcion@miboda.com',                    -- Email de recepción
    'Recepción',                               -- Nombre para recepción
    'access_control'                           -- [ROL] control de acceso
)
ON CONFLICT (id) DO UPDATE 
SET role = 'access_control', first_name = 'Recepción';


-- ========================================================================
-- ✅ SCRIPT COMPLETO
-- ========================================================================
-- Si todo se ejecutó correctamente, el sistema de seguridad está configurado.
-- Verificar en Supabase Dashboard > Authentication > Policies que todas las
-- políticas estén creadas y activas.
-- ========================================================================
