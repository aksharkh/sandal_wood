import { cn } from "@/lib/utils";

/** Compact mark for tight spaces (admin, favicon-scale). */
export function Monogram({ className }: { className?: string }) {
  return (
    <span className={cn("inline-grid h-8 w-8 place-items-center rounded-full border border-current font-display text-[15px] leading-none", className)} aria-hidden>
      S
    </span>
  );
}

export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex flex-col items-center leading-none", className)}>
      <span className="font-display text-[22px] tracking-[0.24em] text-current md:text-[24px]">SANTALUM</span>
      {!compact && <span className="mt-1 text-[9px] font-medium tracking-[0.42em] text-current opacity-70">MAISON · 印度</span>}
    </span>
  );
}
