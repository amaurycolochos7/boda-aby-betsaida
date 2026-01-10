# Keep-Alive para Supabase

Este directorio contiene el sistema automatizado para mantener activa la base de datos de Supabase.

## ¿Por qué es necesario?

Supabase en su plan gratuito pausa las bases de datos después de 7 días de inactividad. Este sistema previene eso haciendo consultas periódicas automáticas.

## Archivos

- **`test-keep-alive.js`** - Script de prueba para ejecutar localmente
- **Ejecutar en Vercel**: El archivo `api/keep-alive.js` es un endpoint serverless

## Uso Local

Para probar localmente antes de desplegar:

```bash
npm install
npm run test-keep-alive
```

Deberías ver:
```
✅ ÉXITO - Ping keep-alive de Supabase completado
📊 Confirmaciones en DB: X
⏰ Timestamp: ...
```

## Configuración en Producción

### Paso 1: Desplegar a Vercel

Simplemente haz push de los cambios a GitHub. Vercel detectará automáticamente el endpoint `/api/keep-alive`.

### Paso 2: Configurar Cron Job Gratuito

Usa **cron-job.org** (servicio gratuito):

1. Ve a https://cron-job.org/
2. Regístrate gratis
3. **Crear nuevo Cron Job**:
   - Click en "Create cronjob"
   - **Title**: `Supabase Keep-Alive - Boda`
   - **URL**: `https://tu-sitio.vercel.app/api/keep-alive` (reemplaza con tu URL real)
   - **Schedule**:
     - Selecciona "Every X days"
     - Ingresa `4` días
     - Hora: Cualquiera (por ejemplo, 00:00 UTC)
   - **Método**: GET

### Paso 3: Verificar

Visita tu endpoint directamente para probarlo:
```
https://tu-sitio.vercel.app/api/keep-alive
```

Deberías ver un JSON con:
```json
{
  "success": true,
  "message": "✅ Ping keep-alive de Supabase exitoso",
  "confirmationsCount": X,
  "timestamp": "...",
  "nextPingRecommended": "..."
}
```

## Monitoreo

Puedes revisar los logs en:
- **Vercel Dashboard** → Tu proyecto → Functions → `keep-alive`
- **cron-job.org** → Execution History

## Frecuencia Recomendada

- **Cada 4 días** es lo recomendado (más seguro que esperar 7 días)
- Puedes ajustarlo si lo necesitas
