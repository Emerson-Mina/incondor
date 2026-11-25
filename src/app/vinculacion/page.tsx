import type { Metadata } from 'next';
import MailForm from '@/components/MailForm';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'Vinculación y registro',
  description: 'Registro de clientes, proveedores y vehículos afiliados en Incondor S.A.S: documentos requeridos y formulario.',
  alternates: { canonical: '/vinculacion/' },
};

// Documentos típicos de vinculación (SIPLAFT). Ajustar según el procedimiento interno.
const DOCS = [
  { t: 'Clientes', items: ['RUT actualizado', 'Certificado de Cámara de Comercio (no mayor a 30 días)', 'Copia de cédula del representante legal', 'Formato de vinculación SIPLAFT firmado'] },
  { t: 'Proveedores', items: ['RUT actualizado', 'Certificado de Cámara de Comercio', 'Certificación bancaria', 'Formato de vinculación SIPLAFT firmado'] },
  { t: 'Vehículos afiliados', items: ['Licencia de tránsito', 'SOAT y revisión técnico-mecánica vigentes', 'Pólizas de responsabilidad civil', 'Licencia de conducción del conductor'] },
];

export default function Vinculacion() {
  return (
    <>
      <PageHero crumb="Vinculación" kicker="Trámites" title="Vinculación" accent="y registro." lead="Para trabajar con Incondor como cliente, proveedor o propietario de vehículo, reúna los documentos y envíe el formulario." />
      <section className="section">
        <div className="container">
          <div className="docs">
            {DOCS.map((d) => (
              <article key={d.t} className="doc-card">
                <span className="tag tag-solid">{d.t}</span>
                <ul className="sq-list">{d.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </article>
            ))}
          </div>
          <p className="pqrs-note" style={{ marginTop: 16 }}><span className="tag pending" style={{ marginLeft: 0, marginRight: 8 }}>Pendiente</span>Confirmar la lista de documentos con el área administrativa.</p>
        </div>
      </section>
      <section className="section section-alt">
        <div className="container form-wrap">
          <div>
            <p className="kicker kicker-dot">Formulario</p>
            <h2 className="h-xl">Solicite su <span className="hl">vinculación.</span></h2>
            <p className="head-side" style={{ marginTop: 18 }}>Le contactamos para revisar los documentos y completar el registro.</p>
          </div>
          <MailForm
            subject="Solicitud de vinculación"
            submit="Enviar solicitud"
            done="Solicitud de vinculación preparada"
            note="Adjunte los documentos en el correo que se abrirá al enviar."
            fields={[
              { name: 'razon', label: 'Nombre o razón social *', required: true },
              { name: 'tipo', label: 'Tipo de vinculación', type: 'select', options: ['Cliente', 'Proveedor', 'Vehículo afiliado'] },
              { name: 'nit', label: 'NIT o cédula *', required: true },
              { name: 'contacto', label: 'Persona de contacto *', required: true },
              { name: 'correo', label: 'Correo electrónico *', type: 'email', required: true },
              { name: 'telefono', label: 'Teléfono *', type: 'tel', required: true },
              { name: 'ciudad', label: 'Ciudad' },
              { name: 'actividad', label: 'Actividad económica' },
              { name: 'mensaje', label: 'Comentarios', type: 'textarea' },
            ]}
          />
        </div>
      </section>
    </>
  );
}
