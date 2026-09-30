"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { MotionValue } from "motion/react";
import { dotTexture, seeded, woodMaterial } from "./wood";

/* Studio light built from emissive panels — no HDR file is downloaded. */
function Studio() {
  return (
    <>
      <ambientLight intensity={0.35} color="#ffe2d4" />
      <directionalLight position={[3, 5, 6]} intensity={2.4} color="#ffe6d6" />
      <directionalLight position={[-6, -2, -4]} intensity={1.6} color="#ff8a5c" />
      <pointLight position={[-3, 2, 4]} intensity={14} distance={12} color="#ffb08a" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 5]} scale={[10, 3, 1]} color="#fff1e8" />
        <Lightformer form="rect" intensity={1.6} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#ff9f78" />
        <Lightformer form="ring" intensity={2} position={[5, 1, -3]} scale={3} color="#ffd2b8" />
      </Environment>
    </>
  );
}

function Dust({ count = 260, spread = [12, 8, 6] as [number, number, number], color = "#ffb892", size = 0.05 }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (seeded(i, 2) - 0.5) * spread[0];
      pos[i * 3 + 1] = (seeded(i, 3) - 0.5) * spread[1];
      pos[i * 3 + 2] = (seeded(i, 4) - 0.5) * spread[2];
      sp[i] = 0.04 + seeded(i, 5) * 0.12;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo: g, speeds: sp };
  }, [count, spread]);
  const tex = useMemo(() => dotTexture(), []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const a = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = a.getY(i) + speeds[i] * dt;
      if (y > spread[1] / 2) y = -spread[1] / 2;
      a.setY(i, y);
    }
    a.needsUpdate = true;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial map={tex} size={size} color={color} transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/* ─────────────────────────── Hero: the bracelet ─────────────────────────── */

function Bracelet({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const mat = useMemo(() => woodMaterial(), []);
  const beadGeo = useMemo(() => new THREE.SphereGeometry(1, 64, 48), []);
  const N = 17;
  const R = 1.5;
  const beads = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2;
        return {
          p: [Math.cos(a) * R, Math.sin(a) * R, 0] as [number, number, number],
          r: [seeded(i, 8) * 6, seeded(i, 9) * 6, a] as [number, number, number],
          s: i === 0 ? 0.36 : 0.3 + seeded(i, 10) * 0.012,
        };
      }),
    [],
  );

  useFrame((state, dt) => {
    if (!group.current || !spin.current) return;
    const t = state.clock.elapsedTime;
    const scroll = typeof window === "undefined" ? 0 : Math.min(1.2, window.scrollY / window.innerHeight);
    spin.current.rotation.z += dt * 0.12;
    const px = pointer.current?.x ?? 0;
    const py = pointer.current?.y ?? 0;
    const tx = 1.05 - py * 0.25 - scroll * 0.9;
    const ty = -0.35 + px * 0.35 + scroll * 0.6;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.05;
    group.current.rotation.y += (ty - group.current.rotation.y) * 0.05;
    group.current.position.y = Math.sin(t * 0.8) * 0.08 + scroll * 0.9;
    const wide = state.size.width > 900;
    group.current.position.x = wide ? 0.55 : 0;
    const s = (wide ? 0.8 : 0.62) * (1 + scroll * 0.25);
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group} rotation={[1.05, -0.35, 0]}>
      <group ref={spin}>
        {beads.map((b, i) => (
          <mesh key={i} geometry={beadGeo} material={mat} position={b.p} rotation={b.r} scale={b.s} />
        ))}
        <mesh>
          <torusGeometry args={[R, 0.022, 12, 160]} />
          <meshStandardMaterial color="#3a120b" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export function HeroScene({ active = true }: { active?: boolean }) {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7.6], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onPointerMove={(e) => {
        pointer.current = { x: (e.clientX / window.innerWidth) * 2 - 1, y: (e.clientY / window.innerHeight) * 2 - 1 };
      }}
      style={{ pointerEvents: "auto" }}
    >
      <Studio />
      <Bracelet pointer={pointer} />
      <Dust />
    </Canvas>
  );
}

/* ─────────────── Story: 108 beads that assemble as you scroll ─────────────── */

const COUNT = 108;
type Layout = Float32Array;

function layouts(): Layout[] {
  const cloud = new Float32Array(COUNT * 3);
  const strand = new Float32Array(COUNT * 3);
  const mala = new Float32Array(COUNT * 3);
  const coil = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const t = i / COUNT;
    // 1 — raw: a loose cloud of turned beads
    const u = seeded(i, 21) * 2 - 1, th = seeded(i, 22) * Math.PI * 2, r = 1.6 + Math.cbrt(seeded(i, 23)) * 2.4;
    const q = Math.sqrt(1 - u * u);
    cloud.set([q * Math.cos(th) * r * 1.3, u * r * 0.8, q * Math.sin(th) * r], i * 3);
    // 2 — strung: a single strand spiralling down
    const a2 = t * Math.PI * 2 * 5;
    strand.set([Math.cos(a2) * 0.9, (0.5 - t) * 5.2, Math.sin(a2) * 0.9], i * 3);
    // 3 — counted: the 108 mala
    const a3 = t * Math.PI * 2 - Math.PI / 2;
    mala.set([Math.cos(a3) * 2.35, Math.sin(a3) * 2.35, 0], i * 3);
    // 4 — worn: wrapped three times around the wrist
    const a4 = t * Math.PI * 2 * 3;
    coil.set([Math.cos(a4) * 1.25, Math.sin(a4) * 1.25, (t - 0.5) * 1.1], i * 3);
  }
  return [cloud, strand, mala, coil];
}

const smooth = (x: number) => x * x * (3 - 2 * x);

function Beads({ progress }: { progress: MotionValue<number> }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const L = useMemo(() => layouts(), []);
  const mat = useMemo(() => woodMaterial(), []);
  const geo = useMemo(() => new THREE.SphereGeometry(0.13, 32, 24), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const eased = useRef(0);
  const colored = useRef(false);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh || !group.current) return;
    if (!colored.current) {
      const c = new THREE.Color();
      for (let i = 0; i < COUNT; i++) {
        const k = 0.72 + seeded(i, 31) * 0.28;
        mesh.setColorAt(i, c.setRGB(k, k * (0.92 + seeded(i, 32) * 0.08), k * 0.9));
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      colored.current = true;
    }
    eased.current += (progress.get() - eased.current) * 0.08;
    const p = Math.min(0.9999, Math.max(0, eased.current)) * 3;
    const seg = Math.floor(p);
    const f = p - seg;
    const A = L[seg], B = L[Math.min(3, seg + 1)];
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      // beads travel in a wave, not all at once
      const d = i / COUNT;
      const k = smooth(Math.min(1, Math.max(0, f * 1.6 - d * 0.6)));
      const o = i * 3;
      const bob = seg === 0 && f < 0.3 ? Math.sin(t * 0.6 + i) * 0.06 : 0;
      dummy.position.set(A[o] + (B[o] - A[o]) * k, A[o + 1] + (B[o + 1] - A[o + 1]) * k + bob, A[o + 2] + (B[o + 2] - A[o + 2]) * k);
      dummy.rotation.set(seeded(i, 41) * 6 + t * 0.05, seeded(i, 42) * 6, 0);
      dummy.scale.setScalar(i % 27 === 0 ? 1.25 : 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    group.current.rotation.y = t * 0.08 + eased.current * Math.PI * 0.8;
    group.current.rotation.x = 0.25 + Math.sin(eased.current * Math.PI) * 0.35;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={ref} args={[geo, mat, COUNT]} />
    </group>
  );
}

export function StoryScene({ progress, active = true }: { progress: MotionValue<number>; active?: boolean }) {
  return (
    <Canvas dpr={[1, 1.75]} frameloop={active ? "always" : "never"} camera={{ position: [0, 0, 9], fov: 36 }} gl={{ antialias: true, alpha: true }}>
      <Studio />
      <Beads progress={progress} />
      <Dust count={180} spread={[14, 10, 8]} size={0.04} />
    </Canvas>
  );
}
