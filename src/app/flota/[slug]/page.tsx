import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import VehicleHeader from '@/components/VehicleHeader';
import JsonLd from '@/components/JsonLd';
import { FLEET, getVehicle } from '@/lib/fleet';
import { COMPANY, SITE_URL } from '@/lib/site';

type Params = { slug: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return FLEET.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const v = getVehicle((await params).slug);
  if (!v) return {};
  const url = `/flota/${v.slug}/`;
  return {
    title: v.seoTitle,
    description: v.seoDescription,
    alternates: { canonical: url },
    openGraph: { title: `${v.seoTitle} | ${COMPANY.name}`, description: v.seoDescription, url, type: 'website', locale: 'es_CO' },
  };
}

export default async function VehiclePage({ params }: { params: Promise<Params> }) {
  const v = getVehicle((await params).slug);
  if (!v) notFound();
  const others = FLEET.filter((f) => f.slug !== v.slug);
  const url = `${SITE_URL}/flota/${v.slug}/`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Service',
              name: v.name,
              serviceType: v.service,
              description: v.seoDescription,
              url,
              areaServed: ['Villavicencio', 'Meta', 'Colombia'],
              provider: { '@type': 'MovingCompany', '@id': `${SITE_URL}/#empresa`, name: COMPANY.name, telephone: COMPANY.phone },
            },
            {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE_URL}/` },
                { '@type': 'ListItem', position: 2, name: 'Flota', item: `${SITE_URL}/flota/` },
                { '@type': 'ListItem', position: 3, name: v.name, item: url },
              ],
            },
          ],
        }}
      />

      <nav className="crumbs container" aria-label="Ruta de navegación">
        <Link href="/">Inicio</Link> / <Link href="/flota/">Flota</Link> / <span aria-current="page">{v.name}</span>
      </nav>

      <VehicleHeader v={v} />

      <section className="section container">
        <div className="contact">
          <div>
            <p className="prose">{v.intro}</p>
          </div>
          <div className="card">
            <h2 style={{ fontSize: 26 }}>Usos frecuentes</h2>
            <ul className="bullets">{v.uses.map((u) => <li key={u}>{u}</li>)}</ul>
          </div>
          <div className="card">
            <h2 style={{ fontSize: 26 }}>Ficha de referencia</h2>
            <dl className="hours">
              <dt>Configuración</dt><dd>{v.config}</dd>
              <dt>Ejes</dt><dd>{v.axles}</dd>
              <dt>Largo</dt><dd>{v.length}</dd>
              <dt>Ancho</dt><dd>2,6 m</dd>
              <dt>Alto</dt><dd>{v.height}</dd>
              <dt>Capacidad</dt><dd>{v.capacity}</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 56 }}>
        <div className="cta-band">
          <div>
            <h2>¿Necesita una {v.name.toLowerCase()}?</h2>
          </div>
          <div className="row">
            {COMPANY.whatsapp.map((w, i) => (
              <a key={w.href} className={`btn ${i === 0 ? 'btn-primary' : ''}`} href={w.href} target="_blank" rel="noopener noreferrer">WhatsApp {w.label}</a>
            ))}
            <a className="btn" href={COMPANY.phoneHref}>Llamar</a>
          </div>
        </div>
      </section>

      <section className="section container" style={{ paddingTop: 16 }} aria-labelledby="otros-h">
        <h2 id="otros-h" style={{ marginBottom: 20 }}>Más vehículos</h2>
        <div className="grid">
          {others.map((f) => (
            <Link className="card" key={f.slug} href={`/flota/${f.slug}/`}>
              <h3>{f.name}</h3>
              <p className="muted">{f.service}.</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
