"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useMaison, usePlacement, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { JOURNAL } from "@/lib/data/journal";
import { regionFromCurrency } from "@/lib/cart";
import { ProductCard } from "../shop/ProductCard";
import { QrMark } from "../site/Footer";
import { Button, EASE, Heading, Label, Magnetic, Marquee, MaskLine, Parallax, Photo, Reveal, ScrollWords, Section, TextLink } from "../motion/primitives";
import { cn, fmtDate } from "@/lib/utils";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* 00 — Opening curtain (CSS only: it always lifts, even before JavaScript loads) */
export function Curtain() {
  return (
    <div className="curtain pointer-events-none fixed inset-0 z-[90] flex items-end justify-between bg-night px-5 pb-8 text-cream md:px-10" aria-hidden>
      <span className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-none tracking-[-0.03em]">Santalum</span>
      <span className="flex h-[1em] overflow-hidden font-display text-[clamp(4rem,14vw,12rem)] leading-none tracking-[-0.04em]">
        <span className="count-roll flex flex-col">
          {["00", "27", "54", "81", "108"].map((n) => (
            <span key={n} className="block h-[1em] text-right tabular-nums">
              {n}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}

/* 01 — Hero: a framed window that opens to full screen as you scroll */
export function Hero() {
  const { t, l, zh } = useT();
  const content = useMaison((s) => s.content);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const k = useTransform(scrollYProgress, (p) => clamp(p / 0.7));
  const clip = useTransform(k, (v) => `inset(${(1 - v) * 17}% ${(1 - v) * 31}% ${(1 - v) * 17}% ${(1 - v) * 31}%)`);
  const imgScale = useTransform(k, (v) => 1.25 - v * 0.25);
  const left = useTransform(k, (v) => `${-v * 45}vw`);
  const right = useTransform(k, (v) => `${v * 45}vw`);
  const fade = useTransform(k, (v) => 1 - clamp(v * 1.6));
  const caption = useTransform(scrollYProgress, (p) => clamp((p - 0.62) / 0.2));
  const captionY = useTransform(caption, (v) => (1 - v) * 40);

  return (
    <section ref={ref} className="relative h-[230vh] bg-night text-cream">
      <div className="grain sticky top-0 h-[100svh] overflow-hidden">
        {/* the window */}
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src="/images/p-carving.jpg" alt="Red sandalwood heartwood, hand-carved in Tirupati" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-night/25" />
        </motion.div>

        {/* headline passes across the window */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-center px-5 md:px-10">
          <h1 className="font-display text-[clamp(3.6rem,14.6vw,16rem)] leading-[0.84] tracking-[-0.045em]">
            <motion.span style={{ x: left, opacity: fade }} className="line-up">
              <span style={{ animationDelay: "1.45s" }}>{zh ? "小叶紫檀" : "Red"}</span>
            </motion.span>
            <motion.span style={{ x: right, opacity: fade }} className="line-up text-right">
              <span style={{ animationDelay: "1.57s" }} className="italic">
                {zh ? "来自印度" : "Sandalwood"}
              </span>
            </motion.span>
          </h1>
        </div>

        {/* meta rail */}
        <motion.div style={{ opacity: fade }} className="cap absolute inset-x-5 top-[92px] flex justify-between text-rose md:inset-x-10">
          <span className="rise" style={{ animationDelay: "1.9s" }}>
            Pterocarpus santalinus
          </span>
          <span className="rise hidden md:inline" style={{ animationDelay: "2s" }}>
            13.68° N · 79.35° E — {zh ? "塞沙查拉姆山" : "Seshachalam Hills"}
          </span>
          <span className="rise" style={{ animationDelay: "2.1s" }}>
            小叶紫檀 · रक्तचंदन
          </span>
        </motion.div>

        <motion.div style={{ opacity: fade }} className="absolute inset-x-5 bottom-8 flex items-end justify-between gap-8 md:inset-x-10 md:bottom-10">
          <p className="rise hidden max-w-[300px] text-[14px] leading-relaxed text-cream/80 sm:block" style={{ animationDelay: "2.1s" }}>
            {l(content.heroSub)}
          </p>
          <div className="rise flex items-center gap-3" style={{ animationDelay: "2.2s" }}>
            <Button href="/collections" variant="light" arrow>
              {t("cta.shop")}
            </Button>
            <span className="cap hidden text-rose md:inline">( {zh ? "向下滚动" : "Scroll"} ↓ )</span>
          </div>
        </motion.div>

        {/* once the window is open */}
        <motion.div style={{ opacity: caption, y: captionY }} className="absolute inset-x-5 bottom-10 md:inset-x-10 md:bottom-14">
          <p className="cap text-cream/80">( {zh ? "蒂鲁帕蒂 · 手工雕刻" : "Tirupati — carved by hand"} )</p>
          <p className="mt-4 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.8rem)] leading-[1] tracking-[-0.03em]">
            {zh ? "一种木材，一个产地，一双手。" : "One wood. One region. One pair of hands."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* 02 — Running line */
export function Ticker() {
  return (
    <section className="bg-night pb-10 pt-6 text-cream">
      <Marquee className="font-display text-[clamp(3rem,9vw,9rem)] leading-[1.1] tracking-[-0.03em]" items={["Pterocarpus santalinus", "小叶紫檀", "Raktachandan", "रक्तचंदन"]} />
    </section>
  );
}

/* 03 — Manifesto */
export function Intro() {
  const { zh } = useT();
  const facts = [
    { v: "1.18", u: "g/cm³", d: zh ? "平均密度——沉于水" : "Average density. It sinks in water." },
    { v: "30+", u: zh ? "年" : "years", d: zh ? "形成可用心材所需" : "For a tree to form workable heartwood." },
    { v: "01", u: zh ? "产区" : "region", d: zh ? "南印度东高止山脉" : "On earth: the Eastern Ghats, South India." },
    { v: "108", u: zh ? "颗" : "beads", d: zh ? "一串念珠，逐颗手工车制" : "In a mala, each turned by hand." },
  ];
  return (
    <Section className="pb-24 pt-28 md:pb-32 md:pt-44">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Label>{zh ? "01 — 材质" : "01 — The material"}</Label>
        </div>
        <div className="lg:col-span-9">
          <ScrollWords
            className="font-display text-[clamp(2.1rem,4.6vw,5rem)] leading-[1.04] tracking-[-0.03em]"
            text={zh ? "有些材料是被挑选的。 小叶紫檀却需要等待—— 在土里数十年， 在工坊里数月， 在腕上一生。" : "Some materials are chosen. Red sandalwood is earned — decades in the ground, months in the atelier, and a lifetime on the wrist."}
          />
          <div className="mt-12">
            <TextLink href="/maison">{zh ? "关于我们" : "About the Maison"}</TextLink>
          </div>
        </div>
      </div>
      <dl className="mt-24 grid grid-cols-2 border-t border-ink lg:grid-cols-4">
        {facts.map((f, i) => (
          <div key={i} className={cn("border-b border-line py-8 pr-4 md:py-10", i % 2 === 1 && "border-l border-line pl-5", i > 0 && "lg:border-l lg:border-line lg:pl-8")}>
            <dt className="flex items-start gap-2">
              <MaskLine className="font-display text-[clamp(3.4rem,6.4vw,6.6rem)] leading-[0.9] tracking-[-0.04em]" delay={i * 0.08}>
                {f.v}
              </MaskLine>
              <span className="cap pt-2 text-muted">{f.u}</span>
            </dt>
            <dd className="mt-5 max-w-[230px] text-[13px] leading-snug text-graphite">{f.d}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/* 04 — Collections: an index; the photograph follows the cursor */
export function Collections() {
  const { l, zh } = useT();
  const products = useMaison((s) => s.products);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 140, damping: 18, mass: 0.5 });
  const tilt = useTransform(sx, (v) => `${clamp((x.get() - v) / 18, -8, 8)}deg`);

  return (
    <section
      className="relative bg-night py-28 text-cream md:py-40"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <div className="mx-auto max-w-[1640px] px-5 md:px-10">
        <div className="flex items-end justify-between pb-10">
          <Label className="text-rose">{zh ? "02 — 系列" : "02 — The collections"}</Label>
          <TextLink href="/collections" className="text-cream">
            {zh ? "全部作品" : "All objects"}
          </TextLink>
        </div>
        <ul className="border-t border-cream/20">
          {COLLECTIONS.map((c, i) => (
            <li key={c.slug} className="border-b border-cream/20">
              <Link href={`/collections/${c.slug}`} onPointerEnter={() => setActive(i)} className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 md:gap-10 md:py-7">
                <span className="cap w-8 text-rose">0{i + 1}</span>
                <span className={cn("font-display text-[clamp(2.4rem,7.2vw,7.4rem)] leading-[0.95] tracking-[-0.035em] transition-[transform,opacity] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-4 md:group-hover:translate-x-8", active !== null && active !== i && "opacity-30", active === i && "italic")}>
                  {l(c.name)}
                </span>
                <span className="flex items-center gap-4">
                  <span className="relative h-14 w-11 overflow-hidden lg:hidden">
                    <Image src={c.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="cap hidden text-rose md:inline">{products.filter((p) => p.collection === c.slug && p.status === "active").length} {zh ? "件" : "pieces"}</span>
                  <span className="cap transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* floating preview */}
      <motion.div style={{ x: sx, y: sy, rotate: tilt }} className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block">
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key="p"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="relative -ml-[150px] -mt-[200px] h-[400px] w-[300px] overflow-hidden"
            >
              {COLLECTIONS.map((c, i) => (
                <Image key={c.slug} src={c.image} alt="" fill sizes="300px" className={cn("object-cover transition-opacity duration-500", active === i ? "opacity-100" : "opacity-0")} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
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
    <Section className="py-28 md:py-40">
      <div className="grid items-end gap-8 pb-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Label>{zh ? "03 — 精选" : "03 — Selected"}</Label>
        </div>
        <Heading className="text-[clamp(2.8rem,6vw,6.4rem)] lg:col-span-7">
          <MaskLine>{zh ? "从材质" : "Start with"}</MaskLine>
          <MaskLine delay={0.08} className="italic">
            {zh ? "开始" : "the material"}
          </MaskLine>
        </Heading>
        <div className="lg:col-span-2 lg:text-right">
          <TextLink href="/collections">{t("cta.viewAll")}</TextLink>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-14 md:gap-x-6 lg:grid-cols-4">
        {list.map((p, i) => (
          <div key={p.id} className={cn(i % 2 === 1 && "lg:mt-20")}>
            <ProductCard p={p} index={i} />
          </div>
        ))}
      </div>
    </Section>
  );
}

/* 06 — Four principles: panels that stack as you scroll */
export function Pillars() {
  const { zh } = useT();
  const items = [
    { n: "A", t: zh ? "材质" : "Material", h: zh ? "只用有文件记录的心材" : "Only documented heartwood", d: zh ? "每件作品都可追溯到一个政府拍卖批次。" : "Government-auctioned billets only, every piece traceable to its batch number.", img: "/images/e-grain-rich.jpg", href: "/material", cls: "bg-forest text-cream", sub: "text-cream/70" },
    { n: "B", t: zh ? "工艺" : "Craft", h: zh ? "三代匠人，一双手" : "Three generations, one pair of hands", d: zh ? "蒂鲁帕蒂手工车制。七道砂磨，蜂蜡养护，从不上漆。" : "Turned by hand in Tirupati. Seven grades of abrasive, beeswax and the palm — never lacquered.", img: "/images/e-chisel.jpg", href: "/craft", cls: "bg-stone text-ink", sub: "text-graphite" },
    { n: "C", t: zh ? "克制" : "Restraint", h: zh ? "四成木料被舍弃" : "Four in ten billets refused", d: zh ? "没有标志，没有多余。只留下最好的木料。" : "No logos and no excess. What does not meet the grade never becomes an object.", img: "/images/p-incense.jpg", href: "/maison", cls: "bg-vermilion text-cream", sub: "text-cream/80" },
    { n: "D", t: zh ? "科学" : "Science", h: zh ? "1.18 克/立方厘米" : "1.18 grams per cubic centimetre", d: zh ? "比水更重。红色来自不溶于水的紫檀素。" : "Heavier than water. Its red comes from santalins, pigments water cannot wash out.", img: "/images/p-grain-red.jpg", href: "/science", cls: "bg-night text-cream", sub: "text-rose" },
  ];
  return (
    <section className="relative bg-page">
      {items.map((it, i) => (
        <div key={it.n} className="sticky" style={{ top: `${i * 56}px` }}>
          <article className={cn("grid min-h-[calc(100svh-168px)] grid-rows-[56px_1fr] border-t border-black/10", it.cls)}>
            <header className="cap mx-auto flex w-full max-w-[1640px] items-center justify-between px-5 md:px-10">
              <span>
                {it.n} — {it.t}
              </span>
              <span className="opacity-60">0{i + 1} / 04</span>
            </header>
            <div className="mx-auto grid w-full max-w-[1640px] items-center gap-10 px-5 pb-14 pt-6 md:px-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Heading className="text-[clamp(2.6rem,6.2vw,6.8rem)]">{it.h}</Heading>
                <p className={cn("mt-8 max-w-md text-[15px] leading-relaxed", it.sub)}>{it.d}</p>
                <div className="mt-10">
                  <TextLink href={it.href}>{zh ? "了解更多" : "Read more"}</TextLink>
                </div>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden lg:col-span-5 lg:aspect-auto lg:h-[58svh]">
                <Image src={it.img} alt={it.t} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </div>
          </article>
        </div>
      ))}
    </section>
  );
}

/* 07 — Making: the photograph changes as each step arrives */
const STEPS = [
  { en: "Select", zh: "选料", img: "/images/e-bark.jpg", d: { en: "Each billet is weighed, sounded and split. Four in ten are refused.", zh: "每块木料都经称重、敲击与剖开检视。四成被淘汰。" } },
  { en: "Shape", zh: "成形", img: "/images/e-chisel.jpg", d: { en: "Turned and carved by hand, with tools forged from old files.", zh: "手工车制与雕刻，刀具由旧锉刀锻成。" } },
  { en: "Finish", zh: "打磨", img: "/images/e-hands-bw.jpg", d: { en: "Seven grades of abrasive, then beeswax and the palm. No lacquer.", zh: "七道砂磨，再以蜂蜡与手掌养护。不上漆。" } },
  { en: "Inspect", zh: "检验", img: "/images/p-beads-dark.jpg", d: { en: "Density measured, grain checked, logged to its batch.", zh: "测量密度、侧光检视，登记入批次档案。" } },
  { en: "Present", zh: "呈献", img: "/images/p-box.jpg", d: { en: "Wrapped in handloom cotton, cased, with its provenance card.", zh: "手织棉布包裹，装盒，附溯源卡。" } },
];
export function Making() {
  const { zh } = useT();
  const [active, setActive] = useState(0);
  return (
    <Section className="py-28 md:py-40">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <Label>{zh ? "04 — 工艺" : "04 — The making"}</Label>
            <div className="relative mt-8 aspect-[4/5] overflow-hidden bg-sand">
              {STEPS.map((s, i) => (
                <Image key={s.en} src={s.img} alt={s.en} fill sizes="(min-width: 1024px) 40vw, 100vw" className={cn("object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-lux)]", active === i ? "scale-100 opacity-100" : "scale-110 opacity-0")} />
              ))}
              <span className="absolute bottom-4 left-4 font-display text-[88px] leading-none tracking-[-0.04em] text-cream mix-blend-difference">0{active + 1}</span>
            </div>
          </div>
        </div>
        <ol className="lg:col-span-6 lg:col-start-7">
          <li className="pb-10">
            <Heading className="text-[clamp(2.8rem,5.4vw,5.8rem)]">
              {zh ? "五个步骤，" : "Five stages, "}
              <span className="italic">{zh ? "一双手" : "one pair of hands"}</span>
            </Heading>
          </li>
          {STEPS.map((s, i) => (
            <Step key={s.en} onActive={() => setActive(i)} active={active === i}>
              <span className="cap w-10 shrink-0 pt-3 text-muted">0{i + 1}</span>
              <div>
                <h3 className="font-display text-[clamp(2.2rem,4vw,4rem)] leading-none tracking-[-0.03em]">{zh ? s.zh : s.en}</h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-graphite">{zh ? s.d.zh : s.d.en}</p>
              </div>
            </Step>
          ))}
          <li className="pt-10">
            <TextLink href="/craft">{zh ? "走进工坊" : "Inside the atelier"}</TextLink>
          </li>
        </ol>
      </div>
    </Section>
  );
}
function Step({ children, onActive, active }: { children: React.ReactNode; onActive: () => void; active: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return (
    <li ref={ref} className={cn("flex gap-5 border-t border-ink/15 py-10 transition-opacity duration-500 md:py-16", active ? "opacity-100" : "lg:opacity-35")}>
      {children}
    </li>
  );
}

/* 08 — Provenance: the record, printed like a ticket */
export function Provenance() {
  const { zh } = useT();
  const rows = [
    [zh ? "来源" : "Source", zh ? "安得拉邦塞沙查拉姆山 · 2023/117 号政府拍卖批" : "Seshachalam Hills, Andhra Pradesh — auction lot 2023/117"],
    [zh ? "批次" : "Batch", zh ? "心材 212 公斤 · 密度 1.18" : "212 kg heartwood · density 1.18 g/cm³"],
    [zh ? "加工" : "Processing", zh ? "自然风干 18 个月 · 蒂鲁帕蒂车制 · 油养" : "Air-seasoned 18 months · turned in Tirupati · oil-finished"],
    [zh ? "认证" : "Certification", zh ? "CITES 附录 II 许可 · 监管链记录" : "CITES Appendix II permit · chain-of-custody record"],
  ];
  return (
    <section className="relative bg-night text-cream">
      <div className="relative h-[110svh] min-h-[640px]">
        <Parallax speed={0.07} className="absolute inset-0">
          <Image src="/images/e-hills-mist.jpg" alt="The Eastern Ghats in morning mist" fill sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-b from-night/70 via-night/10 to-night" />
        <div className="absolute inset-x-5 top-24 md:inset-x-10 md:top-32">
          <Label className="text-cream/80">{zh ? "05 — 溯源" : "05 — Provenance"}</Label>
          <Heading className="mt-8 max-w-[14ch] text-[clamp(3rem,8.4vw,9rem)]">
            <MaskLine>{zh ? "每一件，" : "Every piece"}</MaskLine>
            <MaskLine delay={0.08}>{zh ? "都有" : "knows where"}</MaskLine>
            <MaskLine delay={0.16} className="italic">
              {zh ? "来处。" : "it came from."}
            </MaskLine>
          </Heading>
        </div>
      </div>
      <div className="relative mx-auto -mt-[28svh] grid max-w-[1640px] gap-12 px-5 pb-28 md:px-10 md:pb-40 lg:grid-cols-12">
        <div className="lg:col-span-4 lg:pt-[30svh]">
          <p className="max-w-sm text-[15px] leading-relaxed text-cream/75">
            {zh ? "小叶紫檀受 CITES 保护。我们只使用有完整文件记录的合法木料，并把记录公开给您。" : "Red sandalwood is protected under CITES. We work only with legally documented stock — and we show you the paperwork."}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button href="/provenance" variant="light" arrow>
              {zh ? "追溯一个批次" : "Trace a batch"}
            </Button>
            <TextLink href="/sourcing" className="text-cream">
              {zh ? "采购政策" : "Sourcing policy"}
            </TextLink>
          </div>
        </div>
        <Reveal className="lg:col-span-7 lg:col-start-6">
          {/* the ticket */}
          <div className="relative bg-page text-ink shadow-[0_60px_120px_-40px_rgba(0,0,0,.7)]">
            <span aria-hidden className="absolute -left-3 top-[116px] h-6 w-6 rounded-full bg-night" />
            <span aria-hidden className="absolute -right-3 top-[116px] h-6 w-6 rounded-full bg-night" />
            <div className="flex items-start justify-between gap-6 p-6 md:p-9">
              <div>
                <p className="cap text-muted">{zh ? "批次档案" : "Batch record"}</p>
                <p className="mt-2 font-mono text-[clamp(1.6rem,3vw,2.6rem)] tracking-tight">SM-AP-24-017</p>
              </div>
              <span className="cap flex items-center gap-2 border border-moss/40 px-3 py-1.5 text-moss">
                <span className="h-1.5 w-1.5 rounded-full bg-moss" />
                {zh ? "已验证" : "Verified"}
              </span>
            </div>
            <div className="mx-6 border-t border-dashed border-ink/30 md:mx-9" />
            <dl className="p-6 md:p-9">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-4 border-b border-line py-4 text-[14px] md:grid-cols-[160px_1fr]">
                  <dt className="cap pt-0.5 text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div className="mt-7 flex items-end justify-between">
                <span aria-hidden className="h-12 w-56 max-w-[60%] bg-[repeating-linear-gradient(90deg,#0d1613_0_2px,transparent_2px_5px,#0d1613_5px_6px,transparent_6px_10px,#0d1613_10px_13px,transparent_13px_15px)]" />
                <span className="cap text-muted">{zh ? "附于每件作品" : "Issued with every piece"}</span>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 09 — Density */
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
  return (
    <Section tone="vermilion" className="py-28 md:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Label className="text-cream/70">{zh ? "06 — 科学与责任" : "06 — Science & responsibility"}</Label>
          <p className="mt-6 font-display text-[clamp(7rem,22vw,22rem)] leading-[0.78] tracking-[-0.06em] text-copper">
            <MaskLine>1.18</MaskLine>
          </p>
          <p className="cap mt-6">{zh ? "克 / 立方厘米 — 比水更重" : "g/cm³ — heavier than water"}</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-16">
          <div className="cap flex justify-between border-b border-cream/40 pb-3">
            <span>{zh ? "气干密度" : "Air-dry density"}</span>
            <span className="text-cream/60">{zh ? "竖线 = 水" : "Rule = water"}</span>
          </div>
          <ul className="relative">
            <span className="pointer-events-none absolute bottom-0 top-0 w-px bg-cream/40" style={{ left: `calc(42% + ${(1 / 1.3) * 44}%)` }} />
            {woods.map((w, i) => (
              <li key={w.en} className="grid grid-cols-[42%_44%_14%] items-center border-b border-cream/15 py-4 text-[13px]">
                <span className={w.hi ? "font-medium" : "text-cream/70"}>{zh ? w.zh : w.en}</span>
                <span className="relative h-[3px]">
                  <motion.span className={cn("absolute inset-y-0 left-0", w.hi ? "bg-copper" : "bg-cream/30")} initial={{ width: 0 }} whileInView={{ width: `${(w.v / 1.3) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.3, delay: i * 0.07, ease: EASE }} />
                </span>
                <span className="text-right font-mono tabular-nums">{w.v.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <TextLink href="/science">{zh ? "阅读科学" : "Read the science"}</TextLink>
          </div>
        </div>
      </div>
      <div className="mt-24 grid border-t border-cream/40 md:grid-cols-3">
        {commitments.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.06} className={cn("py-10 md:pr-10", i > 0 && "border-t border-cream/15 md:border-l md:border-t-0 md:pl-10")}>
            <p className="font-display text-[clamp(3.4rem,6vw,6rem)] leading-none tracking-[-0.04em]">{c.n}</p>
            <p className="mt-4 max-w-[260px] text-[14px] text-cream/75">{c.d}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 10 — Gifting */
export function Gifting() {
  const { zh } = useT();
  const kinds = zh
    ? [["私人礼赠", "手写卡片与漆盒"], ["企业礼赠", "10 件起订，可刻标志"], ["婚礼与寿辰", "对镯、六十与七十大寿"], ["酒店礼遇", "客房礼品，季度供应"], ["设计师合作", "空间定制木作"]]
    : [["Personal", "Handwritten card, lacquer case"], ["Corporate", "From ten pieces, engraved"], ["Weddings & milestones", "Pairs, 60th and 70th birthdays"], ["Hospitality", "Suite amenities, quarterly"], ["Designer collaborations", "Bespoke heartwood for interiors"]];
  return (
    <Section className="py-28 md:py-40">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Label>{zh ? "07 — 礼赠" : "07 — Gifting"}</Label>
          <Heading className="mt-8 text-[clamp(3rem,7vw,7.6rem)]">
            <MaskLine>{zh ? "值得传承" : "A gift that"}</MaskLine>
            <MaskLine delay={0.08}>{zh ? "的" : "becomes an"}</MaskLine>
            <MaskLine delay={0.16} className="italic text-vermilion">
              {zh ? "礼物" : "heirloom"}
            </MaskLine>
          </Heading>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-graphite">
            {zh ? "排灯节、婚礼、春节、中秋——每件礼物装于漆盒，附手写卡片与溯源档案。" : "Diwali, weddings, Spring Festival, Mid-Autumn — every gift arrives cased, with a handwritten card and its provenance record."}
          </p>
          <ul className="mt-12 border-t border-ink">
            {kinds.map(([k, d], i) => (
              <li key={k} className="group grid grid-cols-[40px_1fr_auto] items-baseline gap-4 border-b border-line py-4 transition-[padding] duration-500 ease-[var(--ease-expo)] hover:pl-3">
                <span className="cap text-muted">0{i + 1}</span>
                <span className="font-display text-[22px] leading-tight tracking-[-0.01em]">{k}</span>
                <span className="text-right text-[13px] text-graphite">{d}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button href="/gifting" arrow>
              {zh ? "礼赠服务" : "Explore gifting"}
            </Button>
            <TextLink href="/enquiries?type=Corporate">{zh ? "企业咨询" : "Corporate enquiry"}</TextLink>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <Parallax speed={0.06} className="aspect-[3/4] lg:sticky lg:top-24">
            <Image src="/images/p-wedding.jpg" alt="Hands with henna and bangles at a South Indian wedding" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </Parallax>
        </div>
      </div>
    </Section>
  );
}

/* 11 — Journal */
export function Journal() {
  const { l, zh, locale } = useT();
  return (
    <Section tone="stone" className="py-28 md:py-40">
      <div className="flex items-end justify-between pb-10">
        <Label>{zh ? "08 — 札记" : "08 — Journal"}</Label>
        <TextLink href="/journal">{zh ? "全部文章" : "All entries"}</TextLink>
      </div>
      <ul className="border-t border-ink">
        {JOURNAL.slice(0, 4).map((p) => (
          <li key={p.slug} className="border-b border-ink/20">
            <Link href={`/journal/${p.slug}`} className="group grid items-center gap-5 py-6 md:grid-cols-12 md:py-8">
              <span className="cap text-muted md:col-span-2">{fmtDate(p.date, locale)}</span>
              <span className="font-display text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[1.02] tracking-[-0.025em] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 md:col-span-7">{l(p.title)}</span>
              <span className="cap text-muted md:col-span-1">{p.category}</span>
              <span className="relative hidden aspect-[4/3] overflow-hidden md:col-span-2 md:block">
                <Image src={p.image} alt="" fill sizes="16vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-lux)] group-hover:scale-110" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* 12 — Founder */
export function Founder() {
  const { zh } = useT();
  return (
    <Section className="py-28 md:py-44">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <Label>{zh ? "09 — 缘起" : "09 — Why we began"}</Label>
          <Photo src="/images/e-elder-mala.jpg" alt="Hands holding a mala" className="mt-8 aspect-[3/4] w-full max-w-[280px]" sizes="280px" />
        </div>
        <div className="lg:col-span-9">
          <ScrollWords
            className="font-display text-[clamp(2rem,4.2vw,4.6rem)] leading-[1.06] tracking-[-0.03em]"
            text={
              zh
                ? "“我的祖母每天清晨都会研磨红檀。 我想让世界看到， 这种木材值得被认真对待—— 被溯源、 被尊重、 被好好制作。”"
                : "“My grandmother ground red sandalwood every morning. I wanted the world to see this wood treated with the seriousness it deserves — traced, respected, and made well.”"
            }
          />
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <p className="cap text-muted">{zh ? "创始人，Santalum Maison" : "Founder, Santalum Maison"}</p>
            <TextLink href="/founder">{zh ? "阅读创始人手记" : "Read the founder's letter"}</TextLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 13 — Santalum Circle, private enquiries, contact */
export function Closing() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  const cols = [
    { k: "Santalum Circle", t: zh ? "优先购买限量批次、私人鉴赏会邀请、终身免费油养。" : "First access to limited batches, private viewings and lifetime re-oiling. Free to join.", href: "/account", cta: zh ? "加入" : "Join" },
    { k: zh ? "预约到访" : "Visit by appointment", t: zh ? "班加罗尔 Lavelle Road 工作室。" : "Our studio on Lavelle Road, Bengaluru. WhatsApp " + content.whatsapp + ".", href: "/contact", cta: zh ? "预约" : "Book a visit" },
  ];
  return (
    <section className="grain relative overflow-hidden bg-forest py-28 text-cream md:py-40">
      <div className="relative mx-auto max-w-[1640px] px-5 md:px-10">
        <Label className="text-cream/70">{zh ? "10 — 私人咨询" : "10 — Private enquiries"}</Label>
        <div className="mt-8 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <Link href="/enquiries" className="group block">
            <Heading className="text-[clamp(3.4rem,11.5vw,13rem)] leading-[0.84]">
              <MaskLine>{zh ? "与我们" : "Let us"}</MaskLine>
              <MaskLine delay={0.08} className="italic transition-colors duration-500 group-hover:text-copper">
                {zh ? "交谈" : "talk."}
              </MaskLine>
            </Heading>
          </Link>
          <Magnetic>
            <Link href="/enquiries" className="cap group grid h-40 w-40 place-items-center rounded-full bg-cream text-center font-medium text-ink transition-colors duration-500 hover:bg-copper md:h-48 md:w-48">
              <span>
                {zh ? "提交咨询" : "Make an enquiry"}
                <span className="mt-2 block text-[18px] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
              </span>
            </Link>
          </Magnetic>
        </div>
        <div className="mt-24 grid border-t border-cream/30 md:grid-cols-3">
          {cols.map((c, i) => (
            <div key={c.k} className={cn("flex flex-col py-10 md:pr-10", i > 0 && "border-t border-cream/15 md:border-l md:border-t-0 md:pl-10")}>
              <p className="font-display text-[28px] tracking-[-0.02em]">{c.k}</p>
              <p className="mt-4 max-w-sm flex-1 text-[14px] leading-relaxed text-cream/75">{c.t}</p>
              <TextLink href={c.href} className="mt-8 self-start">
                {c.cta}
              </TextLink>
            </div>
          ))}
          <div className="flex items-start gap-5 border-t border-cream/15 py-10 md:border-l md:border-t-0 md:pl-10">
            <span className="shrink-0 bg-white p-2">
              <QrMark className="h-16 w-16" seed={3} />
            </span>
            <div>
              <p className="font-display text-[28px] tracking-[-0.02em]">{zh ? "微信" : "WeChat"}</p>
              <p className="mt-4 text-[14px] leading-relaxed text-cream/75">{zh ? `${content.wechat}（普通话服务）` : `${content.wechat} — Mandarin-speaking advisor`}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Look closer — used on the Material page */
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
    <section className="grid bg-night text-cream lg:grid-cols-2">
      <div className="relative min-h-[70svh] lg:min-h-[100svh]">
        <Image src="/images/e-grain-rich.jpg" alt="Close-up of heartwood grain" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        {SIGNS.map((s, i) => (
          <button key={s.en} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-label={s.en}>
            <span className={cn("cap grid h-9 w-9 place-items-center rounded-full border transition-colors", active === i ? "border-cream bg-cream text-ink" : "border-cream/80 text-cream")}>{i + 1}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col justify-center px-5 py-20 md:px-16 lg:py-0">
        <Label className="text-rose">{zh ? "细看" : "Look closer"}</Label>
        <Heading className="mt-6 text-[clamp(2.4rem,4.4vw,4.6rem)]">{zh ? "藏家辨别品级的四个特征" : "Four signs collectors look for"}</Heading>
        <ol className="mt-12 border-t border-cream/30">
          {SIGNS.map((s, i) => (
            <li key={s.en} className="border-b border-cream/15">
              <button onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="grid w-full grid-cols-[40px_1fr] py-5 text-left">
                <span className={cn("cap pt-2", active === i ? "text-copper" : "text-rose")}>0{i + 1}</span>
                <span>
                  <span className={cn("font-display text-[28px] leading-none tracking-[-0.02em]", active === i && "italic")}>
                    {zh ? s.zh : s.en} <span className="cap ml-2 not-italic text-rose">{zh ? s.en : s.zh}</span>
                  </span>
                  <AnimatePresence initial={false}>
                    {active === i && (
                      <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="block overflow-hidden text-[14px] leading-relaxed text-cream/75">
                        <span className="block pt-3">{zh ? s.d.zh : s.d.en}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
