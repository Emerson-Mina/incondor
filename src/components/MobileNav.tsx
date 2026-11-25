'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { NavGroup } from '@/lib/nav';

// Menú móvil por grupos: se cierra al elegir un enlace (la navegación de Next no recarga el layout).
export default function MobileNav({ groups }: { groups: NavGroup[] }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => ref.current?.removeAttribute('open');
  return (
    <details className="mnav" ref={ref}>
      <summary aria-label="Abrir menú"><span /><span /></summary>
      <nav aria-label="Menú móvil" className="mnav-panel">
        {groups.map((g) => (
          <details key={g.t} className="mnav-group">
            <summary>{g.t}</summary>
            <ul>
              {g.items?.map((i) => <li key={i.href + i.t}><Link href={i.href} onClick={close}>{i.t}</Link></li>)}
            </ul>
          </details>
        ))}
        <Link href="/contacto/" className="mnav-contact" onClick={close}>Contáctenos</Link>
      </nav>
    </details>
  );
}
