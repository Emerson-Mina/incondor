import { FLEET } from '@/lib/fleet';
import { SERVICES } from '@/lib/services';

export type NavLink = { t: string; href: string; d?: string };
export type NavGroup = { t: string; href: string; items?: NavLink[] };

// Menú principal (también alimenta el pie de página).
export const NAV: NavGroup[] = [
  {
    t: 'Nosotros', href: '/nosotros/',
    items: [
      { t: 'Misión y visión', href: '/nosotros/', d: 'Quiénes somos y hacia dónde vamos' },
      { t: 'Nuestra historia', href: '/historia/', d: 'En la vía desde 2010' },
      { t: 'Políticas y certificados', href: '/politicas/', d: 'SST, seguridad vial y SIPLAFT' },
      { t: 'Aliados', href: '/aliados/', d: 'Empresas que confían en nosotros' },
    ],
  },
  {
    t: 'Servicios', href: '/servicios/',
    items: [
      ...SERVICES.map((s) => ({ t: s.t, href: `/servicios/${s.slug}/`, d: s.short })),
      { t: 'Todos los servicios', href: '/servicios/' },
    ],
  },
  {
    t: 'Flota', href: '/flota/',
    items: [
      ...FLEET.map((f) => ({ t: f.name, href: `/flota/${f.slug}/`, d: `${f.config} · ${f.capacity}` })),
      { t: 'Toda la flota', href: '/flota/' },
    ],
  },
  {
    t: 'Trámites', href: '/pqrs/',
    items: [
      { t: 'Radicación de PQRS', href: '/pqrs/', d: 'Peticiones, quejas, reclamos y sugerencias' },
      { t: 'Vinculación y registro', href: '/vinculacion/', d: 'Clientes, proveedores y vehículos' },
      { t: 'Preguntas frecuentes', href: '/preguntas-frecuentes/', d: 'Respuestas rápidas' },
      { t: 'Trabaja con nosotros', href: '/trabaja-con-nosotros/', d: 'Envíe su hoja de vida' },
    ],
  },
];
