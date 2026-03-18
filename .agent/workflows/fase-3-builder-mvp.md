---
description: Phase 3 — Builder MVP - Visual editor with live preview for event creation
---

# 🔹 FASE 3 — BUILDER MVP (CORE DEL NEGOCIO)

## 🎯 Objetivo
Reemplazar la edición manual por edición visual con preview en vivo.

---

## 3.1 — Rediseño del Panel de Edición (Split Layout)

**Archivo**: `app/dashboard/[id]/edit/page.tsx`

### Pasos:

1. **Crear layout split-panel** con CSS Grid:
   ```
   [ Panel Config (40%) ] | [ Preview en vivo (60%) ]
   ```
   - Panel izquierdo: formulario con pestañas/secciones colapsables
   - Panel derecho: iframe embebido con la vista del evento (`/event/{slug}`)
   - En móvil: tabs que alternan entre "Editar" y "Preview"

2. **Crear componente `BuilderLayout.tsx`** en `components/dashboard/`:
   - Props: `eventId`, `slug`, `config`
   - Estado centralizado con `useReducer` para el config completo
   - Cada cambio actualiza el state → re-render del preview

3. **Crear `BuilderPreview.tsx`**:
   - Iframe que carga `/event/{slug}?preview=true`
   - Re-carga automática al detectar cambios en config
   - Toolbar superior con: "Desktop / Móvil" toggle para cambiar ancho del frame

4. **CSS del builder** en `app/dashboard/builder.css`:
   - `.builder-container`: grid `40% 60%` en desktop, stack en móvil
   - `.builder-panel`: scroll vertical independiente, fondo claro
   - `.builder-preview`: fondo oscuro con frame centrado
   - `.builder-tabs`: pestañas para móvil (Editar | Preview)

---

## 3.2 — Inputs Editables (Tabs del Panel)

**Archivo**: `components/dashboard/BuilderPanel.tsx`

### Tabs a crear:

#### Tab 1: "Evento" (Datos Core)
- Nombre del evento (input text)
- Fecha (date picker)
- Hora (time picker)
- Lugar / Salón (input text)
- Dirección (input text)
- Google Maps URL (input text)
- Teléfono de contacto (input text)

#### Tab 2: "Pareja" (Datos Custom)
- Nombres del novio (first + last)
- Nombres de la novia (first + last)
- Padres del novio (padre + madre)
- Padres de la novia (padre + madre)

#### Tab 3: "Diseño" (Theme)
- Frase del Hero (input text)
- Iniciales (2 inputs separados)
- Subtítulo de entrada (input text)
- Texto de invitación (textarea)
- Colores primarios (color picker — preparar para futuro)
- Tipografía (select con opciones — preparar para futuro)

#### Tab 4: "Confirmación" (RSVP)
- Nota de confirmación (input text)
- Fecha límite (date picker)
- Contactos WhatsApp (lista dinámica: label + número)
- URL de confirmación (input text)

#### Tab 5: "Footer"
- Nombres del footer (input text)
- Mensaje final (input text)

### Implementación:
- Cada tab es un componente: `TabEvento.tsx`, `TabPareja.tsx`, `TabDiseno.tsx`, `TabRsvp.tsx`, `TabFooter.tsx`
- Todos reciben `config` y `onChange(path, value)` para actualizar el state

---

## 3.3 — Sincronización en Tiempo Real

**Mecanismo**: PostMessage + Iframe reload

### Pasos:

1. En el **builder** (`BuilderLayout.tsx`):
   - Cada cambio en un input → actualiza el state vía `dispatch`
   - Debounce de 500ms → envía `postMessage` al iframe con el nuevo config
   - El iframe reacciona y re-renderiza sin recargar

2. En la **página del evento** (`app/event/[slug]/page.tsx`):
   - Detectar query param `?preview=true`
   - Escuchar `window.addEventListener('message', ...)` 
   - Al recibir un nuevo config → re-renderizar con los datos recibidos en lugar de los de DB

3. **Alternativa simple** (si postMessage es complejo):
   - Guardar en `sessionStorage` y recargar el iframe con `iframe.src = iframe.src`
   - Menos elegante pero funcional

---

## 3.4 — Guardado Automático

**Archivo**: `components/dashboard/BuilderLayout.tsx`

### Pasos:

1. **Auto-save con debounce**:
   - Timer de 2 segundos después del último cambio
   - Indicador visual: "Guardando..." → "✓ Guardado" → se desvanece
   - Si hay error: "⚠ Error al guardar" en rojo

2. **Implementación**:
   ```
   useEffect → debounce 2s → updateEvent(id, core, custom) → mostrar estado
   ```

3. **Indicador en la UI**:
   - Badge en la esquina superior derecha del panel
   - Estados: `idle` | `saving` | `saved` | `error`
   - Transición suave con CSS

4. **Guardado manual** también disponible:
   - Botón "Guardar" siempre visible como fallback
   - Atajo de teclado: Ctrl+S para guardar manualmente

---

## 📁 Archivos a crear/modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `app/dashboard/[id]/edit/page.tsx` | MODIFICAR | Reemplazar form actual con BuilderLayout |
| `app/dashboard/builder.css` | CREAR | Estilos del split-panel builder |
| `components/dashboard/BuilderLayout.tsx` | CREAR | Layout principal split-panel |
| `components/dashboard/BuilderPanel.tsx` | CREAR | Panel con tabs de edición |
| `components/dashboard/BuilderPreview.tsx` | CREAR | Iframe preview con toggle desktop/móvil |
| `components/dashboard/tabs/TabEvento.tsx` | CREAR | Tab datos del evento |
| `components/dashboard/tabs/TabPareja.tsx` | CREAR | Tab datos de la pareja |
| `components/dashboard/tabs/TabDiseno.tsx` | CREAR | Tab diseño/theme |
| `components/dashboard/tabs/TabRsvp.tsx` | CREAR | Tab confirmación RSVP |
| `components/dashboard/tabs/TabFooter.tsx` | CREAR | Tab footer |
| `app/event/[slug]/page.tsx` | MODIFICAR | Agregar modo preview con postMessage |
| `lib/types.ts` | MODIFICAR | Agregar theme colors/fonts si se necesita |

---

## ✅ Criterio de éxito

- [ ] Layout split funcional: panel izquierdo + preview derecho
- [ ] 5 tabs con todos los inputs editables
- [ ] Cada cambio se refleja en el preview en <1 segundo
- [ ] Auto-save con indicador visual
- [ ] Funciona en móvil con tabs (Editar/Preview)
- [ ] No rompe el diseño de la invitación existente

---

## ⚠️ Punto crítico

> El sistema actual está optimizado para verse bonito. Ahora debe ser editable sin romper el diseño. La clave es que el preview siempre muestre la invitación real — no una aproximación.
