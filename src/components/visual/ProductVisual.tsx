"use client";

import { useId, type ReactNode } from "react";
import type { VisualKind } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Procedural renders of the objects. No photography has been supplied yet, and
 * self-contained SVG keeps the storefront fast and fully functional behind the
 * Great Firewall (no third-party image CDNs). Swap for real photography by
 * uploading images to a product in the admin panel.
 */

// Round trig output so server (Node) and browser render identical attribute strings.
const f2 = (n: number) => Math.round(n * 100) / 100;

const mix = (a: string, b: string, t: number) => {
  const pa = a.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  const pb = b.match(/\w\w/g)!.map((x) => parseInt(x, 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0")).join("");
};

function palette(tone: number) {
  return {
    hi: mix("7a2a1c", "e07a55", tone),
    mid: mix("3e0f09", "a8391f", tone),
    lo: mix("140504", "4a120b", tone),
  };
}

type Props = {
  kind: VisualKind;
  tone?: number;
  seed?: number;
  className?: string;
  image?: string;
  glow?: boolean;
  label?: string;
};

export function ProductVisual({ kind, tone = 0.45, seed = 3, className, image, glow = true, label }: Props) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `${s}${raw}`;
  const c = palette(tone);

  if (image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={label ?? ""} className="h-full w-full object-cover" />
      </div>
    );
  }

  const wood = `url(#${id("wood")})`;
  const withWood = (children: ReactNode) => (
    <g>
      {children}
      <g filter={wood} opacity={0.9}>
        {children}
      </g>
    </g>
  );

  const bead = (x0: number, y0: number, r0: number, key: string | number, d0 = 0, grain = true) => {
    const cx = f2(x0), cy = f2(y0), r = f2(r0), dim = f2(d0);
    return (
    <g key={key}>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id("bead")})`} />
      {grain && <circle cx={cx} cy={cy} r={r} fill="#000" filter={wood} opacity={0.85} />}
      {dim > 0 && <circle cx={cx} cy={cy} r={r} fill="#0b0706" opacity={dim} />}
      <ellipse cx={cx - r * 0.32} cy={cy - r * 0.38} rx={r * 0.34} ry={r * 0.2} fill="#fff" opacity={0.16 - dim * 0.12} transform={`rotate(-30 ${f2(cx - r * 0.32)} ${f2(cy - r * 0.38)})`} />
    </g>
    );
  };

  // One filter pass over the whole strand: per-bead filters are ~40x the paint cost.
  const ringOfBeads = (n: number, rx: number, ry: number, r: number, cy = 200) => {
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + Math.PI / 2;
      return { x: 200 + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, depth: Math.sin(a) };
    }).sort((a, b) => a.depth - b.depth);
    const size = (d: number) => r * (0.86 + (d + 1) * 0.08);
    return (
      <g>
        {pts.map((p, i) => bead(p.x, p.y, size(p.depth), i, Math.max(0, -p.depth) * 0.35, false))}
        <g filter={wood} opacity={0.8}>
          {pts.map((p, i) => (
            <circle key={i} cx={f2(p.x)} cy={f2(p.y)} r={f2(size(p.depth))} fill="#000" />
          ))}
        </g>
      </g>
    );
  };

  let art: ReactNode = null;
  switch (kind) {
    case "mala":
      art = (
        <g>
          {ringOfBeads(40, 128, 104, 12, 186)}
          <path d="M200 296 C 196 318, 204 330, 200 346" stroke="#c9a46a" strokeWidth="1.5" fill="none" />
          {bead(200, 300, 15, "guru")}
          <g>
            {Array.from({ length: 13 }, (_, i) => (
              <path key={i} d={`M200 318 Q ${192 + i * 1.4} 350 ${186 + i * 2.3} 374`} stroke={i % 3 ? "#8e2b1e" : "#c9a46a"} strokeWidth="1.3" fill="none" opacity={0.9} />
            ))}
            <rect x="193" y="312" width="14" height="10" rx="3" fill="#c9a46a" />
          </g>
        </g>
      );
      break;
    case "bracelet":
      art = <g>{ringOfBeads(12, 108, 66, 27, 205)}</g>;
      break;
    case "bangle":
    case "ring": {
      const big = kind === "bangle";
      const rx = big ? 132 : 78;
      const ry = big ? 70 : 44;
      const w = big ? 36 : 22;
      art = (
        <g transform={big ? "" : "translate(0 10)"}>
          <path d={`M ${200 - rx} 205 A ${rx} ${ry} 0 0 1 ${200 + rx} 205`} stroke={`url(#${id("bandBack")})`} strokeWidth={w} fill="none" strokeLinecap="round" />
          <path d={`M ${200 - rx} 205 A ${rx} ${ry} 0 0 1 ${200 + rx} 205`} stroke="#000" strokeWidth={w} fill="none" filter={wood} opacity={0.9} />
          <path d={`M ${200 - rx} 205 A ${rx} ${ry} 0 0 1 ${200 + rx} 205`} stroke="#c9a46a" strokeWidth="1.2" fill="none" opacity={0.35} transform={`translate(0 ${w * 0.18})`} />
          <path d={`M ${200 - rx} 205 A ${rx} ${ry} 0 0 0 ${200 + rx} 205`} stroke={`url(#${id("band")})`} strokeWidth={w} fill="none" strokeLinecap="round" />
          <path d={`M ${200 - rx} 205 A ${rx} ${ry} 0 0 0 ${200 + rx} 205`} stroke="#000" strokeWidth={w} fill="none" filter={wood} opacity={0.9} />
          <path d={`M ${200 - rx} 205 A ${rx} ${ry} 0 0 0 ${200 + rx} 205`} stroke={`url(#${id("gold")})`} strokeWidth={big ? 2.2 : 1.6} fill="none" />
          <path d={`M ${200 - rx + 20} ${205 + ry * 0.45} A ${rx} ${ry} 0 0 0 ${200 + rx * 0.2} ${205 + ry + w * 0.2}`} stroke="#fff" strokeWidth={w * 0.18} fill="none" opacity={0.12} strokeLinecap="round" />
        </g>
      );
      break;
    }
    case "pendant":
      art = (
        <g>
          <path d="M120 20 C 150 120, 175 140, 196 112" stroke="#6e1d12" strokeWidth="4" fill="none" />
          <path d="M280 20 C 250 120, 225 140, 204 112" stroke="#6e1d12" strokeWidth="4" fill="none" />
          <circle cx="200" cy="112" r="8" fill="none" stroke="#c9a46a" strokeWidth="3" />
          {withWood(<>
            <circle cx="200" cy="222" r="98" fill={`url(#${id("bead")})`} />
          </>)}
          <g stroke={c.lo} strokeWidth="3" opacity={0.75}>
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return <line key={i} x1={f2(200 + Math.cos(a) * 36)} y1={f2(222 + Math.sin(a) * 36)} x2={f2(200 + Math.cos(a) * 82)} y2={f2(222 + Math.sin(a) * 82)} strokeLinecap="round" />;
            })}
          </g>
          <circle cx="200" cy="222" r="28" fill="none" stroke={c.lo} strokeWidth="3" opacity={0.8} />
          <circle cx="200" cy="222" r="90" fill="none" stroke="#c9a46a" strokeWidth="1" opacity={0.35} />
          <ellipse cx="160" cy="170" rx="40" ry="18" fill="#fff" opacity={0.08} transform="rotate(-35 160 170)" />
        </g>
      );
      break;
    case "earrings":
      art = (
        <g>
          {[140, 260].map((x, i) => (
            <g key={x} transform={`translate(0 ${i * 14})`}>
              <path d={`M ${x} 70 C ${x} 50, ${x + 26} 50, ${x + 22} 80 L ${x + 4} 118`} stroke={`url(#${id("gold")})`} strokeWidth="3" fill="none" />
              <circle cx={x + 4} cy={124} r="6" fill="#f3ece2" />
              {withWood(<>
                <path d={`M ${x + 4} 138 C ${x + 58} 210, ${x + 52} 300, ${x + 4} 304 C ${x - 44} 300, ${x - 50} 210, ${x + 4} 138 Z`} fill={`url(#${id("bead")})`} />
              </>)}
              <ellipse cx={x - 10} cy={220} rx="9" ry="36" fill="#fff" opacity={0.1} />
            </g>
          ))}
        </g>
      );
      break;
    case "cufflinks":
      art = (
        <g>
          {[
            [145, 190],
            [262, 228],
          ].map(([x, y]) => (
            <g key={x}>
              <rect x={x - 8} y={y + 40} width="16" height="46" rx="6" fill="#8c8a86" />
              <rect x={x - 26} y={y + 82} width="52" height="14" rx="7" fill={`url(#${id("silver")})`} />
              <circle cx={x} cy={y} r="60" fill={`url(#${id("silver")})`} />
              {withWood(<>
                <circle cx={x} cy={y} r="48" fill={`url(#${id("bead")})`} />
              </>)}
              <circle cx={x} cy={y} r="54" fill="none" stroke="#5b5955" strokeDasharray="2 4" strokeWidth="2" />
            </g>
          ))}
        </g>
      );
      break;
    case "comb":
      art = (
        <g transform="rotate(-8 200 200)">
          {withWood(<>
            <path d="M70 150 Q 200 110 330 150 L 330 196 L 70 196 Z" fill={`url(#${id("slab")})`} />
            {Array.from({ length: 26 }, (_, i) => (
              <rect key={i} x={76 + i * 9.8} y="190" width="6" height={110 - Math.abs(i - 12.5) * 1.2} rx="3" fill={`url(#${id("slab")})`} />
            ))}
          </>)}
          <path d="M84 160 Q 200 126 316 160" stroke="#c9a46a" strokeWidth="1.2" fill="none" opacity={0.5} />
        </g>
      );
      break;
    case "box":
      art = (
        <g>
          {withWood(<>
            <polygon points="200,112 330,168 200,224 70,168" fill={`url(#${id("top")})`} />
            <polygon points="70,168 200,224 200,330 70,274" fill={`url(#${id("slab")})`} />
            <polygon points="200,224 330,168 330,274 200,330" fill={c.lo} />
          </>)}
          <polyline points="70,190 200,246 330,190" stroke="#0b0706" strokeWidth="2" fill="none" opacity={0.7} />
          <rect x="190" y="240" width="20" height="16" rx="2" fill={`url(#${id("gold")})`} transform="skewY(23) translate(0 -86)" />
          <polygon points="200,112 330,168 200,224 70,168" fill="none" stroke="#c9a46a" strokeWidth="1" opacity={0.35} />
        </g>
      );
      break;
    case "powder":
      art = (
        <g>
          <ellipse cx="200" cy="262" rx="150" ry="44" fill="#1a1210" />
          <path d="M50 262 Q 60 330 200 336 Q 340 330 350 262" fill="#241917" />
          <path d="M60 256 C 110 150, 160 128, 200 126 C 240 128, 290 150, 340 256 Z" fill={`url(#${id("powder")})`} />
          <path d="M60 256 C 110 150, 160 128, 200 126 C 240 128, 290 150, 340 256 Z" fill="#000" filter={`url(#${id("dust")})`} opacity={0.6} />
          <ellipse cx="200" cy="258" rx="140" ry="16" fill="#6e1d12" opacity={0.6} />
          <ellipse cx="170" cy="160" rx="30" ry="12" fill="#fff" opacity={0.08} />
        </g>
      );
      break;
    case "incense":
      art = (
        <g>
          <path d="M226 40 C 200 70, 250 90, 222 120 S 240 160, 228 176" stroke="#efe6d8" strokeWidth="1.5" fill="none" opacity={0.25}>
            <animate attributeName="d" dur="6s" repeatCount="indefinite" values="M226 40 C 200 70, 250 90, 222 120 S 240 160, 228 176;M220 40 C 250 70, 196 94, 230 122 S 216 160, 228 176;M226 40 C 200 70, 250 90, 222 120 S 240 160, 228 176" />
          </path>
          <line x1="228" y1="176" x2="200" y2="262" stroke="#4a2a1c" strokeWidth="3" />
          <circle cx="228" cy="176" r="2.5" fill="#ff8a4c" />
          {withWood(<>
            <polygon points="80,300 320,300 300,276 100,276" fill={`url(#${id("slab")})`} />
            <polygon points="110,276 290,276 272,254 128,254" fill={`url(#${id("top")})`} />
            <polygon points="140,254 260,254 246,236 154,236" fill={`url(#${id("slab")})`} />
          </>)}
          <ellipse cx="200" cy="238" rx="14" ry="5" fill={`url(#${id("gold")})`} />
        </g>
      );
      break;
    case "brooch":
      art = (
        <g>
          {withWood(<>
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse key={i} cx="200" cy="140" rx="34" ry="72" fill={`url(#${id("bead")})`} transform={`rotate(${i * 45} 200 205)`} />
            ))}
          </>)}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="200" y1="150" x2="200" y2="96" stroke={c.lo} strokeWidth="2" opacity={0.6} transform={`rotate(${i * 45} 200 205)`} />
          ))}
          <circle cx="200" cy="205" r="30" fill={`url(#${id("gold")})`} />
          <circle cx="200" cy="205" r="30" fill="#000" filter={wood} opacity={0.3} />
        </g>
      );
      break;
  }

  return (
    <div className={cn("relative overflow-hidden", className)} aria-label={label} role={label ? "img" : undefined}>
      {glow && (
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(60% 55% at 50% 48%, ${c.mid}55 0%, transparent 70%)` }}
        />
      )}
      <svg viewBox="0 0 400 400" className="relative h-full w-full" aria-hidden>
        <defs>
          <filter id={id("wood")} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.11" numOctaves="4" seed={seed} result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.05  0 0 0 0 0.01  0 0 0 0 0.01  2.4 0 0 0 -1.05" result="grain" />
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed={seed + 7} result="f" />
            <feColorMatrix in="f" type="matrix" values="0 0 0 0 0.93  0 0 0 0 0.76  0 0 0 0 0.42  16 0 0 0 -11.1" result="flecks" />
            <feMerge result="m">
              <feMergeNode in="grain" />
              <feMergeNode in="flecks" />
            </feMerge>
            <feComposite in="m" in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={id("dust")}>
            <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed={seed} />
            <feColorMatrix type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.02  0 0 0 0 0.02  3 0 0 0 -1.4" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
          <filter id={id("shadow")}>
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <radialGradient id={id("bead")} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor={c.hi} />
            <stop offset="55%" stopColor={c.mid} />
            <stop offset="100%" stopColor={c.lo} />
          </radialGradient>
          <linearGradient id={id("band")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.lo} />
            <stop offset="45%" stopColor={c.hi} />
            <stop offset="100%" stopColor={c.lo} />
          </linearGradient>
          <linearGradient id={id("bandBack")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.mid} />
            <stop offset="100%" stopColor="#0b0706" />
          </linearGradient>
          <linearGradient id={id("slab")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c.hi} />
            <stop offset="100%" stopColor={c.lo} />
          </linearGradient>
          <linearGradient id={id("top")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.mid} />
            <stop offset="50%" stopColor={c.hi} />
            <stop offset="100%" stopColor={c.mid} />
          </linearGradient>
          <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f3dcae" />
            <stop offset="45%" stopColor="#c9a46a" />
            <stop offset="100%" stopColor="#7a5a2a" />
          </linearGradient>
          <linearGradient id={id("silver")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f2f0ec" />
            <stop offset="50%" stopColor="#a9a6a0" />
            <stop offset="100%" stopColor="#56544f" />
          </linearGradient>
          <radialGradient id={id("powder")} cx="50%" cy="10%" r="90%">
            <stop offset="0%" stopColor="#d65c3a" />
            <stop offset="60%" stopColor="#9e2f1f" />
            <stop offset="100%" stopColor="#4a120b" />
          </radialGradient>
        </defs>
        <ellipse cx="200" cy="352" rx="120" ry="14" fill="#000" opacity={0.55} filter={`url(#${id("shadow")})`} />
        {art}
      </svg>
    </div>
  );
}
