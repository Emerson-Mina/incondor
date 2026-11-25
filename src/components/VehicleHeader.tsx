import Link from 'next/link';
import { FLEET, type Vehicle } from '@/lib/fleet';

// Encabezado de la ficha de un vehículo: nombre, servicio, medidas y acceso al resto de la flota.
export default function VehicleHeader({ v }: { v: Vehicle }) {
  return (
    <section className="vhead" aria-labelledby="vehiculo-h">
      <div className="container">
        <p className="kicker kicker-dot kicker-light">Flota · Configuración {v.config}</p>
        <div className="vhead-row">
          <div>
            <h1 id="vehiculo-h" className="vhead-title">{v.name}</h1>
            <p className="vhead-sub">{v.service}.</p>
          </div>
          <span className="vhead-config" aria-hidden="true">{v.config}</span>
        </div>
        <dl className="specs">
          <div><dt>Ejes</dt><dd>{v.axles}</dd></div>
          <div><dt>Largo</dt><dd>{v.length}</dd></div>
          <div><dt>Ancho</dt><dd>2,6 m</dd></div>
          <div><dt>Alto</dt><dd>{v.height}</dd></div>
          <div><dt>Capacidad</dt><dd>{v.capacity}</dd></div>
        </dl>
        <nav className="fleet-tabs" aria-label="Vehículos de la flota">
          {FLEET.map((f) => (
            <Link key={f.slug} href={`/flota/${f.slug}/`} className="chip" aria-current={f.slug === v.slug ? 'page' : undefined}>
              {f.name}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
