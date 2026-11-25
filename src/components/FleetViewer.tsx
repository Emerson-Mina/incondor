'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FLEET, getVehicle, type VehicleSlug } from '@/lib/fleet';
import type { ViewName } from './FleetScene';

const FleetScene = dynamic(() => import('./FleetScene'), {
  ssr: false,
  loading: () => <div className="stage-loading" aria-hidden="true"><span /></div>,
});

const PAINTS: [string, string][] = [
  ['Blanco', '#e9ebe8'], ['Negro', '#121417'], ['Amarillo', '#d9a404'], ['Naranja', '#d9560f'],
  ['Rojo', '#a3231a'], ['Azul', '#1c4f8f'], ['Verde', '#1f6b3b'], ['Gris', '#5b6268'],
];
const VIEWS: [ViewName, string][] = [['iso', 'Tres cuartos'], ['front', 'Frente'], ['side', 'Lateral'], ['rear', 'Trasera'], ['top', 'Arriba']];

type Props = {
  /** "route": cada vehículo es una página (/flota/slug). "local": cambia sin navegar. */
  mode: 'route' | 'local';
  slug?: VehicleSlug;
  headingLevel?: 'h1' | 'h2' | 'h3';
};

export default function FleetViewer({ mode, slug: routeSlug, headingLevel = 'h2' }: Props) {
  const [localSlug, setLocalSlug] = useState<VehicleSlug>(routeSlug ?? FLEET[0].slug);
  const slug = mode === 'route' && routeSlug ? routeSlug : localSlug;
  const v = getVehicle(slug)!;

  const [paint, setPaint] = useState(v.paint);
  const [lift, setLift] = useState(0);
  const [cargoOn, setCargoOn] = useState(true);
  const [view, setView] = useState<{ name: ViewName; n: number }>({ name: 'iso', n: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [quality, setQuality] = useState<'auto' | 'high' | 'low'>('auto');

  useEffect(() => {
    setPaint(v.paint);
    setLift(0);
    setCargoOn(true);
  }, [v]);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setAutoRotate(false);
  }, []);

  const H = headingLevel;
  const maxDeg = slug === 'tracto-camion-volco' ? 32 : 40;

  return (
    <section className="viewer" aria-label="Visor 3D de la flota">
      <div className="viewer-head container">
        <div className="viewer-title">
          <p className="kicker">Flota en 3D · {v.config}</p>
          <H className="viewer-name">{v.name}</H>
          <p className="muted">{v.service}.</p>
        </div>
        <dl className="specs">
          <div><dt>Ejes</dt><dd>{v.axles}</dd></div>
          <div><dt>Largo</dt><dd>{v.length}</dd></div>
          <div><dt>Ancho</dt><dd>2,6 m</dd></div>
          <div><dt>Alto</dt><dd>{v.height}</dd></div>
          <div><dt>Capacidad</dt><dd>{v.capacity}</dd></div>
        </dl>
      </div>

      <nav className="fleet-tabs container" aria-label="Vehículos de la flota">
        {FLEET.map((f) =>
          mode === 'route' ? (
            <Link key={f.slug} href={`/flota/${f.slug}/`} scroll={false} className="chip" aria-current={f.slug === slug ? 'page' : undefined}>
              {f.name}
            </Link>
          ) : (
            <button key={f.slug} type="button" className="chip" aria-pressed={f.slug === slug} onClick={() => setLocalSlug(f.slug)}>
              {f.name}
            </button>
          ),
        )}
      </nav>

      <div className="stage">
        <FleetScene
          slug={slug}
          paint={paint}
          lift={lift}
          cargoOn={cargoOn}
          view={view}
          autoRotate={autoRotate}
          onUserOrbit={() => setAutoRotate(false)}
          quality={quality}
        />
        <p className="stage-hint">Arrastra para girar · rueda o pellizco para acercar · medidas y capacidades de referencia</p>
      </div>

      <div className="controls container">
        <div className="group">
          <span className="label">Vista</span>
          <div className="row">
            {VIEWS.map(([k, label]) => (
              <button key={k} type="button" className="btn" onClick={() => { setView((s) => ({ name: k, n: s.n + 1 })); setAutoRotate(false); }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="group">
          <span className="label">Pintura cabina</span>
          <div className="row">
            {PAINTS.map(([name, hex]) => (
              <button
                key={hex}
                type="button"
                className="swatch"
                style={{ background: hex }}
                title={name}
                aria-label={`Pintura ${name.toLowerCase()}`}
                aria-pressed={paint === hex}
                onClick={() => setPaint(hex)}
              />
            ))}
          </div>
        </div>
        {v.dump && (
          <div className="group">
            <span className="label">Volco</span>
            <div className="row">
              <input type="range" min={0} max={100} value={Math.round(lift * 100)} aria-label="Ángulo del volco" onChange={(e) => setLift(Number(e.target.value) / 100)} />
              <output className="lift-out">{Math.round(lift * maxDeg)}°</output>
              <button type="button" className="btn" aria-pressed={lift > 0.5} onClick={() => setLift(lift > 0.5 ? 0 : 1)}>
                {lift > 0.5 ? 'Bajar' : 'Volcar'}
              </button>
            </div>
          </div>
        )}
        {v.cargo && (
          <div className="group">
            <span className="label">Carga</span>
            <div className="row">
              <button type="button" className="btn" aria-pressed={cargoOn} onClick={() => setCargoOn(true)}>{v.cargo.a}</button>
              <button type="button" className="btn" aria-pressed={!cargoOn} onClick={() => setCargoOn(false)}>{v.cargo.b}</button>
            </div>
          </div>
        )}
        <div className="group">
          <span className="label">Giro</span>
          <div className="row">
            <button type="button" className="btn" aria-pressed={autoRotate} onClick={() => setAutoRotate((a) => !a)}>Automático</button>
          </div>
        </div>
        <div className="group">
          <span className="label">Calidad</span>
          <div className="row">
            {([['auto', 'Auto'], ['high', 'Alta'], ['low', 'Ligera']] as const).map(([k, label]) => (
              <button key={k} type="button" className="btn" aria-pressed={quality === k} onClick={() => setQuality(k)}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
