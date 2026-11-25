import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Arrow from '@/components/Arrow';
import JsonLd from '@/components/JsonLd';
import { getVehicle } from '@/lib/fleet';
import { getService, SERVICES } from '@/lib/services';
import { COMPANY, SITE_URL } from '@/lib/site';

type Params = { slug: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return { title: s.seoTitle, description: s.seoDescription, alternates: { canonical: `/servicios/${s.slug}/` } };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const idx = SERVICES.indexOf(s);
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  const quote = `${COMPANY.whatsapp[0].href}?text=${encodeURIComponent(`Hola Incondor, quiero cotizar ${s.t.toLowerCase()}.`)}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.t,
          description: s.seoDescription,
          url: `${SITE_URL}/servicios/${s.slug}/`,
          areaServed: ['Villavicencio', 'Meta', 'Colombia'],
          provider: { '@type': 'MovingCompany', '@id': `${SITE_URL}/#empresa`, name: COMPANY.name },
        }}
      />
      <section className="phero">
        <div className="container">
          <nav className="crumbs" aria-label="Ruta de navegación">
            <Link href="/">Inicio</Link> / <Link href="/servicios/">Servicios</Link> / <span aria-current="page">{s.t}</span>
          </nav>
          <p className="kicker kicker-dot kicker-light">Servicio 0{idx + 1} / 0{SERVICES.length}</p>
          <div className="phero-row">
            <h1 className="phero-title">{s.t}</h1>
            <div>
              <p className="head-side">{s.intro}</p>
              <a className="btn btn-primary" style={{ marginTop: 22 }} href={quote} target="_blank" rel="noopener noreferrer">Cotizar este servicio <Arrow /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split split-top">
          <div>
            <p className="kicker kicker-dot">Qué incluye</p>
            <ul className="sq-list sq-lg">{s.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
          <div>
            <p className="kicker kicker-dot">Qué transportamos</p>
            <ul className="clients" style={{ marginTop: 0 }}>{s.materials.map((m) => <li key={m}>{m}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker kicker-dot">Vehículos para este servicio</p>
              <h2 className="h-xl">La flota <span className="hl">que lo mueve.</span></h2>
            </div>
          </div>
          <div className="fleet-grid">
            {s.vehicles.map((slug) => {
              const f = getVehicle(slug)!;
              return (
                <Link className="fleet-card" key={f.slug} href={`/flota/${f.slug}/`}>
                  <div className="fleet-top"><span className="tag">{f.config}</span><span className="fleet-config" aria-hidden="true">{f.config}</span></div>
                  <div>
                    <h3>{f.name}</h3>
                    <dl className="fleet-meta">
                      <div><dt>Ejes</dt><dd>{f.axles}</dd></div>
                      <div><dt>Largo</dt><dd>{f.length}</dd></div>
                      <div><dt>Capacidad</dt><dd>{f.capacity}</dd></div>
                    </dl>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="kicker kicker-dot">Otros servicios</p>
          <div className="others">
            {others.map((o) => (
              <Link key={o.slug} href={`/servicios/${o.slug}/`} className="other">
                <span>{o.t}</span><Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
