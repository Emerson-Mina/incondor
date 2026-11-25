import Link from 'next/link';

// Encabezado común de las subpáginas.
export default function PageHero({ kicker, title, accent, lead, crumb }: { kicker: string; title: string; accent?: string; lead?: string; crumb: string }) {
  return (
    <section className="phero">
      <div className="container">
        <nav className="crumbs" aria-label="Ruta de navegación">
          <Link href="/">Inicio</Link> / <span aria-current="page">{crumb}</span>
        </nav>
        <p className="kicker kicker-dot kicker-light">{kicker}</p>
        <div className="phero-row">
          <h1 className="phero-title">{title}{accent && <><br /><span className="hl">{accent}</span></>}</h1>
          {lead && <p className="head-side">{lead}</p>}
        </div>
      </div>
    </section>
  );
}
