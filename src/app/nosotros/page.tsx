import type { Metadata } from 'next';
import Arrow from '@/components/Arrow';
import PageHero from '@/components/PageHero';
import Link from 'next/link';
import { ABOUT, COMPANY } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Nosotros: misión, visión e historia',
  description: 'Conozca a Incondor S.A.S: quiénes somos, misión, visión, principios y valores, e historia de la empresa de transporte de carga en Villavicencio.',
  alternates: { canonical: '/nosotros/' },
};

export default function Nosotros() {
  return (
    <>
      <PageHero crumb="Nosotros" kicker="Quiénes somos" title="En la vía" accent="desde 2010." lead={ABOUT.who} />

      <section className="section">
        <div className="container mv">
          <article className="mv-card">
            <span className="tag tag-solid">Misión</span>
            <p>{ABOUT.mission}</p>
          </article>
          <article className="mv-card">
            <span className="tag tag-solid">Visión</span>
            {ABOUT.vision.pending && <span className="tag pending">Pendiente</span>}
            <p>{ABOUT.vision.text}</p>
          </article>
          <p className="head-side" style={{ gridColumn: '1 / -1', fontSize: 14 }}>{ABOUT.docRef}</p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker kicker-dot">Principios</p>
              <h2 className="h-xl">Lo que no <span className="hl">negociamos.</span></h2>
            </div>
            <p className="head-side">Siete principios que guían cada viaje, cada contratación y cada decisión.</p>
          </div>
          <div className="values">
            {ABOUT.principles.map((v, i) => (
              <article key={v.t} className="value">
                <span className="tag tag-num">0{i + 1}</span>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="kicker kicker-dot">Valores</p>
              <h2 className="h-xl">Cómo <span className="hl">trabajamos.</span></h2>
            </div>
            <p className="head-side">La forma en que tratamos a clientes, compañeros y comunidades.</p>
          </div>
          <div className="values">
            {ABOUT.values.map((v, i) => (
              <article key={v.t} className="value">
                <span className="tag tag-num">0{i + 1}</span>
                <h3>{v.t}</h3>
                <p>{v.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 120 }}>
        <div className="cta-band">
          <div>
            <p className="kicker">Conozca más</p>
            <h2>En la vía desde {ABOUT.founded}</h2>
          </div>
          <div className="row">
          <Link className="btn btn-outline" href="/historia/">Nuestra historia</Link>
          <a className="btn btn-primary" href={COMPANY.whatsapp[0].href} target="_blank" rel="noopener noreferrer">Cotizar <Arrow /></a>
          </div>
        </div>
      </section>
    </>
  );
}
