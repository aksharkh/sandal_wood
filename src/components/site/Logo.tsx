import { cn } from "@/lib/utils";

/** Heartwood cross-section: offset growth rings around a single ember core. */
export function Monogram({ className, animate = false }: { className?: string; animate?: boolean }) {
  const rings = [30, 24, 18.5, 13, 8];
  return (
    <svg viewBox="0 0 64 64" className={cn("h-8 w-8", className)} aria-hidden>
      {rings.map((r, i) => (
        <circle
          key={r}
          cx={32 + i * 0.9}
          cy={32 - i * 0.5}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={i === 0 ? 1.4 : 0.9}
          opacity={1 - i * 0.14}
          pathLength={1}
          strokeDasharray={animate ? 1 : undefined}
          strokeDashoffset={animate ? 1 : undefined}
          style={animate ? { animation: `sm-draw 1.6s ${0.15 * i}s cubic-bezier(.65,0,.35,1) forwards` } : undefined}
        />
      ))}
      <circle cx="36" cy="30" r="3.2" fill="#c8553a" />
      <style>{`@keyframes sm-draw{to{stroke-dashoffset:0}}`}</style>
    </svg>
  );
}

export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Monogram className="h-8 w-8 text-gold" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[19px] font-medium tracking-[0.34em] text-bone">SANTALUM</span>
        {!compact && <span className="mt-1 text-[8.5px] font-medium tracking-[0.62em] text-gold/80">MAISON · 印度紫檀</span>}
      </span>
    </span>
  );
}
