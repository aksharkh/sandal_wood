import { cn } from "@/lib/utils";

/** Compact mark: a single bead — a circle with the seed-line of the heartwood. */
export function Monogram({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-grid h-8 w-8 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#c86b4a,#7a2c1c_60%,#2a130d)] font-display text-[14px] font-light leading-none text-white", className)}
      aria-hidden
    >
      S
    </span>
  );
}

export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5 leading-none", className)}>
      <span className="relative h-[18px] w-[18px] shrink-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#e59a74,#9f3f2a_55%,#2a130d)]" aria-hidden />
      <span className="flex flex-col">
        <span className="font-display text-[15px] font-normal tracking-[0.34em] md:text-[16px]">SANTALUM</span>
        {!compact && <span className="mt-1 text-[8px] font-medium tracking-[0.46em] opacity-60">MAISON · 印度</span>}
      </span>
    </span>
  );
}
