---
description: Phase 4 — Media System - Supabase Storage for images and music
---

# 🔹 FASE 4 — MEDIA SYSTEM

## 🎯 Objetivo
Eliminar dependencia de archivos locales (`/public/images/`, `/public/music/`) y migrar a Supabase Storage para que cada evento tenga sus propios archivos.

---

## 📊 Análisis del Estado Actual

### Archivos estáticos en `/public/`:
| Tipo | Cantidad | Ejemplos |
|------|----------|----------|
| Hero | 2 | `hero-couple.jpg`, `hero-bg.jpg` |
| Galería | 19 | `gallery/gallery-01.jpg` ... `gallery-19.jpg` |
| Pareja | 5 | `couple-landscape.jpg`, `couple-stairs.jpg`, etc. |
| Landing | 2 | `dashboard-preview.png`, `hero-landing.png` |
| Música | 1 | `music/background.mp3` |

### Referencias en código:
- `lib/demo-event.ts` → rutas hardcodeadas `/images/...`, `/music/...`
- `lib/auth.ts` → template de nuevo evento usa `/images/hero-couple.jpg`
- `app/page.tsx` → landing usa `/images/dashboard-preview.png`
- `lib/types.ts` → `heroImage: string`, `gallery: string[]`, `coupleImages: string[]`, `music: string`

### ⚠️ Nota importante:
Los assets de la **landing page** (`dashboard-preview.png`, `hero-landing.png`) deben **quedarse en `/public/`** porque son del sistema, no del usuario. Solo se migran los assets **por evento**.

---

## 4.1 — Configurar Supabase Storage

### Pasos:

1. **Crear bucket `event-media`** en Supabase Dashboard:
   - Bucket público (para servir imágenes sin auth)
   - Limite de 10MB por archivo
   - Tipos permitidos: `image/jpeg`, `image/png`, `image/webp`, `audio/mpeg`

2. **Estructura de carpetas dentro del bucket**:
   ```
   event-media/
   ├── {event-id}/
   │   ├── hero.jpg
   │   ├── gallery/
   │   │   ├── 001.jpg
   │   │   ├── 002.jpg
   │   │   └── ...
   │   ├── couple/
   │   │   ├── 001.jpg
   │   │   └── ...
   │   └── music.mp3
   ```

3. **Crear `lib/storage.ts`**:
   - `uploadFile(eventId, category, file)` → retorna URL pública
   - `deleteFile(eventId, path)` → elimina archivo
   - `listFiles(eventId, category)` → lista archivos de una categoría
   - `getPublicUrl(path)` → genera URL pública del bucket
   - Categorías: `hero`, `gallery`, `couple`, `music`

4. **Políticas RLS del bucket**:
   - INSERT: Solo usuarios autenticados, en sus propios eventos
   - SELECT: Público (las invitaciones son públicas)
   - DELETE: Solo el dueño del evento

---

## 4.2 — Upload UI en el Builder

### Componente `MediaUploader.tsx`:
- Drag & drop zona
- Click para seleccionar archivos
- Preview de imagen/audio antes de subir
- Barra de progreso de upload
- Botón para eliminar archivo subido

### Integrar en tabs del Builder:

#### Tab "Diseño" — agregar:
- **Hero Image**: Upload singular (reemplaza la actual)
  - Preview de la imagen actual
  - Botón "Cambiar imagen"

#### Tab nuevo: "Galería" (Tab 6):
- **Galería**: Upload múltiple
  - Grid de previews con botón ✕ para eliminar
  - Drag to reorder (opcional, fase futura)
  - Límite: 20 imágenes

#### Tab nuevo: "Fotos de Pareja" (Tab 7):
- **Couple Images**: Upload múltiple (máx 6)
  - Grid de previews

#### Tab "Footer" — agregar:
- **Música**: Upload singular (MP3)
  - Player de preview
  - Botón "Cambiar canción"

---

## 4.3 — Guardar URLs en DB

### Flujo:
```
Usuario sube archivo
  → Upload a Supabase Storage (event-media/{eventId}/...)
  → Obtener URL pública
  → Actualizar config JSON con la URL 
  → Auto-save guarda en DB
```

### El config JSON queda:
```json
{
  "core": {
    "heroImage": "https://xxx.supabase.co/storage/v1/object/public/event-media/{id}/hero.jpg"
  },
  "custom": {
    "music": "https://xxx.supabase.co/storage/v1/object/public/event-media/{id}/music.mp3",
    "gallery": [
      "https://xxx.supabase.co/storage/v1/object/public/event-media/{id}/gallery/001.jpg",
      "https://xxx.supabase.co/storage/v1/object/public/event-media/{id}/gallery/002.jpg"
    ],
    "coupleImages": [
      "https://xxx.supabase.co/storage/v1/object/public/event-media/{id}/couple/001.jpg"
    ]
  }
}
```

---

## 4.4 — Reemplazar Assets Locales

### Cambios:
1. `lib/auth.ts` → template de nuevo evento: `heroImage: ''` (vacío hasta que suba)
2. `lib/demo-event.ts` → mantener rutas locales SOLO para el demo
3. Componentes del evento → ya usan URLs del config, no necesitan cambio
4. Los assets de `/public/images/` se mantienen SOLO para el demo event

---

## 📁 Archivos a crear/modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `lib/storage.ts` | CREAR | Funciones de Supabase Storage |
| `components/dashboard/MediaUploader.tsx` | CREAR | Componente drag & drop upload |
| `components/dashboard/tabs/TabGaleria.tsx` | CREAR | Tab galería con upload múltiple |
| `components/dashboard/tabs/TabFotos.tsx` | CREAR | Tab fotos de pareja |
| `components/dashboard/tabs/TabDiseno.tsx` | MODIFICAR | Agregar upload de hero image |
| `components/dashboard/tabs/TabFooter.tsx` | MODIFICAR | Agregar upload de música |
| `components/dashboard/BuilderLayout.tsx` | MODIFICAR | Agregar tabs 6 y 7 |
| `lib/auth.ts` | MODIFICAR | Template sin assets locales |
| `app/dashboard/builder.css` | MODIFICAR | Estilos del uploader |

---

## ✅ Criterio de éxito

- [ ] Bucket `event-media` creado en Supabase
- [ ] Upload de hero image funcional
- [ ] Upload de galería (múltiple) funcional
- [ ] Upload de fotos de pareja funcional
- [ ] Upload de música funcional
- [ ] URLs guardadas automáticamente en config JSON
- [ ] Preview de archivos subidos en el builder
- [ ] Evento renderiza con archivos de Supabase Storage
- [ ] Demo event sigue usando assets locales como fallback