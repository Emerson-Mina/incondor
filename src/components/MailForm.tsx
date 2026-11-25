'use client';

import Link from 'next/link';
import { useState } from 'react';
import Arrow from '@/components/Arrow';
import { COMPANY } from '@/lib/site';

export type Field = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'number';
  required?: boolean;
  options?: string[];
  full?: boolean;
  placeholder?: string;
};

// Formulario genérico. El sitio es estático: al enviar abre el correo del usuario con los datos.
// Para guardar las solicitudes en una base de datos hay que conectar un backend.
export default function MailForm({ subject, fields, submit, note, done }: { subject: string; fields: Field[]; submit: string; note?: string; done: string }) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = fields.map((x) => `${x.label.replace(' *', '')}: ${f.get(x.name) || '—'}`).join('\n');
    const who = f.get(fields[0].name);
    setSent(true);
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(`${subject}${who ? ` · ${who}` : ''}`)}&body=${encodeURIComponent(body)}`;
  }

  if (sent) {
    return (
      <div className="pqrs-form pqrs-done" role="status">
        <span className="tag tag-solid">Listo</span>
        <h2 className="h-lg">{done}</h2>
        <p>Se abrió su programa de correo con la información. Envíe el correo para completar la solicitud.</p>
        <p className="pqrs-note">¿No se abrió? Escríbanos a <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.</p>
        <button type="button" className="btn btn-outline" onClick={() => setSent(false)}>Volver al formulario</button>
      </div>
    );
  }

  return (
    <form className="pqrs-form" onSubmit={onSubmit}>
      <div className="pq-grid">
        {fields.map((x) => (
          <label key={x.name} className={`pq-field${x.full || x.type === 'textarea' ? ' pq-full' : ''}`}>
            <span className="pq-k">{x.label}</span>
            {x.type === 'select' ? (
              <select name={x.name} required={x.required} defaultValue={x.options?.[0]}>{x.options?.map((o) => <option key={o}>{o}</option>)}</select>
            ) : x.type === 'textarea' ? (
              <textarea name={x.name} required={x.required} rows={5} placeholder={x.placeholder} />
            ) : (
              <input name={x.name} type={x.type ?? 'text'} required={x.required} placeholder={x.placeholder} />
            )}
          </label>
        ))}
      </div>
      {note && <p className="pqrs-note">{note}</p>}
      <label className="pq-check">
        <input type="checkbox" name="autoriza" required />
        <span>Autorizo el tratamiento de mis datos personales según la <Link href="/politicas/#datos">política de tratamiento de datos</Link> (Ley 1581 de 2012). *</span>
      </label>
      <button type="submit" className="btn btn-primary">{submit} <Arrow /></button>
    </form>
  );
}
