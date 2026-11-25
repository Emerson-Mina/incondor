import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { CERTIFICATION, POLICIES } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Políticas y certificaciones',
  description: 'Políticas de Seguridad y Salud en el Trabajo, Seguridad Vial, SIPLAFT y tratamiento de datos de Incondor S.A.S, y certificación SST.',
  alternates: { canonical: '/politicas/' },
};

export default function Politicas() {
  return (
    <>
      <PageHero crumb="Políticas" kicker="Políticas y certificaciones" title="Reglas claras" accent="en cada viaje." lead="Documentos de gestión de la empresa, disponibles para clientes, conductores y autoridades." />

      <section className="section">
        <div className="container pol-wrap">
          <nav className="pol-index" aria-label="Políticas">
            <p className="foot-h">Contenido</p>
            <ul>
              {POLICIES.map((p) => <li key={p.id}><a href={`#${p.id}`}>{p.t}</a></li>)}
              <li><a href="#certificacion">Certificación SST</a></li>
            </ul>
          </nav>
          <div className="pol-list">
            {POLICIES.map((p) => (
              <article key={p.id} id={p.id} className="pol">
                <p className="tl-k"><span className="tag tag-num">{p.code}</span>{!p.pdf && <span className="tag pending">Pendiente</span>}</p>
                <h2 className="h-md">{p.t}</h2>
                <p>{p.d}</p>
                {p.pdf ? (
                  <a className="btn btn-outline" href={p.pdf} target="_blank" rel="noopener noreferrer">Descargar PDF</a>
                ) : (
                  <span className="btn btn-outline" aria-disabled="true">PDF no disponible</span>
                )}
              </article>
            ))}
            <article id="certificacion" className="pol pol-cert">
              <p className="tl-k"><span className="tag tag-solid">Certificado</span></p>
              <h2 className="h-md">Sistema de gestión de SST</h2>
              <p>{CERTIFICATION}</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
