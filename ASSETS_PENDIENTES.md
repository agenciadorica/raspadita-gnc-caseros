# Assets Pendientes

Reemplazar los archivos placeholder con los assets reales antes del deploy a producción.

## Imágenes

| Archivo | Descripción | Especificaciones |
|---------|-------------|-----------------|
| `/public/logo-placeholder.png` → `/public/logo.png` | Logo de GNC Caseros | Fondo transparente, mínimo 300×100 px, formato PNG |
| `/public/bg-placeholder.jpg` → `/public/bg.jpg` | Imagen de fondo o textura | 1080×1920 px (vertical/mobile), formato JPG |

## Colores de marca

Una vez confirmados los colores oficiales, actualizar en `app/globals.css`:

```css
@theme inline {
  --color-brand-primary: #f59e0b;   /* ← reemplazar con color primario real */
  --color-brand-secondary: #1e40af; /* ← reemplazar con color secundario real */
}
```

Y actualizar los colores en los componentes que usen clases hardcodeadas como `bg-yellow-400`, `bg-blue-600`, etc.

## Referencias en el código

- `app/RaspaditaClient.tsx` — usa `logo-placeholder.png`; cambiar `src` a `/logo.png` cuando esté disponible
