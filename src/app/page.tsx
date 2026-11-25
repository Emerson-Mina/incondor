import Link from 'next/link';
import Arrow from '@/components/Arrow';
import JsonLd from '@/components/JsonLd';
import QuickQuote from '@/components/QuickQuote';
import { FLEET, getVehicle } from '@/lib/fleet';
import { NAV } from '@/lib/nav';
import { SERVICES } from '@/lib/services';
import { COMPANY, SITE_URL } from '@/lib/site';

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'MovingCompany',
          '@id': `${SITE_URL}/#empresa`,
          name: COMPANY.name,
          legalName: COMPANY.legalName,
          slogan: COMPANY.slogan,
          description: COMPANY.description,
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          telephone: COMPANY.phone,
          email: COMPANY.email,
          sameAs: [COMPANY.instagram],
          address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY.address.street,
            addressLocality: COMPANY.address.city,
            addressRegion: COMPANY.address.region,
            addressCountry: COMPANY.address.country,
          },
          areaServed: ['Villavicencio', 'Meta', 'Colombia'],
          openingHoursSpecification: [
            { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '08:00', closes: '16:00' },
            { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '16:30' },
            { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '07:00', closes: '12:00' },
          ],
          makesOffer: FLEET.map((f) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: f.name, description: f.seoDescription, url: `${SITE_URL}/flota/${f.slug}/` } })),
        }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-map" aria-hidden="true">
          <svg viewBox="0 0 1440 280">
            <path d="M300 120 C 400 30, 500 150, 580 170 S 730 235, 800 210 S 1010 70, 1110 90" />
          </svg>
          <div className="htag htag-card" style={{ left: '20.83%', top: '42.86%' }}>
            <span className="hdot hdot-on" />
            <div>
              <p className="tag-k">Entregado 09:40</p>
              <p className="tag-t">Gravilla · 14 m³</p>
              <p className="tag-s">Villavicencio → Acacías</p>
            </div>
          </div>
          <div className="htag" style={{ left: '40.28%', top: '60.71%' }}><span className="hdot" /><span className="tag">En ruta · vía Acacías</span></div>
          <div className="htag" style={{ left: '55.56%', top: '75%' }}><span className="hdot" /><span className="tag">Cargue en planta</span></div>
          <div className="htag htag-r" style={{ left: '77.08%', top: '32.14%' }}><span className="tag">Sale a las 06:10</span><span className="hdot" /></div>
        </div>

        <div className="container hero-body">
          <p className="kicker kicker-dot kicker-light">Transporte de carga · Villavicencio, Meta</p>
          <div className="hero-cols">
            <h1 className="hero-title">Carga que<br /><span className="hl">sí llega.</span></h1>
            <div className="hero-side">
              <p>Agregados, mezcla asfáltica, agua, maquinaria pesada y fertilizantes. Una sola empresa, una flota propia y un despachador que le contesta.</p>
              <div className="row" style={{ marginTop: 22 }}>
                <a className="btn btn-primary" href={COMPANY.whatsapp[0].href} target="_blank" rel="noopener noreferrer">Cotizar <Arrow /></a>
                <a className="btn btn-outline" href="/flota/"><span className="hdot hdot-on hdot-sm" /> Ver la flota</a>
              </div>
            </div>
          </div>
          <QuickQuote />
        </div>
      </section>

      {/* PROMESA */}
      <section className="section">
        <div className="container split">
          <div>
            <p className="kicker kicker-dot">La promesa</p>
            <h2 className="h-xl">Desde 2010 moviendo la obra del Meta <span className="hl">sin parar la obra.</span></h2>
            <p className="mono-note"><span className="hdot hdot-on hdot-sm" /> Habilitada por MinTransporte · Resolución 134 de 2013</p>
            <Link className="btn btn-outline btn-outline-dark" style={{ marginTop: 28 }} href="/nosotros/">Conozca la empresa <Arrow /></Link>
          </div>
          <div className="stat-panel">
            <span className="tag tag-solid" style={{ position: 'absolute', top: 22, left: 22 }}>Flota propia</span>
            <div className="stat-big">
              <b>10<span>+</span></b>
              <p>años en el mercado</p>
            </div>
            <dl className="stat-row">
              <div><dt>Vehículos</dt><dd>6 tipos</dd></div>
              <div><dt>Servicios</dt><dd>5 líneas</dd></div>
              <div><dt>Cobertura</dt><dd>Nacional</dd></div>
            </dl>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker kicker-dot">Servicios</p>
              <h2 className="h-xl">Cinco cargas, <span className="hl">una sola empresa.</span></h2>
            </div>
            <div className="head-side">
              <p>Cada servicio tiene su vehículo. Usted llama una vez y nosotros ponemos el camión correcto.</p>
              <Link className="btn btn-outline btn-outline-dark" style={{ marginTop: 18 }} href="/servicios/">Todos los servicios <Arrow /></Link>
            </div>
          </div>
          <div className="svc-grid">
            {SERVICES.map((s, i) => {
              const v = getVehicle(s.vehicles[0])!;
              return (
                <Link key={s.slug} href={`/servicios/${s.slug}/`} className="svc-card">
                  <div className="svc-card-top">
                    <span className="tag tag-num">0{i + 1}</span>
                    <span className="fleet-config" aria-hidden="true">{v.config}</span>
                  </div>
                  <div>
                    <h3>{s.t}</h3>
                    <p>{s.short}</p>
                    <span className="svc-more">Ver servicio <Arrow /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLOTA */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker kicker-dot">La flota</p>
              <h2 className="h-xl">Seis vehículos. <span className="hl">Una sola flota.</span></h2>
            </div>
            <div className="head-side">
              <p>Volquetas, tracto volco, carro tanque, cama baja y tractocamión. Cada uno con su ficha técnica.</p>
              <Link className="btn btn-outline btn-outline-dark" style={{ marginTop: 18 }} href="/flota/">Ver toda la flota <Arrow /></Link>
            </div>
          </div>
          <div className="fleet-grid">
            {FLEET.slice(0, 3).map((f, i) => (
              <Link className="fleet-card" key={f.slug} href={`/flota/${f.slug}/`}>
                <div className="fleet-top"><span className="tag">0{i + 1}</span><span className="fleet-config" aria-hidden="true">{f.config}</span></div>
                <div>
                  <h3>{f.name}</h3>
                  <p>{f.service}.</p>
                  <dl className="fleet-meta">
                    <div><dt>Ejes</dt><dd>{f.axles}</dd></div>
                    <div><dt>Largo</dt><dd>{f.length}</dd></div>
                    <div><dt>Capacidad</dt><dd>{f.capacity}</dd></div>
                  </dl>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ALIADOS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker kicker-dot">Aliados</p>
              <h2 className="h-xl">Empresas que <span className="hl">confían en nosotros.</span></h2>
            </div>
            <div className="head-side">
              <p>Construcción, concreto, asfalto y agroindustria de la región.</p>
              <Link className="btn btn-outline btn-outline-dark" style={{ marginTop: 18 }} href="/aliados/">Ver aliados <Arrow /></Link>
            </div>
          </div>
          <ul className="clients" aria-label="Aliados" style={{ marginTop: 0 }}>{COMPANY.clients.map((c) => <li key={c}>{c}</li>)}</ul>
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker kicker-dot">Trámites</p>
              <h2 className="h-xl">Atención <span className="hl">en línea.</span></h2>
            </div>
            <p className="head-side">Radique solicitudes, vincúlese como cliente o proveedor, o envíe su hoja de vida.</p>
          </div>
          <div className="quick">
            {[...NAV[3].items!, { t: 'Políticas y certificados', href: '/politicas/', d: 'SST, seguridad vial y SIPLAFT' }].map((q, i) => (
              <Link key={q.href} href={q.href} className="quick-card">
                <span className="tag tag-num">0{i + 1}</span>
                <h3>{q.t}</h3>
                <p>{q.d}</p>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
