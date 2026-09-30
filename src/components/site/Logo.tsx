import { cn } from "@/lib/utils";

/** Compact mark for tight spaces (admin, favicon-scale). */
export function Monogram({ className }: { className?: string }) {
  return (
    <span className={cn("inline-grid h-8 w-8 place-items-center rounded-full bg-forest font-display text-[17px] italic leading-none text-cream", className)} aria-hidden>
      S
    </span>
  );
}

export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-baseline gap-2 leading-none", className)}>
      <span className="font-display text-[24px] normal-case tracking-[-0.02em] md:text-[26px]">Santalum</span>
      {!compact && <span className="cap hidden opacity-70 sm:inline">Maison · 印度</span>}
    </span>
  );
}
