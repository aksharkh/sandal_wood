import { cn } from "@/lib/utils";

/** Compact mark for tight spaces (admin, favicon-scale). */
export function Monogram({ className }: { className?: string }) {
  return (
    <span className={cn("font-wide inline-grid h-8 w-8 place-items-center bg-vermilion text-[15px] font-semibold leading-none text-white", className)} aria-hidden>
      S
    </span>
  );
}

export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex flex-col items-center leading-none", className)}>
      <span className="font-wide text-[19px] font-semibold tracking-[0.14em] md:text-[22px]">SANTALUM</span>
      {!compact && <span className="mt-1.5 text-[8.5px] font-medium tracking-[0.5em] opacity-70">MAISON · 印度</span>}
    </span>
  );
}
