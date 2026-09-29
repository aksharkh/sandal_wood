"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { ArrowUpRight, Check, FileCheck2, Leaf, MapPin, ShieldCheck } from "lucide-react";
import { ProductVisual } from "../visual/ProductVisual";
import { ProductCard } from "../shop/ProductCard";
import { EASE, Eyebrow, LineLink, LuxButton, Reveal, SplitReveal } from "../motion/primitives";
import { usePlacement, useShop, useT } from "@/lib/store";
import { regionFromCurrency } from "@/lib/cart";

/* 06 — Start with the Material: products pushed from admin → Recommendations */
export function StartWithMaterial() {
  const { t, zh } = useT();
  const currency = useShop((s) => s.currency);
  const region = regionFromCurrency(currency);
  const china = usePlacement("china-edit", "China");
  const curated = usePlacement("home-curated");
  const list = (region === "China" && china.length ? china : curated).slice(0, 4);
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Eyebrow>{zh ? "从材质开始" : "Start with the material"}</Eyebrow>
          <h2 className="mt-5 max-w-3xl font-display text-5xl font-light leading-[1.02] md:text-7xl">
            <SplitReveal text={zh ? "为您甄选" : "Curated for you"} />
          </h2>
        </div>
        <LineLink href="/collections" className="text-gold">
          {t("cta.viewAll")}
        </LineLink>
      </div>
      <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}

/* 07 — Look Closer: a loupe over the heartwood */
const HOTSPOTS = [
  { x: 30, y: 34, en: "Gold star", zh: "金星", d: { en: "Crystallised deposits that glint like stars — the mark of mature heartwood.", zh: "如星闪烁的结晶沉积——成熟心材的标志。" } },
  { x: 64, y: 28, en: "Cow-hair grain", zh: "牛毛纹", d: { en: "A fine, wavy grain seen only in dense, slow-grown wood.", zh: "细密波状纹理，仅见于致密慢生的木材。" } },
  { x: 56, y: 68, en: "Natural oil", zh: "油性", d: { en: "Resin that surfaces with handling and builds a patina — baojiang.", zh: "随盘玩渗出的油脂，形成包浆。" } },
  { x: 24, y: 70, en: "Colour", zh: "色泽", d: { en: "From ember orange when cut, to near-violet after years in light.", zh: "新切为橙红，经年光照后近乎紫黑。" } },
];

export function LookCloser() {
  const { zh } = useT();
  const [pos, setPos] = useState({ x: 50, y: 50, on: false });
  const [active, setActive] = useState(0);
  return (
    <section className="relative overflow-hidden bg-bone text-ink">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-28 md:px-10 lg:grid-cols-[1fr_1.1fr] lg:py-40">
        <div className="flex flex-col justify-center">
          <Eyebrow className="text-santal [&>span]:bg-santal/60">{zh ? "细看" : "Look closer"}</Eyebrow>
          <h2 className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">
            <SplitReveal text={zh ? "真正的价值，藏在细节里。" : "The value is in what you almost miss."} />
          </h2>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink/60">
            {zh ? "将放大镜移到木材上。藏家通过这四个特征辨别小叶紫檀的品级。" : "Move the loupe across the wood. Collectors judge red sandalwood by these four signs."}
          </p>
          <ul className="mt-10 space-y-1">
            {HOTSPOTS.map((h, i) => (
              <li key={h.en}>
                <button onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="group flex w-full items-start gap-5 border-t border-ink/10 py-4 text-left">
                  <span className={`font-mono text-xs ${active === i ? "text-santal" : "text-ink/40"}`}>0{i + 1}</span>
                  <span className="flex-1">
                    <span className={`font-display text-2xl transition-colors ${active === i ? "text-santal" : "text-ink"}`}>
                      {zh ? h.zh : h.en} <span className="text-base text-ink/40">{zh ? h.en : h.zh}</span>
                    </span>
                    <AnimatePresence initial={false}>
                      {active === i && (
                        <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASE }} className="block overflow-hidden text-sm text-ink/60">
                          <span className="block pt-2">{zh ? h.d.zh : h.d.en}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div
          className="relative aspect-square cursor-none overflow-hidden rounded-[36px] bg-ink"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true });
          }}
          onPointerLeave={() => setPos((p) => ({ ...p, on: false }))}
        >
          <ProductVisual kind="pendant" tone={0.4} seed={9} className="absolute inset-[-4%]" />
          {/* loupe: same art, scaled 2.6× and clipped to a circle that follows the pointer */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ opacity: pos.on ? 1 : 0 }}
            style={{ clipPath: `circle(18% at ${pos.x}% ${pos.y}%)` }}
          >
            <div className="absolute inset-0 bg-ink" />
            <div className="absolute inset-[-4%]" style={{ transform: "scale(2.6)", transformOrigin: `${pos.x}% ${pos.y}%` }}>
              <ProductVisual kind="pendant" tone={0.4} seed={9} className="h-full w-full" />
            </div>
          </motion.div>
          <motion.div
            className="pointer-events-none absolute h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/70 shadow-[0_0_0_1px_rgba(0,0,0,.4),0_30px_80px_rgba(0,0,0,.6)]"
            animate={{ opacity: pos.on ? 1 : 0 }}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-gold">×2.6</span>
          </motion.div>
          {HOTSPOTS.map((h, i) => (
            <button
              key={h.en}
              onMouseEnter={() => setActive(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              aria-label={h.en}
            >
              <span className={`relative grid h-6 w-6 place-items-center rounded-full border ${active === i ? "border-gold bg-gold/20" : "border-bone/40"}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {active === i && <span className="absolute inset-0 animate-ping rounded-full border border-gold" />}
              </span>
            </button>
          ))}
          <div className="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.2em] text-bone/50">SM-AP-24-017 · 1.18 g/cm³</div>
        </div>
      </div>
    </section>
  );
}

/* 08 — Making: five stages, pinned while the steps advance */
const STEPS = [
  { en: "Select", zh: "选料", d: { en: "Each billet is weighed, sounded and split. Four in ten are refused — too much sapwood, hidden checks, or density below 1.05.", zh: "每块木料都经称重、敲击与剖开检视。四成被淘汰——边材过多、暗裂或密度低于1.05。" }, kind: "box" as const },
  { en: "Shape", zh: "成形", d: { en: "Turned on foot-driven lathes with tools forged from old files. A bead takes a minute; the eye for it, a lifetime.", zh: "脚踏车床，旧锉刀锻成的刀具。车一颗珠只需一分钟，练就眼力却需一生。" }, kind: "bracelet" as const },
  { en: "Finish", zh: "打磨", d: { en: "Seven grades of abrasive, then beeswax and palm. No lacquer — the lustre is the wood's own oil rising.", zh: "七道砂磨，再以蜂蜡与手掌养护。不上漆——光泽来自木头自身的油脂。" }, kind: "bangle" as const },
  { en: "Inspect", zh: "检验", d: { en: "Every piece is measured for density, checked under raking light and logged against its batch.", zh: "每件作品都测量密度、侧光检视，并登记入批次档案。" }, kind: "pendant" as const },
  { en: "Present", zh: "呈献", d: { en: "Wrapped in handloom cotton, set in an oxblood lacquer case, with its provenance card and a handwritten note.", zh: "以手织棉布包裹，置于深红漆盒中，附溯源卡与手写便笺。" }, kind: "box" as const },
];

export function Making() {
  const { zh } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length)));
  });
  return (
    <section ref={ref} className="relative bg-umber" style={{ height: `${STEPS.length * 80}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 md:px-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <Eyebrow>{zh ? "制作过程" : "The making"}</Eyebrow>
            <div className="relative mt-8 h-[1.1em] overflow-hidden font-display text-[18vw] font-light leading-none md:text-[10vw]">
              <AnimatePresence mode="popLayout">
                <motion.span key={step} initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }} transition={{ duration: 0.9, ease: EASE }} className="absolute inset-0">
                  {zh ? STEPS[step].zh : STEPS[step].en}
                </motion.span>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="mt-6 max-w-md text-[15px] leading-relaxed text-bone/60">
                {zh ? STEPS[step].d.zh : STEPS[step].d.en}
              </motion.p>
            </AnimatePresence>
            <div className="mt-12 flex gap-3">
              {STEPS.map((s, i) => (
                <div key={s.en} className="flex-1">
                  <div className={`font-mono text-[10px] transition-colors ${i <= step ? "text-gold" : "text-bone/30"}`}>0{i + 1}</div>
                  <div className={`mt-2 text-[10px] uppercase tracking-[0.2em] transition-colors ${i === step ? "text-bone" : "text-bone/35"}`}>{zh ? s.zh : s.en}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 h-px w-full bg-bone/10">
              <motion.div style={{ width: bar }} className="h-px bg-gradient-to-r from-santal to-gold" />
            </div>
            <div className="mt-10">
              <LineLink href="/craft" className="text-gold">
                {zh ? "走进工坊" : "Inside the atelier"}
              </LineLink>
            </div>
          </div>
          <div className="relative hidden aspect-square lg:block">
            <div className="absolute inset-0 rounded-full border border-bone/[0.06]" />
            <div className="absolute inset-[12%] rounded-full border border-dashed border-gold/15 animate-spin-slow" />
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, scale: 0.85, rotate: -12, filter: "blur(10px)" }} animate={{ opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" }} exit={{ opacity: 0, scale: 1.1, rotate: 12, filter: "blur(10px)" }} transition={{ duration: 0.9, ease: EASE }} className="absolute inset-[14%]">
                <ProductVisual kind={STEPS[step].kind} tone={0.3 + step * 0.08} seed={step + 20} className="h-full w-full" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 09 — Provenance */
export function ProvenanceBlock() {
  const { zh } = useT();
  const chain = [
    { icon: MapPin, en: "Source", zh: "来源", v: { en: "Seshachalam Hills, Andhra Pradesh — government auction lot 2023/117", zh: "安得拉邦塞沙查拉姆山——2023/117 号政府拍卖批" } },
    { icon: Leaf, en: "Batch", zh: "批次", v: { en: "SM-AP-24-017 · 212 kg heartwood · density 1.18", zh: "SM-AP-24-017 · 心材 212 公斤 · 密度 1.18" } },
    { icon: FileCheck2, en: "Processing", zh: "加工", v: { en: "Air-seasoned 18 months · turned in Tirupati · oil-finished", zh: "自然风干 18 个月 · 蒂鲁帕蒂车制 · 油养" } },
    { icon: ShieldCheck, en: "Certification", zh: "认证", v: { en: "CITES Appendix II permit · chain-of-custody record", zh: "CITES 附录 II 许可 · 监管链记录" } },
  ];
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-16 lg:grid-cols-2">
        <div>
          <Eyebrow>{zh ? "溯源" : "Provenance"}</Eyebrow>
          <h2 className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">
            <SplitReveal text={zh ? "每一件，都有来处。" : "Every piece knows where it came from."} />
          </h2>
          <Reveal>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-bone/60">
              {zh ? "小叶紫檀受 CITES 保护。我们只使用有完整文件记录的合法木料，并将每一份记录公开给您。" : "Red sandalwood is protected under CITES. We work only with legally documented stock — and we show you the paperwork."}
            </p>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            <LuxButton href="/provenance" variant="ghost">{zh ? "追溯一个批次" : "Trace a batch"}</LuxButton>
            <LuxButton href="/sourcing" variant="ghost" magnetic={false} className="border-transparent">{zh ? "采购政策" : "Sourcing policy"} →</LuxButton>
          </div>
        </div>
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-gold/20 bg-gradient-to-br from-cocoa to-ink p-8 md:p-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-santal/25 blur-[80px]" />
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gold">PROVENANCE RECORD</span>
              <span className="flex items-center gap-1.5 rounded-full bg-jade/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-jade">
                <Check className="h-3 w-3" /> {zh ? "已验证" : "Verified"}
              </span>
            </div>
            <p className="mt-6 font-mono text-3xl tracking-wider text-bone md:text-4xl">SM-AP-24-017</p>
            <ol className="relative mt-10 space-y-8 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-px before:bg-gradient-to-b before:from-gold/60 before:to-transparent">
              {chain.map((c, i) => (
                <motion.li key={c.en} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.15, duration: 0.8, ease: EASE }} className="relative flex gap-5">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/30 bg-ink text-gold">
                    <c.icon className="h-4 w-4" strokeWidth={1.4} />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{zh ? c.zh : c.en}</p>
                    <p className="mt-1 text-sm text-bone/85">{zh ? c.v.zh : c.v.en}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 10 — Science */
export function ScienceBlock() {
  const { zh } = useT();
  const woods = [
    { en: "Red sandalwood", zh: "小叶紫檀", v: 1.18, hi: true },
    { en: "African blackwood", zh: "非洲黑木", v: 1.08 },
    { en: "Ebony", zh: "乌木", v: 1.03 },
    { en: "Sandalwood (S. album)", zh: "檀香木", v: 0.9 },
    { en: "Indian rosewood", zh: "印度玫瑰木", v: 0.83 },
    { en: "Teak", zh: "柚木", v: 0.65 },
  ];
  return (
    <section className="relative overflow-hidden border-y border-bone/[0.06] bg-umber">
      <div className="mx-auto grid max-w-[1600px] gap-16 px-5 py-28 md:px-10 lg:grid-cols-[1fr_1.2fr] lg:py-36">
        <div>
          <Eyebrow>{zh ? "科学" : "Science"}</Eyebrow>
          <h2 className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-6xl">
            <SplitReveal text={zh ? "比水更重的木头。" : "A wood heavier than water."} />
          </h2>
          <Reveal>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-bone/60">
              {zh
                ? "它的红色来自一组名为“紫檀素”（santalin）的天然色素，不溶于水——这也是它能在湿石上留下红痕的原因。高密度让每颗珠子沉手、耐用，并能随时间形成包浆。"
                : "Its red comes from santalins — natural pigments that don't dissolve in water, which is why it leaves a trace on wet stone. The density makes each bead heavy in the hand, durable, and able to build a patina over years."}
            </p>
          </Reveal>
          <div className="mt-10">
            <LineLink href="/science" className="text-gold">{zh ? "阅读科学" : "Read the science"}</LineLink>
          </div>
        </div>
        <div className="rounded-[28px] border border-bone/[0.07] bg-ink/40 p-6 md:p-10">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-bone/40">
            <span>{zh ? "气干密度 g/cm³" : "Air-dry density, g/cm³"}</span>
            <span className="text-bone/30">{zh ? "水 = 1.00" : "Water = 1.00"}</span>
          </div>
          <div className="relative mt-8 space-y-5">
            <div className="pointer-events-none absolute bottom-0 top-0 border-l border-dashed border-bone/25" style={{ left: `calc(${(1 / 1.3) * 100}% )` }} />
            {woods.map((w, i) => (
              <div key={w.en}>
                <div className="flex justify-between text-sm">
                  <span className={w.hi ? "text-bone" : "text-bone/55"}>{zh ? w.zh : w.en}</span>
                  <span className={`font-mono ${w.hi ? "text-gold" : "text-bone/45"}`}>{w.v.toFixed(2)}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-bone/[0.05]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(w.v / 1.3) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.6, delay: i * 0.1, ease: EASE }}
                    className={`h-full rounded-full ${w.hi ? "bg-gradient-to-r from-santal via-ember to-gold" : "bg-bone/20"}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[11px] text-bone/35">{zh ? "典型值，因产地与含水率而异。" : "Typical values; vary with origin and moisture content."}</p>
        </div>
      </div>
    </section>
  );
}

/* 11 — Responsible sourcing */
export function Sourcing() {
  const { zh } = useT();
  const items = [
    { n: "100%", en: "Documented, legally auctioned stock", zh: "有文件记录的合法拍卖木料" },
    { n: "0", en: "Wood from unverified sellers — ever", zh: "来自未经验证卖家的木料——永不" },
    { n: "5%", en: "Of revenue to Eastern Ghats replanting", zh: "营收用于东高止山脉植树" },
  ];
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_50%,rgba(127,163,138,0.10),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <Eyebrow>{zh ? "负责任的采购" : "Responsible sourcing"}</Eyebrow>
        <h2 className="mt-6 max-w-4xl font-display text-5xl font-light leading-[1.02] md:text-7xl">
          <SplitReveal text={zh ? "我们宁可少做，也不做错。" : "We would rather make less than make it wrong."} />
        </h2>
        <div className="mt-16 grid gap-px overflow-hidden rounded-[28px] border border-bone/[0.07] bg-bone/[0.07] md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.en} delay={i * 0.1} className="bg-ink p-8 md:p-10">
              <p className="font-display text-7xl font-light text-gradient-gold">{it.n}</p>
              <p className="mt-4 max-w-[240px] text-sm text-bone/60">{zh ? it.zh : it.en}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/legal/material-policy" className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-gold">
            {zh ? "材料与采购政策" : "Material & sourcing policy"} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
