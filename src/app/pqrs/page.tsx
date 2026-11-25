import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import PqrsForm from '@/components/PqrsForm';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'PQRS: peticiones, quejas, reclamos y sugerencias',
  description: 'Radique peticiones, quejas, reclamos, sugerencias o felicitaciones a Incondor S.A.S.',
  alternates: { canonical: '/pqrs/' },
};

export default function Pqrs() {
  return (
    <>
      <PageHero crumb="PQRS" kicker="Atención al cliente" title="Peticiones, quejas," accent="reclamos y sugerencias." lead="Cuéntenos qué pasó. Su solicitud queda radicada y le respondemos por el medio que indique." />

      <section className="section">
        <div className="container pqrs-wrap">
          <aside className="pqrs-side">
            <div className="hours-card">
              <p className="tag tag-solid">Tiempos de respuesta</p>
              <dl className="hours">
                <dt>Petición</dt><dd>15 días hábiles</dd>
                <dt>Queja</dt><dd>15 días hábiles</dd>
                <dt>Reclamo</dt><dd>15 días hábiles</dd>
                <dt>Sugerencia</dt><dd>15 días hábiles</dd>
              </dl>
              <p className="pqrs-note">Plazo general de la Ley 1755 de 2015. Ajústelo según el procedimiento interno.</p>
            </div>
            <div className="hours-card">
              <p className="tag tag-solid">Otros canales</p>
              <ul className="foot-list" style={{ fontSize: 15 }}>
                <li><a href={COMPANY.phoneHref}>{COMPANY.phone}</a></li>
                <li><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
                <li>{COMPANY.address.street}, {COMPANY.address.city}</li>
              </ul>
            </div>
          </aside>
          <PqrsForm />
        </div>
      </section>
    </>
  );
}
