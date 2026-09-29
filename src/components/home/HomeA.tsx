"use client";

import Link from "next/link";
import { motion, useInView, useMotionValue, useScroll, useTransform, animate, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroOrbit } from "../visual/HeroOrbit";
import { ProductVisual } from "../visual/ProductVisual";
import { EASE, Eyebrow, LuxButton, Reveal, SplitReveal } from "../motion/primitives";
import { useMaison, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";

/* 01 — Red Sandalwood / India hero */
export function Hero() {
  const { t, l, zh } = useT();
  const content = useMaison((s) => s.content);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[680px] overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_40%,#2a0c08_0%,#0b0706_70%)]" />
        <HeroOrbit className="absolute inset-0 h-full w-full" />
      </motion.div>

      {/* vertical Chinese type — a quiet nod to the second audience */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.4 }}
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 font-display text-sm tracking-[0.5em] text-gold/60 [writing-mode:vertical-rl] md:block"
      >
        印度 · 小叶紫檀 · 心材
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1.4 }}
        className="absolute left-6 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[10px] tracking-[0.3em] text-bone/35 [writing-mode:vertical-rl] md:block"
      >
        13.6288° N · 79.4192° E — SESHACHALAM HILLS
      </motion.div>

      <motion.div style={{ y, opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col justify-end px-5 pb-16 md:px-10 md:pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1, ease: EASE }}>
          <Eyebrow>{zh ? "小叶紫檀 · 印度" : "Red Sandalwood · India"}</Eyebrow>
        </motion.div>
        <h1 className="mt-6 max-w-5xl font-display text-[15vw] font-light leading-[0.88] tracking-[-0.02em] sm:text-[11vw] lg:text-[8.6vw]">
          <SplitReveal text={l(content.heroTitle)} immediate delay={0.4} />
        </h1>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1.2, ease: EASE }}
            className="max-w-md text-[15px] leading-relaxed text-bone/65"
          >
            {l(content.heroSub)}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 1.2, ease: EASE }} className="flex flex-wrap gap-3">
            <LuxButton href="/collections" size="lg">
              {t("cta.shop")}
            </LuxButton>
            <LuxButton href="/material" size="lg" variant="ghost">
              {t("cta.material")}
            </LuxButton>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-bone/40"
      >
        <span>{zh ? "向下滚动" : "Scroll"}</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ArrowDown className="h-3 w-3" />
        </motion.span>
      </motion.div>
    </section>
  );
}

/* 02 — Material introduction: words kindle as you scroll */
export function MaterialIntro() {
  const { zh } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });
  const text = zh
    ? "有些材料是被挑选的。小叶紫檀却需要等待——在土里数十年，在工坊里数月，在腕上一生。"
    : "Some materials are chosen. Red sandalwood is earned — decades in the ground, months in the atelier, a lifetime on the wrist.";
  const parts = zh ? Array.from(text) : text.split(" ");
  return (
    <section className="relative mx-auto max-w-[1400px] px-5 py-32 md:px-10 md:py-48">
      <Eyebrow className="mb-10">{zh ? "材质" : "The material"}</Eyebrow>
      <div ref={ref}>
        <p className="font-display text-[8.5vw] font-light leading-[1.08] tracking-[-0.01em] md:text-[5.2vw]">
          {parts.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / parts.length, (i + 1) / parts.length]} accent={/earned|等待/.test(w)}>
              {w}
              {!zh && " "}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({ children, progress, range, accent }: { children: React.ReactNode; progress: MotionValue<number>; range: [number, number]; accent?: boolean }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className={accent ? "text-gradient-ember italic" : undefined}>
      {children}
    </motion.span>
  );
}

function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const [v, setV] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, to, { duration: 2.2, ease: EASE, onUpdate: (x) => setV(x.toFixed(decimals)) });
    return () => c.stop();
  }, [inView, mv, to, decimals]);
  return (
    <span ref={ref} className="tabular-nums">
      {v}
      {suffix}
    </span>
  );
}

/* 03 — Meet Red Sandalwood: growth rings + figures */
export function MeetRedSandalwood() {
  const { zh } = useT();
  const stats = [
    { n: 1.18, d: 2, s: "", unit: "g/cm³", label: zh ? "平均密度——沉于水" : "Average density — it sinks in water" },
    { n: 30, d: 0, s: "+", unit: zh ? "年" : "years", label: zh ? "形成可用心材所需" : "For a tree to form workable heartwood" },
    { n: 1, d: 0, s: "", unit: zh ? "个地区" : "region", label: zh ? "全球唯一原生地：南印度东高止山脉" : "On earth where it grows natively — the Eastern Ghats" },
    { n: 108, d: 0, s: "", unit: zh ? "颗" : "beads", label: zh ? "一串念珠，逐颗手工车制" : "In a mala, each turned by hand" },
  ];
  return (
    <section className="relative overflow-hidden border-y border-bone/[0.06] bg-umber">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-28 md:px-10 lg:grid-cols-2 lg:py-40">
        <div className="relative aspect-square w-full max-w-[640px]">
          <Rings />
        </div>
        <div className="flex flex-col justify-center">
          <Eyebrow>{zh ? "认识小叶紫檀" : "Meet red sandalwood"}</Eyebrow>
          <h2 className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">
            <SplitReveal text={zh ? "Pterocarpus santalinus。" : "Pterocarpus santalinus."} />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-bone/60">
              {zh
                ? "它只生长在南印度的少数山丘。心材色如余烬，经年转为深紫；密度高到可沉于水；上品散布细小金星。在中国，它被称作“小叶紫檀”，自明代起便是宫廷至宝。"
                : "It grows in only a few hills of South India. The heartwood is the colour of embers, deepening to violet with age; dense enough to sink; the finest scattered with tiny golden flecks. In China it is called xiǎoyè zǐtán — treasured at court since the Ming dynasty."}
            </p>
          </Reveal>
          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10">
            {stats.map((s, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <dt className="font-display text-5xl font-light text-bone md:text-6xl">
                  <Counter to={s.n} decimals={s.d} suffix={s.s} />
                  <span className="ml-2 font-sans text-xs uppercase tracking-[0.2em] text-gold">{s.unit}</span>
                </dt>
                <dd className="mt-2 max-w-[220px] text-xs leading-relaxed text-bone/50">{s.label}</dd>
              </Reveal>
            ))}
          </dl>
          <div className="mt-12">
            <Link href="/material" className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gold">
              {zh ? "深入了解材质" : "Explore the material"} <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Rings() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rot = useTransform(scrollYProgress, [0, 1], [-20, 30]);
  const rings = Array.from({ length: 34 }, (_, i) => i);
  return (
    <motion.div ref={ref} style={{ rotate: rot }} className="absolute inset-0">
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <radialGradient id="heart" cx="54%" cy="46%" r="60%">
            <stop offset="0%" stopColor="#c8553a" />
            <stop offset="40%" stopColor="#7a2014" />
            <stop offset="85%" stopColor="#2a0a07" />
            <stop offset="100%" stopColor="#d9c7a8" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="url(#heart)" opacity="0.9" />
        {rings.map((i) => {
          const r = Math.round((8 + i * 5.3 + Math.sin(i * 1.7) * 1.5) * 100) / 100;
          return (
            <motion.ellipse
              key={i}
              cx={214 - i * 0.4}
              cy={186 + i * 0.4}
              rx={r}
              ry={Math.round(r * (0.94 + Math.sin(i) * 0.03) * 100) / 100}
              fill="none"
              stroke={i > 30 ? "#efe6d8" : "#1a0503"}
              strokeOpacity={i > 30 ? 0.35 : 0.25 + (i % 3) * 0.1}
              strokeWidth={i % 5 === 0 ? 1.6 : 0.8}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: i * 0.03, ease: EASE }}
            />
          );
        })}
        {Array.from({ length: 40 }, (_, i) => {
          const a = i * 2.4;
          const rr = 20 + ((i * 37) % 140);
          return <circle key={i} cx={Math.round((214 + Math.cos(a) * rr) * 100) / 100} cy={Math.round((186 + Math.sin(a) * rr) * 100) / 100} r={0.9} fill="#f0d49a" opacity={0.7} />;
        })}
      </svg>
      <div className="absolute left-[8%] top-[12%] glass rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-bone/80">
        Heartwood · 心材
      </div>
      <div className="absolute bottom-[10%] right-[4%] glass rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-bone/80">
        Sapwood · 边材
      </div>
    </motion.div>
  );
}

/* 04 — Material / Craft / Restraint */
export function Pillars() {
  const { zh } = useT();
  const items = [
    {
      k: "01",
      t: zh ? "材质" : "Material",
      d: zh ? "只用有文件记录的政府拍卖心材。每件作品都有批次编号，可追溯其来源。" : "Only documented, government-auctioned heartwood. Every piece carries a batch number you can trace.",
      kind: "powder" as const,
    },
    {
      k: "02",
      t: zh ? "工艺" : "Craft",
      d: zh ? "蒂鲁帕蒂三代车木匠人手工完成。光泽来自木头本身，而非漆面。" : "Turned by hand by three generations of turners in Tirupati. The shine comes from the wood, never lacquer.",
      kind: "comb" as const,
    },
    {
      k: "03",
      t: zh ? "克制" : "Restraint",
      d: zh ? "不张扬的标志，不过度的设计。四成木料在选料阶段即被舍弃。" : "No loud logos, no excess. Four in ten billets are refused at selection — what remains is allowed to speak.",
      kind: "pendant" as const,
    },
  ];
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="max-w-3xl font-display text-5xl font-light leading-[1.02] md:text-7xl">
          <SplitReveal text={zh ? "材质、工艺、克制。" : "Material, craft, restraint."} />
        </h2>
        <Reveal>
          <p className="max-w-sm text-sm leading-relaxed text-bone/55">
            {zh ? "三个原则，决定了我们做什么——以及不做什么。" : "Three principles that decide what we make — and, more often, what we don't."}
          </p>
        </Reveal>
      </div>
      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.k} delay={i * 0.12}>
            <div className="group relative h-full overflow-hidden rounded-[28px] border border-bone/[0.07] bg-gradient-to-b from-cocoa/80 to-ink p-8 transition-colors duration-700 hover:border-gold/30">
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs text-gold">{it.k}</span>
                <ProductVisual kind={it.kind} tone={0.4 + i * 0.1} className="-mr-6 -mt-6 h-40 w-40 opacity-80 transition-all duration-1000 ease-[var(--ease-lux)] group-hover:rotate-12 group-hover:scale-110 group-hover:opacity-100" glow={false} />
              </div>
              <h3 className="mt-6 font-display text-4xl">{it.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-bone/55">{it.d}</p>
              <div className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-santal via-gold to-transparent transition-transform duration-1000 ease-[var(--ease-lux)] group-hover:scale-x-100" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 05 — Collections: horizontal gallery driven by vertical scroll */
export function CollectionsRail() {
  const { l, zh } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);
  const counts = useMaison((s) => s.products);
  return (
    <section ref={ref} className="relative h-[300vh] bg-ink">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 flex w-full max-w-[1600px] items-end justify-between px-5 md:px-10">
          <div>
            <Eyebrow>{zh ? "系列" : "Collections"}</Eyebrow>
            <h2 className="mt-5 font-display text-5xl font-light md:text-7xl">{zh ? "同一种木，五种形态" : "One material, five forms"}</h2>
          </div>
          <Link href="/collections" className="hidden text-[11px] uppercase tracking-[0.24em] text-gold hover:text-bone md:block">
            {zh ? "全部作品" : "All objects"} →
          </Link>
        </div>
        <motion.div style={{ x }} className="flex gap-6 pl-5 md:pl-10">
          {COLLECTIONS.map((c, i) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative block h-[62vh] w-[78vw] shrink-0 overflow-hidden rounded-[32px] border border-bone/[0.06] bg-gradient-to-br from-cocoa via-umber to-ink sm:w-[46vw] lg:w-[34vw]">
              <div className="absolute inset-0 opacity-60 transition-opacity duration-1000 group-hover:opacity-100" style={{ background: `radial-gradient(60% 50% at 50% 40%, rgba(158,47,31,${0.25 + i * 0.05}), transparent 70%)` }} />
              <ProductVisual kind={c.visual} tone={0.3 + i * 0.1} seed={i + 4} glow={false} className="absolute inset-x-[10%] top-[6%] h-[60%] transition-transform duration-[1.6s] ease-[var(--ease-lux)] group-hover:-translate-y-3 group-hover:scale-110" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-gold/80">
                  <span>{l(c.kicker)}</span>
                  <span className="font-mono">
                    0{i + 1} / {counts.filter((p) => p.collection === c.slug && p.status === "active").length} {zh ? "件" : "pcs"}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-4xl md:text-5xl">{l(c.name)}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-bone/55">{l(c.blurb)}</p>
              </div>
              <span className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-bone/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
