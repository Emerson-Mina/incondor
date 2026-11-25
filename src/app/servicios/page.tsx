import type { Metadata } from 'next';
import Link from 'next/link';
import Arrow from '@/components/Arrow';
import PageHero from '@/components/PageHero';
import { getVehicle } from '@/lib/fleet';
import { SERVICES, STEPS } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Servicios de transporte de carga',
  description: 'Transporte de materiales agregados, mezcla asfáltica, agua, maquinaria pesada y fertilizantes en Villavicencio, el Meta y todo el país.',
  alternates: { canonical: '/servicios/' },
};

export default function Servicios() {
  return (
    <>
      <PageHero crumb="Servicios" kicker="Servicios" title="Cinco cargas," accent="una sola empresa." lead="Cada servicio tiene su vehículo. Usted llama una vez y nosotros ponemos el camión correcto." />

      <section className="section">
        <div className="container svc-grid">
          {SERVICES.map((s, i) => {
            const v = getVehicle(s.vehicles[0])!;
            return (
              <Link key={s.slug} href={`/servicios/${s.slug}/`} className="svc-card">
                <div className="svc-card-top">
                  <span className="tag tag-num">0{i + 1}</span>
                  <span className="fleet-config" aria-hidden="true">{v.config}</span>
                </div>
                <div>
                  <h2>{s.t}</h2>
                  <p>{s.short}</p>
                  <span className="svc-more">Ver servicio <Arrow /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker kicker-dot">Cómo trabajamos</p>
              <h2 className="h-xl">De la llamada <span className="hl">a la remisión.</span></h2>
            </div>
            <p className="head-side">Cinco pasos, siempre los mismos, para que sepa en qué va su carga.</p>
          </div>
          <ol className="timeline">
            {STEPS.map((s, i) => (
              <li key={s.t} className={i % 2 ? 'tl-r' : 'tl-l'}>
                <p className="tl-k"><span className="tag tag-num">0{i + 1}</span> {s.k}</p>
                <h3 className="h-md">{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
