"use client";

import Link from "next/link";
import Image from "next/image";
import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMaison, usePlacement, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { JOURNAL } from "@/lib/data/journal";
import { regionFromCurrency } from "@/lib/cart";
import { ProductCard } from "../shop/ProductCard";
import { QrMark } from "../site/Footer";
import { Button, EASE, Heading, Label, Magnetic, MaskLine, Reveal, TextLink } from "../motion/primitives";
import { cn, fmtDate } from "@/lib/utils";

/* ───────────────────────── the scroll mechanism ───────────────────────── */

const QUERY = "(min-width: 1024px) and (min-height: 620px)";
function useWide() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(QUERY);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

const TrackX = createContext<MotionValue<number> | null>(null);

/** Moves its children at a different pace from the scroll, for depth. Zero when its panel is at the left edge. */
function Drift({ children, k = 0.12, className }: { children: ReactNode; k?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const fallback = useMotionValue(0);
  const x = useContext(TrackX) ?? fallback;
  const [base, setBase] = useState(0);
  useEffect(() => {
    const measure = () => setBase((ref.current?.closest("[data-panel]") as HTMLElement | null)?.offsetLeft ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const dx = useTransform(x, (v) => (v === 0 ? 0 : (v + base) * -k));
  return (
    <motion.div ref={ref} style={{ x: dx }} className={className}>
      {children}
    </motion.div>
  );
}

function Panel({ id, w, children, className }: { id: string; w: string; children: ReactNode; className?: string }) {
  return (
    <section data-panel={id} style={{ "--w": w } as React.CSSProperties} className={cn("relative shrink-0 lg:h-full lg:w-[var(--w)] lg:pb-14", className)}>
      {children}
    </section>
  );
}

const CHAPTERS = [
  { id: "arrival", en: "Arrival", zh: "启" },
  { id: "material", en: "Material", zh: "材质" },
  { id: "collections", en: "Collections", zh: "系列" },
  { id: "selected", en: "Selected", zh: "精选" },
  { id: "making", en: "Making", zh: "工艺" },
  { id: "provenance", en: "Provenance", zh: "溯源" },
  { id: "science", en: "Science", zh: "科学" },
  { id: "gifting", en: "Gifting", zh: "礼赠" },
  { id: "journal", en: "Journal", zh: "札记" },
  { id: "enquire", en: "Enquire", zh: "咨询" },
];

/**
 * The homepage as a handscroll. On large screens the page is pinned and the wheel
 * unrolls it sideways; a ruler along the bottom shows the chapters and jumps to them.
 * On small screens the same panels simply stack.
 */
export function HomeScroll() {
  const { zh } = useT();
  const wide = useWide();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [offsets, setOffsets] = useState<number[]>([]);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => (wide ? -p * travel : 0));

  useEffect(() => {
    if (!wide) return;
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const view = el.parentElement?.clientWidth ?? window.innerWidth;
      setTravel(Math.max(0, el.scrollWidth - view));
      setOffsets(CHAPTERS.map((c) => (el.querySelector(`[data-panel="${c.id}"]`) as HTMLElement | null)?.offsetLeft ?? 0));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wide]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!wide || !offsets.length) return;
    const at = p * travel + window.innerWidth * 0.35;
    let i = 0;
    offsets.forEach((o, k) => {
      if (o <= at) i = k;
    });
    setActive((prev) => (prev === i ? prev : i));
  });

  const jump = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + Math.min(offsets[i] ?? 0, travel), behavior: "smooth" });
  };

  return (
    <section ref={section} style={wide ? { height: `calc(100svh + ${travel}px)` } : undefined} className="relative">
      <div className="lg:sticky lg:top-0 lg:h-[100svh] lg:overflow-hidden">
        <TrackX.Provider value={x}>
          <motion.div ref={track} style={{ x }} className="relative flex flex-col lg:h-full lg:w-max lg:flex-row">
            <Panel id="arrival" w="calc(100vw - var(--rail))">
              <Arrival />
            </Panel>
            <Panel id="material" w="76vw" className="bg-night text-cream">
              <Material />
            </Panel>
            <Panel id="collections" w="128vw">
              <Collections />
            </Panel>
            <Panel id="selected" w="96vw" className="bg-stone">
              <Curated />
            </Panel>
            <Panel id="making" w="132vw">
              <Making />
            </Panel>
            <Panel id="provenance" w="104vw" className="bg-night text-cream">
              <Provenance />
            </Panel>
            <Panel id="science" w="84vw" className="bg-forest text-cream">
              <ScienceSourcing />
            </Panel>
            <Panel id="gifting" w="92vw">
              <Gifting />
            </Panel>
            <Panel id="journal" w="92vw" className="bg-stone">
              <Journal />
            </Panel>
            <Panel id="enquire" w="calc(100vw - var(--rail))" className="bg-vermilion text-cream">
              <Closing />
            </Panel>
          </motion.div>
        </TrackX.Provider>

        {/* the ruler */}
        <nav className="absolute inset-x-0 bottom-0 z-20 hidden h-14 items-center gap-6 border-t border-ink/10 bg-page px-8 text-ink lg:flex" aria-label="Chapters">
          <span className="cap tabular-nums text-muted">
            {String(active + 1).padStart(2, "0")} / {CHAPTERS.length}
          </span>
          <ol className="relative flex flex-1 items-center justify-between">
            <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-ink/15" />
            <motion.span aria-hidden style={{ scaleX: scrollYProgress }} className="absolute inset-x-0 top-1/2 h-px origin-left bg-vermilion" />
            {CHAPTERS.map((c, i) => (
              <li key={c.id} className="relative">
                <button onClick={() => jump(i)} className="group flex flex-col items-center px-1" aria-current={active === i}>
                  <span className={cn("h-2.5 w-2.5 rounded-full border-2 transition-all duration-500", active === i ? "scale-125 border-vermilion bg-vermilion" : i < active ? "border-vermilion bg-page" : "border-ink/30 bg-page group-hover:border-ink")} />
                  <span className={cn("cap absolute top-4 whitespace-nowrap transition-opacity duration-300", active === i ? "opacity-100" : "opacity-0 group-hover:opacity-60")}>{zh ? c.zh : c.en}</span>
                </button>
              </li>
            ))}
          </ol>
          <span className="cap flex items-center gap-2 text-muted">
            {zh ? "滚动" : "Scroll"} <span className="nudge inline-block">→</span>
          </span>
        </nav>
      </div>
    </section>
  );
}

/* ───────────────────────────── the panels ───────────────────────────── */

/* 01 — Arrival */
function Arrival() {
  const { t, l, zh } = useT();
  const content = useMaison((s) => s.content);
  return (
    <div className="relative flex h-full flex-col justify-between gap-10 px-5 py-10 md:px-12 lg:py-12">
      <div className="flex items-start justify-between gap-6">
        <p className="cap rise text-muted">Pterocarpus santalinus · 小叶紫檀 · रक्तचंदन</p>
        <p className="cap rise hidden text-muted md:block" style={{ animationDelay: "0.1s" }}>
          {l(content.announcement)}
        </p>
      </div>

      <h1 className="font-display text-[clamp(3.4rem,11.2vw,13.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
        <span className="line-up">
          <span className="flex flex-wrap items-center gap-x-[0.18em]">
            {zh ? "小叶" : "Red"}
            <span className="pill-in relative inline-block h-[0.66em] w-[1.5em] overflow-hidden rounded-full align-middle" style={{ animationDelay: "0.5s" }}>
              <Image src="/images/p-carving.jpg" alt="" fill priority sizes="30vw" className="object-cover" />
            </span>
            {zh ? "紫檀" : "sandal"}
          </span>
        </span>
        <span className="line-up">
          <span style={{ animationDelay: "0.1s" }} className="flex flex-wrap items-center gap-x-[0.18em]">
            {zh ? "来自" : "wood, from"}
            <span className="pill-in relative inline-block h-[0.66em] w-[0.66em] overflow-hidden rounded-full align-middle" style={{ animationDelay: "0.7s" }}>
              <Image src="/images/p-mala-red.jpg" alt="" fill sizes="12vw" className="object-cover" />
            </span>
            <span className="text-vermilion">{zh ? "印度" : "India"}</span>
          </span>
        </span>
      </h1>

      <div className="rise flex flex-col gap-8 md:flex-row md:items-end md:justify-between" style={{ animationDelay: "0.5s" }}>
        <p className="max-w-md text-[16px] leading-relaxed text-graphite">{l(content.heroSub)}</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/collections" size="lg" arrow>
            {t("cta.shop")}
          </Button>
          <Button href="/material" variant="outline" size="lg">
            {t("cta.material")}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* 02 — Material */
function Material() {
  const { zh } = useT();
  const facts = [
    { v: "1.18", u: "g/cm³", d: zh ? "沉于水" : "Sinks in water" },
    { v: "30+", u: zh ? "年" : "years", d: zh ? "形成心材" : "To form heartwood" },
    { v: "1", u: zh ? "产区" : "region", d: zh ? "东高止山脉" : "The Eastern Ghats" },
    { v: "108", u: zh ? "颗" : "beads", d: zh ? "逐颗手工车制" : "Each turned by hand" },
  ];
  return (
    <div className="grain relative flex h-full flex-col justify-between gap-14 overflow-hidden px-5 py-20 md:px-14 lg:py-16">
      <Label className="relative text-rose">{zh ? "材质" : "The material"}</Label>
      <p className="relative max-w-[18ch] font-display text-[clamp(2.2rem,4.6vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
        <MaskLine>{zh ? "有些材料是被挑选的。" : "Some materials"}</MaskLine>
        <MaskLine delay={0.06}>{zh ? "小叶紫檀" : "are chosen."}</MaskLine>
        <MaskLine delay={0.12} className="text-copper">
          {zh ? "却需要等待。" : "This one is earned."}
        </MaskLine>
      </p>
      <div className="relative flex flex-wrap items-end justify-between gap-8">
        <ul className="flex flex-wrap gap-3 md:gap-4">
          {facts.map((f, i) => (
            <Reveal as="li" key={f.v} delay={i * 0.08} className="grid h-[clamp(120px,11.5vw,190px)] w-[clamp(120px,11.5vw,190px)] place-items-center rounded-full border border-cream/25 text-center">
              <span>
                <span className="block font-display text-[clamp(1.8rem,2.8vw,3.2rem)] font-semibold leading-none tracking-[-0.05em]">{f.v}</span>
                <span className="cap mt-1 block text-copper">{f.u}</span>
                <span className="mx-auto mt-1 block max-w-[110px] text-[11px] leading-tight text-rose">{f.d}</span>
              </span>
            </Reveal>
          ))}
        </ul>
        <TextLink href="/maison" className="text-cream">
          {zh ? "关于我们" : "About the Maison"}
        </TextLink>
      </div>
    </div>
  );
}

/* 03 — Collections: tall pills on a staggered line */
function Collections() {
  const { l, zh } = useT();
  const products = useMaison((s) => s.products);
  return (
    <div className="flex h-full flex-col gap-12 px-5 py-20 md:px-14 lg:flex-row lg:items-center lg:gap-[5vw] lg:py-10">
      <div className="shrink-0 lg:w-[24vw]">
        <Label>{zh ? "系列" : "The collections"}</Label>
        <Heading className="mt-6 text-[clamp(2.8rem,5.6vw,6.4rem)]">
          <MaskLine>{zh ? "五个系列，" : "Five families,"}</MaskLine>
          <MaskLine delay={0.06}>{zh ? "一种木材" : "one wood"}</MaskLine>
        </Heading>
        <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-graphite">{zh ? "每件作品都附有其木料批次的溯源档案。" : "Every object ships with the provenance record of its batch."}</p>
        <div className="mt-8">
          <Button href="/collections" variant="outline" arrow>
            {zh ? "全部作品" : "All objects"}
          </Button>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:flex lg:h-full lg:flex-1 lg:items-center lg:gap-[2.4vw]">
        {COLLECTIONS.map((c, i) => (
          <li key={c.slug} className={cn("lg:w-[15vw]", i % 2 ? "lg:translate-y-[7vh]" : "lg:-translate-y-[5vh]")}>
            <Link href={`/collections/${c.slug}`} className="group block">
              <div className="relative aspect-[1/2] overflow-hidden rounded-full bg-sand lg:aspect-auto lg:h-[58vh]">
                <Drift k={i % 2 ? 0.035 : -0.035} className="absolute -inset-x-[12%] inset-y-0">
                  <Image src={c.image} alt={c.name.en} fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-110" />
                </Drift>
                <span className="absolute inset-x-0 bottom-6 mx-auto grid h-12 w-12 place-items-center rounded-full bg-page text-ink opacity-0 transition-all duration-500 group-hover:opacity-100">→</span>
              </div>
              <p className="mt-4 text-center font-display text-[20px] font-semibold tracking-[-0.03em]">{l(c.name)}</p>
              <p className="cap mt-1 text-center text-muted">
                0{i + 1} · {products.filter((p) => p.collection === c.slug && p.status === "active").length} {zh ? "件" : "pieces"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 04 — Start with the material: products pushed from admin */
function Curated() {
  const { t, zh } = useT();
  const currency = useShop((s) => s.currency);
  const china = usePlacement("china-edit", "China");
  const curated = usePlacement("home-curated");
  const list = (regionFromCurrency(currency) === "China" && china.length ? china : curated).slice(0, 4);
  return (
    <div className="flex h-full flex-col justify-center gap-10 px-5 py-20 md:px-14 lg:py-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <Label>{zh ? "精选" : "Selected"}</Label>
          <Heading className="mt-5 text-[clamp(2.4rem,4.4vw,4.8rem)]">{zh ? "从材质开始" : "Start with the material"}</Heading>
        </div>
        <TextLink href="/collections">{t("cta.viewAll")}</TextLink>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </div>
  );
}

/* 05 — Making: five discs along one line */
const STEPS = [
  { en: "Select", zh: "选料", img: "/images/e-bark.jpg", d: { en: "Each billet is weighed, sounded and split. Four in ten are refused.", zh: "每块木料都经称重、敲击与剖开检视。四成被淘汰。" } },
  { en: "Shape", zh: "成形", img: "/images/e-chisel.jpg", d: { en: "Turned and carved by hand, with tools forged from old files.", zh: "手工车制与雕刻，刀具由旧锉刀锻成。" } },
  { en: "Finish", zh: "打磨", img: "/images/e-hands-bw.jpg", d: { en: "Seven grades of abrasive, then beeswax and the palm. No lacquer.", zh: "七道砂磨，再以蜂蜡与手掌养护。不上漆。" } },
  { en: "Inspect", zh: "检验", img: "/images/p-beads-dark.jpg", d: { en: "Density measured, grain checked, logged to its batch.", zh: "测量密度、侧光检视，登记入批次档案。" } },
  { en: "Present", zh: "呈献", img: "/images/p-box.jpg", d: { en: "Wrapped in handloom cotton, cased, with its provenance card.", zh: "手织棉布包裹，装盒，附溯源卡。" } },
];
export function Making() {
  const { zh } = useT();
  return (
    <div className="flex h-full flex-col gap-12 px-5 py-20 md:px-14 lg:flex-row lg:items-center lg:gap-[4vw] lg:py-10">
      <div className="shrink-0 lg:w-[22vw]">
        <Label>{zh ? "工艺" : "The making"}</Label>
        <Heading className="mt-6 text-[clamp(2.8rem,5.2vw,6rem)]">
          <MaskLine>{zh ? "五个步骤，" : "Five stages,"}</MaskLine>
          <MaskLine delay={0.06} className="text-vermilion">
            {zh ? "一双手" : "one pair of hands"}
          </MaskLine>
        </Heading>
        <div className="mt-8">
          <TextLink href="/craft">{zh ? "走进工坊" : "Inside the atelier"}</TextLink>
        </div>
      </div>
      <ol className="relative grid flex-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-[2vw]">
        <span aria-hidden className="absolute inset-x-0 top-1/2 hidden h-px bg-ink/20 lg:block" />
        {STEPS.map((s, i) => (
          <Reveal as="li" key={s.en} delay={i * 0.07} className={cn("relative flex flex-col items-center text-center", i % 2 ? "lg:flex-col-reverse" : "")}>
            <div className="relative aspect-square w-[min(60vw,240px)] overflow-hidden rounded-full bg-sand lg:w-[13vw]">
              <Image src={s.img} alt={s.en} fill sizes="(min-width: 1024px) 14vw, 60vw" className="object-cover" />
            </div>
            <span className="my-4 grid h-10 w-10 place-items-center rounded-full bg-ink font-display text-[15px] font-semibold text-cream lg:my-[3vh]">{i + 1}</span>
            <div className="lg:flex lg:h-[13vw] lg:flex-col lg:justify-center">
              <h3 className="font-display text-[clamp(1.6rem,2.2vw,2.4rem)] font-semibold tracking-[-0.04em]">{zh ? s.zh : s.en}</h3>
              <p className="mx-auto mt-2 max-w-[240px] text-[14px] leading-relaxed text-graphite">{zh ? s.d.zh : s.d.en}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}

/* 06 — Provenance */
function Provenance() {
  const { zh } = useT();
  const rows = [
    [zh ? "来源" : "Source", zh ? "安得拉邦塞沙查拉姆山 · 2023/117 号拍卖批" : "Seshachalam Hills, Andhra Pradesh — lot 2023/117"],
    [zh ? "批次" : "Batch", zh ? "心材 212 公斤 · 密度 1.18" : "212 kg heartwood · density 1.18 g/cm³"],
    [zh ? "加工" : "Processing", zh ? "自然风干 18 个月 · 蒂鲁帕蒂车制" : "Air-seasoned 18 months · turned in Tirupati"],
    [zh ? "认证" : "Certification", zh ? "CITES 附录 II 许可 · 监管链记录" : "CITES Appendix II · chain of custody"],
  ];
  return (
    <div className="grain relative grid h-full gap-12 overflow-hidden px-5 py-20 md:px-14 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-[4vw] lg:py-10">
      <div className="relative">
        <Label className="text-rose">{zh ? "溯源" : "Provenance"}</Label>
        <Heading className="mt-6 text-[clamp(2.8rem,5.4vw,6.2rem)]">
          <MaskLine>{zh ? "每一件，" : "Every piece"}</MaskLine>
          <MaskLine delay={0.06}>{zh ? "都有" : "knows where"}</MaskLine>
          <MaskLine delay={0.12} className="text-copper">
            {zh ? "来处。" : "it came from."}
          </MaskLine>
        </Heading>
        <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-cream/75">
          {zh ? "小叶紫檀受 CITES 保护。我们只使用有完整文件记录的合法木料，并把记录公开给您。" : "Red sandalwood is protected under CITES. We work only with legally documented stock — and we show you the paperwork."}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Button href="/provenance" variant="light" arrow>
            {zh ? "追溯一个批次" : "Trace a batch"}
          </Button>
          <TextLink href="/sourcing">{zh ? "采购政策" : "Sourcing policy"}</TextLink>
        </div>
      </div>

      <div className="relative mx-auto aspect-[3/5] w-[min(70vw,320px)] overflow-hidden rounded-full lg:aspect-auto lg:h-[72vh] lg:w-[24vw]">
        <Drift k={0.05} className="absolute -inset-x-[18%] inset-y-0">
          <Image src="/images/e-hills-mist.jpg" alt="The Eastern Ghats in morning mist" fill sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover" />
        </Drift>
        <span className="cap absolute inset-x-0 bottom-8 text-center text-cream">{zh ? "东高止山脉" : "The Eastern Ghats"}</span>
      </div>

      <Reveal className="relative rounded-[28px] bg-page p-7 text-ink md:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="cap text-muted">{zh ? "批次档案" : "Batch record"}</p>
            <p className="mt-2 font-display text-[clamp(1.6rem,2.4vw,2.4rem)] font-semibold tracking-[-0.04em]">SM-AP-24-017</p>
          </div>
          <span className="cap flex items-center gap-2 rounded-full bg-moss/10 px-3 py-1.5 text-moss">
            <span className="h-1.5 w-1.5 rounded-full bg-moss" />
            {zh ? "已验证" : "Verified"}
          </span>
        </div>
        <dl className="mt-6 border-t border-ink/15">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[100px_1fr] gap-4 border-b border-line py-3.5 text-[14px]">
              <dt className="cap pt-0.5 text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}

/* 07 — Science and responsible sourcing */
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
    { n: "0", d: zh ? "来自未经验证卖家的木料" : "Wood from unverified sellers" },
    { n: "5%", d: zh ? "营收用于东高止山脉植树" : "Of revenue to replanting" },
  ];
  return (
    <div className="relative grid h-full gap-12 bg-forest px-5 py-20 text-cream md:px-14 lg:grid-cols-2 lg:items-center lg:gap-[4vw] lg:py-10">
      <div>
        <Label className="text-rose">{zh ? "科学与责任" : "Science & responsibility"}</Label>
        <p className="mt-4 font-display text-[clamp(7rem,17vw,19rem)] font-bold leading-[0.8] tracking-[-0.06em] text-copper">
          <MaskLine>1.18</MaskLine>
        </p>
        <p className="cap mt-4">{zh ? "克 / 立方厘米 — 比水更重" : "g/cm³ — heavier than water"}</p>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-cream/75">
          {zh ? "它的红色来自不溶于水的天然色素“紫檀素”。高密度让每颗珠子沉手、耐用。" : "Its red comes from santalins — natural pigments water cannot wash out. The density makes each bead heavy in the hand, and durable."}
        </p>
        <div className="mt-8">
          <TextLink href="/science">{zh ? "阅读科学" : "Read the science"}</TextLink>
        </div>
      </div>
      <div>
        <ul className="space-y-3">
          {woods.map((w, i) => (
            <li key={w.en} className="grid grid-cols-[1fr_auto] items-center gap-x-4 text-[13px]">
              <span className="relative flex h-10 items-center overflow-hidden rounded-full bg-cream/10">
                <motion.span className={cn("absolute inset-y-0 left-0 rounded-full", w.hi ? "bg-copper" : "bg-cream/20")} initial={{ width: 0 }} whileInView={{ width: `${(w.v / 1.3) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.3, delay: i * 0.07, ease: EASE }} />
                <span className={cn("relative px-4 font-medium", w.hi && "text-night")}>{zh ? w.zh : w.en}</span>
              </span>
              <span className="w-10 text-right tabular-nums">{w.v.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid grid-cols-3 gap-3">
          {commitments.map((c) => (
            <div key={c.n} className="rounded-[22px] border border-cream/20 p-4 md:p-5">
              <p className="font-display text-[clamp(1.8rem,3vw,3.2rem)] font-semibold leading-none tracking-[-0.05em]">{c.n}</p>
              <p className="mt-3 text-[12px] leading-snug text-rose">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 08 — Gifting */
function Gifting() {
  const { zh } = useT();
  const kinds = zh ? ["私人礼赠", "企业礼赠", "婚礼与寿辰", "酒店礼遇", "设计师合作"] : ["Personal", "Corporate", "Weddings & milestones", "Hospitality", "Designer collaborations"];
  return (
    <div className="grid h-full gap-12 px-5 py-20 md:px-14 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-[5vw] lg:py-10">
      <div className="relative mx-auto flex items-center lg:mx-0">
        <div className="relative aspect-[3/4] w-[min(64vw,300px)] overflow-hidden rounded-full lg:aspect-auto lg:h-[70vh] lg:w-[24vw]">
          <Drift k={0.05} className="absolute -inset-x-[16%] inset-y-0">
            <Image src="/images/p-wedding.jpg" alt="Hands with henna and bangles at a South Indian wedding" fill sizes="(min-width: 1024px) 32vw, 80vw" className="object-cover" />
          </Drift>
        </div>
        <div className="relative -ml-14 aspect-square w-[min(34vw,160px)] self-end overflow-hidden rounded-full border-[6px] border-page lg:-ml-[5vw] lg:w-[13vw]">
          <Image src="/images/p-box-carved.jpg" alt="" fill sizes="(min-width: 1024px) 14vw, 40vw" className="object-cover" />
        </div>
      </div>
      <div>
        <Label>{zh ? "礼赠" : "Gifting"}</Label>
        <Heading className="mt-6 text-[clamp(2.8rem,5.8vw,6.6rem)]">
          <MaskLine>{zh ? "值得传承" : "A gift that"}</MaskLine>
          <MaskLine delay={0.06}>{zh ? "的" : "becomes an"}</MaskLine>
          <MaskLine delay={0.12} className="text-vermilion">
            {zh ? "礼物" : "heirloom"}
          </MaskLine>
        </Heading>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
          {zh ? "排灯节、婚礼、春节、中秋——每件礼物装于漆盒，附手写卡片与溯源档案。" : "Diwali, weddings, Spring Festival, Mid-Autumn — every gift arrives cased, with a handwritten card and its provenance record."}
        </p>
        <ul className="mt-8 flex max-w-xl flex-wrap gap-2">
          {kinds.map((k) => (
            <li key={k} className="rounded-full border border-ink/20 px-4 py-2 text-[13px]">
              {k}
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Button href="/gifting" arrow>
            {zh ? "礼赠服务" : "Explore gifting"}
          </Button>
          <TextLink href="/enquiries?type=Corporate">{zh ? "企业咨询" : "Corporate enquiry"}</TextLink>
        </div>
      </div>
    </div>
  );
}

/* 09 — Journal + founder */
function Journal() {
  const { l, zh, locale } = useT();
  return (
    <div className="grid h-full gap-12 px-5 py-20 md:px-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-[4vw] lg:py-10">
      <div>
        <Label>{zh ? "缘起" : "Why we began"}</Label>
        <blockquote className="mt-6 font-display text-[clamp(1.6rem,2.3vw,2.6rem)] font-semibold leading-[1.1] tracking-[-0.04em]">
          {zh
            ? "“我的祖母每天清晨都会研磨红檀。我想让世界看到，这种木材值得被认真对待。”"
            : "“My grandmother ground red sandalwood every morning. I wanted the world to see this wood treated with the seriousness it deserves.”"}
        </blockquote>
        <div className="mt-8 flex items-center gap-4">
          <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
            <Image src="/images/e-elder-mala.jpg" alt="" fill sizes="56px" className="object-cover" />
          </span>
          <div>
            <p className="text-[13px] text-muted">{zh ? "创始人，Santalum Maison" : "Founder, Santalum Maison"}</p>
            <TextLink href="/founder" className="mt-1">
              {zh ? "阅读创始人手记" : "Read the founder's letter"}
            </TextLink>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-end justify-between">
          <Label>{zh ? "札记" : "Journal"}</Label>
          <TextLink href="/journal">{zh ? "全部文章" : "All entries"}</TextLink>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {JOURNAL.slice(0, 3).map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.07}>
              <Link href={`/journal/${p.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-sand lg:aspect-auto lg:h-[46vh]">
                  <Image src={p.image} alt={p.title.en} fill sizes="(min-width: 1024px) 18vw, 90vw" className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-lux)] group-hover:scale-110" />
                  <span className="cap absolute left-3 top-3 rounded-full bg-page px-3 py-1">{p.category}</span>
                </div>
                <p className="cap mt-4 text-muted">{fmtDate(p.date, locale)}</p>
                <h3 className="mt-1 font-display text-[19px] font-semibold leading-tight tracking-[-0.03em] group-hover:text-vermilion">{l(p.title)}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 10 — Enquire: the seal at the end of the scroll */
function Closing() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  return (
    <div className="grain relative flex h-full flex-col justify-between gap-14 overflow-hidden px-5 py-20 md:px-14 lg:py-14">
      <Label className="relative text-cream [&>span]:bg-cream">{zh ? "私人咨询" : "Private enquiries"}</Label>
      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <Heading className="text-[clamp(3.6rem,11vw,13rem)] leading-[0.84]">
          <MaskLine>{zh ? "与我们" : "Let us"}</MaskLine>
          <MaskLine delay={0.06}>{zh ? "交谈。" : "talk."}</MaskLine>
        </Heading>
        <Magnetic>
          <Link href="/enquiries" className="group relative grid h-44 w-44 place-items-center rounded-full bg-night text-center text-cream transition-colors duration-500 hover:bg-cream hover:text-night md:h-56 md:w-56">
            <svg viewBox="0 0 200 200" className="spin-slow absolute inset-2" aria-hidden>
              <defs>
                <path id="seal" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
              </defs>
              <text className="fill-current text-[13px] font-semibold uppercase tracking-[0.34em]">
                <textPath href="#seal">Santalum Maison · 小叶紫檀 · Private enquiries · </textPath>
              </text>
            </svg>
            <span className="font-display text-[22px] font-semibold tracking-[-0.03em]">
              {zh ? "提交咨询" : "Enquire"} <span className="inline-block transition-transform duration-500 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </Magnetic>
      </div>
      <div className="relative grid gap-8 border-t border-cream/30 pt-8 md:grid-cols-3">
        <div>
          <p className="font-display text-[22px] font-semibold tracking-[-0.03em]">Santalum Circle</p>
          <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-cream/85">{zh ? "优先购买限量批次、私人鉴赏会邀请、终身免费油养。" : "First access to limited batches, private viewings and lifetime re-oiling."}</p>
          <TextLink href="/account" className="mt-4">
            {zh ? "加入" : "Join"}
          </TextLink>
        </div>
        <div>
          <p className="font-display text-[22px] font-semibold tracking-[-0.03em]">{zh ? "预约到访" : "Visit by appointment"}</p>
          <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-cream/85">{zh ? "班加罗尔 Lavelle Road 工作室。" : `Lavelle Road, Bengaluru. WhatsApp ${content.whatsapp}.`}</p>
          <TextLink href="/contact" className="mt-4">
            {zh ? "预约" : "Book a visit"}
          </TextLink>
        </div>
        <div className="flex items-start gap-4">
          <span className="shrink-0 rounded-2xl bg-white p-2">
            <QrMark className="h-16 w-16" seed={3} />
          </span>
          <div>
            <p className="font-display text-[22px] font-semibold tracking-[-0.03em]">{zh ? "微信" : "WeChat"}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-cream/85">{zh ? `${content.wechat}（普通话服务）` : `${content.wechat} — Mandarin-speaking advisor`}</p>
          </div>
        </div>
      </div>
    </div>
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
    <section className="grid items-center gap-12 bg-night px-5 py-20 text-cream md:px-14 lg:grid-cols-2 lg:py-28">
      <div className="relative mx-auto aspect-square w-full max-w-[640px] overflow-hidden rounded-full">
        <Image src="/images/e-grain-rich.jpg" alt="Close-up of heartwood grain" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        {SIGNS.map((s, i) => (
          <button key={s.en} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-label={s.en}>
            <span className={cn("grid h-10 w-10 place-items-center rounded-full border-2 text-[13px] font-semibold transition-colors", active === i ? "border-cream bg-cream text-ink" : "border-cream text-cream")}>{i + 1}</span>
          </button>
        ))}
      </div>
      <div>
        <Label className="text-rose">{zh ? "细看" : "Look closer"}</Label>
        <Heading className="mt-6 text-[clamp(2.4rem,4.4vw,4.8rem)]">{zh ? "藏家辨别品级的四个特征" : "Four signs collectors look for"}</Heading>
        <ol className="mt-10 space-y-2">
          {SIGNS.map((s, i) => (
            <li key={s.en}>
              <button onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className={cn("w-full rounded-[22px] px-5 py-4 text-left transition-colors", active === i ? "bg-cream/10" : "hover:bg-cream/5")}>
                <span className="flex items-baseline gap-3">
                  <span className={cn("cap", active === i ? "text-copper" : "text-rose")}>0{i + 1}</span>
                  <span className="font-display text-[24px] font-semibold tracking-[-0.03em]">{zh ? s.zh : s.en}</span>
                  <span className="cap text-rose">{zh ? s.en : s.zh}</span>
                </span>
                <AnimatePresence initial={false}>
                  {active === i && (
                    <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="block overflow-hidden text-[14px] leading-relaxed text-cream/75">
                      <span className="block pl-9 pt-2">{zh ? s.d.zh : s.d.en}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
