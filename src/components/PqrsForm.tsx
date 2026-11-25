'use client';

import Link from 'next/link';
import { useState } from 'react';
import Arrow from '@/components/Arrow';
import { COMPANY } from '@/lib/site';

const TYPES = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Felicitación'] as const;

// Formulario PQRS. El sitio es estático (sin servidor): por ahora arma un radicado y abre el correo
// del usuario con la solicitud. Para guardar las PQRS en una base de datos hay que conectar un backend.
export default function PqrsForm() {
  const [type, setType] = useState<(typeof TYPES)[number]>('Petición');
  const [sent, setSent] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const d = new Date();
    const radicado = `PQRS-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${String(d.getTime()).slice(-5)}`;
    const lines = [
      `Radicado: ${radicado}`,
      `Tipo: ${type}`,
      `Persona: ${f.get('persona')}`,
      `Nombre / razón social: ${f.get('nombre')}`,
      `Documento: ${f.get('tipo_doc')} ${f.get('documento')}`,
      `Correo: ${f.get('correo')}`,
      `Teléfono: ${f.get('telefono')}`,
      `Ciudad: ${f.get('ciudad')}`,
      `Placa del vehículo: ${f.get('placa') || 'No aplica'}`,
      `Fecha del hecho: ${f.get('fecha') || 'No aplica'}`,
      `Responder por: ${f.get('respuesta')}`,
      '',
      `Asunto: ${f.get('asunto')}`,
      '',
      String(f.get('descripcion')),
    ];
    const href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(`${radicado} · ${type}: ${f.get('asunto')}`)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSent(radicado);
    window.location.href = href;
  }

  if (sent) {
    return (
      <div className="pqrs-form pqrs-done" role="status">
        <span className="tag tag-solid">Solicitud preparada</span>
        <h2 className="h-lg">Radicado <span className="hl">{sent}</span></h2>
        <p>Se abrió su programa de correo con la solicitud. Envíe el correo para completar el radicado y guarde este número para hacer seguimiento.</p>
        <p className="pqrs-note">¿No se abrió el correo? Escríbanos a <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> con el número de radicado.</p>
        <button type="button" className="btn btn-outline" onClick={() => setSent(null)}>Radicar otra solicitud</button>
      </div>
    );
  }

  return (
    <form className="pqrs-form" onSubmit={onSubmit}>
      <fieldset className="pq-types">
        <legend className="pq-k">Tipo de solicitud</legend>
        {TYPES.map((t) => (
          <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => setType(t)}>{t}</button>
        ))}
      </fieldset>

      <div className="pq-grid">
        <label className="pq-field">
          <span className="pq-k">Persona</span>
          <select name="persona" defaultValue="Natural"><option>Natural</option><option>Jurídica</option></select>
        </label>
        <label className="pq-field">
          <span className="pq-k">Nombre o razón social *</span>
          <input name="nombre" required autoComplete="name" />
        </label>
        <label className="pq-field">
          <span className="pq-k">Tipo de documento</span>
          <select name="tipo_doc" defaultValue="CC"><option>CC</option><option>NIT</option><option>CE</option><option>Pasaporte</option></select>
        </label>
        <label className="pq-field">
          <span className="pq-k">Número de documento *</span>
          <input name="documento" required inputMode="numeric" />
        </label>
        <label className="pq-field">
          <span className="pq-k">Correo electrónico *</span>
          <input name="correo" type="email" required autoComplete="email" />
        </label>
        <label className="pq-field">
          <span className="pq-k">Teléfono *</span>
          <input name="telefono" type="tel" required autoComplete="tel" />
        </label>
        <label className="pq-field">
          <span className="pq-k">Ciudad</span>
          <input name="ciudad" autoComplete="address-level2" />
        </label>
        <label className="pq-field">
          <span className="pq-k">Placa del vehículo (si aplica)</span>
          <input name="placa" placeholder="ABC123" style={{ textTransform: 'uppercase' }} />
        </label>
        <label className="pq-field">
          <span className="pq-k">Fecha del hecho</span>
          <input name="fecha" type="date" />
        </label>
        <label className="pq-field">
          <span className="pq-k">Responder por</span>
          <select name="respuesta" defaultValue="Correo electrónico"><option>Correo electrónico</option><option>Teléfono</option><option>WhatsApp</option></select>
        </label>
        <label className="pq-field pq-full">
          <span className="pq-k">Asunto *</span>
          <input name="asunto" required maxLength={120} />
        </label>
        <label className="pq-field pq-full">
          <span className="pq-k">Descripción *</span>
          <textarea name="descripcion" required rows={6} placeholder="Qué pasó, cuándo, dónde y qué espera que hagamos." />
        </label>
      </div>

      <p className="pqrs-note">Si tiene fotos o documentos de soporte, adjúntelos al correo que se abrirá al enviar.</p>

      <label className="pq-check">
        <input type="checkbox" name="autoriza" required />
        <span>Autorizo el tratamiento de mis datos personales según la <Link href="/politicas/#datos">política de tratamiento de datos</Link> (Ley 1581 de 2012). *</span>
      </label>

      <button type="submit" className="btn btn-primary">Radicar {type.toLowerCase()} <Arrow /></button>
    </form>
  );
}
