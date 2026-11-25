# Incondor S.A.S — sitio web con flota en 3D

Sitio de Incondor S.A.S (transporte de carga, Villavicencio – Meta) con un visor 3D interactivo de la flota.

## Stack
- **Next.js 16** (App Router, exportación estática `out/`), **React 19**, **TypeScript**
- **React Three Fiber 9** + **drei** + **postprocessing** (AO, bloom, tone mapping AgX)
- Modelos 100 % procedurales en `src/three/vehicles.ts` (sin archivos 3D externos)

## Estructura
```
src/app/                 páginas (inicio, /flota/[slug], sitemap.xml, robots.txt)
src/components/          FleetViewer (UI) · FleetScene (escena 3D) · JsonLd
src/three/vehicles.ts    constructores de los 6 vehículos y materiales PBR
src/lib/fleet.ts         catálogo de la flota (textos SEO, ficha técnica)
src/lib/site.ts          datos de contacto de la empresa
legacy/                  visores HTML originales (referencia)
```

## Comandos
```bash
npm install
npm run dev        # desarrollo en http://localhost:3000
npm run build      # genera el sitio estático en out/
npm start          # sirve out/ localmente
```

## Publicación
Subir el contenido de `out/` a cualquier hosting estático (Vercel, Netlify, Cloudflare Pages, cPanel).
Definir `NEXT_PUBLIC_SITE_URL` (ver `.env.example`) con el dominio final antes de `npm run build`:
se usa en canonical, Open Graph, `sitemap.xml` y datos estructurados.

## SEO
- Una página estática por vehículo (`/flota/volqueta-doble-troque/`, etc.) con título, descripción y canonical propios.
- Datos estructurados schema.org: `MovingCompany` (inicio), `Service` + `BreadcrumbList` (cada vehículo).
- `sitemap.xml` y `robots.txt` generados en el build.

> Medidas y capacidades del visor son de referencia; ajustarlas en `src/lib/fleet.ts`.
