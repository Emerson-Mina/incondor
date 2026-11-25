import type { Metadata } from 'next';
import MailForm from '@/components/MailForm';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Trabaja con nosotros',
  description: 'Postúlese a las vacantes de Incondor S.A.S en Villavicencio: conductores, operativos y administrativos.',
  alternates: { canonical: '/trabaja-con-nosotros/' },
};

const PROFILES = [
  { t: 'Conductores', d: 'Licencia C2 o C3 vigente y experiencia en volqueta, tractocamión o cama baja.' },
  { t: 'Operativos', d: 'Mantenimiento, despacho y apoyo en patio.' },
  { t: 'Administrativos', d: 'Contabilidad, SST, talento humano y área comercial.' },
];

export default function Trabaja() {
  return (
    <>
      <PageHero crumb="Trabaja con nosotros" kicker="Talento" title="Únase a" accent="nuestro equipo." lead="Si le interesa alguno de nuestros cargos, postúlese aquí y adjunte su hoja de vida." />
      <section className="section">
        <div className="container docs">
          {PROFILES.map((p) => (
            <article key={p.t} className="doc-card">
              <span className="tag tag-solid">{p.t}</span>
              <p>{p.d}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-alt">
        <div className="container form-wrap">
          <div>
            <p className="kicker kicker-dot">Postulación</p>
            <h2 className="h-xl">Envíe su <span className="hl">hoja de vida.</span></h2>
            <p className="head-side" style={{ marginTop: 18 }}>Revisamos todas las postulaciones y le contactamos si su perfil se ajusta a una vacante.</p>
          </div>
          <MailForm
            subject="Postulación"
            submit="Postularme"
            done="Postulación preparada"
            note="Adjunte su hoja de vida (PDF) en el correo que se abrirá al enviar."
            fields={[
              { name: 'nombre', label: 'Nombre completo *', required: true },
              { name: 'cargo', label: 'Cargo de interés', type: 'select', options: ['Conductor', 'Operativo', 'Administrativo', 'Otro'] },
              { name: 'telefono', label: 'Teléfono *', type: 'tel', required: true },
              { name: 'correo', label: 'Correo electrónico *', type: 'email', required: true },
              { name: 'licencia', label: 'Categoría de licencia (si aplica)', placeholder: 'C2, C3…' },
              { name: 'ciudad', label: 'Ciudad de residencia' },
              { name: 'experiencia', label: 'Experiencia', type: 'textarea', placeholder: 'Empresas, cargos y tiempo.' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
