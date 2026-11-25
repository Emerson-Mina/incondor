'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { NavGroup } from '@/lib/nav';

// Menú de escritorio con desplegables: abre al pasar el mouse o con teclado/clic.
export default function MainNav({ groups }: { groups: NavGroup[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const path = usePathname();
  useEffect(() => setOpen(null), [path]);

  return (
    <nav aria-label="Principal" className="main-nav" onKeyDown={(e) => e.key === 'Escape' && setOpen(null)}>
      {groups.map((g) => {
        const active = g.items?.some((i) => i.href === path) || g.href === path;
        return (
          <div key={g.t} className="dd" data-open={open === g.t} onMouseEnter={() => setOpen(g.t)} onMouseLeave={() => setOpen(null)}>
            <button type="button" className="dd-btn" aria-expanded={open === g.t} data-active={active} onClick={() => setOpen(open === g.t ? null : g.t)}>
              {g.t}
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
            </button>
            <div className="dd-panel">
              <ul>
                {g.items?.map((i) => (
                  <li key={i.href + i.t}>
                    <Link href={i.href} aria-current={i.href === path ? 'page' : undefined} className={i.d ? '' : 'dd-all'}>
                      <span className="dd-t">{i.t}</span>
                      {i.d && <span className="dd-d">{i.d}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
      <Link href="/contacto/" className="dd-btn" data-active={path === '/contacto/'}>Contáctenos</Link>
    </nav>
  );
}
