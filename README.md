# Invitación de Boda - Abidan & Betsaida

Invitación digital elegante para la boda del 15 de marzo de 2026.

## 📂 Estructura del Proyecto

```
boda-abidan-betsaida/
├── index.html          # Sitio principal
├── css/styles.css      # Estilos y animaciones
├── js/
│   ├── main.js         # Funcionalidad principal
│   ├── countdown.js    # Contador regresivo
│   └── gallery.js      # Galería lightbox
├── config.json         # Configuración editable
└── README.md           # Este archivo
```

## 🚀 Cómo Usar

1. **Abrir localmente**: Doble clic en `index.html` o usar un servidor local
2. **Subir a hosting**: Sube todos los archivos a tu hosting (Netlify, Vercel, etc.)

## ✏️ Cómo Editar

### Cambiar textos y datos
Edita `config.json` para modificar:
- Nombres de padres
- Detalles del evento
- Itinerario/Timeline
- Mensajes personalizados

### Activar WhatsApp del Novio
En `js/main.js`, busca la línea:
```javascript
groomWhatsApp: null, // Pending
```
Cámbiala por el número (sin espacios ni guiones):
```javascript
groomWhatsApp: '521234567890',
```

### Cambiar fotos de la galería
En `index.html`, busca la sección `gallery-grid` y reemplaza las URLs de las imágenes por las tuyas.

También puedes colocar las fotos en la carpeta `images/gallery/` y usar rutas locales:
```html
<img src="images/gallery/foto1.jpg" alt="Foto 1" loading="lazy">
```

### Agregar enlace de Google Maps
En `index.html`, busca los botones de ubicación y reemplaza `#` por el enlace real:
```html
<a href="https://maps.google.com/?q=TU_DIRECCION" ...>
```

## 🎫 Pases Personalizados

Para mostrar un nombre de invitado, agrega `?pase=` a la URL:
```
https://tusitio.com/?pase=Familia+López
```
Mostrará: "Pase para: Familia López"

## 📱 Características

- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Animaciones elegantes al scroll
- ✅ Contador regresivo automático
- ✅ Galería con lightbox
- ✅ Confirmación por WhatsApp con formulario
- ✅ Navegación flotante
- ✅ Optimizado para compartir en WhatsApp (OpenGraph)

## 📞 Contacto del Desarrollador

Desarrollado con ♥ para Abidan & Betsaida
