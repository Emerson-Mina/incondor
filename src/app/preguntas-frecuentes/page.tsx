import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import PageHero from '@/components/PageHero';
import { FAQ } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Respuestas sobre cotización, cobertura, flota, certificaciones, PQRS y vinculación con Incondor S.A.S.',
  alternates: { canonical: '/preguntas-frecuentes/' },
};

export default function Preguntas() {
  return (
    <>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <PageHero crumb="Preguntas frecuentes" kicker="Preguntas frecuentes" title="Antes de" accent="cada viaje." lead="Respuestas cortas sobre cotización, cobertura, la flota y los trámites." />
      <section className="section">
        <div className="container faq faq-page">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0}>
              <summary><span className="tag tag-num">{String(i + 1).padStart(2, '0')}</span><span className="faq-q">{f.q}</span><span className="faq-ico" aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
