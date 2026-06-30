# Assets Pendientes

## Logo

✅ Resuelto — `/public/logo.svg` (círculo violeta sólido, "GNC" en negro con borde blanco arriba, "CASEROS" en negro con borde blanco abajo).

> Nota: a esta conversación no se adjuntó un archivo de imagen real, solo la descripción del logo. El SVG actual es una reconstrucción vectorial fiel a esa descripción. Si la cliente tiene el archivo original (PNG/SVG/AI exportado), reemplazar `/public/logo.svg` por ese archivo para asegurar fidelidad exacta de tipografía y proporciones.

## Foto de fondo

Pendiente (opcional). Por ahora la pantalla usa un fondo limpio con la paleta violeta/blanco de la marca (`bg-gradient-to-b from-violet-50 to-white` en `app/RaspaditaClient.tsx`). Si la cliente envía una foto del local, se puede agregar como `/public/bg.jpg` y usarla de fondo.

| Archivo | Descripción | Especificaciones |
|---------|-------------|-----------------|
| `/public/bg-placeholder.jpg` → `/public/bg.jpg` | Foto del local (opcional) | 1080×1920 px (vertical/mobile), formato JPG |

## Colores de marca

Definidos en `app/globals.css`:

```css
@theme inline {
  --color-brand-primary: #5b2d8e;      /* violeta del logo */
  --color-brand-primary-dark: #432268; /* hover/active */
  --color-brand-secondary: #ffffff;    /* blanco */
  --color-brand-accent: #000000;       /* negro */
}
```

Si la cliente confirma un tono violeta distinto extraído del archivo de logo real, ajustar `--color-brand-primary` (y `-dark`, un ~25% más oscuro para estados hover).

## Franjas horarias

Editables desde `/admin` sin tocar código: cupo de premios por franja de 2hs, y los parámetros `probabilidad_base` / `incremento_por_jugada` del sorteo progresivo. Ver `supabase/migration_franjas_horarias.sql` para aplicar el esquema nuevo sobre la base existente.
