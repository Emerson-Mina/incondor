import type { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';
import { FLEET } from '@/lib/fleet';

export const metadata: Metadata = {
  title: 'Flota de vehículos de carga',
  description: 'Volquetas doble troque y sencillas, tracto camión volco, carro tanque, cama baja y tractocamión: la flota de Incondor S.A.S en Villavicencio.',
  alternates: { canonical: '/flota/' },
};

export default function Flota() {
  return (
    <>
      <PageHero crumb="Flota" kicker="Nuestra flota" title="Seis vehículos." accent="Una sola flota." lead="Cada vehículo tiene su ficha con medidas, capacidad de referencia y usos frecuentes." />
      <section className="section">
        <div className="container fleet-grid">
          {FLEET.map((f, i) => (
            <Link className="fleet-card" key={f.slug} href={`/flota/${f.slug}/`}>
              <div className="fleet-top">
                <span className="tag">0{i + 1}</span>
                <span className="fleet-config" aria-hidden="true">{f.config}</span>
              </div>
              <div>
                <h2 className="fleet-h">{f.name}</h2>
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
      </section>
    </>
  );
}
