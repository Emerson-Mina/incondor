'use client';

import { useState } from 'react';
import { FLEET } from '@/lib/fleet';
import { COMPANY } from '@/lib/site';
import Arrow from '@/components/Arrow';

// Barra de cotización rápida del hero: arma un mensaje y lo abre en WhatsApp.
export default function QuickQuote() {
  const [vehicle, setVehicle] = useState(FLEET[0].name);
  const [from, setFrom] = useState('Villavicencio');
  const [to, setTo] = useState('');
  const [load, setLoad] = useState('');

  const text = `Hola Incondor, quiero cotizar: ${vehicle}${load ? `, ${load}` : ''}. Desde ${from || '—'} hasta ${to || '—'}.`;
  const href = `${COMPANY.whatsapp[0].href}?text=${encodeURIComponent(text)}`;

  return (
    <form className="qq" onSubmit={(e) => { e.preventDefault(); window.open(href, '_blank', 'noopener'); }} aria-label="Cotización rápida">
      <label className="qq-cell qq-wide">
        <span className="qq-k">Vehículo</span>
        <select name="vehiculo" value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
          {FLEET.map((f) => <option key={f.slug}>{f.name}</option>)}
        </select>
      </label>
      <label className="qq-cell">
        <span className="qq-k">Carga</span>
        <input name="carga" value={load} onChange={(e) => setLoad(e.target.value)} placeholder="Gravilla, 14 m³" />
      </label>
      <label className="qq-cell">
        <span className="qq-k">Desde</span>
        <input name="desde" value={from} onChange={(e) => setFrom(e.target.value)} />
      </label>
      <label className="qq-cell">
        <span className="qq-k">Hasta</span>
        <input name="hasta" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Acacías" />
      </label>
      <div className="qq-cell qq-go">
        <button type="submit" className="btn btn-primary btn-sm">Cotizar <Arrow /></button>
      </div>
    </form>
  );
}
