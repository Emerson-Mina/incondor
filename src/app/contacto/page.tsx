import type { Metadata } from 'next';
import MailForm from '@/components/MailForm';
import PageHero from '@/components/PageHero';
import { COMPANY } from '@/lib/site';
import { SERVICES } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Contáctenos',
  description: 'Contacte a Incondor S.A.S: teléfono, WhatsApp, correo, horario y ubicación en Villavicencio, Meta.',
  alternates: { canonical: '/contacto/' },
};

export default function Contacto() {
  return (
    <>
      <PageHero crumb="Contáctenos" kicker="Contáctenos" title="Hablemos de" accent="su próxima carga." lead="Escríbanos, llámenos o visítenos en la planta. Un despachador le responde con precio y vehículo disponible." />
      <section className="section">
        <div className="container contact-grid">
          <a className="contact-card" href={COMPANY.phoneHref}><span className="pq-k">Teléfono</span><b>{COMPANY.phone}</b></a>
          {COMPANY.whatsapp.map((w) => (
            <a key={w.href} className="contact-card" href={w.href} target="_blank" rel="noopener noreferrer"><span className="pq-k">WhatsApp</span><b>{w.label}</b></a>
          ))}
          <a className="contact-card" href={`mailto:${COMPANY.email}`}><span className="pq-k">Correo</span><b className="contact-mail">{COMPANY.email}</b></a>
        </div>
      </section>
      <section className="section section-alt">
        <div className="container form-wrap">
          <div>
            <p className="kicker kicker-dot">Escríbanos</p>
            <h2 className="h-xl">Solicite una <span className="hl">cotización.</span></h2>
            <dl className="hours" style={{ marginTop: 28 }}>
              {COMPANY.hours.map((h) => <div key={h.days} style={{ display: 'contents' }}><dt>{h.days}</dt><dd>{h.time}</dd></div>)}
            </dl>
          </div>
          <MailForm
            subject="Solicitud de cotización"
            submit="Enviar"
            done="Solicitud preparada"
            fields={[
              { name: 'nombre', label: 'Nombre o empresa *', required: true },
              { name: 'servicio', label: 'Servicio', type: 'select', options: SERVICES.map((s) => s.t) },
              { name: 'telefono', label: 'Teléfono *', type: 'tel', required: true },
              { name: 'correo', label: 'Correo electrónico', type: 'email' },
              { name: 'origen', label: 'Origen' },
              { name: 'destino', label: 'Destino' },
              { name: 'mensaje', label: 'Detalle de la carga *', type: 'textarea', required: true, placeholder: 'Material, cantidad y fecha.' },
            ]}
          />
        </div>
      </section>
      <section className="map-wrap">
        <iframe
          title="Ubicación de Incondor S.A.S"
          src="https://www.google.com/maps?q=Planta+Gravicon+Villavicencio+Meta&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="container map-card-wrap">
          <div className="map-card">
            <span className="tag tag-solid">Dónde estamos</span>
            <p>{COMPANY.address.street}<br />{COMPANY.address.city}, {COMPANY.address.region}, Colombia</p>
            <a className="btn btn-outline" href="https://www.google.com/maps/search/?api=1&query=Planta+Gravicon+Villavicencio" target="_blank" rel="noopener noreferrer">Cómo llegar</a>
          </div>
        </div>
      </section>
    </>
  );
}
