"use client";

import { motion } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { EASE } from "../motion/primitives";

/** Single-series area chart with crosshair + tooltip. Title names the series, so no legend. */
export function AreaChart({
  data,
  format,
  height = 260,
  color = "#d9573a",
}: {
  data: { label: string; value: number }[];
  format: (n: number) => string;
  height?: number;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const W = 800;
  const H = height;
  const pad = { t: 16, r: 8, b: 28, l: 8 };
  const max = Math.max(1, ...data.map((d) => d.value)) * 1.12;
  const x = (i: number) => pad.l + (i / Math.max(1, data.length - 1)) * (W - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b);
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${H - pad.b} L${x(0).toFixed(1)},${H - pad.b} Z`;
  const ticks = [0.25, 0.5, 0.75, 1].map((f) => max * f);
  const labelEvery = Math.ceil(data.length / 7);

  return (
    <div
      ref={ref}
      className="relative"
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        const rel = ((e.clientX - r.left) / r.width) * W;
        const i = Math.round(((rel - pad.l) / (W - pad.l - pad.r)) * (data.length - 1));
        setHover(Math.max(0, Math.min(data.length - 1, i)));
      }}
      onPointerLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <line key={t} x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="rgba(239,230,216,.06)" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
        ))}
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="rgba(239,230,216,.12)" vectorEffect="non-scaling-stroke" />
        <motion.path d={area} fill="url(#area-fill)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} />
        <motion.path d={line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, ease: EASE }} />
        {hover !== null && (
          <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="rgba(239,230,216,.25)" vectorEffect="non-scaling-stroke" />
        )}
      </svg>
      {/* HTML overlays keep text crisp regardless of the stretched SVG */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between px-1 text-[10px] text-bone/35">
        {data.map((d, i) => (i % labelEvery === 0 || i === data.length - 1 ? <span key={i}>{d.label}</span> : null))}
      </div>
      <div className="pointer-events-none absolute left-1 top-0 text-[10px] text-bone/30">{format(max)}</div>
      {hover !== null && (
        <>
          <span
            className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#140c0a]"
            style={{ left: `${(x(hover) / W) * 100}%`, top: y(data[hover].value), background: color }}
          />
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl border border-bone/10 bg-[#1b1210]/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
            style={{ left: `${Math.min(88, Math.max(12, (x(hover) / W) * 100))}%`, top: y(data[hover].value) - 12 }}
          >
            <p className="text-bone/50">{data[hover].label}</p>
            <p className="mt-0.5 font-medium text-bone">{format(data[hover].value)}</p>
          </div>
        </>
      )}
    </div>
  );
}

/** Horizontal bars, direct-labelled (identity never by colour alone). */
export function BarList({
  items,
  format,
  colorFor,
}: {
  items: { label: string; value: number; sub?: string; key?: string }[];
  format: (n: number) => string;
  colorFor?: (label: string) => string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  const [hover, setHover] = useState<number | null>(null);
  return (
    <ul className="space-y-3.5">
      {items.map((it, i) => (
        <li key={it.key ?? it.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="group relative">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-bone/80">{it.label}</span>
            <span className="shrink-0 tabular-nums text-bone/60">{format(it.value)}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-bone/[0.05]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(it.value / max) * 100}%` }}
              transition={{ duration: 1.1, ease: EASE, delay: i * 0.05 }}
              className="h-full rounded-full"
              style={{ background: colorFor?.(it.label) ?? "#d9573a", opacity: hover === null || hover === i ? 1 : 0.45 }}
            />
          </div>
          {it.sub && <p className="mt-1 text-[11px] text-bone/35">{it.sub}</p>}
        </li>
      ))}
    </ul>
  );
}

export function Sparkline({ values, color = "#d9573a" }: { values: number[]; color?: string }) {
  const d = useMemo(() => {
    const max = Math.max(1, ...values);
    const min = Math.min(...values);
    return values
      .map((v, i) => `${i ? "L" : "M"}${((i / Math.max(1, values.length - 1)) * 100).toFixed(1)},${(28 - ((v - min) / Math.max(1, max - min)) * 24).toFixed(1)}`)
      .join(" ");
  }, [values]);
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-24" preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

/** Region share as a single segmented bar with a labelled legend below. */
export function SegmentBar({ parts, format }: { parts: { label: string; value: number; color: string }[]; format: (n: number) => string }) {
  const total = Math.max(1, parts.reduce((s, p) => s + p.value, 0));
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div>
      <div className="flex h-3 gap-[2px] overflow-hidden rounded-full">
        {parts.map((p) => (
          <motion.div
            key={p.label}
            onMouseEnter={() => setHover(p.label)}
            onMouseLeave={() => setHover(null)}
            initial={{ width: 0 }}
            animate={{ width: `${(p.value / total) * 100}%` }}
            transition={{ duration: 1.2, ease: EASE }}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ background: p.color, opacity: hover && hover !== p.label ? 0.4 : 1 }}
            title={`${p.label}: ${format(p.value)}`}
          />
        ))}
      </div>
      <ul className="mt-5 space-y-2.5">
        {parts.map((p) => (
          <li key={p.label} className="flex items-center justify-between text-sm" onMouseEnter={() => setHover(p.label)} onMouseLeave={() => setHover(null)}>
            <span className="flex items-center gap-2 text-bone/75">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} /> {p.label}
            </span>
            <span className="tabular-nums text-bone/60">
              {format(p.value)} <span className="ml-2 text-bone/35">{Math.round((p.value / total) * 100)}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
