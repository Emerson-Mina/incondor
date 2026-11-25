import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section container">
      <h1 style={{ fontSize: 64, marginBottom: 24 }}>Página no encontrada</h1>
      <Link className="btn btn-primary" href="/">Volver al inicio</Link>
    </section>
  );
}
