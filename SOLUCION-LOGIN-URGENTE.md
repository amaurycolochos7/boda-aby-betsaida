# 🚨 Solución Urgente - No Puedo Acceder

## Problema
Antes podías acceder pero ahora te dice "Invalid login credentials" (Credenciales inválidas).

## Causa
La contraseña del usuario `recepcion@miboda.com` **no es la que estás intentando**.

## ✅ Solución Rápida (2 minutos)

### Opción 1: Resetear Contraseña (RECOMENDADO)

1. Ve a **Supabase Dashboard** → **Authentication** → **Users**
2. Encuentra y haz clic en **recepcion@miboda.com**
3. En el panel derecho, busca la sección **"Reset password"**
4. Haz clic en **"Send password recovery"** 
   - O mejor: Establece una nueva contraseña directamente haciendo clic en **"Update user"** y cambiando el password field

5. **Crea una contraseña nueva y simple para prueba**, por ejemplo:
   - `Boda2026!`
   - `Recepcion123!`
   - O la que prefieras

6. **Guarda la contraseña** en un lugar seguro

7. Intenta hacer login nuevamente con:
   - **Email:** `recepcion@miboda.com`
   - **Password:** (la contraseña que acabas de establecer)

### Opción 2: Usar "Magic Link" (Enlace Mágico)

Si no quieres cambiar la contraseña:

1. En el mismo panel del usuario en Supabase
2. Haz clic en **"Send magic link"**
3. Revisa el email `recepcion@miboda.com`
4. Haz clic en el enlace del correo
5. Automáticamente te loguearás

## 📸 ¿Cómo Establecer Nueva Contraseña en Supabase?

1. **Authentication** → **Users** → Clic en `recepcion@miboda.com`
2. Scroll down hasta encontrar **"User Management"**
3. Verás un campo **"Password"** 
4. Escribe la nueva contraseña (ej: `Boda2026!`)
5. Haz clic en **"Update user"** o **"Save"**

## ⚠️ Nota Importante

**NO** es un problema de:
- ❌ Base de datos
- ❌ Políticas RLS
- ❌ Perfiles de usuario
- ❌ Código de la aplicación

**SÍ** es simplemente:
- ✅ La contraseña que estás usando no coincide con la que tiene Supabase

## 🔄 Después de Cambiar la Contraseña

1. Cierra la página del login
2. Recarga la página (F5)
3. Ingresa:
   - Email: `recepcion@miboda.com`
   - Password: (tu nueva contraseña)
4. Deberías poder entrar sin problemas

## 💡 Para Evitar Esto en el Futuro

Guarda tus contraseñas en un gestor de contraseñas como:
- 1Password
- Bitwarden  
- LastPass
- O simplemente en un documento seguro

---

**🎯 Acción Inmediata:** Ve a Supabase Dashboard → Authentication → Users → recepcion@miboda.com → Establece nueva contraseña
