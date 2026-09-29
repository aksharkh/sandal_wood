import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <p className="font-mono text-xs tracking-[0.4em] text-gold">404 · 未找到</p>
      <h1 className="mt-6 font-display text-6xl font-light md:text-8xl">Lost in the grain.</h1>
      <p className="mt-4 max-w-md text-bone/55">The page you were looking for has moved, or never existed.</p>
      <Link href="/" className="mt-10 rounded-full bg-santal px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-bone hover:bg-ember">
        Return home
      </Link>
    </div>
  );
}
