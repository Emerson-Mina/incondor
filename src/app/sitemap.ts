import type { MetadataRoute } from 'next';
import { FLEET } from '@/lib/fleet';
import { SERVICES } from '@/lib/services';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...['nosotros', 'historia', 'aliados', 'politicas', 'servicios', 'flota', 'pqrs', 'vinculacion', 'preguntas-frecuentes', 'trabaja-con-nosotros', 'contacto'].map((p) => ({ url: `${SITE_URL}/${p}/`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.6 })),
    ...SERVICES.map((s) => ({ url: `${SITE_URL}/servicios/${s.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 })),
    ...FLEET.map((f) => ({ url: `${SITE_URL}/flota/${f.slug}/`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 })),
  ];
}
