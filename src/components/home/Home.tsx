"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useInView, useMotionValue, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMaison, usePlacement, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { JOURNAL } from "@/lib/data/journal";
import { regionFromCurrency } from "@/lib/cart";
import { ProductCard } from "../shop/ProductCard";
import { QrMark } from "../site/Footer";
import { HeroScene, StoryScene } from "../three/Lazy";
import { Button, EASE, Heading, Label, Parallax, Photo, Reveal, ScrollWords, Section, TextLink, Tilt } from "../motion/primitives";
import { cn, fmtDate } from "@/lib/utils";

/** Light sheet that slides up over a night section. */
const SHEET = "relative z-10 -mt-10 rounded-t-[40px] md:-mt-14 md:rounded-t-[56px]";

/* 01 — Hero: a red-sandalwood bracelet in real-time 3D */
export function Hero() {
  const { t, l, zh } = useT();
  const content = useMaison((s) => s.content);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "0px 0px 0px 0px" });

  return (
    <section ref={ref} data-nav="dark" className="grain night-glow relative h-[100svh] min-h-[680px] overflow-hidden text-cream">
      {/* soft halo behind the object */}
      <div aria-hidden className="absolute left-1/2 top-[42%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(229,154,116,.28),transparent_65%)] blur-2xl lg:left-[66%]" />
      <div className="absolute inset-0 bottom-[30%] lg:bottom-0 lg:left-[34%]">
        <HeroScene active={inView} />
      </div>

      <div className="pointer-events-none relative mx-auto flex h-full max-w-[1760px] flex-col justify-end px-5 pb-20 md:px-10 md:pb-24">
        <p style={{ animationDelay: "0.2s" }} className="rise mb-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-rose">
          Pterocarpus santalinus · 小叶紫檀
        </p>
        <h1 style={{ animationDelay: "0.1s" }} className="rise max-w-[11ch] font-display text-[clamp(3.4rem,9vw,10rem)] font-extralight leading-[0.9] tracking-[-0.045em]">
          {zh ? (
            <>
              小叶紫檀，
              <br />
              <span className="bg-gradient-to-r from-[#f3c3a8] via-[#e59a74] to-[#b5523b] bg-clip-text text-transparent">来自印度。</span>
            </>
          ) : (
            <>
              Red sandalwood,{" "}
              <span className="bg-gradient-to-r from-[#f3c3a8] via-[#e59a74] to-[#c0614a] bg-clip-text text-transparent">from India.</span>
            </>
          )}
        </h1>
        <div style={{ animationDelay: "0.4s" }} className="rise pointer-events-auto mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Button href="/collections" variant="light" size="lg" arrow>
              {t("cta.shop")}
            </Button>
            <Button href="/material" variant="ghost-light" size="lg">
              {t("cta.material")}
            </Button>
          </div>
          <div className="glass-dark max-w-sm rounded-[24px] p-5">
            <p className="text-[13px] leading-relaxed text-cream/80">{l(content.heroSub)}</p>
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose">
              <span>1.18 g/cm³</span>
              <span>{zh ? "沉于水" : "Sinks in water"}</span>
              <span>CITES</span>
            </div>
          </div>
        </div>
      </div>

      {/* floating annotations around the object */}
      <div aria-hidden className="pointer-events-none absolute right-[6%] top-[24%] hidden lg:block">
        <div className="float-y glass-dark flex items-center gap-3 rounded-full py-2 pl-2 pr-5 text-[12px] text-cream/90">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-cream/10 text-[10px]">01</span>
          {zh ? "蒂鲁帕蒂手工车制" : "Hand-turned in Tirupati"}
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute left-[58%] top-[70%] hidden xl:block">
        <div className="float-y glass-dark flex items-center gap-3 rounded-full py-2 pl-2 pr-5 text-[12px] text-cream/90 [animation-delay:1.8s]">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-cream/10 text-[10px]">02</span>
          {zh ? "金星 · 牛毛纹" : "Gold star, cow-hair grain"}
        </div>
      </div>
    </section>
  );
}

/* 02 — Material introduction: words brighten as you read */
export function Intro() {
  const { zh } = useT();
  const facts = [
    { v: "1.18", u: "g/cm³", d: zh ? "平均密度——沉于水" : "Average density. It sinks in water." },
    { v: "30+", u: zh ? "年" : "years", d: zh ? "形成可用心材所需" : "For a tree to form workable heartwood." },
    { v: "1", u: zh ? "产区" : "region", d: zh ? "南印度东高止山脉" : "On earth: the Eastern Ghats, South India." },
    { v: "108", u: zh ? "颗" : "beads", d: zh ? "一串念珠，逐颗手工车制" : "In a mala, each turned by hand." },
  ];
  return (
    <section className={cn(SHEET, "blush-glow py-28 md:py-40")}>
      <div className="mx-auto max-w-[1560px] px-5 md:px-10">
        <Label>{zh ? "材质" : "The material"}</Label>
        <ScrollWords
          className="mt-10 max-w-[1300px] font-display text-[clamp(2rem,4.4vw,4.6rem)] font-light leading-[1.08] tracking-[-0.03em]"
          text={
            zh
              ? "有些材料是被挑选的。 小叶紫檀却需要等待—— 在土里数十年， 在工坊里数月， 在腕上一生。"
              : "Some materials are chosen. Red sandalwood is earned — decades in the ground, months in the atelier, and a lifetime on the wrist."
          }
        />
        <div className="mt-20 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Tilt className="h-full rounded-[28px]">
                <div className="h-full rounded-[28px] border border-white/70 bg-paper/70 p-6 shadow-[0_30px_60px_-40px_rgba(90,30,20,.35)] backdrop-blur md:p-8">
                  <p className="font-display text-[clamp(2.6rem,4.4vw,4.4rem)] font-extralight leading-none tracking-[-0.05em]">
                    {f.v}
                    <span className="ml-2 align-top font-sans text-[12px] tracking-normal text-muted">{f.u}</span>
                  </p>
                  <p className="mt-6 max-w-[220px] text-[13px] leading-snug text-graphite">{f.d}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 03 — The 108: beads assemble in 3D as you scroll */
const STAGES = [
  { k: { en: "Raw", zh: "原料" }, t: { en: "Heartwood, as it arrives", zh: "心材，初到工坊" }, d: { en: "Government-auctioned billets from the Seshachalam Hills — weighed, sounded and split. Four in ten are refused.", zh: "来自塞沙查拉姆山的政府拍卖木料——称重、敲击、剖开。四成被淘汰。" } },
  { k: { en: "Turned", zh: "车制" }, t: { en: "Every bead turned by hand", zh: "每一颗，手工车制" }, d: { en: "Three generations of craftsmen in Tirupati. Seven grades of abrasive, beeswax and the palm. Never lacquered.", zh: "蒂鲁帕蒂三代匠人。七道砂磨，蜂蜡与手掌养护。从不上漆。" } },
  { k: { en: "Counted", zh: "成串" }, t: { en: "One hundred and eight", zh: "一百零八" }, d: { en: "The number of the japa mala, sacred in Hindu and Buddhist practice alike — India and China, on one strand.", zh: "念珠之数，印度教与佛教共同尊崇——印度与中国，同在一串。" } },
  { k: { en: "Worn", zh: "佩戴" }, t: { en: "Three turns, a lifetime", zh: "绕腕三圈，相伴一生" }, d: { en: "Oil from the hand darkens the wood toward violet. The patina is yours alone.", zh: "手上的油脂让木色渐转紫黑。那层包浆，只属于您。" } },
];
export function Story() {
  const { l, zh } = useT();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const inView = useInView(ref, { margin: "200px 0px" });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section ref={ref} data-nav="dark" className="relative h-[420vh] bg-night text-cream">
      <div className="grain night-glow sticky top-0 h-[100svh] overflow-hidden">
        <div className="absolute inset-0 lg:left-[30%]">
          <StoryScene progress={scrollYProgress} active={inView} />
        </div>
        <div className="pointer-events-none relative mx-auto flex h-full max-w-[1760px] flex-col justify-between px-5 pb-10 pt-32 md:px-10 md:pb-14">
          <div className="flex items-center justify-between">
            <Label className="text-rose">{zh ? "一百零八颗的旅程" : "The journey of 108"}</Label>
            <div className="h-px w-40 overflow-hidden rounded-full bg-white/15 md:w-64">
              <motion.div style={{ width: bar }} className="h-full bg-gradient-to-r from-[#e59a74] to-[#f3c3a8]" />
            </div>
          </div>
          <div className="relative h-[46vh] max-w-xl">
            {STAGES.map((s, i) => (
              <StageText key={i} i={i} progress={scrollYProgress}>
                <p className="font-mono text-[12px] text-rose">
                  0{i + 1} / 04 — {l(s.k)}
                </p>
                <h2 className="mt-5 font-display text-[clamp(2.6rem,5.6vw,5.8rem)] font-extralight leading-[0.95] tracking-[-0.04em]">{l(s.t)}</h2>
                <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/75">{l(s.d)}</p>
              </StageText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function StageText({ i, progress, children }: { i: number; progress: MotionValue<number>; children: React.ReactNode }) {
  const c = (i + 0.5) / 4;
  const w = 0.125;
  const first = i === 0, last = i === 3;
  // computed in JS (not a native scroll timeline) so opacity, drift and blur always agree
  // one stage at a time: each fades out fully before the next fades in
  const inOut = (p: number) => {
    const a = (p - (c - w + 0.01)) / 0.05; // fade in
    const b = (c + w - 0.01 - p) / 0.05; // fade out
    return Math.min(1, Math.max(0, first ? 1 : a), Math.max(0, last ? 1 : b));
  };
  const opacity = useTransform(progress, inOut);
  const y = useTransform(progress, (p) => (1 - inOut(p)) * (p < c ? 50 : -50));
  const filter = useTransform(progress, (p) => `blur(${(1 - inOut(p)) * 10}px)`);
  return (
    <motion.div style={{ opacity, y, filter }} className="absolute inset-x-0 bottom-0">
      {children}
    </motion.div>
  );
}

/* 04 — Collections: a 3D carousel of objects */
export function Collections() {
  const { l, m, zh } = useT();
  const products = useMaison((s) => s.products);
  const items = products.filter((p) => p.status === "active" && p.images?.length).slice(0, 12);
  const n = items.length || 1;
  const rot = useMotionValue(0);
  const vel = useRef(0.045);
  const drag = useRef<{ x: number; r: number } | null>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const moved = useRef(false);

  useAnimationFrame((_, dt) => {
    if (!drag.current) {
      vel.current += (0.045 - vel.current) * 0.02;
      rot.set(rot.get() - vel.current * (dt / 16));
    }
    const r = rot.get();
    cards.current.forEach((el, i) => {
      if (!el) return;
      const a = (((i * 360) / n + r) * Math.PI) / 180;
      const depth = (Math.cos(a) + 1) / 2; // 1 = front
      el.style.opacity = String(0.25 + depth * 0.75);
      el.style.filter = `brightness(${0.55 + depth * 0.45})`;
      el.style.zIndex = String(Math.round(depth * 100));
    });
  });
  const ringRotate = useTransform(rot, (r) => `rotateX(-6deg) rotateY(${r}deg)`);

  return (
    <section className={cn(SHEET, "overflow-hidden bg-page pb-24 pt-28 md:pb-32 md:pt-36")}>
      <div className="mx-auto flex max-w-[1560px] flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <Label>{zh ? "系列" : "The collections"}</Label>
          <Heading className="mt-5 max-w-3xl text-[clamp(2.6rem,5vw,5.4rem)]">{zh ? "为一生而作的器物" : "Objects made for a lifetime"}</Heading>
        </div>
        <p className="max-w-sm text-[15px] leading-relaxed text-graphite">{zh ? "拖动旋转。每件作品都附有其木料批次的溯源档案。" : "Drag to turn. Every object ships with the provenance record of its batch."}</p>
      </div>

      <div
        className="relative mt-10 h-[min(78vh,720px)] cursor-grab touch-pan-y select-none [perspective:1800px] active:cursor-grabbing"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, r: rot.get() };
          moved.current = false;
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) moved.current = true;
          const next = drag.current.r + dx * 0.18;
          vel.current = (rot.get() - next) * 0.6;
          rot.set(next);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        <motion.div style={{ transform: ringRotate, transformStyle: "preserve-3d" }} className="absolute left-1/2 top-1/2 h-0 w-0">
          {items.map((p, i) => (
            <Link
              key={p.id}
              ref={(el) => {
                cards.current[i] = el;
              }}
              href={`/product/${p.slug}`}
              draggable={false}
              onClick={(e) => moved.current && e.preventDefault()}
              className="group absolute left-0 top-0 block w-[clamp(170px,19vw,300px)] [--r:clamp(330px,40vw,640px)]"
              style={{ transform: `translate(-50%,-50%) rotateY(${(i * 360) / n}deg) translateZ(var(--r))` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] bg-sand shadow-[0_40px_80px_-40px_rgba(60,20,10,.55)]">
                <Image src={p.images![0]} alt={p.name.en} fill sizes="300px" draggable={false} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-2 bottom-2 flex items-center justify-between rounded-full bg-paper/80 px-4 py-2 text-[12px] backdrop-blur">
                  <span className="truncate font-medium">{l(p.name)}</span>
                  <span className="shrink-0 pl-2 tabular-nums text-muted">{m(p.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mt-6 flex max-w-[1560px] flex-wrap justify-center gap-2 px-5 md:px-10">
        {COLLECTIONS.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="group flex items-center gap-3 rounded-full border border-ink/15 py-1.5 pl-1.5 pr-5 text-[13px] transition-colors hover:border-ink hover:bg-ink hover:text-cream">
            <span className="relative h-9 w-9 overflow-hidden rounded-full">
              <Image src={c.image} alt="" fill sizes="36px" className="object-cover" />
            </span>
            {l(c.name)}
            <span className="text-[11px] tabular-nums opacity-50">{products.filter((p) => p.collection === c.slug && p.status === "active").length}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* 05 — Start with the material: products pushed from admin */
export function Curated() {
  const { t, zh } = useT();
  const currency = useShop((s) => s.currency);
  const china = usePlacement("china-edit", "China");
  const curated = usePlacement("home-curated");
  const list = (regionFromCurrency(currency) === "China" && china.length ? china : curated).slice(0, 4);
  return (
    <Section className="pb-28 md:pb-40">
      <div className="flex items-end justify-between gap-6">
        <div>
          <Label>{zh ? "精选" : "Selected"}</Label>
          <Heading className="mt-5 text-[clamp(2.2rem,3.8vw,4rem)]">{zh ? "从材质开始" : "Start with the material"}</Heading>
        </div>
        <Button href="/collections" variant="outline" arrow className="hidden md:inline-flex">
          {t("cta.viewAll")}
        </Button>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-5 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </Section>
  );
}

/* 06 — Look closer: glass hotspots over the grain */
const SIGNS = [
  { x: 30, y: 34, en: "Gold star", zh: "金星", d: { en: "Crystallised deposits that glint like stars — the mark of mature heartwood.", zh: "如星闪烁的结晶沉积——成熟心材的标志。" } },
  { x: 66, y: 28, en: "Cow-hair grain", zh: "牛毛纹", d: { en: "A fine, wavy grain found only in dense, slow-grown wood.", zh: "细密波状纹理，仅见于致密慢生的木材。" } },
  { x: 56, y: 68, en: "Natural oil", zh: "油性", d: { en: "Resin that surfaces with handling and builds a patina.", zh: "随盘玩渗出的油脂，形成包浆。" } },
  { x: 24, y: 72, en: "Colour", zh: "色泽", d: { en: "Ember orange when cut; near-violet after years in the light.", zh: "新切为橙红，经年光照后近乎紫黑。" } },
];
export function LookCloser() {
  const { zh } = useT();
  const [active, setActive] = useState(0);
  return (
    <Section tone="stone" className="py-24 md:py-32" wide>
      <div className="relative overflow-hidden rounded-[32px] md:rounded-[44px]">
        <div className="relative h-[88svh] min-h-[620px]">
          <Parallax speed={0.05} className="absolute inset-0">
            <Image src="/images/e-grain-rich.jpg" alt="Close-up of heartwood grain" fill sizes="100vw" className="object-cover" />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/40" />
          {SIGNS.map((s, i) => (
            <button key={s.en} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-label={s.en}>
              <span className="relative grid h-11 w-11 place-items-center">
                <span className={cn("absolute inset-0 rounded-full bg-white/40", active === i && "animate-ping")} />
                <span className={cn("relative grid h-9 w-9 place-items-center rounded-full text-[11px] font-semibold backdrop-blur-md transition-colors", active === i ? "bg-cream text-ink" : "bg-white/25 text-white")}>{i + 1}</span>
              </span>
            </button>
          ))}
          <div className="absolute inset-x-3 bottom-3 rounded-[26px] border border-white/60 bg-paper/88 backdrop-blur-xl p-6 md:inset-x-auto md:bottom-6 md:right-6 md:top-6 md:flex md:w-[400px] md:flex-col md:justify-center md:p-10">
            <Label>{zh ? "细看" : "Look closer"}</Label>
            <Heading className="mt-4 text-[clamp(1.8rem,2.6vw,2.6rem)]">{zh ? "藏家辨别品级的四个特征" : "Four signs collectors look for"}</Heading>
            <ol className="mt-6 space-y-1">
              {SIGNS.map((s, i) => (
                <li key={s.en}>
                  <button onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className={cn("w-full rounded-2xl px-4 py-3 text-left transition-colors", active === i ? "bg-paper/80" : "hover:bg-paper/40")}>
                    <span className="flex items-baseline gap-3 text-[14px] font-medium">
                      <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
                      {zh ? s.zh : s.en}
                      <span className="text-[12px] font-normal text-muted">{zh ? s.en : s.zh}</span>
                    </span>
                    <AnimatePresence initial={false}>
                      {active === i && (
                        <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="block overflow-hidden pl-7 text-[13px] leading-relaxed text-graphite">
                          <span className="block pt-1.5">{zh ? s.d.zh : s.d.en}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 07 — Making: pinned, cards swing past in 3D */
const STEPS = [
  { en: "Select", zh: "选料", img: "/images/e-bark.jpg", d: { en: "Each billet is weighed, sounded and split. Four in ten are refused.", zh: "每块木料都经称重、敲击与剖开检视。四成被淘汰。" } },
  { en: "Shape", zh: "成形", img: "/images/e-chisel.jpg", d: { en: "Turned and carved by hand, with tools forged from old files.", zh: "手工车制与雕刻，刀具由旧锉刀锻成。" } },
  { en: "Finish", zh: "打磨", img: "/images/e-hands-bw.jpg", d: { en: "Seven grades of abrasive, then beeswax and the palm. No lacquer.", zh: "七道砂磨，再以蜂蜡与手掌养护。不上漆。" } },
  { en: "Inspect", zh: "检验", img: "/images/p-beads-dark.jpg", d: { en: "Density measured, grain checked, logged to its batch.", zh: "测量密度、侧光检视，登记入批次档案。" } },
  { en: "Present", zh: "呈献", img: "/images/p-box.jpg", d: { en: "Wrapped in handloom cotton, cased, with its provenance card.", zh: "手织棉布包裹，装盒，附溯源卡。" } },
];
export function Making() {
  const { zh } = useT();
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  useEffect(() => {
    const measure = () => track.current && setTravel(Math.max(0, track.current.scrollWidth - window.innerWidth + 40));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => -p * travel);
  const rotY = useTransform(scrollYProgress, [0, 0.5, 1], [-14, -6, -14]);
  return (
    <section ref={ref} className="relative h-[260vh] bg-page">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-[1560px] items-end justify-between px-5 md:px-10">
          <div>
            <Label>{zh ? "工艺" : "The making"}</Label>
            <Heading className="mt-5 text-[clamp(2.2rem,3.8vw,4rem)]">{zh ? "五个步骤，一双手" : "Five stages, one pair of hands"}</Heading>
          </div>
          <TextLink href="/craft" className="hidden md:inline-flex">
            {zh ? "走进工坊" : "Inside the atelier"}
          </TextLink>
        </div>
        <div className="mt-12 [perspective:1600px]">
          <motion.div ref={track} style={{ x, rotateY: rotY, transformStyle: "preserve-3d" }} className="flex w-max gap-5 pl-5 pr-5 md:gap-8 md:pl-10 md:pr-10">
            {STEPS.map((s, i) => (
              <div key={s.en} className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[30vw]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
                  <Image src={s.img} alt={s.en} fill sizes="(min-width: 1024px) 30vw, 78vw" className="object-cover" />
                  <span className="glass absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-full font-display text-[18px] font-light">{i + 1}</span>
                </div>
                <div className="mt-5 flex gap-4 px-1">
                  <h3 className="w-24 shrink-0 font-display text-[22px] font-light tracking-[-0.02em]">{zh ? s.zh : s.en}</h3>
                  <p className="text-[14px] leading-relaxed text-graphite">{zh ? s.d.zh : s.d.en}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* 08 — Provenance: the record floats over the hills */
export function Provenance() {
  const { zh } = useT();
  const rows = [
    [zh ? "来源" : "Source", zh ? "安得拉邦塞沙查拉姆山 · 2023/117 号政府拍卖批" : "Seshachalam Hills, Andhra Pradesh — auction lot 2023/117"],
    [zh ? "批次" : "Batch", zh ? "心材 212 公斤 · 密度 1.18" : "212 kg heartwood · density 1.18 g/cm³"],
    [zh ? "加工" : "Processing", zh ? "自然风干 18 个月 · 蒂鲁帕蒂车制" : "Air-seasoned 18 months · turned in Tirupati"],
    [zh ? "认证" : "Certification", zh ? "CITES 附录 II 许可 · 监管链记录" : "CITES Appendix II · chain-of-custody record"],
  ];
  return (
    <section data-nav="dark" className="grain night-glow relative overflow-hidden py-28 text-cream md:py-40">
      <div className="relative mx-auto grid max-w-[1560px] items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Label className="text-rose">{zh ? "溯源" : "Provenance"}</Label>
          <Heading className="mt-6 text-[clamp(2.6rem,5vw,5.4rem)]">{zh ? "每一件，都有来处。" : "Every piece knows where it came from."}</Heading>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-cream/75">
            {zh ? "小叶紫檀受 CITES 保护。我们只使用有完整文件记录的合法木料，并把记录公开给您。" : "Red sandalwood is protected under CITES. We work only with legally documented stock — and we show you the paperwork."}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="/provenance" variant="light" arrow>
              {zh ? "追溯一个批次" : "Trace a batch"}
            </Button>
            <Button href="/sourcing" variant="ghost-light">
              {zh ? "采购政策" : "Sourcing policy"}
            </Button>
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <Parallax speed={0.06} className="aspect-[4/3] rounded-[36px] lg:aspect-[5/4]">
            <Image src="/images/e-hills-mist.jpg" alt="The Eastern Ghats in morning mist" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </Parallax>
          <Reveal className="relative -mt-40 px-4 md:absolute md:-bottom-10 md:-left-16 md:mt-0 md:w-[460px] md:px-0">
            <Tilt className="rounded-[28px]" max={6}>
              <div className="glass-dark rounded-[28px] p-7 shadow-[0_50px_100px_-40px_rgba(0,0,0,.8)]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[20px] tracking-wide">SM-AP-24-017</span>
                  <span className="flex items-center gap-2 rounded-full bg-[#4f6b4a]/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#cfe3c8]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#a8d59b]" />
                    {zh ? "已验证" : "Verified"}
                  </span>
                </div>
                <dl className="mt-5 divide-y divide-white/10">
                  {rows.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[110px_1fr] gap-4 py-3.5 text-[13px]">
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-rose">{k}</dt>
                      <dd className="text-cream/90">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Tilt>
          </Reveal>
          <p className="mt-6 text-right text-[12px] text-rose md:mt-4">{zh ? "东高止山脉 · 安得拉邦" : "The Eastern Ghats, Andhra Pradesh"}</p>
        </div>
      </div>
    </section>
  );
}

/* 09 + 10 — Science and responsible sourcing, as a bento */
export function ScienceSourcing() {
  const { zh } = useT();
  const woods = [
    { en: "Red sandalwood", zh: "小叶紫檀", v: 1.18, hi: true },
    { en: "African blackwood", zh: "非洲黑木", v: 1.08 },
    { en: "Ebony", zh: "乌木", v: 1.03 },
    { en: "Sandalwood (S. album)", zh: "檀香木", v: 0.9 },
    { en: "Indian rosewood", zh: "印度玫瑰木", v: 0.83 },
    { en: "Teak", zh: "柚木", v: 0.65 },
  ];
  const commitments = [
    { n: "100%", d: zh ? "有文件记录的合法拍卖木料" : "Documented, legally auctioned stock" },
    { n: "0", d: zh ? "来自未经验证卖家的木料" : "Wood from unverified sellers — ever" },
    { n: "5%", d: zh ? "营收用于东高止山脉植树" : "Of revenue to Eastern Ghats replanting" },
  ];
  const card = "rounded-[32px] border border-white/80 bg-paper/75 shadow-[0_40px_80px_-60px_rgba(90,30,20,.45)] backdrop-blur";
  return (
    <section className={cn(SHEET, "blush-glow py-28 md:py-40")}>
      <div className="mx-auto max-w-[1560px] px-5 md:px-10">
        <Label>{zh ? "科学与责任" : "Science & responsibility"}</Label>
        <div className="mt-10 grid gap-4 md:gap-5 lg:grid-cols-12">
          <Reveal className={cn(card, "relative overflow-hidden p-8 md:p-12 lg:col-span-5")}>
            <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(229,154,116,.45),transparent_70%)]" />
            <p className="relative bg-gradient-to-br from-[#b5523b] via-[#9f3f2a] to-[#4a180e] bg-clip-text font-display text-[clamp(6rem,13vw,12rem)] font-extralight leading-[0.85] tracking-[-0.06em] text-transparent">1.18</p>
            <p className="relative mt-4 text-[12px] font-semibold uppercase tracking-[0.18em]">{zh ? "克 / 立方厘米 — 比水更重" : "g/cm³ — heavier than water"}</p>
            <p className="relative mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
              {zh ? "它的红色来自不溶于水的天然色素“紫檀素”。高密度让每颗珠子沉手、耐用，并能随时间形成包浆。" : "Its red comes from santalins — natural pigments water cannot wash out. The density makes each bead heavy in the hand, durable, and able to build a patina over years."}
            </p>
            <TextLink href="/science" className="relative mt-8">
              {zh ? "阅读科学" : "Read the science"}
            </TextLink>
          </Reveal>
          <Reveal delay={0.08} className={cn(card, "p-8 md:p-12 lg:col-span-7")}>
            <div className="flex justify-between text-[12px] font-semibold uppercase tracking-[0.16em]">
              <span>{zh ? "气干密度" : "Air-dry density"}</span>
              <span className="text-muted">{zh ? "虚线 = 水" : "Dashed = water"}</span>
            </div>
            <ul className="relative mt-8 space-y-5">
              <span className="pointer-events-none absolute bottom-0 top-0 border-l border-dashed border-ink/30" style={{ left: `calc(38% + ${(1 / 1.3) * 50}%)` }} />
              {woods.map((w, i) => (
                <li key={w.en} className="grid grid-cols-[38%_50%_12%] items-center text-[13px]">
                  <span className={w.hi ? "font-semibold" : "text-graphite"}>{zh ? w.zh : w.en}</span>
                  <span className="relative h-3 overflow-hidden rounded-full bg-ink/[0.06]">
                    <motion.span
                      className={cn("absolute inset-y-0 left-0 rounded-full", w.hi ? "bg-gradient-to-r from-[#e59a74] to-[#9f3f2a]" : "bg-ink/20")}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(w.v / 1.3) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: i * 0.08, ease: EASE }}
                    />
                  </span>
                  <span className="text-right tabular-nums">{w.v.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          {commitments.map((c, i) => (
            <Reveal key={c.n} delay={0.1 + i * 0.06} className="lg:col-span-4">
              <Tilt className="h-full rounded-[32px]">
                <div className={cn(card, "h-full p-8 md:p-10")}>
                  <p className="font-display text-[clamp(3rem,5vw,4.6rem)] font-extralight leading-none tracking-[-0.05em]">{c.n}</p>
                  <p className="mt-5 max-w-[260px] text-[14px] text-graphite">{c.d}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 11 — Gifting: image stage with a glass panel */
export function Gifting() {
  const { zh } = useT();
  const kinds = zh
    ? [["私人礼赠", "手写卡片与漆盒"], ["企业礼赠", "10 件起订，可刻标志"], ["婚礼与寿辰", "对镯、六十与七十大寿"], ["酒店礼遇", "客房礼品，季度供应"], ["设计师合作", "空间定制木作"]]
    : [["Personal", "Handwritten card, lacquer case"], ["Corporate", "From ten pieces, engraved"], ["Weddings & milestones", "Pairs, 60th and 70th birthdays"], ["Hospitality", "Suite amenities, quarterly"], ["Designer collaborations", "Bespoke heartwood for interiors"]];
  return (
    <Section className="py-24 md:py-32" wide>
      <div className="relative overflow-hidden rounded-[32px] md:rounded-[44px]">
        <div className="relative min-h-[92svh]">
          <Parallax speed={0.05} className="absolute inset-0">
            <Image src="/images/p-wedding.jpg" alt="Hands with henna and bangles at a South Indian wedding" fill sizes="100vw" className="object-cover" />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
          <div className="relative flex min-h-[92svh] flex-col justify-end p-6 text-cream md:p-14">
            <Label className="text-cream/80">{zh ? "礼赠" : "Gifting"}</Label>
            <Heading className="mt-5 max-w-2xl text-[clamp(2.6rem,5vw,5.4rem)]">{zh ? "值得传承的礼物" : "A gift that becomes an heirloom"}</Heading>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/85">
              {zh ? "排灯节、婚礼、春节、中秋——每件礼物装于漆盒，附手写卡片与溯源档案。" : "Diwali, weddings, Spring Festival, Mid-Autumn — every gift arrives cased, with a handwritten card and its provenance record."}
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {kinds.map(([k, d]) => (
                <span key={k} className="glass-dark rounded-full px-4 py-2 text-[12px]" title={d}>
                  {k}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="/gifting" variant="light" arrow>
                {zh ? "礼赠服务" : "Explore gifting"}
              </Button>
              <Button href="/enquiries?type=Corporate" variant="ghost-light">
                {zh ? "企业咨询" : "Corporate enquiry"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 12 — Journal */
export function Journal() {
  const { l, zh, locale } = useT();
  return (
    <Section className="pb-28 md:pb-40">
      <div className="flex items-end justify-between">
        <div>
          <Label>{zh ? "札记" : "Journal"}</Label>
          <Heading className="mt-5 text-[clamp(2.2rem,3.8vw,4rem)]">{zh ? "关于木与手" : "On wood and hands"}</Heading>
        </div>
        <Button href="/journal" variant="outline" arrow className="hidden md:inline-flex">
          {zh ? "全部文章" : "All entries"}
        </Button>
      </div>
      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-5">
        {JOURNAL.slice(0, 3).map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <Link href={`/journal/${p.slug}`} className="group block">
              <Tilt className="rounded-[24px]">
                <Photo src={p.image} alt={p.title.en} className="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" zoom />
              </Tilt>
              <p className="mt-5 flex items-center gap-2 text-[12px] text-muted">
                <span className="rounded-full border border-ink/15 px-3 py-1">{p.category}</span>
                {fmtDate(p.date, locale)}
              </p>
              <h3 className="mt-3 font-display text-[24px] font-light leading-snug tracking-[-0.02em] transition-colors group-hover:text-vermilion">{l(p.title)}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 13 — Founder */
export function Founder() {
  const { zh } = useT();
  return (
    <Section tone="stone" className="py-24 md:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <div className="relative mx-auto aspect-square w-[min(100%,420px)]">
            <div aria-hidden className="absolute -inset-6 rounded-full border border-ink/10" />
            <div aria-hidden className="absolute -inset-12 rounded-full border border-ink/5" />
            <Photo src="/images/e-elder-mala.jpg" alt="Hands holding a mala" shape="circle" className="h-full w-full" sizes="420px" />
          </div>
        </Reveal>
        <div className="lg:col-span-7 lg:col-start-6">
          <Label>{zh ? "缘起" : "Why we began"}</Label>
          <blockquote className="mt-8 font-display text-[clamp(1.9rem,3.2vw,3.3rem)] font-light leading-[1.16] tracking-[-0.025em]">
            {zh
              ? "“我的祖母每天清晨都会研磨红檀。我想让世界看到，这种木材值得被认真对待——被溯源、被尊重、被好好制作。”"
              : "“My grandmother ground red sandalwood every morning. I wanted the world to see this wood treated with the seriousness it deserves — traced, respected, and made well.”"}
          </blockquote>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <p className="text-[13px] text-muted">{zh ? "创始人，Santalum Maison" : "Founder, Santalum Maison"}</p>
            <TextLink href="/founder">{zh ? "阅读创始人手记" : "Read the founder's letter"}</TextLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 14 — Santalum Circle, private enquiries, contact */
export function Closing() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  const cols = [
    { k: "Santalum Circle", t: zh ? "优先购买限量批次、私人鉴赏会邀请、终身免费油养。" : "First access to limited batches, private viewings and lifetime re-oiling. Free to join.", href: "/account", cta: zh ? "加入" : "Join the Circle" },
    { k: zh ? "私人咨询" : "Private enquiries", t: zh ? "定制、收藏、婚礼与企业礼赠——由专属顾问亲自回复。" : "Commissions, collecting, weddings and corporate gifting — answered personally by an advisor.", href: "/enquiries", cta: zh ? "提交咨询" : "Make an enquiry" },
    { k: zh ? "预约到访" : "Visit by appointment", t: zh ? "班加罗尔 Lavelle Road 工作室。" : "Our studio on Lavelle Road, Bengaluru. WhatsApp " + content.whatsapp + ".", href: "/contact", cta: zh ? "预约" : "Book a visit" },
  ];
  return (
    <Section className="pb-32 pt-20 md:pb-40 md:pt-24">
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {cols.map((c, i) => (
          <Reveal key={c.k} delay={i * 0.08}>
            <Tilt className="h-full rounded-[32px]">
              <div className={cn("flex h-full flex-col rounded-[32px] p-8 md:p-10", i === 0 ? "night-glow text-cream" : "bg-stone")}>
                <p className="font-display text-[26px] font-light tracking-[-0.02em]">{c.k}</p>
                <p className={cn("mt-4 max-w-sm flex-1 text-[15px] leading-relaxed", i === 0 ? "text-cream/75" : "text-graphite")}>{c.t}</p>
                <div className="mt-10">
                  <Button href={c.href} variant={i === 0 ? "light" : "solid"} size="md" arrow>
                    {c.cta}
                  </Button>
                </div>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-5 rounded-full bg-stone py-2 pl-2 pr-6 text-[13px] text-graphite md:inline-flex">
        <span className="overflow-hidden rounded-full bg-white p-2">
          <QrMark className="h-10 w-10" seed={3} />
        </span>
        {zh ? `微信：${content.wechat}（普通话服务）` : `WeChat ${content.wechat} — Mandarin-speaking advisor`}
      </div>
    </Section>
  );
}
