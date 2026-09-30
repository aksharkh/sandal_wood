import { cn } from "@/lib/utils";

/** The seal: a persimmon disc, like a chop mark at the end of a scroll. */
export function Monogram({ className }: { className?: string }) {
  return (
    <span className={cn("inline-grid h-9 w-9 place-items-center rounded-full bg-vermilion font-display text-[17px] font-bold leading-none text-cream", className)} aria-hidden>
      S
    </span>
  );
}

export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5 leading-none", className)}>
      <Monogram className="h-7 w-7 text-[14px]" />
      <span className="font-display text-[20px] font-bold normal-case tracking-[-0.03em]">Santalum</span>
      {!compact && <span className="cap hidden opacity-60 sm:inline">Maison</span>}
    </span>
  );
}
