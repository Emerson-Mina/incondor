# Incondor S.A.S — Avance del proyecto y siguientes pasos

_Última actualización: 17 de noviembre de 2026_

## 1. Qué es el proyecto

Sitio web de Incondor S.A.S (transporte de carga, Villavicencio – Meta) con un **visor 3D interactivo de toda la flota**, pensado para verse profesional y **posicionar en Google**.

- Sitio actual de la empresa: `https://incondor.com` (el dominio `incondor.com.co` no existe en DNS).
- La flota se tomó del **portafolio PDF** publicado en el sitio actual.

## 2. Lo que llevamos

### 2.1 Visor 3D (punto de partida → flota completa)
- Partimos de `Volquete 6x4 en 3D.html` (un solo vehículo, Three.js plano).
- Se modelaron los **6 vehículos** del portafolio, todos procedurales (sin archivos 3D externos):

| Vehículo | Config. | Interacción |
|---|---|---|
| Volqueta doble troque | C3 | Volco hidráulico (0–40°) + compuerta |
| Volqueta sencilla | C2 | Volco hidráulico (0–40°) |
| Tracto camión tipo volco | 3S3 | Volco del semirremolque (0–32°) |
| Carro tanque | C3 | Tanque inoxidable, flauta de riego |
| Tractomula cama baja | 3S3 | Con excavadora / vacía |
| Tractocamión (fertilizantes) | 3S3 | Carpado / big bags |

- Controles: 5 vistas de cámara, color de cabina, giro automático, volco, carga y calidad.
- Los HTML originales quedaron en `legacy/` como referencia.

### 2.2 Migración a framework
- **Next.js 16.4.6 + React 19 + TypeScript**, exportación estática (`out/`).
- **React Three Fiber 9 + drei + postprocessing** para la escena 3D.
- `npm audit`: **0 vulnerabilidades** (se descartó Next 16.0.10 por CVEs críticos).

### 2.3 Look oscuro y realista
- Interfaz en tema oscuro con el naranja de la marca; logo convertido a versión clara (`public/logo-light.png`).
- Estudio oscuro con iluminación generada en código (sin HDR externos).
- Materiales físicos: pintura con barniz, cromo, inoxidable, vidrio, suciedad en volcos.
- Postprocesado: oclusión ambiental (N8AO), bloom en luces, viñeta, tone mapping AgX.

### 2.4 SEO
- Página estática por vehículo: `/flota/<slug>/` con título, descripción y canonical propios.
- Datos estructurados schema.org: `MovingCompany` (inicio), `Service` + `BreadcrumbList` (vehículos).
- `sitemap.xml` y `robots.txt` generados en el build.
- Inicio con hero, visor, servicios, flota, clientes y contacto (datos del sitio actual).

### 2.5 Rendimiento
- Fusión de piezas estáticas por material (de cientos de draw calls a decenas).
- Sombras recalculadas solo cuando algo se mueve.
- Render bajo demanda; se detiene si el visor está quieto o fuera de pantalla.
- Calidad automática: detecta renderizado por software o FPS bajos y apaga efectos. Selector manual Auto / Alta / Ligera.

### 2.6 Errores corregidos en las pruebas
- Parabrisas de cabinas con capó inclinado hacia afuera.
- Franjas en el piso causadas por `ContactShadows` de drei (reemplazado por sombra radial).
- Tanque inoxidable que se veía negro.
- Vehículo cortado en celular (FOV adaptado al ancho de pantalla).

### 2.7 Pruebas realizadas
- Firefox headless: los 6 vehículos renderizan sin errores de consola; volco, cargas y calidad funcionan.
- Vista móvil (390 px) revisada.
- `tsc` sin errores; `next build` genera 11 páginas estáticas.

### 2.8 Información institucional (carpeta `INFO_FRANK/`, 17 nov 2026)
- Misión y visión actualizadas a la **versión 09** (I-011 / I-012, 18 de julio de 2023).
- "Quiénes somos": empresa creada en **2010**; textos "más de 10 años" cambiados a "desde 2010".
- **7 principios** y **8 valores** oficiales en `/nosotros/` (antes 5 valores provisionales).
- Trayectoria: hito de fundación 2010 y actualización 2023 agregados.
- Logo regenerado desde el PNG transparente de alta resolución (`public/logo.png`, `public/logo-hd.png`).
- Todo el contenido vive en `ABOUT` dentro de `src/lib/site.ts`.
- **Diseño:** a pedido del cliente se volvió al diseño oscuro estilo plantilla (hero con ruta y etiquetas, colores carbón + naranja). Se reconstruyó desde el historial de la sesión del 11 nov.
  El diseño de rombos naranjas quedó respaldado en `/home/sys_tic/Documentos/Incondor-backup-diseno3-20261118-0810/`.

## 3. Problema detectado en el equipo de desarrollo

El 3D se traba en este equipo porque **la GPU no está activa**:

```
amdgpu 0000:03:00.0: probe with driver amdgpu failed with error -22
OpenGL renderer string: llvmpipe (LLVM 20.1.2, 256 bits)   # renderizado por CPU
```

- GPU: AMD Lucienne (integrada). Kernel actual: `7.0.0-42-generic`.
- Kernels alternativos instalados: `7.0.0-31-generic`, `6.14.0-37-generic`.
- No es un problema del sitio; los visitantes con GPU funcional no lo sufren.

## 4. Siguientes pasos

### Urgente (equipo)
1. Reiniciar y en GRUB → *Opciones avanzadas* arrancar con `7.0.0-31-generic`.
2. Verificar con `glxinfo -B` → debe decir `Accelerated: yes` y AMD (no llvmpipe).
3. Si funciona: dejar ese kernel por defecto o actualizar `linux-firmware` y reportar el fallo de `7.0.0-42`.

### Contenido (Incondor)
4. **Confirmar medidas y capacidades reales** de cada vehículo (hoy son de referencia) en `src/lib/fleet.ts`.
5. Confirmar colores reales de la flota y textos de servicios.
6. Aportar fotos reales para una galería y para la imagen de Open Graph (vista previa al compartir).
7. Decidir si se agregan más vehículos o maquinaria propia.

### SEO y publicación
8. Definir el dominio final en `NEXT_PUBLIC_SITE_URL` (ver `.env.example`).
9. Elegir hosting (Vercel, Netlify, Cloudflare Pages o el cPanel actual) y subir `out/`.
10. Dar de alta el sitio en Google Search Console y enviar `sitemap.xml`.
11. Crear o actualizar la ficha de **Google Business Profile** con la misma dirección y teléfono.
12. Generar imágenes Open Graph por vehículo.
13. Agregar analítica (Google Analytics 4 o Plausible) y medir clics en WhatsApp.

### Producto
14. Formulario de cotización (vehículo, origen, destino, fecha) que llegue por WhatsApp o correo.
15. Medir FPS reales en un equipo con GPU y ajustar la calidad "Alta" si hace falta.
16. Revisión de accesibilidad (contraste, teclado) antes de publicar.
17. Inicializar repositorio git y hacer el primer commit.

## 5. Cómo correrlo

```bash
cd "/home/sys_tic/Documentos/Incondor S.A"
npm install
npm run dev        # http://localhost:3000
npm run build      # sitio estático en out/
npm start          # sirve out/ localmente
```

## 6. Mapa de archivos

```
src/app/page.tsx                 inicio (hero, visor, servicios, flota, clientes, contacto)
src/app/flota/[slug]/page.tsx    página por vehículo (SEO)
src/app/layout.tsx               header, footer, metadatos globales
src/app/sitemap.ts · robots.ts   SEO técnico
src/components/FleetViewer.tsx   interfaz del visor (controles)
src/components/FleetScene.tsx    escena 3D (luces, cámara, calidad, postprocesado)
src/three/vehicles.ts            modelos de los 6 vehículos y materiales
src/lib/fleet.ts                 catálogo de la flota (textos, ficha técnica)
src/lib/site.ts                  datos de contacto de la empresa
legacy/                          visores HTML originales
```
