"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useMaison, usePlacement, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { JOURNAL } from "@/lib/data/journal";
import { regionFromCurrency } from "@/lib/cart";
import { ProductCard } from "../shop/ProductCard";
import { QrMark } from "../site/Footer";
import { Button, EASE, Heading, Label, Parallax, Photo, Reveal, Section, TextLink } from "../motion/primitives";
import { cn, fmtDate } from "@/lib/utils";

const SLIDES = [
  { src: "/images/p-carving.jpg", en: "Heartwood, hand-carved — Tirupati", zh: "心材手工雕刻 · 蒂鲁帕蒂" },
  { src: "/images/p-mala-red.jpg", en: "108 Japa Mala", zh: "一百零八念珠" },
  { src: "/images/p-bangle.jpg", en: "Ember Bangle", zh: "余烬手镯" },
];

/* 01 — Red sandalwood / India: split screen */
export function Hero() {
  const { t, l, zh } = useT();
  const content = useMaison((s) => s.content);
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="grid min-h-[100svh] lg:grid-cols-2">
      <div className="relative order-2 flex flex-col justify-end bg-vermilion px-5 pb-12 pt-16 text-white md:px-10 md:pb-16 lg:order-1 lg:pt-[140px]">
        <p style={{ animationDelay: "0.3s" }} className="rise absolute left-5 top-[120px] hidden text-[11px] font-medium uppercase tracking-[0.18em] text-white/80 md:left-10 lg:block">
          Pterocarpus santalinus — 小叶紫檀
        </p>
        <h1
          style={{ animationDelay: "0.15s" }}
          className="rise font-display text-[clamp(3rem,6.2vw,7rem)] font-[450] leading-[0.95] tracking-[-0.035em]"
        >
          {zh ? (
            <>
              小叶紫檀，
              <br />
              来自印度。
            </>
          ) : (
            <>
              Red sandalwood,
              <br />
              from India.
            </>
          )}
        </h1>
        <div className="rise" style={{ animationDelay: "0.45s" }}>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/85">{l(content.heroSub)}</p>
          <div className="mt-10 flex flex-wrap items-center gap-8">
            <Button href="/collections" variant="light">
              {t("cta.shop")}
            </Button>
            <TextLink href="/material" className="text-white">
              {t("cta.material")}
            </TextLink>
          </div>
        </div>
      </div>

      <div className="relative order-1 h-[72svh] overflow-hidden bg-sand lg:order-2 lg:h-auto">
        {/* all slides stay mounted and crossfade, so there is never a blank frame */}
        {SLIDES.map((s, k) => (
          <div
            key={s.src}
            className={cn(
              "absolute inset-0 transition-[opacity,transform] ease-[var(--ease-lux)] [transition-duration:1400ms,6000ms]",
              k === i ? "z-[1] scale-100 opacity-100" : "z-0 scale-[1.06] opacity-0",
            )}
          >
            <Image src={s.src} alt={s.en} fill priority={k === 0} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-x-5 bottom-6 flex items-end justify-between text-[11px] font-medium uppercase tracking-[0.16em] text-white md:inset-x-10">
          <span>{zh ? SLIDES[i].zh : SLIDES[i].en}</span>
          <span className="flex items-center gap-3 tabular-nums">
            {SLIDES.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} className="relative h-px w-10 bg-white/40">
                {k === i && <motion.span key={i} className="absolute inset-y-0 left-0 bg-white" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5.5, ease: "linear" }} />}
              </button>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}

/* 02 — Material introduction */
export function Intro() {
  const { zh } = useT();
  return (
    <Section className="py-28 md:py-44">
      <div className="grid gap-8 lg:grid-cols-12">
        <Label className="lg:col-span-3">{zh ? "材质" : "The material"}</Label>
        <Reveal className="lg:col-span-8">
          <p className="font-display text-[clamp(1.8rem,3.2vw,3.2rem)] font-[400] leading-[1.14] tracking-[-0.02em]">
            {zh ? (
              <>
                有些材料是被挑选的。小叶紫檀却需要等待——<span className="text-muted">在土里数十年，在工坊里数月，在腕上一生。</span>
              </>
            ) : (
              <>
                Some materials are chosen. Red sandalwood is earned — <span className="text-muted">decades in the ground, months in the atelier, and a lifetime on the wrist.</span>
              </>
            )}
          </p>
          <TextLink href="/maison" className="mt-12">
            {zh ? "关于我们" : "About the Maison"}
          </TextLink>
        </Reveal>
      </div>
    </Section>
  );
}

/* 03 — Meet red sandalwood: campaign image + figures */
export function Meet() {
  const { zh } = useT();
  const facts = [
    { v: "1.18", u: "g/cm³", d: zh ? "平均密度——沉于水" : "Average density. It sinks in water." },
    { v: "30+", u: zh ? "年" : "years", d: zh ? "形成可用心材所需" : "For a tree to form workable heartwood." },
    { v: "1", u: zh ? "产区" : "region", d: zh ? "南印度东高止山脉" : "On earth: the Eastern Ghats, South India." },
    { v: "108", u: zh ? "颗" : "beads", d: zh ? "一串念珠，逐颗手工车制" : "In a mala, each turned by hand." },
  ];
  return (
    <section>
      <div className="relative h-[92svh] min-h-[560px]">
        <Parallax speed={0.06} className="absolute inset-0">
          <Image src="/images/p-grain-red.jpg" alt="Red sandalwood heartwood" fill sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1600px] px-5 pb-12 text-white md:px-10 md:pb-16">
          <Label className="text-white/80">{zh ? "认识小叶紫檀" : "Meet red sandalwood"}</Label>
          <Heading className="mt-5 max-w-4xl text-[clamp(2.6rem,5.6vw,6rem)]">Pterocarpus santalinus</Heading>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/85">
            {zh
              ? "只生长在南印度的少数山丘。心材色如余烬，经年转为深紫；密度高到可沉于水；上品散布细小金星。自明代起，便是中国宫廷至宝。"
              : "It grows in only a few hills of South India. Ember-red heartwood that deepens with age, dense enough to sink, the finest scattered with tiny golden flecks. In China, xiǎoyè zǐtán — treasured at court since the Ming dynasty."}
          </p>
        </div>
      </div>
      <Section>
        <dl className="grid grid-cols-2 border-b border-line lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal key={i} delay={i * 0.06} className={cn("py-12 pr-6 md:py-16", i > 0 && "lg:border-l lg:border-line lg:pl-8", i % 2 === 1 && "border-l border-line pl-6 lg:pl-8")}>
              <dt className="font-display text-[clamp(3rem,5vw,5rem)] font-[400] leading-none tracking-[-0.04em]">
                {f.v}
                <span className="ml-2 align-top font-sans text-[12px] tracking-normal text-muted">{f.u}</span>
              </dt>
              <dd className="mt-4 max-w-[220px] text-[13px] leading-snug text-graphite">{f.d}</dd>
            </Reveal>
          ))}
        </dl>
      </Section>
    </section>
  );
}

/* 04 — Material / craft / restraint */
export function Pillars() {
  const { zh } = useT();
  const items = [
    { t: zh ? "材质" : "Material", d: zh ? "只用有文件记录的政府拍卖心材。" : "Only documented, government-auctioned heartwood, each piece with a traceable batch number.", img: "/images/e-grain-rich.jpg", href: "/material" },
    { t: zh ? "工艺" : "Craft", d: zh ? "蒂鲁帕蒂三代匠人手工完成。" : "Turned by hand by three generations of craftsmen in Tirupati. Never lacquered.", img: "/images/e-chisel.jpg", href: "/craft" },
    { t: zh ? "克制" : "Restraint", d: zh ? "四成木料在选料时即被舍弃。" : "No logos, no excess. Four in ten billets are refused at selection.", img: "/images/p-incense.jpg", href: "/maison" },
  ];
  return (
    <Section className="py-28 md:py-40">
      <div className="flex items-end justify-between border-b border-ink pb-5">
        <Heading className="text-[clamp(2rem,3.4vw,3.4rem)]">{zh ? "材质、工艺、克制" : "Material, craft, restraint"}</Heading>
        <Label className="hidden md:block">{zh ? "三个原则" : "Three principles"}</Label>
      </div>
      <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-5">
        {items.map((it, i) => (
          <Reveal key={it.t} delay={i * 0.08}>
            <Link href={it.href} className="group block">
              <Photo src={it.img} alt={it.t} className="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" zoom />
              <div className="mt-5 grid grid-cols-[40px_1fr] gap-2">
                <span className="text-[11px] font-medium tabular-nums text-muted">0{i + 1}</span>
                <div>
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.16em]">{it.t}</h3>
                  <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-graphite">{it.d}</p>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 05 — Collections: edge-to-edge */
export function Collections() {
  const { l, zh } = useT();
  const products = useMaison((s) => s.products);
  return (
    <section>
      <div className="mx-auto flex max-w-[1600px] items-end justify-between px-5 pb-8 md:px-10">
        <Heading className="text-[clamp(2rem,3.4vw,3.4rem)]">{zh ? "系列" : "The collections"}</Heading>
        <TextLink href="/collections">{zh ? "全部作品" : "All objects"}</TextLink>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white md:grid-cols-5">
        {COLLECTIONS.map((c, i) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className={cn("group relative block", i === 0 && "col-span-2 md:col-span-1")}>
            <Photo src={c.image} alt={c.name.en} className={cn(i === 0 ? "aspect-[4/3] md:aspect-[3/5]" : "aspect-[3/4] md:aspect-[3/5]")} sizes="(min-width: 768px) 20vw, 50vw" zoom />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-white md:inset-x-5 md:bottom-5">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em]">{l(c.name)}</span>
              <span className="text-[11px] tabular-nums opacity-80">{products.filter((p) => p.collection === c.slug && p.status === "active").length}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* 06 — Start with the material: products pushed from admin */
export function Curated() {
  const { t, zh } = useT();
  const currency = useShop((s) => s.currency);
  const china = usePlacement("china-edit", "China");
  const curated = usePlacement("home-curated");
  const list = (regionFromCurrency(currency) === "China" && china.length ? china : curated).slice(0, 4);
  return (
    <Section className="py-28 md:py-40">
      <div className="flex items-end justify-between border-b border-ink pb-5">
        <Heading className="text-[clamp(2rem,3.4vw,3.4rem)]">{zh ? "从材质开始" : "Start with the material"}</Heading>
        <TextLink href="/collections">{t("cta.viewAll")}</TextLink>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-14 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </Section>
  );
}

/* 07 — Look closer: split screen */
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
    <section className="grid bg-stone lg:grid-cols-2">
      <div className="relative min-h-[70svh] lg:min-h-[100svh]">
        <Image src="/images/e-grain-rich.jpg" alt="Close-up of heartwood grain" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        {SIGNS.map((s, i) => (
          <button key={s.en} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-label={s.en}>
            <span className={cn("grid h-8 w-8 place-items-center border text-[11px] font-medium transition-colors", active === i ? "border-white bg-white text-ink" : "border-white/80 text-white")}>{i + 1}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col justify-center px-5 py-20 md:px-16 lg:py-0">
        <Label>{zh ? "细看" : "Look closer"}</Label>
        <Heading className="mt-5 text-[clamp(2rem,3.4vw,3.4rem)]">{zh ? "藏家辨别品级的四个特征" : "Four signs collectors look for"}</Heading>
        <ol className="mt-12 border-t border-ink">
          {SIGNS.map((s, i) => (
            <li key={s.en} className="border-b border-line">
              <button onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="grid w-full grid-cols-[40px_1fr] py-5 text-left">
                <span className={cn("text-[11px] font-medium tabular-nums", active === i ? "text-vermilion" : "text-muted")}>0{i + 1}</span>
                <span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em]">
                    {zh ? s.zh : s.en} <span className="ml-2 font-normal normal-case tracking-normal text-muted">{zh ? s.en : s.zh}</span>
                  </span>
                  <AnimatePresence initial={false}>
                    {active === i && (
                      <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }} className="block overflow-hidden text-[14px] leading-relaxed text-graphite">
                        <span className="block pt-2">{zh ? s.d.zh : s.d.en}</span>
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

/* 08 — Making: horizontal strip */
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
    <section className="py-28 md:py-40">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between border-b border-ink px-5 pb-5 md:px-10">
        <Heading className="text-[clamp(2rem,3.4vw,3.4rem)]">{zh ? "五个步骤，一双手" : "Five stages, one pair of hands"}</Heading>
        <TextLink href="/craft" className="hidden md:inline-flex">
          {zh ? "走进工坊" : "Inside the atelier"}
        </TextLink>
      </div>
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 md:px-10">
        {STEPS.map((s, i) => (
          <Reveal key={s.en} delay={i * 0.05} className="w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-[28vw]">
            <Photo src={s.img} alt={s.en} className="aspect-[4/5]" sizes="(min-width: 1024px) 28vw, 78vw" />
            <div className="mt-5 grid grid-cols-[40px_1fr] gap-2">
              <span className="text-[11px] font-medium tabular-nums text-muted">0{i + 1}</span>
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.16em]">{zh ? s.zh : s.en}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-graphite">{zh ? s.d.zh : s.d.en}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 09 — Provenance: landscape + the vermilion band */
export function Provenance() {
  const { zh } = useT();
  const rows = [
    [zh ? "来源" : "Source", zh ? "安得拉邦塞沙查拉姆山 · 2023/117 号政府拍卖批" : "Seshachalam Hills, Andhra Pradesh — government auction lot 2023/117"],
    [zh ? "批次" : "Batch", zh ? "心材 212 公斤 · 密度 1.18" : "212 kg heartwood · density 1.18 g/cm³"],
    [zh ? "加工" : "Processing", zh ? "自然风干 18 个月 · 蒂鲁帕蒂车制 · 油养" : "Air-seasoned 18 months · turned in Tirupati · oil-finished"],
    [zh ? "认证" : "Certification", zh ? "CITES 附录 II 许可 · 监管链记录" : "CITES Appendix II permit · chain-of-custody record"],
  ];
  return (
    <section>
      <div className="relative h-[80svh] min-h-[480px]">
        <Parallax speed={0.06} className="absolute inset-0">
          <Image src="/images/e-hills-mist.jpg" alt="The Eastern Ghats in morning mist" fill sizes="100vw" className="object-cover" />
        </Parallax>
        <p className="absolute bottom-6 left-5 text-[11px] font-medium uppercase tracking-[0.16em] text-white md:left-10">{zh ? "东高止山脉 · 安得拉邦" : "The Eastern Ghats, Andhra Pradesh"}</p>
      </div>
      <Section tone="vermilion" className="py-24 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label className="text-white/80">{zh ? "溯源" : "Provenance"}</Label>
            <Heading className="mt-5 text-[clamp(2.4rem,4.4vw,4.6rem)]">{zh ? "每一件，都有来处。" : "Every piece knows where it came from."}</Heading>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/85">
              {zh ? "小叶紫檀受 CITES 保护。我们只使用有完整文件记录的合法木料，并把记录公开给您。" : "Red sandalwood is protected under CITES. We work only with legally documented stock — and we show you the paperwork."}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <Button href="/provenance" variant="light">
                {zh ? "追溯一个批次" : "Trace a batch"}
              </Button>
              <TextLink href="/sourcing" className="text-white">
                {zh ? "采购政策" : "Sourcing policy"}
              </TextLink>
            </div>
          </div>
          <Reveal className="lg:col-span-6 lg:col-start-7">
            <div className="flex items-baseline justify-between border-b border-white pb-4">
              <span className="font-mono text-[clamp(1.6rem,2.6vw,2.4rem)] tracking-wide">SM-AP-24-017</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em]">{zh ? "已验证" : "Verified"}</span>
            </div>
            <dl>
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 border-b border-white/30 py-5 text-[14px]">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/75">{k}</dt>
                  <dd className="col-span-2">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>
    </section>
  );
}

/* 10 + 11 — Science and responsible sourcing */
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
    <Section className="py-28 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Label>{zh ? "科学" : "Science"}</Label>
          <p className="mt-6 font-display text-[clamp(6rem,14vw,13rem)] font-[350] leading-[0.85] tracking-[-0.06em] text-vermilion">1.18</p>
          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.16em]">{zh ? "克 / 立方厘米 — 比水更重" : "g/cm³ — heavier than water"}</p>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-graphite">
            {zh ? "它的红色来自不溶于水的天然色素“紫檀素”。高密度让每颗珠子沉手、耐用，并能随时间形成包浆。" : "Its red comes from santalins — natural pigments water cannot wash out. The density makes each bead heavy in the hand, durable, and able to build a patina over years."}
          </p>
          <TextLink href="/science" className="mt-10">
            {zh ? "阅读科学" : "Read the science"}
          </TextLink>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          <div className="flex justify-between border-b border-ink pb-3 text-[11px] font-medium uppercase tracking-[0.16em]">
            <span>{zh ? "气干密度" : "Air-dry density"}</span>
            <span className="text-muted">{zh ? "竖线 = 水" : "Rule = water"}</span>
          </div>
          <ul className="relative">
            <span className="pointer-events-none absolute bottom-0 top-0 w-px bg-ink/30" style={{ left: `calc(40% + ${(1 / 1.3) * 45}%)` }} />
            {woods.map((w, i) => (
              <li key={w.en} className="grid grid-cols-[40%_45%_15%] items-center border-b border-line py-4 text-[13px]">
                <span className={w.hi ? "font-medium" : "text-graphite"}>{zh ? w.zh : w.en}</span>
                <span className="relative h-[3px]">
                  <motion.span
                    className={cn("absolute inset-y-0 left-0", w.hi ? "bg-vermilion" : "bg-ink/25")}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(w.v / 1.3) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.06, ease: EASE }}
                  />
                </span>
                <span className="text-right tabular-nums">{w.v.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-28 grid border-t border-ink md:grid-cols-3">
        {commitments.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.06} className={cn("py-10 md:pr-10", i > 0 && "border-t border-line md:border-l md:border-t-0 md:pl-10")}>
            <p className="font-display text-[clamp(3rem,5vw,4.6rem)] font-[400] leading-none tracking-[-0.04em]">{c.n}</p>
            <p className="mt-4 max-w-[260px] text-[14px] text-graphite">{c.d}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 12 — Gifting: split screen */
export function Gifting() {
  const { zh } = useT();
  const kinds = zh
    ? [["私人礼赠", "手写卡片与漆盒"], ["企业礼赠", "10 件起订，可刻标志"], ["婚礼与寿辰", "对镯、六十与七十大寿"], ["酒店礼遇", "客房礼品，季度供应"], ["设计师合作", "空间定制木作"]]
    : [["Personal", "Handwritten card, lacquer case"], ["Corporate", "From ten pieces, engraved"], ["Weddings & milestones", "Pairs, 60th and 70th birthdays"], ["Hospitality", "Suite amenities, quarterly"], ["Designer collaborations", "Bespoke heartwood for interiors"]];
  return (
    <section className="grid lg:grid-cols-2">
      <div className="relative min-h-[70svh] lg:min-h-[100svh]">
        <Image src="/images/p-wedding.jpg" alt="Hands with henna and bangles at a South Indian wedding" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col justify-center bg-stone px-5 py-20 md:px-16 lg:py-0">
        <Label>{zh ? "礼赠" : "Gifting"}</Label>
        <Heading className="mt-5 text-[clamp(2.2rem,3.6vw,3.8rem)]">{zh ? "值得传承的礼物" : "A gift that becomes an heirloom"}</Heading>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
          {zh ? "排灯节、婚礼、春节、中秋——每件礼物装于漆盒，附手写卡片与溯源档案。" : "Diwali, weddings, Spring Festival, Mid-Autumn — every gift arrives cased, with a handwritten card and its provenance record."}
        </p>
        <ul className="mt-10 border-t border-ink">
          {kinds.map(([k, d]) => (
            <li key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em]">{k}</span>
              <span className="text-right text-[13px] text-graphite">{d}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex flex-wrap items-center gap-8">
          <Button href="/gifting">{zh ? "礼赠服务" : "Explore gifting"}</Button>
          <TextLink href="/enquiries?type=Corporate">{zh ? "企业咨询" : "Corporate enquiry"}</TextLink>
        </div>
      </div>
    </section>
  );
}

/* 13 — Journal */
export function Journal() {
  const { l, zh, locale } = useT();
  return (
    <Section className="py-28 md:py-40">
      <div className="flex items-end justify-between border-b border-ink pb-5">
        <Heading className="text-[clamp(2rem,3.4vw,3.4rem)]">{zh ? "札记" : "Journal"}</Heading>
        <TextLink href="/journal">{zh ? "全部文章" : "All entries"}</TextLink>
      </div>
      <div className="mt-10 grid gap-12 md:grid-cols-3 md:gap-5">
        {JOURNAL.slice(0, 3).map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <Link href={`/journal/${p.slug}`} className="group block">
              <Photo src={p.image} alt={p.title.en} className="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" zoom />
              <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
                {p.category} — {fmtDate(p.date, locale)}
              </p>
              <h3 className="mt-3 font-display text-[22px] font-[450] leading-snug tracking-[-0.015em] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{l(p.title)}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 14 — Founder: split screen */
export function Founder() {
  const { zh } = useT();
  return (
    <section className="grid border-t border-line lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-24 md:px-16 lg:order-1">
        <Label>{zh ? "缘起" : "Why we began"}</Label>
        <blockquote className="mt-8 font-display text-[clamp(1.8rem,2.8vw,2.8rem)] font-[400] leading-[1.18] tracking-[-0.02em]">
          {zh
            ? "“我的祖母每天清晨都会研磨红檀。我想让世界看到，这种木材值得被认真对待——被溯源、被尊重、被好好制作。”"
            : "“My grandmother ground red sandalwood every morning. I wanted the world to see this wood treated with the seriousness it deserves — traced, respected, and made well.”"}
        </blockquote>
        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{zh ? "创始人，Santalum Maison" : "Founder, Santalum Maison"}</p>
        <TextLink href="/founder" className="mt-10 self-start">
          {zh ? "阅读创始人手记" : "Read the founder's letter"}
        </TextLink>
      </div>
      <div className="relative min-h-[70svh] lg:order-2 lg:min-h-[90svh]">
        <Image src="/images/e-elder-mala.jpg" alt="Hands holding a mala" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
      </div>
    </section>
  );
}

/* 15–17 — Santalum Circle, private enquiries, contact */
export function Closing() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  const cols = [
    { k: "Santalum Circle", t: zh ? "优先购买限量批次、私人鉴赏会邀请、终身免费油养。" : "First access to limited batches, private viewings and lifetime re-oiling. Free to join.", href: "/account", cta: zh ? "加入" : "Join" },
    { k: zh ? "私人咨询" : "Private enquiries", t: zh ? "定制、收藏、婚礼与企业礼赠——由专属顾问亲自回复。" : "Commissions, collecting, weddings and corporate gifting — answered personally by an advisor.", href: "/enquiries", cta: zh ? "提交咨询" : "Make an enquiry" },
    { k: zh ? "预约到访" : "Visit by appointment", t: zh ? "班加罗尔 Lavelle Road 工作室。" : "Our studio on Lavelle Road, Bengaluru. WhatsApp " + content.whatsapp + ".", href: "/contact", cta: zh ? "预约" : "Book a visit" },
  ];
  return (
    <Section tone="stone" className="py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-3 md:gap-0">
        {cols.map((c, i) => (
          <Reveal key={c.k} delay={i * 0.06} className={cn("flex flex-col md:px-10", i === 0 && "md:pl-0", i > 0 && "md:border-l md:border-ink/15")}>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em]">{c.k}</p>
            <p className="mt-4 max-w-sm flex-1 text-[15px] leading-relaxed text-graphite">{c.t}</p>
            <TextLink href={c.href} className="mt-8 self-start">
              {c.cta}
            </TextLink>
          </Reveal>
        ))}
      </div>
      <div className="mt-16 flex items-center gap-5 border-t border-ink/15 pt-8 text-[13px] text-graphite">
        <QrMark className="h-14 w-14" seed={3} />
        {zh ? `微信：${content.wechat}（普通话服务）` : `WeChat ${content.wechat} — Mandarin-speaking advisor`}
      </div>
    </Section>
  );
}
