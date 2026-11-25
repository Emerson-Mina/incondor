import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Aliados y clientes',
  description: 'Empresas de construcción, concreto, asfalto y agroindustria que confían su carga a Incondor S.A.S en Villavicencio y el Meta.',
  alternates: { canonical: '/aliados/' },
};

export default function Aliados() {
  return (
    <>
      <PageHero crumb="Aliados" kicker="Aliados y clientes" title="Empresas que" accent="confían en nosotros." lead="Reconocidas empresas de la región nos confían el transporte de sus materiales, maquinaria e insumos." />

      <section className="section">
        <div className="container">
          <div className="allies">
            {COMPANY.clients.map((c, i) => (
              <article key={c} className="ally">
                <span className="tag tag-num">{String(i + 1).padStart(2, '0')}</span>
                {/* Espacio reservado para el logo del aliado (SVG o PNG con fondo transparente). */}
                <div className="ally-logo" aria-hidden="true">{c.split(' ').map((w) => w[0]).join('').slice(0, 3)}</div>
                <h2>{c}</h2>
                <p className="ally-k">Logo pendiente</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 120 }}>
        <div className="cta-band">
          <div>
            <p className="kicker">Alianzas</p>
            <h2>¿Quiere ser aliado de Incondor?</h2>
          </div>
          <a className="btn btn-primary" href={`mailto:${COMPANY.email}?subject=${encodeURIComponent('Propuesta de alianza')}`}>Escríbanos</a>
        </div>
      </section>
    </>
  );
}
