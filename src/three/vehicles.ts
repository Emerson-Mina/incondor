/**
 * Modelos procedurales de la flota Incondor.
 * Convención: x = adelante, y = arriba, z = lateral. Suelo en y = 0. Unidades en metros.
 * Cada constructor devuelve un THREE.Group listo para montar con <primitive />.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { VehicleSlug } from '@/lib/fleet';

const PI = Math.PI;
type P = THREE.Object3D;
type V2 = THREE.Vector2;

/* ======================= Materiales ======================= */
export type Materials = ReturnType<typeof createMaterials>;

function noiseTexture(size: number, base: number, spread: number, blotches: number): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const c = cv.getContext('2d')!;
  const img = c.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = base + (Math.random() - 0.5) * spread;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  c.putImageData(img, 0, 0);
  for (let k = 0; k < blotches; k++) {
    const x = Math.random() * size, y = Math.random() * size, r = 8 + Math.random() * size * 0.12;
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    const d = Math.random() < 0.5 ? 0 : 255;
    g.addColorStop(0, `rgba(${d},${d},${d},0.16)`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

export function createMaterials() {
  const grime = noiseTexture(256, 150, 60, 70);
  grime.repeat.set(2, 1);
  const dirt = noiseTexture(256, 205, 70, 50);
  dirt.colorSpace = THREE.SRGBColorSpace;
  dirt.repeat.set(3, 1);

  const phys = (o: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(o);
  const std = (color: number, roughness: number, metalness: number, extra: THREE.MeshStandardMaterialParameters = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  const lamp = (color: number, emissive: number, intensity: number) =>
    new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: intensity, roughness: 0.2, toneMapped: false });

  const m = {
    paint: phys({ color: 0xe9ebe8, roughness: 0.42, metalness: 0.22, clearcoat: 1, clearcoatRoughness: 0.07, side: THREE.DoubleSide }),
    liner: std(0x7d8079, 0.85, 0.35, { roughnessMap: grime, map: dirt, side: THREE.DoubleSide }),
    black: std(0x0d0f12, 0.62, 0.35),
    dark: std(0x1d2126, 0.55, 0.45),
    steel: std(0x50565c, 0.48, 0.75),
    rubber: std(0x0a0b0c, 0.95, 0),
    tire: new THREE.MeshStandardMaterial({ color: 0x0c0d0f, roughness: 0.92, metalness: 0, side: THREE.DoubleSide }),
    chrome: std(0xf0f2f4, 0.12, 1, { envMapIntensity: 1.8 }),
    rim: std(0xc2c7cc, 0.3, 1, { envMapIntensity: 1.6 }),
    glass: phys({ color: 0x0a1118, roughness: 0.04, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.6 }),
    glassSide: phys({ color: 0x15232e, roughness: 0.05, metalness: 0.15, clearcoat: 1, envMapIntensity: 1.4 }),
    inox: phys({ color: 0xd4d9de, roughness: 0.26, metalness: 0.9, clearcoat: 0.4, clearcoatRoughness: 0.2, envMapIntensity: 2.2, side: THREE.DoubleSide }),
    wood: std(0x43311f, 0.92, 0, { roughnessMap: grime }),
    tarp: phys({ color: 0x0e1012, roughness: 0.55, metalness: 0.05, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
    strap: std(0x2a2f34, 0.75, 0.1),
    yellow: phys({ color: 0xe1a500, roughness: 0.48, metalness: 0.15, clearcoat: 0.6, clearcoatRoughness: 0.2 }),
    tipBody: std(0x6c7379, 0.6, 0.65, { roughnessMap: grime, side: THREE.DoubleSide }),
    tipLiner: std(0x4b5056, 0.85, 0.5, { roughnessMap: grime, map: dirt, side: THREE.DoubleSide }),
    bag: std(0xe7e6df, 0.95, 0),
    band: std(0x2c7531, 0.85, 0),
    lampW: lamp(0xffffff, 0xfff1c9, 2.2),
    lampR: lamp(0xb31b12, 0xff2414, 1.8),
    lampA: lamp(0xd98400, 0xff9500, 1.8),
  };
  return {
    ...m,
    setPaint(hex: string) {
      m.paint.color.set(hex);
    },
    dispose() {
      Object.values(m).forEach((x) => x.dispose());
      grime.dispose();
      dirt.dispose();
    },
  };
}

/* ======================= Ayudas ======================= */
const KEEP = new Set<THREE.BufferGeometry>();
const keep = <G extends THREE.BufferGeometry>(g: G) => (KEEP.add(g), g);

function add(p: P, geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, noShadow = false) {
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = !noShadow;
  mesh.receiveShadow = true;
  p.add(mesh);
  return mesh;
}
const box = (p: P, w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) =>
  add(p, new THREE.BoxGeometry(w, h, d), mat, x, y, z);
function cyl(p: P, rt: number, rb: number, h: number, seg: number, mat: THREE.Material, x: number, y: number, z: number, axis?: 'x' | 'y' | 'z') {
  const g = new THREE.CylinderGeometry(rt, rb, h, seg);
  if (axis === 'z') g.rotateX(PI / 2);
  if (axis === 'x') g.rotateZ(PI / 2);
  return add(p, g, mat, x, y, z);
}
/** Viga recta entre dos puntos del plano lateral (x, y) a la altura lateral z. */
function beam(p: P, ax: number, ay: number, bx: number, by: number, t: number, w: number, z: number, mat: THREE.Material, ext = 0) {
  const dx = bx - ax, dy = by - ay;
  const m = box(p, Math.hypot(dx, dy) + ext, t, w, mat, (ax + bx) / 2, (ay + by) / 2, z);
  m.rotation.z = Math.atan2(dy, dx);
  return m;
}
function mergeGeos(list: THREE.BufferGeometry[]) {
  const pos: number[] = [], nor: number[] = [];
  list.forEach((g) => {
    const n = g.index ? g.toNonIndexed() : g;
    pos.push(...(n.attributes.position.array as Float32Array));
    nor.push(...(n.attributes.normal.array as Float32Array));
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return out;
}

/* ---------- Ruedas: geometría compartida ---------- */
let WG: Record<'tire' | 'lugs' | 'bolts' | 'rim' | 'hub' | 'cap', THREE.BufferGeometry> | null = null;
function wheelGeos() {
  if (WG) return WG;
  const prof = [[0.29, -0.15], [0.4, -0.16], [0.47, -0.145], [0.5, -0.1], [0.505, 0], [0.5, 0.1], [0.47, 0.145], [0.4, 0.16], [0.29, 0.15]]
    .map(([a, b]) => new THREE.Vector2(a, b));
  const tire = new THREE.LatheGeometry(prof, 48);
  tire.rotateX(PI / 2);
  const lugs: THREE.BufferGeometry[] = [];
  for (let k = 0; k < 28; k++) {
    const a = (k / 28) * PI * 2;
    [-1, 1].forEach((s) => {
      const b = new THREE.BoxGeometry(0.05, 0.03, 0.13);
      b.rotateY(s * 0.35);
      b.rotateZ(a + (s > 0 ? PI / 28 : 0));
      const aa = a + (s > 0 ? PI / 28 : 0);
      b.translate(Math.cos(aa) * 0.505, Math.sin(aa) * 0.505, s * 0.075);
      lugs.push(b);
    });
  }
  const bolts: THREE.BufferGeometry[] = [];
  [-1, 1].forEach((s) => {
    for (let n = 0; n < 10; n++) {
      const an = (n / 10) * PI * 2, c = new THREE.CylinderGeometry(0.02, 0.02, 0.045, 6);
      c.rotateX(PI / 2);
      c.translate(Math.cos(an) * 0.17, Math.sin(an) * 0.17, s * 0.15);
      bolts.push(c);
    }
  });
  const cz = (r: number, h: number, seg: number) => {
    const g = new THREE.CylinderGeometry(r, r, h, seg);
    g.rotateX(PI / 2);
    return g;
  };
  WG = {
    tire: keep(tire), lugs: keep(mergeGeos(lugs)), bolts: keep(mergeGeos(bolts)),
    rim: keep(cz(0.3, 0.27, 40)), hub: keep(cz(0.24, 0.29, 32)), cap: keep(cz(0.11, 0.31, 24)),
  };
  return WG;
}
let fenderGeo: THREE.BufferGeometry | null = null;
function getFenderGeo() {
  if (!fenderGeo) {
    fenderGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.42, 32, 1, true, PI / 2, PI);
    fenderGeo.rotateX(PI / 2);
    keep(fenderGeo);
  }
  return fenderGeo;
}

/* ======================= Contexto de construcción ======================= */
export type Lift = { pivot: THREE.Group; gate: THREE.Group; update: (theta: number) => void; max: number };
export type Built = {
  group: THREE.Group;
  wheels: THREE.Object3D[];
  lift?: Lift;
  cargo?: (on: boolean) => void;
  dispose: () => void;
};

class Ctx {
  wheels: THREE.Object3D[] = [];
  ownMats: THREE.Material[] = [];
  constructor(public M: Materials) {}

  wheel(p: P, x: number, z: number, r: number) {
    const G = wheelGeos(), M = this.M;
    const g = new THREE.Group();
    add(g, G.tire, M.tire);
    add(g, G.lugs, M.rubber, 0, 0, 0, true);
    add(g, G.rim, M.rim);
    add(g, G.hub, M.dark, 0, 0, 0, true);
    add(g, G.cap, M.chrome, 0, 0, 0, true);
    add(g, G.bolts, M.chrome, 0, 0, 0, true);
    g.scale.setScalar(r / 0.5);
    g.position.set(x, r, z);
    g.userData.r = r;
    p.add(g);
    g.userData.dynamic = true;
    this.wheels.push(g);
  }
  axle(p: P, x: number, dual: boolean, r = 0.5, drive = false) {
    const M = this.M;
    cyl(p, 0.08, 0.08, 2.2, 14, M.black, x, r, 0, 'z');
    [-1, 1].forEach((s) => {
      box(p, 0.95, 0.05, 0.12, M.dark, x, r + 0.16, s * 0.5);
      if (dual) { this.wheel(p, x, s * 0.75, r); this.wheel(p, x, s * 1.09, r); }
      else this.wheel(p, x, s * 1.0, r);
    });
    if (drive) add(p, new THREE.SphereGeometry(0.2, 20, 14), M.black, x, r, 0);
  }
  fenderArch(p: P, x: number) {
    [-1, 1].forEach((s) => add(p, getFenderGeo(), this.M.paint, x, 0.5, s * 1.0));
  }
  rails(p: P, x0: number, x1: number, y: number) {
    const M = this.M;
    [-1, 1].forEach((s) => box(p, x1 - x0, 0.26, 0.14, M.black, (x0 + x1) / 2, y, s * 0.45));
    for (let xi = x0 + 0.4; xi <= x1 - 0.4; xi += 1.2) box(p, 0.1, 0.2, 0.9, M.black, xi, y - 0.02, 0);
  }
  rearEnd(p: P, rx: number, mudX: number, yo: number) {
    const M = this.M;
    box(p, 0.1, 0.4, 2.2, M.dark, rx + 0.02, 1.0 + yo, 0);
    [-1, 1].forEach((s) => {
      box(p, 0.04, 0.16, 0.28, s < 0 ? M.lampA : M.lampR, rx - 0.03, 1.0 + yo, s * 0.95);
      box(p, 0.04, 0.12, 0.2, M.lampW, rx - 0.03, 0.82 + yo, s * 0.95);
      box(p, 0.04, 0.5, 0.5, M.rubber, mudX, 0.45, s * 1.1);
      box(p, 0.06, 0.06, 0.5, M.dark, mudX, 0.72, s * 1.1);
      const sh = 1.0 + yo - 0.62;
      box(p, 0.1, sh, 0.07, M.dark, rx - 0.1, 0.62 + sh / 2, s * 0.8);
    });
    // defensa trasera con franjas reflectivas
    box(p, 0.1, 0.14, 2.1, M.chrome, rx - 0.15, 0.62, 0);
    for (let i = 0; i < 6; i++) box(p, 0.012, 0.08, 0.16, i % 2 ? M.lampR : M.lampW, rx - 0.206, 0.62, -0.85 + i * 0.34).castShadow = false;
  }
  sign(p: P, text: string, w: number, h: number, x: number, y: number, z: number, rotY: number) {
    const cv = document.createElement('canvas');
    cv.width = 1024;
    cv.height = Math.round((1024 * h) / w);
    const c = cv.getContext('2d')!;
    c.fillStyle = '#f2c200';
    c.fillRect(0, 0, cv.width, cv.height);
    c.lineWidth = 14;
    c.strokeStyle = '#111';
    c.strokeRect(7, 7, cv.width - 14, cv.height - 14);
    c.fillStyle = '#111';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `bold ${Math.round(cv.height * 0.56)}px "Arial Narrow", Arial, sans-serif`;
    c.fillText(text, cv.width / 2, cv.height / 2 + 4, cv.width - 60);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 });
    this.ownMats.push(mat);
    const m = add(p, new THREE.PlaneGeometry(w, h), mat, x, y, z, true);
    m.rotation.y = rotY;
    return m;
  }

  /* ---------- Cabina frontal plana (volquetas) ---------- */
  cabCOE(p: P) {
    const M = this.M;
    const sh = new THREE.Shape();
    sh.moveTo(1.85, 1.3); sh.lineTo(3.7, 1.3); sh.lineTo(3.7, 2.25); sh.lineTo(3.45, 3.1); sh.lineTo(3.3, 3.3); sh.lineTo(1.85, 3.3); sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: 2.2, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.05, bevelSegments: 4, curveSegments: 1 });
    geo.translate(0, 0, -1.1);
    add(p, geo, M.paint);

    const ang = Math.atan2(0.25, 0.85);
    box(p, 0.025, 0.8, 2.12, M.black, 3.622, 2.69, 0).rotation.z = ang;
    box(p, 0.03, 0.72, 2.0, M.glass, 3.632, 2.69, 0).rotation.z = ang;
    box(p, 0.02, 0.05, 0.6, M.dark, 3.66, 2.4, 0.35).rotation.z = ang + 0.9; // limpiabrisas
    box(p, 0.02, 0.05, 0.6, M.dark, 3.66, 2.4, -0.45).rotation.z = ang + 0.9;

    [-1, 1].forEach((s) => {
      box(p, 1.0, 0.68, 0.02, M.black, 2.95, 2.7, s * 1.183);
      box(p, 0.95, 0.62, 0.03, M.glassSide, 2.95, 2.7, s * 1.186);
      box(p, 0.012, 1.68, 0.012, M.dark, 2.1, 2.36, s * 1.184);
      box(p, 1.42, 0.012, 0.012, M.dark, 2.81, 1.52, s * 1.184);
      box(p, 0.14, 0.04, 0.05, M.chrome, 2.3, 2.2, s * 1.2);
      box(p, 0.05, 0.05, 0.22, M.dark, 3.38, 2.78, s * 1.28);
      box(p, 0.09, 0.52, 0.16, M.black, 3.4, 2.58, s * 1.42);
      box(p, 0.02, 0.46, 0.13, M.glassSide, 3.455, 2.58, s * 1.42);
      box(p, 0.55, 0.05, 0.3, M.steel, 2.1, 0.92, s * 1.05);
      box(p, 0.04, 0.4, 0.04, M.steel, 1.9, 1.12, s * 1.1);
      box(p, 0.05, 0.17, 0.3, M.lampW, 3.8, 1.6, s * 0.88);
      box(p, 0.04, 0.08, 0.16, M.lampA, 3.8, 1.35, s * 1.08);
    });
    box(p, 0.05, 0.78, 1.7, M.black, 3.77, 1.75, 0);
    for (let r = 0; r < 5; r++) box(p, 0.03, 0.05, 1.62, M.chrome, 3.8, 1.5 + r * 0.14, 0);
    box(p, 0.22, 0.34, 2.3, M.dark, 3.82, 1.12, 0);
    box(p, 0.06, 0.06, 0.9, M.chrome, 3.94, 1.12, 0);
    [-0.45, 0, 0.45].forEach((z) => box(p, 0.1, 0.07, 0.2, M.lampA, 3.36, 3.38, z));
    cyl(p, 0.055, 0.055, 2.2, 14, M.chrome, 1.72, 2.45, 1.0, 'y');
    box(p, 0.06, 0.1, 0.18, M.dark, 1.74, 1.5, 1.0);
    box(p, 0.06, 0.1, 0.18, M.dark, 1.74, 2.5, 1.06);
    cyl(p, 0.28, 0.28, 1.5, 24, M.chrome, 0.4, 0.97, 0.95, 'x');
    [-0.2, 1.0].forEach((x) => box(p, 0.06, 0.62, 0.62, M.dark, x, 0.97, 0.95));
    box(p, 0.9, 0.4, 0.42, M.dark, 0.5, 0.95, -0.95);
    this.fenderArch(p, 2.6);
  }

  /* ---------- Cabina convencional con capó ---------- */
  cabConv(p: P, o: { hood?: number; sleeper?: boolean; aircleaners?: boolean }) {
    const M = this.M;
    const F = o.hood ?? 1.25, W = -0.75, CB = W - 1.55;
    const hs = new THREE.Shape();
    hs.moveTo(W, 1.22); hs.lineTo(F, 1.22); hs.lineTo(F, 2.05);
    hs.quadraticCurveTo(F, 2.3, F - 0.3, 2.32); hs.lineTo(W, 2.4); hs.closePath();
    const hg = new THREE.ExtrudeGeometry(hs, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 3, curveSegments: 8 });
    hg.translate(0, 0, -0.75);
    add(p, hg, M.paint);
    this.fenderArch(p, 0);
    [-1, 1].forEach((s) => {
      box(p, F + 0.55, 0.1, 0.46, M.paint, (F - 0.6) / 2, 1.13, s * 1.0);
      box(p, 0.12, 0.16, 0.34, M.lampW, F - 0.2, 1.27, s * 0.98);
      box(p, 0.08, 0.08, 0.16, M.lampA, F - 0.24, 1.27, s * 1.2);
    });
    box(p, 0.06, 0.8, 1.2, M.chrome, F + 0.05, 1.66, 0);
    for (let i = 0; i < 9; i++) box(p, 0.03, 0.7, 0.045, M.black, F + 0.09, 1.66, -0.48 + i * 0.12);
    box(p, 0.25, 0.32, 2.45, M.chrome, F + 0.2, 0.98, 0);

    // Cabina: la cara frontal sube vertical hasta el capó y luego se inclina hacia atrás (parabrisas).
    const yW = 2.45, yR = 3.2, run = 0.4;
    const cs = new THREE.Shape();
    cs.moveTo(CB, 1.2); cs.lineTo(W + 0.05, 1.2); cs.lineTo(W + 0.05, yW); cs.lineTo(W + 0.05 - run, yR); cs.lineTo(CB, yR); cs.closePath();
    const cg = new THREE.ExtrudeGeometry(cs, { depth: 2.1, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 3, curveSegments: 1 });
    cg.translate(0, 0, -1.05);
    add(p, cg, M.paint);
    // Parabrisas apoyado sobre la cara inclinada: su eje "alto" sigue el vector (-run, yR-yW).
    const rise = yR - yW, len = Math.hypot(run, rise);
    const tilt = Math.atan2(run, rise);                // rota +y hacia -x
    const nx = rise / len, ny = run / len;             // normal exterior (hacia +x, +y)
    const mx = W + 0.05 - run / 2, my = (yW + yR) / 2;
    const frame = box(p, 0.03, len - 0.02, 2.06, M.black, mx + nx * 0.075, my + ny * 0.075, 0);
    frame.rotation.z = tilt;
    const ws = box(p, 0.03, len - 0.1, 1.94, M.glass, mx + nx * 0.09, my + ny * 0.09, 0);
    ws.rotation.z = tilt;
    box(p, 0.34, 0.05, 2.12, M.dark, W - 0.5, yR + 0.07, 0).rotation.z = -0.1;   // visera
    [-0.45, 0, 0.45].forEach((z) => box(p, 0.1, 0.07, 0.2, M.lampA, W - 0.75, yR + 0.1, z));
    [-1, 1].forEach((s) => {
      box(p, 0.96, 0.66, 0.02, M.black, W - 0.62, 2.72, s * 1.105);
      box(p, 0.9, 0.6, 0.03, M.glassSide, W - 0.62, 2.72, s * 1.108);
      box(p, 0.012, 1.7, 0.012, M.dark, CB + 0.35, 2.2, s * 1.105);
      box(p, 0.14, 0.04, 0.05, M.chrome, CB + 0.55, 2.2, s * 1.13);
      box(p, 0.05, 0.05, 0.3, M.dark, W + 0.02, 2.62, s * 1.2);
      box(p, 0.09, 0.56, 0.16, M.black, W + 0.04, 2.5, s * 1.42);
      box(p, 0.02, 0.5, 0.13, M.glassSide, W + 0.095, 2.5, s * 1.42);
      cyl(p, 0.28, 0.28, 1.2, 28, M.chrome, -1.55, 0.95, s * 0.98, 'x');
      [-2.05, -1.05].forEach((x) => box(p, 0.05, 0.6, 0.62, M.dark, x, 0.95, s * 0.98));
      box(p, 0.26, 0.04, 0.3, M.steel, -0.72, 0.62, s * 1.0);
      if (o.aircleaners) {
        cyl(p, 0.17, 0.17, 0.75, 24, M.chrome, W + 0.22, 2.05, s * 1.26, 'y');
        box(p, 0.06, 0.06, 0.2, M.dark, W + 0.22, 2.05, s * 1.12);
      }
    });
    let back = CB;
    if (o.sleeper) {
      box(p, 1.35, 2.35, 2.1, M.paint, CB - 0.67, 2.375, 0);
      box(p, 0.85, 0.3, 2.0, M.paint, CB + 0.35, 3.32, 0).rotation.z = 0.28;
      [-1, 1].forEach((s) => box(p, 0.5, 0.35, 0.02, M.glassSide, CB - 0.7, 2.75, s * 1.052));
      back = CB - 1.35;
    }
    [-1, 1].forEach((s) => {
      cyl(p, 0.08, 0.08, 2.7, 16, M.chrome, back - 0.14, 2.55, s * 0.98, 'y');
      cyl(p, 0.105, 0.105, 0.9, 16, M.steel, back - 0.14, 1.95, s * 0.98, 'y');
    });
    return back;
  }

  tractor(v: P, o: { hood?: number; sleeper?: boolean; aircleaners?: boolean }) {
    const M = this.M;
    const back = this.cabConv(v, o);
    const a1 = back - 0.95, a2 = a1 - 1.3, kx = (a1 + a2) / 2 + 0.25;
    this.rails(v, a2 - 0.9, 1.1, 1.0);
    this.axle(v, 0, false);
    this.axle(v, a1, true, 0.5, true);
    this.axle(v, a2, true, 0.5, true);
    box(v, 1.1, 0.1, 1.5, M.dark, kx, 1.2, 0);
    box(v, 0.95, 0.07, 1.3, M.black, kx, 1.29, 0);
    box(v, 0.7, 0.04, 1.0, M.steel, back - 0.4, 1.2, 0);
    [-1, 1].forEach((s) => {
      box(v, 0.04, 0.55, 0.55, M.rubber, a2 - 0.62, 0.5, s * 1.0);
      box(v, 0.06, 0.06, 0.55, M.dark, a2 - 0.62, 0.8, s * 1.0);
      box(v, 0.04, 0.1, 0.16, M.lampR, a2 - 0.93, 1.0, s * 0.45);
    });
    return kx;
  }

  semitrailer(v: P, kx: number, len: number) {
    const M = this.M;
    const F = kx + 0.9, R = F - len;
    [-1, 1].forEach((s) => box(v, len, 0.16, 0.14, M.black, (F + R) / 2, 1.42, s * 0.5));
    for (let x = F - 0.6; x > R + 0.3; x -= 1.2) box(v, 0.1, 0.12, 0.9, M.black, x, 1.42, 0);
    box(v, 1.8, 0.05, 2.3, M.dark, F - 0.9, 1.365, 0);
    box(v, 0.06, 0.24, 2.4, M.dark, F - 0.03, 1.47, 0);
    [R + 1.3, R + 2.6, R + 3.9].forEach((ax) => {
      this.axle(v, ax, true, 0.5, false);
      [-1, 1].forEach((s) => [-0.45, 0.45].forEach((d) => box(v, 0.1, 0.62, 0.1, M.dark, ax + d, 1.03, s * 0.5)));
    });
    [-1, 1].forEach((s) => {
      box(v, 0.12, 1.0, 0.12, M.steel, F - 2.3, 0.84, s * 0.85);
      box(v, 0.3, 0.05, 0.3, M.dark, F - 2.3, 0.32, s * 0.85);
    });
    box(v, 0.08, 0.08, 1.7, M.steel, F - 2.3, 0.9, 0);
    this.rearEnd(v, R, R + 0.7, 0.35);
    return { F, R };
  }

  dumpBody(p: P, o: { xr: number; xf: number; y0: number; y1: number; slope: number; hw?: number; mat?: THREE.Material; liner?: THREE.Material; base: V2; top: V2; max: number }) {
    const M = this.M;
    const { xr, xf, y0, y1, slope: s } = o;
    const hw = o.hw ?? 1.19, h = y1 - y0, mat = o.mat ?? M.paint, lin = o.liner ?? M.liner;
    const H = new THREE.Vector2(xr + 0.1, y0);
    const pivot = new THREE.Group();
    pivot.position.set(H.x, H.y, 0);
    p.add(pivot);
    const bodyG = new THREE.Group();
    bodyG.position.set(-H.x, -H.y, 0);
    pivot.add(bodyG);

    const wallShape = new THREE.Shape();
    wallShape.moveTo(xr, y0); wallShape.lineTo(xf, y0); wallShape.lineTo(xf + s, y1); wallShape.lineTo(xr, y1); wallShape.closePath();
    const lean = Math.atan2(s, h);
    [1, -1].forEach((sd) => {
      const wg = new THREE.ExtrudeGeometry(wallShape, { depth: 0.06, bevelEnabled: false });
      wg.translate(0, 0, sd > 0 ? hw : -hw - 0.06);
      add(bodyG, wg, mat);
      const lg = new THREE.ShapeGeometry(wallShape);
      const uv = lg.attributes.uv; // UV en metros → la textura de suciedad no se estira
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 3, uv.getY(i) / 2);
      add(bodyG, lg, lin, 0, 0, sd * (hw - 0.002), true);
      for (let xc = xf - 0.5; xc > xr + 0.3; xc -= 0.92) {
        box(bodyG, 0.13, (h + 0.04) / Math.cos(lean), 0.04, mat, xc, (y0 + y1) / 2, sd * (hw + 0.08)).rotation.z = -lean;
      }
      box(bodyG, xf + s - xr, 0.09, 0.14, mat, (xf + s + xr) / 2, y1 + 0.01, sd * (hw + 0.01));
    });
    box(bodyG, xf - xr + 0.05, 0.1, 2 * hw, lin, (xf + xr) / 2, y0 + 0.05, 0);
    box(bodyG, 0.07, Math.hypot(h, s) + 0.02, 2 * hw + 0.06, mat, xf + s / 2 - 0.04, (y0 + y1) / 2, 0).rotation.z = -lean;
    box(bodyG, 0.24, 0.06, 2 * hw + 0.12, mat, xf + s + 0.04, y1 + 0.02, 0).rotation.z = -0.15;
    [-1, 1].forEach((sd) => box(bodyG, xf - xr - 0.1, 0.11, 0.1, M.black, (xf + xr) / 2, y0 - 0.055, sd * 0.5));
    for (let q = xr + 0.5; q < xf; q += 0.9) box(bodyG, 0.12, 0.11, 2 * hw - 0.18, M.black, q, y0 - 0.055, 0);

    const gate = new THREE.Group();
    gate.position.set(xr, y1 - 0.03, 0);
    bodyG.add(gate);
    box(gate, 0.07, h - 0.1, 2 * hw, mat, 0, -(h - 0.1) / 2, 0);
    [-0.8, 0, 0.8].forEach((z) => box(gate, 0.04, h - 0.3, 0.12, mat, -0.05, -(h - 0.1) / 2, z));
    box(gate, 0.05, 0.1, 2 * hw + 0.02, mat, -0.03, -0.05, 0);
    [-1, 1].forEach((sd) => cyl(gate, 0.04, 0.04, 0.2, 10, M.steel, -0.06, -(h - 0.2), sd * 1.0, 'z'));

    const stages = ([[0.1, M.black, 0.55], [0.075, M.chrome, 0.8], [0.055, M.chrome, 1.0]] as const).map(([r, m, f]) => {
      const g = new THREE.CylinderGeometry(r, r, 1, 18);
      g.translate(0, 0.5, 0);
      const mesh = new THREE.Mesh(g, m);
      mesh.castShadow = true;
      mesh.userData.dynamic = true;
      p.add(mesh);
      return { mesh, f };
    });
    const origin = new THREE.Vector2();
    const update = (theta: number) => {
      const t = o.top.clone().sub(H).rotateAround(origin, theta).add(H);
      const d = t.sub(o.base), L = Math.max(d.length(), 0.2), phi = Math.atan2(d.y, d.x);
      stages.forEach((st) => {
        st.mesh.position.set(o.base.x, o.base.y, 0);
        st.mesh.rotation.z = phi - PI / 2;
        st.mesh.scale.y = L * st.f;
      });
    };
    update(0);
    pivot.userData.dynamic = true;
    return { pivot, gate, update, max: o.max } satisfies Lift;
  }

  excavator(p: P, ox: number, oy: number) {
    const M = this.M;
    const g = new THREE.Group();
    g.position.set(ox, oy, 0);
    p.add(g);
    [-1, 1].forEach((s) => {
      box(g, 3.6, 0.62, 0.62, M.dark, 0, 0.36, s * 1.12);
      [-1.8, 1.8].forEach((x) => cyl(g, 0.31, 0.31, 0.62, 24, M.dark, x, 0.36, s * 1.12, 'z'));
      for (let k = 0; k < 12; k++) box(g, 0.08, 0.05, 0.64, M.black, -1.65 + k * 0.3, 0.69, s * 1.12);
    });
    box(g, 2.2, 0.45, 1.6, M.dark, 0, 0.75, 0);
    cyl(g, 0.7, 0.7, 0.14, 32, M.black, 0, 1.03, 0, 'y');
    box(g, 3.0, 0.85, 2.5, M.yellow, 0.35, 1.53, 0);
    box(g, 0.55, 0.85, 2.5, M.yellow, 2.1, 1.5, 0);
    box(g, 1.3, 0.18, 1.3, M.yellow, 1.05, 2.04, -0.5);
    cyl(g, 0.05, 0.05, 0.4, 10, M.dark, 1.3, 2.3, -0.85, 'y');
    box(g, 1.0, 1.45, 0.95, M.yellow, -0.62, 2.68, 0.72);
    box(g, 0.03, 1.05, 0.82, M.glass, -1.13, 2.78, 0.72);
    box(g, 0.8, 0.95, 0.03, M.glassSide, -0.6, 2.8, 1.205);
    box(g, 0.8, 0.95, 0.03, M.glassSide, -0.6, 2.8, 0.235);
    const bz = -0.25;
    beam(g, -1.0, 2.0, -2.7, 3.1, 0.5, 0.5, bz, M.yellow, 0.2);
    beam(g, -2.7, 3.1, -4.5, 2.8, 0.42, 0.48, bz, M.yellow, 0.2);
    beam(g, -4.5, 2.8, -5.15, 1.1, 0.36, 0.4, bz, M.yellow, 0.1);
    [-1, 1].forEach((s) => {
      beam(g, -0.8, 1.6, -1.6, 2.3, 0.2, 0.18, bz + s * 0.34, M.yellow);
      beam(g, -0.8, 1.6, -2.3, 2.75, 0.1, 0.1, bz + s * 0.34, M.chrome);
    });
    beam(g, -2.4, 3.5, -3.3, 3.38, 0.22, 0.22, bz, M.yellow);
    beam(g, -2.4, 3.5, -4.4, 3.2, 0.12, 0.12, bz, M.chrome);
    box(g, 0.95, 0.8, 1.05, M.yellow, -5.3, 1.0, bz).rotation.z = 0.35;
    for (let i = 0; i < 4; i++) box(g, 0.14, 0.08, 0.1, M.dark, -5.82, 0.66, bz - 0.4 + i * 0.27);
    [-1, 1].forEach((s) => {
      beam(g, -2.1, 0.3, -2.9, 0.03, 0.035, 0.035, s * 1.05, M.black);
      beam(g, 2.1, 0.3, 2.9, 0.03, 0.035, 0.035, s * 1.05, M.black);
    });
    return g;
  }
}

/* ======================= Vehículos ======================= */
type Out = { group: THREE.Group; lift?: Lift; cargo?: (on: boolean) => void };

function dumpTruck(c: Ctx, o: { rear: number[]; xr: number; guard?: boolean }): Out {
  const M = c.M, v = new THREE.Group();
  const last = o.rear[o.rear.length - 1];
  c.rails(v, o.xr + 0.1, 3.6, 1.12);
  c.rearEnd(v, o.xr, last - 0.6, 0);
  c.axle(v, 2.6, false);
  o.rear.forEach((ax) => c.axle(v, ax, true, 0.5, true));
  c.cabCOE(v);
  if (o.guard) [-1, 1].forEach((s) => {
    box(v, 1.5, 0.05, 0.04, M.chrome, -0.9, 0.7, s * 1.2);
    box(v, 0.04, 0.3, 0.04, M.steel, -1.5, 0.82, s * 1.2);
    box(v, 0.04, 0.3, 0.04, M.steel, -0.3, 0.82, s * 1.2);
  });
  const lift = c.dumpBody(v, { xr: o.xr, xf: 1.0, y0: 1.35, y1: 3.45, slope: 0.5, base: new THREE.Vector2(1.25, 1.08), top: new THREE.Vector2(0.9, 1.3), max: 0.7 });
  return { group: v, lift };
}

function tipper(c: Ctx): Out {
  const M = c.M, v = new THREE.Group();
  const kx = c.tractor(v, { hood: 1.2 });
  const t = c.semitrailer(v, kx, 11.6);
  const s = 0.25, xf = t.F - 0.45 - s, y0 = 1.58, y1 = 3.5, h = y1 - y0;
  const lift = c.dumpBody(v, {
    xr: t.R, xf, y0, y1, slope: s, mat: M.tipBody, liner: M.tipLiner,
    base: new THREE.Vector2(t.F - 0.2, 1.52), top: new THREE.Vector2(xf + s * 0.85 + 0.08, y0 + h * 0.85), max: 0.55,
  });
  return { group: v, lift };
}

function tanker(c: Ctx): Out {
  const M = c.M, v = new THREE.Group();
  c.cabConv(v, { hood: 1.05 });
  c.rails(v, -7.7, 1.1, 1.0);
  c.axle(v, 0, false);
  c.axle(v, -5.3, true, 0.5, true);
  c.axle(v, -6.6, true, 0.5, true);
  c.rearEnd(v, -7.75, -7.2, 0);
  const x0 = -2.6, x1 = -7.35, len = x0 - x1, cx = (x0 + x1) / 2, cy = 2.08, ry = 0.78, rz = 1.17;
  const tg = new THREE.CylinderGeometry(1, 1, len, 56, 1, true);
  tg.rotateZ(PI / 2);
  add(v, tg, M.inox, cx, cy, 0).scale.set(1, ry, rz);
  [x0, x1].forEach((x) => add(v, new THREE.SphereGeometry(1, 40, 20), M.inox, x, cy, 0).scale.set(0.2, ry, rz));
  for (let bx = x1 + 0.4; bx < x0; bx += 1.15) {
    const bg = new THREE.CylinderGeometry(1.015, 1.015, 0.07, 56, 1, true);
    bg.rotateZ(PI / 2);
    add(v, bg, M.chrome, bx, cy, 0, true).scale.set(1, ry, rz);
  }
  [-3.0, -4.3, -5.9, -7.0].forEach((x) => box(v, 0.22, 0.24, 1.3, M.dark, x, 1.24, 0));
  box(v, len - 0.6, 0.04, 0.5, M.steel, cx, cy + ry + 0.03, 0);
  [-0.3, 0.3].forEach((z) => {
    cyl(v, 0.02, 0.02, len - 0.8, 8, M.chrome, cx, cy + ry + 0.38, z, 'x');
    for (let px = x1 + 0.6; px < x0 - 0.3; px += 1.2) box(v, 0.03, 0.36, 0.03, M.chrome, px, cy + ry + 0.2, z);
  });
  [-3.8, -6.1].forEach((x) => cyl(v, 0.26, 0.26, 0.12, 28, M.chrome, x, cy + ry + 0.1, 0, 'y'));
  [-0.28, 0.28].forEach((z) => box(v, 0.05, 1.9, 0.05, M.chrome, x1 - 0.32, 1.95, z));
  for (let y = 1.2; y < 2.9; y += 0.3) box(v, 0.04, 0.04, 0.56, M.chrome, x1 - 0.32, y, 0);
  cyl(v, 0.09, 0.09, 0.5, 14, M.dark, x1 - 0.2, 1.38, 0.4, 'x');
  cyl(v, 0.05, 0.05, 2.0, 12, M.chrome, -7.85, 0.78, 0, 'z');
  for (let n = -0.8; n <= 0.8; n += 0.4) cyl(v, 0.03, 0.03, 0.08, 8, M.dark, -7.89, 0.73, n, 'y');
  [-1, 1].forEach((s) => {
    cyl(v, 0.1, 0.1, 1.9, 14, M.dark, -3.65, 1.12, s * 1.12, 'x');
    box(v, 0.7, 0.5, 0.35, M.steel, -4.45, 1.0, s * 1.0);
  });
  return { group: v };
}

function lowboy(c: Ctx): Out {
  const M = c.M, v = new THREE.Group();
  const kx = c.tractor(v, { sleeper: true, hood: 1.35 });
  const F = kx + 0.9;
  const P: [number, number][] = [[F, 1.48], [F - 2.6, 1.48], [F - 3.15, 0.73], [F - 9.8, 0.73], [F - 10.4, 1.08], [F - 13.8, 1.08]];
  for (let i = 0; i < P.length - 1; i++) {
    const [a, b] = [P[i], P[i + 1]];
    [-0.55, 0.55].forEach((z) => beam(v, a[0], a[1], b[0], b[1], 0.26, 0.14, z, M.black, 0.12));
    [-1.27, 1.27].forEach((z) => beam(v, a[0], a[1] + 0.02, b[0], b[1] + 0.02, 0.22, 0.08, z, M.dark, 0.1));
  }
  box(v, 2.6, 0.05, 2.5, M.dark, F - 1.3, 1.635, 0);
  beam(v, F - 2.6, 1.635, F - 3.15, 0.885, 0.05, 2.5, 0, M.dark);
  box(v, 6.65, 0.05, 2.5, M.wood, F - 6.475, 0.885, 0);
  beam(v, F - 9.8, 0.885, F - 10.4, 1.235, 0.05, 2.5, 0, M.wood);
  box(v, 3.4, 0.05, 2.5, M.wood, F - 12.1, 1.235, 0);
  for (let x = F - 3.6; x > F - 9.6; x -= 0.9) box(v, 0.1, 0.16, 2.4, M.black, x, 0.78, 0);
  box(v, 1.8, 0.05, 2.0, M.dark, F - 0.9, 1.33, 0);
  [F - 11.2, F - 12.15, F - 13.1].forEach((ax) => {
    c.axle(v, ax, true, 0.42, false);
    [-1, 1].forEach((s) => box(v, 0.1, 0.4, 0.1, M.dark, ax, 0.76, s * 0.55));
  });
  [-1, 1].forEach((s) => {
    box(v, 0.12, 1.0, 0.12, M.steel, F - 2.1, 0.84, s * 0.85);
    box(v, 0.3, 0.05, 0.3, M.dark, F - 2.1, 0.32, s * 0.85);
  });
  c.rearEnd(v, F - 13.8, F - 13.65, 0.05);
  c.sign(v, 'CARGA EXTRADIMENSIONADA', 2.0, 0.34, F - 13.87, 1.62, 0, -PI / 2);
  c.sign(v, 'CARGA EXTRADIMENSIONADA', 1.7, 0.29, 1.35 + 0.34, 0.98, 0, PI / 2);
  const exc = c.excavator(v, F - 5.35, 0.91);
  exc.userData.dynamic = true;
  return { group: v, cargo: (on) => { exc.visible = on; } };
}

function flatbed(c: Ctx): Out {
  const M = c.M, v = new THREE.Group();
  const kx = c.tractor(v, { sleeper: true, hood: 1.5, aircleaners: true });
  const len = 12.2, { F, R } = c.semitrailer(v, kx, len), cx = (F + R) / 2;
  box(v, len, 0.08, 2.5, M.wood, cx, 1.54, 0);
  [-1, 1].forEach((s) => {
    box(v, len, 0.16, 0.06, M.dark, cx, 1.47, s * 1.25);
    for (let x = F - 0.4; x > R + 0.3; x -= 3.0) box(v, 0.08, 0.05, 0.03, M.lampA, x, 1.47, s * 1.285);
  });
  const tarp = new THREE.Group();
  tarp.userData.dynamic = true;
  v.add(tarp);
  const w = 1.27, th = 2.05, r = 0.35, sh = new THREE.Shape();
  sh.moveTo(-w, 0); sh.lineTo(w, 0); sh.lineTo(w, th - r); sh.quadraticCurveTo(w, th, w - r, th);
  sh.lineTo(-w + r, th); sh.quadraticCurveTo(-w, th, -w, th - r); sh.closePath();
  const tg = new THREE.ExtrudeGeometry(sh, { depth: len - 0.1, bevelEnabled: false, curveSegments: 10 });
  tg.rotateY(PI / 2);
  tg.translate(R + 0.05, 1.58, 0);
  add(tarp, tg, M.tarp);
  [-1, 1].forEach((s) => {
    for (let x = R + 0.6; x < F - 0.2; x += 1.1) box(tarp, 0.05, 1.7, 0.02, M.strap, x, 2.45, s * 1.278);
  });
  const open = new THREE.Group();
  open.userData.dynamic = true;
  open.visible = false;
  v.add(open);
  [-1, 1].forEach((s) => {
    for (let x = F - 0.1; x > R; x -= 1.22) box(open, 0.07, 1.45, 0.07, M.dark, x, 2.3, s * 1.21);
  });
  const nAlong = Math.floor((len - 0.3) / 1.1), count = nAlong * 4;
  const bags = new THREE.InstancedMesh(new THREE.BoxGeometry(1.02, 0.95, 1.08), M.bag, count);
  const bands = new THREE.InstancedMesh(new THREE.BoxGeometry(1.04, 0.24, 1.1), M.band, count);
  const m4 = new THREE.Matrix4();
  let k = 0;
  for (let i = 0; i < nAlong; i++) for (const z of [-0.58, 0.58]) for (const lv of [0, 1]) {
    m4.makeTranslation(R + 0.75 + i * 1.1, 1.58 + 0.475 + lv * 0.96, z);
    bags.setMatrixAt(k, m4);
    bands.setMatrixAt(k, m4);
    k++;
  }
  [bags, bands].forEach((m) => { m.castShadow = true; m.receiveShadow = true; open.add(m); });
  return { group: v, cargo: (on) => { tarp.visible = on; open.visible = !on; } };
}

const BUILDERS: Record<VehicleSlug, (c: Ctx) => Out> = {
  'volqueta-doble-troque': (c) => dumpTruck(c, { rear: [-2.2, -3.3], xr: -4.1, guard: true }),
  'volqueta-sencilla': (c) => dumpTruck(c, { rear: [-1.5], xr: -2.6 }),
  'tracto-camion-volco': tipper,
  'carro-tanque': tanker,
  'tractomula-cama-baja': lowboy,
  tractocamion: flatbed,
};

/**
 * Rendimiento: fusiona en una sola malla por material todas las piezas que no se mueven.
 * Pasa de cientos de draw calls a unas decenas. Se omiten los subárboles marcados como dinámicos
 * (ruedas, volco, carga, cilindros hidráulicos) porque se animan o se ocultan.
 */
function bakeStatic(root: THREE.Group) {
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const victims: THREE.Mesh[] = [];
  const walk = (o: THREE.Object3D) => {
    if (o.userData.dynamic) return;
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh && !(mesh as unknown as THREE.InstancedMesh).isInstancedMesh && !Array.isArray(mesh.material)) {
      const g = (mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone());
      g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, mesh.matrixWorld));
      const mat = mesh.material as THREE.Material & { map?: THREE.Texture | null };
      for (const name of Object.keys(g.attributes)) {
        if (name !== 'position' && name !== 'normal' && !(name === 'uv' && mat.map)) g.deleteAttribute(name);
      }
      if (mat.map && !g.attributes.uv) {
        g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      }
      if (!buckets.has(mat)) buckets.set(mat, []);
      buckets.get(mat)!.push(g);
      victims.push(mesh);
    }
    o.children.forEach(walk);
  };
  root.children.forEach(walk);
  victims.forEach((m) => {
    m.parent?.remove(m);
    if (!KEEP.has(m.geometry)) m.geometry.dispose();
  });
  buckets.forEach((geos, mat) => {
    const merged = mergeGeometries(geos, false);
    geos.forEach((g) => g.dispose());
    if (!merged) return;
    const mesh = new THREE.Mesh(merged, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
  });
}

export function buildVehicle(slug: VehicleSlug, M: Materials): Built {
  const c = new Ctx(M);
  const out = BUILDERS[slug](c);
  bakeStatic(out.group);
  return {
    ...out,
    wheels: c.wheels,
    dispose() {
      out.group.traverse((n) => {
        const mesh = n as THREE.Mesh;
        if (mesh.geometry && !KEEP.has(mesh.geometry)) mesh.geometry.dispose();
      });
      c.ownMats.forEach((m) => {
        (m as THREE.MeshStandardMaterial).map?.dispose();
        m.dispose();
      });
    },
  };
}
