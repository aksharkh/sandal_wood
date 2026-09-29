"use client";

import { useEffect, useRef } from "react";

/**
 * A bracelet of heartwood beads orbiting in pseudo-3D, with drifting embers.
 * Canvas (not SVG filters) so it holds 60fps on mid-range phones.
 */
export function HeroOrbit({ className, beads = 18 }: { className?: string; beads?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0,
      h = 0,
      dpr = 1;

    const grain = document.createElement("canvas");
    grain.width = grain.height = 512;
    const g = grain.getContext("2d")!;
    for (let i = 0; i < 520; i++) {
      const y0 = Math.random() * 512;
      g.beginPath();
      g.moveTo(0, y0);
      const amp = 2 + Math.random() * 7;
      const freq = 0.006 + Math.random() * 0.02;
      for (let x = 0; x <= 512; x += 8) g.lineTo(x, y0 + Math.sin(x * freq + i) * amp);
      g.strokeStyle = `rgba(${20 + Math.random() * 30},4,2,${0.05 + Math.random() * 0.22})`;
      g.lineWidth = 0.4 + Math.random() * 1.8;
      g.stroke();
    }
    for (let i = 0; i < 420; i++) {
      g.beginPath();
      g.arc(Math.random() * 512, Math.random() * 512, 0.3 + Math.random() * 0.9, 0, Math.PI * 2);
      g.fillStyle = `rgba(245,${200 + Math.random() * 30},140,${0.35 + Math.random() * 0.55})`;
      g.fill();
    }

    const embers = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      v: 0.00008 + Math.random() * 0.00028,
      s: 0.4 + Math.random() * 1.6,
      p: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.6,
    }));

    let mx = 0,
      my = 0,
      tmx = 0,
      tmy = 0;
    const onMove = (e: PointerEvent) => {
      tmx = e.clientX / window.innerWidth - 0.5;
      tmy = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const drawBead = (x: number, y: number, r: number, dim: number, i: number, spin: number) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();
      const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.42, r * 0.05, x, y, r * 1.08);
      grad.addColorStop(0, "#d4674a");
      grad.addColorStop(0.45, "#8a2718");
      grad.addColorStop(1, "#1c0705");
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      // grain slides across the bead as it turns
      const src = 160;
      const ox = ((spin * 60 + i * 37) % (512 - src) + (512 - src)) % (512 - src);
      ctx.globalAlpha = 0.95;
      ctx.drawImage(grain, ox, (i * 53) % (512 - src), src, src, x - r, y - r, r * 2, r * 2);
      ctx.globalAlpha = 1;
      if (dim > 0) {
        ctx.fillStyle = `rgba(11,7,6,${dim})`;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      const hl = ctx.createRadialGradient(x - r * 0.38, y - r * 0.45, 0, x - r * 0.38, y - r * 0.45, r * 0.55);
      hl.addColorStop(0, `rgba(255,236,220,${0.28 - dim * 0.25})`);
      hl.addColorStop(1, "rgba(255,236,220,0)");
      ctx.fillStyle = hl;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
      ctx.restore();
    };

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        last = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);

    let theta = 0;
    let last = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      if (!reduced) theta += dt * 0.00018;
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w * (w > 900 ? 0.6 : 0.5) + mx * 30;
      const cy = h * 0.4 + my * 20;
      const R = Math.min(w * 0.8, h) * 0.27;
      const tilt = 0.3 + my * 0.25;
      const roll = -0.18 + mx * 0.25;
      const br = R * 0.235;

      // glow
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.9);
      glow.addColorStop(0, "rgba(158,47,31,0.30)");
      glow.addColorStop(0.5, "rgba(58,15,11,0.18)");
      glow.addColorStop(1, "rgba(11,7,6,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // floor shadow
      ctx.save();
      ctx.translate(cx, cy + R * 1.25);
      ctx.scale(1, 0.14);
      const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.2);
      sh.addColorStop(0, "rgba(0,0,0,0.55)");
      sh.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const pts = Array.from({ length: beads }, (_, i) => {
        const a = theta + (i / beads) * Math.PI * 2;
        const x0 = Math.cos(a) * R;
        const z = Math.sin(a);
        const y0 = z * R * tilt;
        const x = cx + x0 * Math.cos(roll) - y0 * Math.sin(roll);
        const y = cy + x0 * Math.sin(roll) + y0 * Math.cos(roll);
        return { x, y, z, i };
      }).sort((a, b) => a.z - b.z);

      for (const p of pts) {
        const s = 1 + p.z * 0.16;
        drawBead(p.x, p.y, br * s, Math.max(0, (0.5 - (p.z + 1) / 2) * 0.9), p.i, theta * 8 + p.i);
      }

      // embers
      ctx.globalCompositeOperation = "lighter";
      for (const e of embers) {
        if (!reduced) e.y -= e.v * dt;
        if (e.y < -0.02) {
          e.y = 1.02;
          e.x = Math.random();
        }
        const flick = 0.35 + Math.sin(now * 0.002 + e.p) * 0.25;
        ctx.beginPath();
        ctx.arc(e.x * w + Math.sin(now * 0.0006 + e.p) * 12, e.y * h, e.s, 0, Math.PI * 2);
        ctx.fillStyle = e.gold ? `rgba(233,196,130,${flick})` : `rgba(214,96,64,${flick})`;
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      if (visible) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [beads]);

  return <canvas ref={ref} className={className} aria-hidden />;
}
