import * as THREE from "three";

/**
 * Procedural red-sandalwood surface, generated on the client — no image files,
 * nothing fetched. Fine wavy "cow-hair" grain over broad colour drift from
 * ember orange to aged violet-brown, with sparse golden flecks (金星).
 * The noise is sampled on a cylinder so the texture wraps a bead without a seam.
 */

function hash(x: number, y: number, z: number) {
  let h = x * 374761393 + y * 668265263 + z * 2147483647;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return (h & 0xffff) / 0xffff;
}
const fade = (t: number) => t * t * (3 - 2 * t);
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = fade(x - xi), yf = fade(y - yi), zf = fade(z - zi);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), xf), l(c(0, 1, 0), c(1, 1, 0), xf), yf),
    l(l(c(0, 0, 1), c(1, 0, 1), xf), l(c(0, 1, 1), c(1, 1, 1), xf), yf),
    zf,
  );
}
function fbm(x: number, y: number, z: number, oct = 4) {
  let v = 0, a = 0.5, f = 1;
  for (let i = 0; i < oct; i++) {
    v += a * noise3(x * f, y * f, z * f);
    f *= 2.03;
    a *= 0.5;
  }
  return v;
}

const DEEP = [46, 10, 7];
const MID = [112, 32, 18];
const EMBER = [170, 66, 38];

let cache: { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } | null = null;

export function woodTextures() {
  if (cache) return cache;
  const W = 512, H = 256;
  const cMap = document.createElement("canvas");
  const cBump = document.createElement("canvas");
  cMap.width = cBump.width = W;
  cMap.height = cBump.height = H;
  const gm = cMap.getContext("2d")!;
  const gb = cBump.getContext("2d")!;
  const im = gm.createImageData(W, H);
  const ib = gb.createImageData(W, H);

  for (let y = 0; y < H; y++) {
    const v = y / H;
    for (let x = 0; x < W; x++) {
      const a = (x / W) * Math.PI * 2;
      const cx = Math.cos(a) * 1.6, cy = Math.sin(a) * 1.6;
      // warp so the grain waves like real turned heartwood
      const warp = fbm(cx * 0.8, cy * 0.8, v * 2.2, 3) * 0.34;
      const t = (v + warp) * 16;
      const line = Math.pow(0.5 + 0.5 * Math.sin(t * Math.PI * 2), 3) * (0.55 + fbm(cx * 2, cy * 2, v * 9, 2) * 0.6);
      const fine = noise3(cx * 10, cy * 10, v * 60);
      const band = fbm(cx * 0.9, cy * 0.9, v * 5, 4);
      const k = Math.min(1, Math.max(0, (band - 0.28) * 1.9));
      const base = k < 0.5
        ? DEEP.map((d, i) => d + (MID[i] - d) * (k / 0.5))
        : MID.map((d, i) => d + (EMBER[i] - d) * ((k - 0.5) / 0.5));
      const shade = 1 - line * 0.22 - (fine - 0.5) * 0.08;
      const o = (y * W + x) * 4;
      im.data[o] = base[0] * shade;
      im.data[o + 1] = base[1] * shade;
      im.data[o + 2] = base[2] * shade;
      im.data[o + 3] = 255;
      const bh = 150 - line * 60 + (fine - 0.5) * 24;
      ib.data[o] = ib.data[o + 1] = ib.data[o + 2] = bh;
      ib.data[o + 3] = 255;
    }
  }
  // 金星 — golden flecks of crystallised deposit
  for (let i = 0; i < 90; i++) {
    const x = Math.floor(hash(i, 7, 3) * W), y = Math.floor(hash(i, 11, 5) * H);
    const o = (y * W + x) * 4;
    im.data[o] = 236; im.data[o + 1] = 170; im.data[o + 2] = 104;
  }
  gm.putImageData(im, 0, 0);
  gb.putImageData(ib, 0, 0);

  const map = new THREE.CanvasTexture(cMap);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 8;
  const bump = new THREE.CanvasTexture(cBump);
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping;
  cache = { map, bump };
  return cache;
}

export function woodMaterial() {
  const { map, bump } = woodTextures();
  return new THREE.MeshPhysicalMaterial({
    map,
    bumpMap: bump,
    bumpScale: 0.8,
    roughness: 0.42,
    clearcoat: 0.3,
    clearcoatRoughness: 0.32,
    sheen: 0.35,
    sheenColor: new THREE.Color("#ff9a70"),
    sheenRoughness: 0.5,
  });
}

/** Round, soft sprite for floating dust motes. */
export function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.35, "rgba(255,255,255,.45)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  return t;
}

/** Deterministic pseudo-random for layouts. */
export function seeded(i: number, salt = 1) {
  return hash(i, salt, 17);
}
