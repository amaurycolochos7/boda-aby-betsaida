# 🔍 Diagnóstico y Solución - Error de Login

## 📋 Resumen del Problema

El usuario `recepcion@miboda.com` ya está creado en Supabase, pero aún muestra "Invalid login credentials".

## 🔎 Posibles Causas

### 1. ❌ Contraseña Incorrecta
La causa más común. Verifica que estés usando la contraseña correcta.

**Solución:**
- Ve a Supabase Dashboard → Authentication → Users
- Haz clic en el usuario `recepcion@miboda.com`
- Usa la opción "Send magic link" o "Reset password"
- O crea una nueva contraseña temporal

### 2. ❌ Usuario No Confirmado
Si el usuario no está confirmado, no podrá hacer login.

**Solución:**
1. Ve a Supabase Dashboard → Authentication → Users
2. Haz clic en `recepcion@miboda.com`
3. Busca el campo "Email Confirmed"
4. Si dice "No", haz clic en "Confirm email"

### 3. ❌ Tabla user_profiles No Existe o Está Vacía
El perfil del usuario necesita estar en la tabla `user_profiles`.

**Solución:**
1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta el archivo [`verificar-usuarios.sql`](file:///c:/Users/Amaury/.gemini/antigravity/scratch/boda-abidan-betsaida/verificar-usuarios.sql)
3. Verifica que aparezcan los 3 usuarios

### 4. ❌ Políticas RLS Bloqueando el Acceso
Las políticas de seguridad pueden estar impidiendo leer los perfiles.

**Solución:**
1. Ve a Supabase Dashboard → SQL Editor
2. Ejecuta el archivo [`corregir-politicas-rls.sql`](file:///c:/Users/Amaury/.gemini/antigravity/scratch/boda-abidan-betsaida/corregir-politicas-rls.sql)
3. Esto recreará las políticas correctamente

## 🚀 Pasos de Solución (EN ORDEN)

### Paso 1: Verificar Email Confirmation ⚡ HACER PRIMERO
```
1. Abre Supabase Dashboard
2. Ve a Authentication → Users
3. Haz clic en recepcion@miboda.com
4. Verifica que "Email Confirmed" = "Yes"
5. Si dice "No", haz clic en el botón de confirmar
```

### Paso 2: Resetear Contraseña (Recomendado)
```
1. En el mismo panel del usuario
2. Busca la sección "Reset password"
3. Crea una nueva contraseña temporal (ejemplo: Boda2026!)
4. Guarda la contraseña
5. Intenta hacer login nuevamente
```

### Paso 3: Ejecutar Script de Verificación
```sql
-- Copia este código en SQL Editor y ejecuta:

-- Ver si el perfil existe
SELECT * FROM user_profiles 
WHERE email = 'recepcion@miboda.com';

-- Si no existe o tiene datos incorrectos, ejecuta:
INSERT INTO user_profiles (id, email, first_name, role)
VALUES (
    'e1049ca1-3d66-4cf6-ab4e-08d5362c76c1',
    'recepcion@miboda.com',
    'Recepción',
    'access_control'
)
ON CONFLICT (id) DO UPDATE 
SET 
    email = 'recepcion@miboda.com',
    first_name = 'Recepción',
    role = 'access_control';
```

### Paso 4: Corregir Políticas RLS
```
1. Ve a SQL Editor en Supabase
2. Ejecuta TODO el contenido de: corregir-politicas-rls.sql
3. Verifica que no haya errores
```

### Paso 5: Probar Login con Debugging
```
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Intenta hacer login
4. Observa los mensajes que aparecen:
   - 🔐 Intentando login con: ...
   - ✅ Autenticación exitosa
   - ✅ Perfil encontrado
   - 🚀 Redirigiendo...
   
5. Si ves un ❌, toma captura y envíala
```

## 📸 Información Necesaria

Si ninguna solución funciona, necesito:

1. **Captura de la consola del navegador** (F12 → Console) al intentar login
2. **Resultado de esta query en SQL Editor:**
   ```sql
   SELECT * FROM user_profiles 
   WHERE email = 'recepcion@miboda.com';
   ```
3. **Confirmación de que el email está verificado** en Authentication → Users

## ⚡ Solución Rápida (Prueba Esto Primero)

```
1. Supabase Dashboard → Authentication → Users
2. Click en recepcion@miboda.com
3. Click "Confirm email" (si no está confirmado)
4. Click "Update user" y establece nueva password: Boda2026!
5. Guarda
6. Intenta login con: recepcion@miboda.com / Boda2026!
```

## 🎯 Siguiente Paso

**Prueba la Solución Rápida primero** y si no funciona, ejecuta los scripts SQL que creé:
- [`verificar-usuarios.sql`](file:///c:/Users/Amaury/.gemini/antigravity/scratch/boda-abidan-betsaida/verificar-usuarios.sql)
- [`corregir-politicas-rls.sql`](file:///c:/Users/Amaury/.gemini/antigravity/scratch/boda-abidan-betsaida/corregir-politicas-rls.sql)
