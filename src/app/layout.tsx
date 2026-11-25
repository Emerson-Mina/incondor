import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, Geist_Mono, Inter } from 'next/font/google';
import Link from 'next/link';
import { COMPANY, SITE_URL } from '@/lib/site';
import Arrow from '@/components/Arrow';
import MainNav from '@/components/MainNav';
import MobileNav from '@/components/MobileNav';
import { NAV } from '@/lib/nav';
import { SERVICES } from '@/lib/services';
import './globals.css';

const display = Barlow_Condensed({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = Geist_Mono({ subsets: ['latin'], weight: ['500'], variable: '--font-mono', display: 'swap' });


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Incondor S.A.S | Transporte de carga en Villavicencio y el Meta',
    template: '%s | Incondor S.A.S',
  },
  description: COMPANY.description,
  keywords: [
    'transporte de carga Villavicencio', 'volquetas Villavicencio', 'volqueta doble troque', 'carro tanque agua Meta',
    'cama baja maquinaria', 'transporte de agregados', 'mezcla asfáltica', 'tractocamión fertilizantes', 'Incondor',
  ],
  applicationName: COMPANY.name,
  authors: [{ name: COMPANY.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: COMPANY.name,
    title: 'Incondor S.A.S | Transporte de carga en Villavicencio',
    description: COMPANY.description,
    url: '/',
    images: [{ url: '/logo.png', width: 600, height: 171, alt: 'Incondor S.A.S' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.png' },
};

export const viewport: Viewport = { themeColor: '#090c0f', colorScheme: 'dark', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#contenido">Saltar al contenido</a>
        <header className="site-header">
          <div className="container header-row">
            <Link href="/" className="brand" aria-label="Incondor S.A.S, inicio">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-light.png" alt="Incondor S.A.S" width={168} height={48} />
            </Link>
            <MainNav groups={NAV} />
            <div className="header-actions">
              <a className="btn btn-primary btn-sm" href={COMPANY.whatsapp[0].href} target="_blank" rel="noopener noreferrer">
                Cotizar <Arrow />
              </a>
              <MobileNav groups={NAV} />
            </div>
          </div>
        </header>
        <main id="contenido">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div className="foot-cta">
              <div>
                <p className="kicker kicker-dot kicker-light">Despacho · Lun a sáb</p>
                <h2 className="foot-title">¿Tiene una carga?<br /><span className="hl">Cotícela hoy.</span></h2>
                <p className="foot-lead">Díganos el material, el origen y el destino. Un despachador le responde con precio y vehículo disponible.</p>
                <div className="row" style={{ marginTop: 28, gap: 22 }}>
                  <a className="btn btn-primary" href={COMPANY.whatsapp[0].href} target="_blank" rel="noopener noreferrer">Cotizar por WhatsApp <Arrow /></a>
                  <a className="mail-link" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </div>
              </div>
              <div className="hours-card">
                <p className="tag tag-solid">Horario de despacho</p>
                <dl className="hours">
                  {COMPANY.hours.map((h) => <div key={h.days} style={{ display: 'contents' }}><dt>{h.days}</dt><dd>{h.time}</dd></div>)}
                </dl>
              </div>
            </div>

            <div className="footer-grid">
              <div>
                <h2 className="foot-h">Corporativo</h2>
                <ul className="foot-list">
                  {NAV[0].items!.map((i) => <li key={i.href}><Link href={i.href}>{i.t}</Link></li>)}
                </ul>
              </div>
              <div>
                <h2 className="foot-h">Servicios</h2>
                <ul className="foot-list">
                  {SERVICES.map((s) => <li key={s.slug}><Link href={`/servicios/${s.slug}/`}>{s.t}</Link></li>)}
                  <li><Link href="/flota/">Nuestra flota</Link></li>
                </ul>
              </div>
              <div>
                <h2 className="foot-h">Trámites</h2>
                <ul className="foot-list">
                  {NAV[3].items!.map((i) => <li key={i.href}><Link href={i.href}>{i.t}</Link></li>)}
                </ul>
              </div>
              <div>
                <h2 className="foot-h">Conecta</h2>
                <ul className="foot-list">
                  <li><a href={COMPANY.phoneHref}>{COMPANY.phone}</a></li>
                  {COMPANY.whatsapp.map((w) => <li key={w.href}><a href={w.href} target="_blank" rel="noopener noreferrer">WhatsApp {w.label}</a></li>)}
                  <li><Link href="/contacto/">Contáctenos</Link></li>
                </ul>
                <p className="foot-addr" style={{ marginTop: 16 }}>{COMPANY.address.street}<br />{COMPANY.address.city}, {COMPANY.address.region}, Colombia</p>
                <p className="foot-social">
                  <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
                </p>
              </div>
            </div>
          </div>
          <div className="container copy">
            <span>© {new Date().getFullYear()} {COMPANY.legalName}</span>
            <span>“{COMPANY.slogan}”</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
