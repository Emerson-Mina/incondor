'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { buildVehicle, createMaterials, type Built } from '@/three/vehicles';
import type { VehicleSlug } from '@/lib/fleet';

export type ViewName = 'iso' | 'front' | 'side' | 'rear' | 'top';
export type SceneProps = {
  slug: VehicleSlug;
  paint: string;
  lift: number;                     // 0..1
  cargoOn: boolean;
  view: { name: ViewName; n: number };
  autoRotate: boolean;
  onUserOrbit: () => void;
  /** auto: detecta GPU débil o FPS bajos y baja la calidad sola. */
  quality: 'auto' | 'high' | 'low';
};

const BG = '#090c0f';
const PI = Math.PI;

function viewVec(name: ViewName, L: number) {
  switch (name) {
    case 'front': return new THREE.Vector3(1, 0.08, 0).multiplyScalar(L / 2 + 9);
    case 'rear': return new THREE.Vector3(-1, 0.1, 0).multiplyScalar(L / 2 + 9);
    case 'side': return new THREE.Vector3(0.0001, 0.06, 1).multiplyScalar(Math.max(L * 1.25 + 2, 13));
    case 'top': return new THREE.Vector3(0.0001, 1, 0.0001).multiplyScalar(L * 1.5 + 1);
    default: return new THREE.Vector3(9.5, 3.2, 10).normalize().multiplyScalar(Math.max(L * 1.45 + 2, 15));
  }
}

function Rig(p: SceneProps & { reduce: boolean; active: boolean; onSize: (s: THREE.Vector3) => void }) {
  const { camera, gl, invalidate } = useThree();
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null;
  const mats = useMemo(() => createMaterials(), []);
  const holder = useRef<THREE.Group>(null!);
  const st = useRef({
    cur: null as null | (Built & { outer: THREE.Group; size: THREE.Vector3 }),
    liftCur: 0,
    drive: null as null | { t: number; from: number },
    tween: null as null | { t: number; from: THREE.Spherical; to: THREE.Spherical; d: number },
    first: true,
  });

  useEffect(() => () => mats.dispose(), [mats]);

  // En pantallas angostas se abre el FOV vertical para que el vehículo quepa a lo ancho.
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const base = Math.tan(THREE.MathUtils.degToRad(15)) * 1.5;
    cam.fov = aspect >= 1.5 ? 30 : THREE.MathUtils.radToDeg(2 * Math.atan(Math.min(base / aspect, 1.6)));
    cam.updateProjectionMatrix();
  }, [aspect, camera]);

  useEffect(() => {
    if (!controls) return;
    const stop = () => { st.current.tween = null; };
    controls.addEventListener('start', stop);
    return () => controls.removeEventListener('start', stop);
  }, [controls]);
  useEffect(() => { mats.setPaint(p.paint); invalidate(); }, [mats, p.paint, invalidate]);
  useEffect(() => { invalidate(); }, [p.lift, p.autoRotate, p.active, invalidate]);

  const goView = (name: ViewName) => {
    const s = st.current;
    if (!s.cur || !controls) return;
    const from = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    const to = new THREE.Spherical().setFromVector3(viewVec(name, s.cur.size.x));
    let d = to.theta - from.theta;
    while (d > PI) d -= 2 * PI;
    while (d < -PI) d += 2 * PI;
    s.tween = { t: 0, from, to, d };
  };

  // Montaje del vehículo
  useEffect(() => {
    if (!controls) return;
    const s = st.current;
    if (s.cur) { holder.current.remove(s.cur.outer); s.cur.dispose(); }
    const built = buildVehicle(p.slug, mats);
    const outer = new THREE.Group();
    outer.add(built.group);
    holder.current.add(outer);
    const bb = new THREE.Box3().setFromObject(built.group);
    const c = bb.getCenter(new THREE.Vector3()), size = bb.getSize(new THREE.Vector3());
    built.group.position.x = -c.x;
    built.group.position.z = -c.z;
    s.cur = { ...built, outer, size };
    s.liftCur = 0;
    built.cargo?.(true);
    p.onSize(size);

    const L = size.x;
    controls.target.set(0, size.y * 0.45, 0);
    controls.minDistance = L * 0.45 + 3;
    controls.maxDistance = L * 2.4 + 6;
    if (s.first) {
      camera.position.copy(viewVec('iso', L)).add(controls.target);
      s.first = false;
    } else {
      goView('iso');
      if (!p.reduce) { s.drive = { t: 0, from: -Math.min(6, L * 0.4) }; outer.position.x = s.drive.from; }
    }
    controls.update();
    gl.shadowMap.needsUpdate = true;
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.slug, controls]);

  useEffect(() => { st.current.cur?.cargo?.(p.cargoOn); gl.shadowMap.needsUpdate = true; invalidate(); }, [p.cargoOn, p.slug, gl, invalidate]);
  useEffect(() => { if (p.view.n > 0) { goView(p.view.name); invalidate(); } /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [p.view]);
  useEffect(() => () => { st.current.cur?.dispose(); }, []);

  useFrame((_, dtRaw) => {
    const s = st.current, cur = s.cur;
    const dt = Math.min(0.05, dtRaw);
    if (!cur) return;
    if (s.drive) {
      s.drive.t = Math.min(1, s.drive.t + dt / 0.9);
      const e = 1 - Math.pow(1 - s.drive.t, 3);
      const x = s.drive.from * (1 - e), dx = x - cur.outer.position.x;
      cur.outer.position.x = x;
      cur.wheels.forEach((w) => { w.rotation.z -= dx / w.userData.r; });
      if (s.drive.t >= 1) s.drive = null;
    }
    let moved = !!s.drive;
    if (cur.lift && Math.abs(p.lift - s.liftCur) > 0.0005) {
      moved = true;
      s.liftCur += (p.lift - s.liftCur) * Math.min(1, dt * 3.2);
      const th = s.liftCur * cur.lift.max;
      cur.lift.pivot.rotation.z = th;
      cur.lift.gate.rotation.z = -s.liftCur * 0.75;
      cur.lift.update(th);
    }
    if (s.tween && controls) {
      const tw = s.tween;
      tw.t = Math.min(1, tw.t + dt / 0.9);
      const e = tw.t < 0.5 ? 2 * tw.t * tw.t : 1 - Math.pow(-2 * tw.t + 2, 2) / 2;
      const sp = new THREE.Spherical(
        tw.from.radius + (tw.to.radius - tw.from.radius) * e,
        tw.from.phi + (tw.to.phi - tw.from.phi) * e,
        tw.from.theta + tw.d * e,
      );
      camera.position.setFromSpherical(sp).add(controls.target);
      if (tw.t >= 1) s.tween = null;
    }
    // Sombras solo se recalculan si la geometría se movió; la cámara girando no las cambia.
    if (moved) gl.shadowMap.needsUpdate = true;
    // Render bajo demanda: seguir pidiendo cuadros solo mientras algo se anima y el visor está en pantalla.
    if (p.active && (moved || s.tween || p.autoRotate)) invalidate();
  });

  return <group ref={holder} />;
}

/** Sombra de contacto suave bajo el vehículo (gradiente radial, sin artefactos). */
function ContactBlob({ size }: { size: THREE.Vector3 }) {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    const c = cv.getContext('2d')!;
    const g = c.createRadialGradient(128, 128, 8, 128, 128, 128);
    g.addColorStop(0, 'rgba(0,0,0,0.75)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.3)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(cv);
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh rotation-x={-PI / 2} position-y={0.004} scale={[size.x + 2.6, size.z + 1.6, 1]} renderOrder={1}>
      <planeGeometry />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

function Studio({ size, low }: { size: THREE.Vector3; low: boolean }) {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 34, 95]} />
      <hemisphereLight args={['#b9c6d2', '#0b0d10', 0.18]} />
      <directionalLight
        castShadow
        position={[8, 15, 9]}
        intensity={2.4}
        shadow-mapSize={low ? [1024, 1024] : [2048, 2048]}
        shadow-bias={-0.0006}
        shadow-normalBias={0.06}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-camera-near={1}
        shadow-camera-far={45}
      />
      <spotLight position={[-14, 7, -10]} angle={0.55} penumbra={1} intensity={110} color="#ff7a33" distance={60} />
      <spotLight position={[14, 9, -6]} angle={0.5} penumbra={1} intensity={90} color="#9fc4ff" distance={60} />
      {/* Reflejos: softboxes de estudio generados en GPU, sin archivos HDR externos */}
      <Environment resolution={low ? 128 : 256} frames={1}>
        <color attach="background" args={['#05070a']} />
        <Lightformer form="rect" intensity={4} position={[0, 9, 0]} rotation-x={PI / 2} scale={[18, 5, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-12, 3, 0]} rotation-y={PI / 2} scale={[24, 1.6, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[12, 3, 0]} rotation-y={-PI / 2} scale={[24, 1.6, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[0, 2.5, 14]} scale={[18, 1.2, 1]} />
        <Lightformer form="ring" intensity={1.4} color="#ff8a4c" position={[-8, 5, -12]} scale={4} />
      </Environment>
      <mesh rotation-x={-PI / 2} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#0e1216" roughness={0.62} metalness={0.35} envMapIntensity={0.6} />
      </mesh>
      <ContactBlob size={size} />
    </>
  );
}

/** Sin postprocesado, el renderer aplica el tone mapping directamente. */
function ToneSync({ composer }: { composer: boolean }) {
  const { gl, invalidate } = useThree();
  useEffect(() => {
    gl.toneMapping = composer ? THREE.NoToneMapping : THREE.AgXToneMapping;
    gl.shadowMap.needsUpdate = true;
    invalidate();
  }, [composer, gl, invalidate]);
  return null;
}

const isSoftwareGL = (gl: THREE.WebGLRenderer) => {
  const ctx = gl.getContext();
  const ext = ctx.getExtension('WEBGL_debug_renderer_info');
  const name = String(ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ctx.getParameter(ctx.RENDERER));
  return /llvmpipe|swiftshader|software|softpipe|basic render/i.test(name);
};

export default function FleetScene(props: SceneProps) {
  const [size, setSize] = useState(() => new THREE.Vector3(8, 3.5, 2.6));
  const [reduce, setReduce] = useState(false);
  const [autoLow, setAutoLow] = useState(false);
  const [active, setActive] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => setReduce(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false), []);
  useEffect(() => {
    // Deja de dibujar cuando el visor sale de pantalla.
    const el = wrap.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const low = props.quality === 'low' || (props.quality === 'auto' && autoLow);

  return (
    <div ref={wrap} style={{ position: 'absolute', inset: 0 }}>
    <Canvas
      shadows
      flat
      frameloop="demand"
      dpr={low ? 1 : [1, 1.75]}
      camera={{ fov: 30, near: 0.1, far: 250, position: [14, 6, 14] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = true;
        if (isSoftwareGL(gl)) setAutoLow(true);
      }}
    >
      <PerformanceMonitor onDecline={() => setAutoLow(true)} flipflops={1} />
      <ToneSync composer={!low} />
      <Studio size={size} low={low} />
      <Rig {...props} reduce={reduce} active={active} onSize={(s) => setSize(s.clone())} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        maxPolarAngle={PI / 2 - 0.04}
        autoRotate={props.autoRotate}
        autoRotateSpeed={0.9}
        onStart={props.onUserOrbit}
      />
      {!low && (
        <EffectComposer multisampling={2}>
          <N8AO aoRadius={0.55} intensity={1.8} distanceFalloff={0.6} quality="medium" halfRes />
          <Bloom mipmapBlur luminanceThreshold={1} intensity={0.55} />
          <Vignette offset={0.28} darkness={0.72} />
          <ToneMapping mode={ToneMappingMode.AGX} />
        </EffectComposer>
      )}
    </Canvas>
    </div>
  );
}
