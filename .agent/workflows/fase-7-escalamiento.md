---
description: Phase 7 — Escalamiento. From invitation → full event management system. Padrinos, checklist, seating, check-in scanner.
---

# Fase 7 — Escalamiento: Sistema Modular de Eventos

## Concepto Central: Modulos Activables por Tipo

Cada tipo de evento tiene modulos predeterminados. El usuario puede activar/desactivar desde su dashboard.

### Modulos por Tipo de Evento

| Modulo | Boda | Quinceañera | Cumpleaños | Corporativo |
|--------|------|-------------|------------|-------------|
| Padrinos | Default | Opcional | Opcional | - |
| Chambelanes/Corte | - | Default | - | - |
| Mesa de regalos | Default | Default | Opcional | - |
| Mesas/Seating | Default | Default | Opcional | Default |
| Checklist/Tareas | Default | Default | Default | Default |
| Proveedores | Default | Default | Opcional | Default |
| Check-In QR | Default | Default | Opcional | Default |
| Speakers/Agenda | - | - | - | Default |

**Default** = se activa automaticamente al crear el evento
**Opcional** = disponible para activar manualmente
**-** = no aplica / no disponible

### Flujo del Usuario

```
1. Crea evento → elige tipo (boda, quinceañera, etc.)
2. Sistema pre-activa modulos segun tipo
3. Dashboard muestra tabs/secciones solo de modulos activos
4. Usuario puede activar/desactivar modulos en "Configuracion"
5. Cada modulo tiene su propia seccion en el dashboard
```

---

## Estado Actual (Ya Existe)

| Modulo | Estado |
|--------|--------|
| Invitacion digital | Completo — hero, countdown, gallery, timeline, RSVP |
| Dashboard CRUD | Completo — crear, editar, eliminar eventos |
| Builder visual | Completo — editor de evento con preview |
| Confirmacion codigo | Completo — input 4 digitos |
| QR en invitacion | Parcial — solo texto, no genera QR real |
| Galeria/Musica | Completo |
| Pareja/Padres/Timeline | Completo — datos en JSON |

---

## Nuevos Modulos

### 7.0 — Sistema de Modulos (Base)

**Lo primero.** Crear la infraestructura para activar/desactivar modulos.

1. Agregar campo `modules` al JSON del evento en `types.ts`:
   ```
   modules: { padrinos: boolean, checklist: boolean, seating: boolean, checkin: boolean, ... }
   ```
2. Al crear evento, auto-activar modulos segun `type` (boda, quinceañera, etc.)
3. En dashboard, mostrar solo tabs de modulos activos
4. Pantalla de configuracion para toggle de modulos

---

### 7.1 — Padrinos / Corte de Honor

**Aplica a:** Bodas (padrinos), Quinceañeras (chambelanes)

1. Tipo `Padrino`: `{ name, role, phone?, confirmed? }`
2. Se guarda en JSON `custom.padrinos` — no requiere tabla nueva
3. Seccion visual en la invitacion digital
4. Editor en el builder del dashboard
5. Roles predefinidos segun tipo:
   - **Boda:** Anillos, Lazo, Arras, Velacion, Ramo, Brindis
   - **Quinceañera:** Chambelan principal, Chambelanes, Damas, Ultimo juguete

---

### 7.2 — Checklist / Tareas

**Aplica a:** Todos los tipos de evento

1. Tabla `event_tasks` (id, event_id, title, is_completed, due_date, category, sort_order)
2. API: `/api/events/[id]/tasks`
3. Pagina: `/dashboard/[id]/tasks`
4. Categorias predefinidas segun tipo:
   - **Boda:** Vestido, Traje, Iglesia, Banquete, Musica, Decoracion, Fotografia, Luna de miel
   - **Quinceañera:** Vestido, Vals, Pastel, Chambelanes, Decoracion
   - **General:** Lugar, Comida, Musica, Decoracion, Invitaciones, Logistica
5. Templates: al activar checklist, se pre-cargan tareas sugeridas segun tipo

---

### 7.3 — Mesas + Invitados (Seating)

**Aplica a:** Bodas, Quinceañeras, Corporativos

1. Tabla `event_tables` (id, event_id, name, capacity, sort_order)
2. Tabla `event_guests` (id, event_id, name, phone, party_size, status, table_id, access_code, checked_in)
3. API: `/api/events/[id]/tables` y `/api/events/[id]/guests`
4. Pagina: `/dashboard/[id]/seating`
5. Vista visual: grid de mesas con invitados asignados
6. Lista lateral de invitados sin mesa → drag & drop a mesa
7. Conteo: capacidad vs asignados por mesa

---

### 7.4 — Check-In QR

**Aplica a:** Bodas, Quinceañeras, Corporativos

**Depende de:** 7.3 (tabla `event_guests`)

1. Generar QR real en `/confirm` al confirmar asistencia (libreria `qrcode`)
2. Pagina `/dashboard/[id]/checkin` — scanner con camara del celular
3. Al escanear: marca `checked_in = true`, muestra nombre + mesa
4. Vista resumen: barra de progreso llegados/total
5. Modo manual: buscar por nombre si falla QR

---

## Orden de Implementacion

```
7.0 Sistema de modulos (base)
  ↓
7.1 Padrinos (rapido, JSON)
  ↓
7.3 Mesas + Invitados (crea tablas base)
  ↓
7.2 Checklist (tabla independiente, puede ir en paralelo)
  ↓
7.4 Check-In QR (depende de 7.3)
```

## Archivos Clave

| Archivo | Accion |
|---------|--------|
| `lib/types.ts` | Agregar modules, Padrino type |
| `app/dashboard/[id]/layout.tsx` | [NEW] Tabs dinamicos por modulo activo |
| `app/dashboard/[id]/tasks/page.tsx` | [NEW] Checklist |
| `app/dashboard/[id]/seating/page.tsx` | [NEW] Mesas |
| `app/dashboard/[id]/checkin/page.tsx` | [NEW] Scanner QR |
| `app/event/[slug]/page.tsx` | Seccion padrinos condicional |
| `app/confirm/page.tsx` | Generar QR real |
