# Guía de Configuración Inicial - Portal de Novios

## ❌ Error Actual: "Invalid login credentials"

Este error aparece porque **aún no has creado los usuarios** en Supabase. A continuación te explico cómo solucionarlo.

---

## ✅ Solución: Crear Usuarios en Supabase

### Paso 1: Acceder a Supabase Dashboard

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `pwrixdojbrmtwyfmygys`
3. En el menú lateral, haz clic en **Authentication** > **Users**

### Paso 2: Crear Usuario para los Novios

Crea **3 usuarios** con los siguientes datos:

#### 👰 Usuario 1: Novia (Betsaida)
- **Email:** `betsi@miboda.com` (o el email que prefieras)
- **Password:** Elige una contraseña segura
- **Auto Confirm User:** ✅ Activado (importante)

#### 🤵 Usuario 2: Novio (Abidan)
- **Email:** `abi@miboda.com` (o el email que prefieras)
- **Password:** Elige una contraseña segura
- **Auto Confirm User:** ✅ Activado (importante)

#### 🎫 Usuario 3: Control de Acceso (Recepción)
- **Email:** `recepcion@miboda.com` (o el email que prefieras)
- **Password:** Elige una contraseña segura
- **Auto Confirm User:** ✅ Activado (importante)

### Paso 3: Copiar los UUIDs Generados

Después de crear cada usuario, Supabase les asigna un **UUID único** (identificador). Necesitas copiar estos UUIDs:

1. En la lista de usuarios, haz clic en cada usuario
2. Copia el campo **UUID** (algo como: `375c26ed-628d-49bb-a9d9-aee27ea64f45`)
3. Guarda estos UUIDs temporalmente

### Paso 4: Actualizar el Script SQL

1. Ve a **Supabase Dashboard** > **SQL Editor**
2. Crea un nuevo query
3. Copia este script y **reemplaza los UUIDs** con los que copiaste:

```sql
-- Configurar perfil del NOVIO (Abidan)
INSERT INTO user_profiles (id, email, first_name, role)
VALUES (
    'AQUI_VA_EL_UUID_DE_ABIDAN',  -- Reemplaza con el UUID real
    'abi@miboda.com',              -- El email que usaste
    'Abidan',
    'groom'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'groom', first_name = 'Abidan';

-- Configurar perfil de la NOVIA (Betsaida)
INSERT INTO user_profiles (id, email, first_name, role)
VALUES (
    'AQUI_VA_EL_UUID_DE_BETSAIDA',  -- Reemplaza con el UUID real
    'betsi@miboda.com',               -- El email que usaste
    'Betsaida',
    'bride'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'bride', first_name = 'Betsaida';

-- Configurar perfil del CONTROL DE ACCESO
INSERT INTO user_profiles (id, email, first_name, role)
VALUES (
    'AQUI_VA_EL_UUID_DE_RECEPCION',  -- Reemplaza con el UUID real
    'recepcion@miboda.com',            -- El email que usaste
    'Recepción',
    'access_control'
)
ON CONFLICT (id) DO UPDATE 
SET role = 'access_control', first_name = 'Recepción';
```

4. Haz clic en **RUN** para ejecutar el script
5. Deberías ver: `Success. No rows returned`

### Paso 5: Probar el Login

Ahora puedes iniciar sesión en el portal usando:

- **Email:** `abi@miboda.com` o `betsi@miboda.com`
- **Password:** La contraseña que elegiste en el Paso 2

---

## 🔍 Verificar que Todo Funciona

Después de crear los usuarios y ejecutar el script:

1. Ve a tu portal de novios: `http://localhost/admin/` (o tu URL)
2. Ingresa el email y contraseña
3. Deberías ser redirigido al dashboard

---

## 🛟 ¿Problemas?

Si sigues viendo errores:

1. Verifica que los emails en los usuarios de Authentication coincidan con los del script SQL
2. Asegúrate de haber marcado **Auto Confirm User** al crear los usuarios
3. Verifica que la tabla `user_profiles` exista en tu base de datos
4. Revisa que las políticas RLS estén activadas (ejecuta `supabase-rls-policies.sql`)

---

## 📝 Notas Importantes

- Los roles son:
  - `groom`: Novio (acceso completo al dashboard)
  - `bride`: Novia (acceso completo al dashboard)
  - `access_control`: Personal de recepción (acceso a escaneo QR)
  
- Puedes cambiar los emails a cualquiera que prefieras
- Guarda las contraseñas en un lugar seguro
