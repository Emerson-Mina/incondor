import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { ABOUT, CERTIFICATION } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Nuestra historia',
  description: 'La historia de Incondor S.A.S: desde 2010 transportando carga en Villavicencio y el Meta.',
  alternates: { canonical: '/historia/' },
};

export default function Historia() {
  return (
    <>
      <PageHero crumb="Nuestra historia" kicker="Nuestra historia" title="Cómo llegamos" accent="hasta aquí." lead={CERTIFICATION} />
      <section className="section">
        <div className="container">
          <ol className="timeline">
            {ABOUT.history.map((h, i) => (
              <li key={h.t} className={i % 2 ? 'tl-r' : 'tl-l'}>
                <p className="tl-k"><span className="tag tag-num">{h.y}</span>{h.pending && <span className="tag pending">Pendiente</span>}</p>
                <h2 className="h-md">{h.t}</h2>
                <p>{h.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
