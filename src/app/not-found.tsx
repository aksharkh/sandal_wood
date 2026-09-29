import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-6 text-center text-ink">
      <div className="arch grid h-56 w-44 place-items-center bg-maroon font-display text-6xl italic text-cream">404</div>
      <h1 className="mt-10 font-display text-6xl md:text-7xl">
        Lost in the <em className="text-clay">grain</em>
      </h1>
      <p className="mt-4 max-w-md text-graphite">The page you were looking for has moved, or never existed. 页面未找到。</p>
      <Link href="/" className="mt-10 rounded-full bg-clay px-8 py-4 text-[14px] text-cream transition-colors hover:bg-clay-deep">
        Return home
      </Link>
    </div>
  );
}
