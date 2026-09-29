"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useMaison, usePlacement, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { JOURNAL } from "@/lib/data/journal";
import { regionFromCurrency } from "@/lib/cart";
import { ProductCard } from "../shop/ProductCard";
import { QrMark } from "../site/Footer";
import { Badge, Button, EASE, Heading, Label, Marquee, Parallax, Photo, Reveal, Section, TextLink, Words } from "../motion/primitives";
import { cn, fmtDate } from "@/lib/utils";

/* 01 — Hero: the arch opens as you scroll */
export function Hero() {
  const { t, l, zh } = useT();
  const content = useMaison((s) => s.content);
  const ref = useRef<HTMLElement>(null);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setNarrow(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const width = useTransform(p, [0, 0.55], [narrow ? "78vw" : "30vw", "100vw"]);
  const height = useTransform(p, [0, 0.55], [narrow ? "58vh" : "68vh", "100vh"]);
  const radius = useTransform(p, [0, 0.5], [narrow ? "39vw" : "15vw", "0vw"]);
  const imgScale = useTransform(p, [0, 1], [1.2, 1]);
  const titleOpacity = useTransform(p, [0, 0.22], [1, 0]);
  const titleY = useTransform(p, [0, 0.3], ["0%", "-40%"]);
  const statement = useTransform(p, [0.5, 0.7], [0, 1]);
  const statementY = useTransform(p, [0.5, 0.75], [40, 0]);

  return (
    <section ref={ref} className="relative -mt-[76px] h-[260vh] bg-page">
      <div className="sticky top-0 flex h-screen items-end justify-center overflow-hidden">
        {/* giant headline behind the arch */}
        <motion.div style={{ opacity: titleOpacity, y: titleY }} className="pointer-events-none absolute inset-x-0 top-[17vh] px-5 md:top-[19vh] md:px-10">
          <h1 className="font-display text-[17vw] leading-[0.82] tracking-[-0.03em] md:text-[12.5vw]">
            <span className="block">
              <Words text={zh ? "印度的" : "The red"} immediate delay={0.2} />
            </span>
            <span className="block text-right italic text-clay">
              <Words text={zh ? "赤色之心" : "heart"} immediate delay={0.35} />
            </span>
          </h1>
        </motion.div>

        {/* the arch */}
        <motion.div
          style={{ width, height, borderTopLeftRadius: radius, borderTopRightRadius: radius }}
          className="relative z-10 overflow-hidden bg-sand"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
        >
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src="/images/p-carving.jpg" alt="Hand-carved red sandalwood" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/10 to-transparent" />
          <motion.div style={{ opacity: statement, y: statementY }} className="absolute inset-x-0 bottom-[16vh] px-6 text-center text-cream">
            <p className="mx-auto max-w-4xl font-display text-[clamp(2rem,4.6vw,4.6rem)] leading-[1.02]">
              {zh ? (
                <>
                  有些材料是被挑选的。<em className="text-ember">小叶紫檀，</em>需要等待。
                </>
              ) : (
                <>
                  Some materials are chosen. <em className="text-ember">Red sandalwood</em> is earned.
                </>
              )}
            </p>
            <p className="mx-auto mt-6 max-w-xl text-[15px] text-cream/85">
              {zh ? "在土里数十年，在工坊里数月，在腕上一生。" : "Decades in the ground, months in the atelier, a lifetime on the wrist."}
            </p>
          </motion.div>
        </motion.div>

        {/* intro copy + CTA sit on the cream, either side of the arch */}
        <motion.div style={{ opacity: titleOpacity }} className="absolute bottom-10 left-5 z-20 hidden max-w-[300px] md:left-10 md:block">
          <p className="text-[15px] leading-relaxed text-graphite">{l(content.heroSub)}</p>
          <Button href="/collections" arrow className="mt-6">
            {t("cta.shop")}
          </Button>
        </motion.div>
        <motion.div style={{ opacity: titleOpacity }} className="absolute bottom-10 right-5 z-20 hidden flex-col items-end gap-6 md:right-10 md:flex">
          <Badge text="Pterocarpus santalinus · 小叶紫檀 · Tirupati · " className="text-graphite" center={<span className="font-display text-2xl italic text-clay">1.18</span>} />
          <p className="text-right text-[12px] text-muted">
            {zh ? "密度 1.18 g/cm³ · 沉于水" : "Density 1.18 g/cm³ · it sinks"}
          </p>
        </motion.div>
        <motion.div style={{ opacity: titleOpacity }} className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 md:hidden">
          <Button href="/collections" arrow>
            {t("cta.shop")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* 02 — marquee band */
export function MaterialMarquee() {
  const { zh } = useT();
  return (
    <div className="bg-maroon py-8 text-cream md:py-10">
      <Marquee
        className="font-display text-[clamp(2.4rem,5.4vw,5.2rem)] leading-none"
        items={zh ? ["小叶紫檀", "Raktachandan", "心材", "金星", "牛毛纹", "蒂鲁帕蒂", "沉水"] : ["Pterocarpus santalinus", "小叶紫檀", "Raktachandan", "Heartwood", "Gold star", "Tirupati", "It sinks"]}
      />
    </div>
  );
}

/* 03 — Meet red sandalwood: layered collage */
export function Meet() {
  const { zh } = useT();
  const facts = [
    { v: "1.18", u: "g/cm³", d: zh ? "平均密度——沉于水" : "Average density — it sinks" },
    { v: "30+", u: zh ? "年" : "yrs", d: zh ? "形成心材所需" : "For heartwood to form" },
    { v: "1", u: zh ? "产区" : "region", d: zh ? "南印度东高止山脉" : "The Eastern Ghats, South India" },
    { v: "108", u: zh ? "颗" : "beads", d: zh ? "逐颗手工车制" : "In a mala, each turned by hand" },
  ];
  return (
    <Section tone="stone" className="overflow-hidden py-28 md:py-40">
      <div className="grid items-center gap-20 lg:grid-cols-12">
        <div className="relative mx-auto w-full max-w-[520px] lg:col-span-5">
          <Photo src="/images/p-grain-red.jpg" alt="Red sandalwood heartwood grain" shape="arch" className="aspect-[3/4] w-[82%]" sizes="(min-width: 1024px) 34vw, 80vw" />
          <Parallax speed={0.08} className="absolute bottom-[4%] right-0 w-[44%]">
            <Photo src="/images/e-bark.jpg" alt="Bark of the tree" shape="circle" className="aspect-square border-[10px] border-stone" sizes="240px" />
          </Parallax>
          <Badge text="Heartwood · 心材 · Sapwood · 边材 · " className="absolute right-[6%] top-[6%] h-28 w-28 rounded-full bg-stone text-graphite" center={<span className="h-2 w-2 rounded-full bg-clay" />} />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Label>{zh ? "认识小叶紫檀" : "Meet red sandalwood"}</Label>
          <Heading className="mt-6 text-[clamp(3rem,6vw,6rem)]">
            <Words text="Pterocarpus" />
            <br />
            <em className="text-clay">
              <Words text="santalinus" delay={0.1} />
            </em>
          </Heading>
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-lg text-[16px] leading-relaxed text-graphite">
              {zh
                ? "它只生长在南印度的少数山丘。心材色如余烬，经年转为深紫；密度高到可沉于水；上品散布细小金星。在中国，它被称作“小叶紫檀”，自明代起便是宫廷至宝。"
                : "It grows in only a few hills of South India. The heartwood is the colour of embers, deepening towards violet with age; dense enough to sink; the finest scattered with tiny golden flecks. In China it is xiǎoyè zǐtán — treasured at court since the Ming dynasty."}
            </p>
          </Reveal>
          <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-10">
            {facts.map((f, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="border-t border-ink/20 pt-5">
                  <dt className="font-display text-6xl leading-none">
                    {f.v}
                    <span className="ml-2 align-top font-sans text-[12px] text-muted">{f.u}</span>
                  </dt>
                  <dd className="mt-3 text-[13px] text-graphite">{f.d}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Button href="/material" variant="outline" arrow>
              {zh ? "了解材质" : "About the material"}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 04 — Material / craft / restraint: three arches at staggered heights */
export function Pillars() {
  const { zh } = useT();
  const items = [
    { t: zh ? "材质" : "Material", d: zh ? "只用有文件记录的政府拍卖心材，每件皆有批次编号。" : "Only documented, government-auctioned heartwood. Every piece carries a traceable batch number.", img: "/images/e-grain-rich.jpg", href: "/material" },
    { t: zh ? "工艺" : "Craft", d: zh ? "蒂鲁帕蒂三代匠人手工完成。光泽来自木头本身。" : "Turned by three generations of craftsmen in Tirupati. The lustre is the wood's own — never lacquer.", img: "/images/e-chisel.jpg", href: "/craft" },
    { t: zh ? "克制" : "Restraint", d: zh ? "没有张扬的标志。四成木料在选料时即被舍弃。" : "No loud logos. Four in ten billets are refused at selection — what remains is allowed to speak.", img: "/images/p-incense.jpg", href: "/maison" },
  ];
  return (
    <Section className="py-28 md:py-40">
      <div className="mx-auto max-w-3xl text-center">
        <Label className="justify-center">{zh ? "我们的原则" : "What guides us"}</Label>
        <Heading className="mt-6 text-[clamp(2.8rem,5.4vw,5.4rem)]">
          <Words text={zh ? "材质、工艺" : "Material, craft"} /> <em className="text-clay">{zh ? "与克制" : "& restraint"}</em>
        </Heading>
      </div>
      <div className="mt-20 grid gap-14 md:grid-cols-3 md:gap-10">
        {items.map((it, i) => (
          <Reveal key={it.t} delay={i * 0.1} className={cn(i === 1 && "md:mt-24", i === 2 && "md:mt-12")}>
            <Link href={it.href} className="group block text-center">
              <Photo src={it.img} alt={it.t} shape="arch" className="aspect-[3/4]" sizes="(min-width: 768px) 30vw, 100vw" zoom />
              <p className="mt-6 font-display text-[15px] italic text-muted">0{i + 1}</p>
              <h3 className="font-display text-4xl transition-colors group-hover:text-clay">{it.t}</h3>
              <p className="mx-auto mt-3 max-w-xs text-[14px] leading-relaxed text-graphite">{it.d}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 05 — Collections: an index with a cursor-following preview */
export function Collections() {
  const { l, zh } = useT();
  const products = useMaison((s) => s.products);
  const [hover, setHover] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <Section tone="paper" className="relative py-28 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label>{zh ? "系列" : "The collections"}</Label>
          <Heading className="mt-6 text-[clamp(2.8rem,5.4vw,5.4rem)]">
            {zh ? "同一种木，" : "One material,"} <em className="text-clay">{zh ? "五种形态" : "five forms"}</em>
          </Heading>
        </div>
        <Button href="/collections" variant="outline" arrow>
          {zh ? "全部作品" : "All objects"}
        </Button>
      </div>

      <div
        ref={listRef}
        className="relative mt-16 border-t border-ink/15"
        onPointerMove={(e) => {
          const r = listRef.current!.getBoundingClientRect();
          x.set(e.clientX - r.left);
          y.set(e.clientY - r.top);
        }}
        onPointerLeave={() => setHover(null)}
      >
        {COLLECTIONS.map((c, i) => {
          const count = products.filter((p) => p.collection === c.slug && p.status === "active").length;
          return (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              onPointerEnter={() => setHover(i)}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-ink/15 py-6 md:grid-cols-[80px_1fr_1fr_auto] md:py-8"
            >
              <span className="font-display text-lg italic text-muted">0{i + 1}</span>
              <span className="flex items-center gap-4">
                <Photo src={c.image} alt="" shape="circle" className="h-14 w-14 shrink-0 md:hidden" sizes="56px" />
                <span className="font-display text-[clamp(2.2rem,5vw,4.8rem)] leading-none transition-all duration-500 group-hover:translate-x-3 group-hover:italic group-hover:text-clay">
                  {l(c.name)}
                </span>
              </span>
              <span className="hidden text-[14px] text-graphite md:block">{l(c.blurb)}</span>
              <span className="flex items-center gap-4 text-[13px] text-muted">
                <span className="hidden sm:inline">{count} {zh ? "件" : "pieces"}</span>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-ink/20 transition-all duration-500 group-hover:rotate-45 group-hover:border-clay group-hover:bg-clay group-hover:text-cream">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </span>
            </Link>
          );
        })}

        <AnimatePresence>
          {hover !== null && (
            <motion.div
              className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[340px] w-[260px] md:block"
              style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
              initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="arch relative h-full w-full overflow-hidden shadow-[0_30px_60px_-20px_rgba(43,26,19,0.45)]">
                {COLLECTIONS.map((c, i) => (
                  <Image key={c.slug} src={c.image} alt="" fill sizes="260px" className={cn("object-cover transition-opacity duration-300", hover === i ? "opacity-100" : "opacity-0")} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}

/* 06 — Selected pieces: horizontal gallery (products pushed from admin) */
export function Curated() {
  const { t, zh } = useT();
  const currency = useShop((s) => s.currency);
  const china = usePlacement("china-edit", "China");
  const curated = usePlacement("home-curated");
  const featured = useMaison((s) => s.products).filter((p) => p.featured && p.status === "active");
  const base = regionFromCurrency(currency) === "China" && china.length ? china : curated;
  const list = [...base, ...featured.filter((p) => !base.some((b) => b.id === p.id))].slice(0, 8);
  return (
    <section className="overflow-hidden bg-blush py-28 md:py-36">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-6 px-5 md:px-10">
        <div>
          <Label>{zh ? "从材质开始" : "Start with the material"}</Label>
          <Heading className="mt-6 text-[clamp(2.8rem,5.4vw,5.4rem)]">
            {zh ? "为您" : "Selected"} <em className="text-clay">{zh ? "甄选" : "pieces"}</em>
          </Heading>
        </div>
        <Button href="/collections" arrow>
          {t("cta.viewAll")}
        </Button>
      </div>
      <div className="no-scrollbar mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:gap-8 md:px-10">
        {list.map((p, i) => (
          <div key={p.id} className="w-[72vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[22vw]">
            <ProductCard p={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* 07 — Look closer: the one fully dark chapter */
const SIGNS = [
  { x: 30, y: 34, en: "Gold star", zh: "金星", d: { en: "Crystallised deposits that glint like stars — the mark of mature heartwood.", zh: "如星闪烁的结晶沉积——成熟心材的标志。" } },
  { x: 66, y: 28, en: "Cow-hair grain", zh: "牛毛纹", d: { en: "A fine, wavy grain found only in dense, slow-grown wood.", zh: "细密波状纹理，仅见于致密慢生的木材。" } },
  { x: 56, y: 68, en: "Natural oil", zh: "油性", d: { en: "Resin that surfaces with handling and builds a patina — baojiang.", zh: "随盘玩渗出的油脂，形成包浆。" } },
  { x: 24, y: 72, en: "Colour", zh: "色泽", d: { en: "Ember orange when cut; near-violet after years in the light.", zh: "新切为橙红，经年光照后近乎紫黑。" } },
];
export function LookCloser() {
  const { zh } = useT();
  const [active, setActive] = useState(0);
  return (
    <Section tone="cocoa" className="py-28 md:py-40">
      <div className="grid items-center gap-16 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <Photo src="/images/e-grain-rich.jpg" alt="Close-up of heartwood grain" shape="soft" className="aspect-[5/4] rounded-[40px]" />
          {SIGNS.map((s, i) => (
            <button key={s.en} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-label={s.en}>
              <span className={cn("relative grid h-10 w-10 place-items-center rounded-full border text-[12px] backdrop-blur transition-all duration-300", active === i ? "scale-110 border-cream bg-cream text-ink" : "border-cream/70 bg-cocoa/30 text-cream")}>
                {i + 1}
                {active === i && <span className="absolute inset-0 animate-ping rounded-full border border-cream/70" />}
              </span>
            </button>
          ))}
        </div>
        <div className="lg:col-span-5">
          <Label className="text-rose">{zh ? "细看" : "Look closer"}</Label>
          <Heading className="mt-6 text-[clamp(2.8rem,5vw,5rem)]">
            {zh ? "价值，" : "The value is"} <em className="text-ember">{zh ? "在细节之中" : "in the detail"}</em>
          </Heading>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-rose">
            {zh ? "藏家通过这四个特征辨别小叶紫檀的品级。" : "Collectors judge red sandalwood by four signs. Every piece we make is assessed against all of them."}
          </p>
          <ol className="mt-10">
            {SIGNS.map((s, i) => (
              <li key={s.en} className="border-t border-cream/15 last:border-b">
                <button onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="flex w-full items-start gap-5 py-5 text-left">
                  <span className={cn("mt-2 font-display text-lg italic", active === i ? "text-ember" : "text-rose/70")}>0{i + 1}</span>
                  <span className="flex-1">
                    <span className={cn("font-display text-3xl transition-colors", active === i ? "text-cream" : "text-cream/60")}>{zh ? s.zh : s.en}</span>
                    <span className="ml-3 text-[13px] text-rose">{zh ? s.en : s.zh}</span>
                    <AnimatePresence initial={false}>
                      {active === i && (
                        <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: EASE }} className="block overflow-hidden text-[14px] text-rose">
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
      </div>
    </Section>
  );
}

/* 08 — Making: cards that stack as you scroll */
const STEPS = [
  { en: "Select", zh: "选料", img: "/images/e-bark.jpg", tone: "bg-paper text-ink", sub: "text-graphite", d: { en: "Each billet is weighed, sounded and split. Four in ten are refused — too much sapwood, hidden checks, or density below 1.05.", zh: "每块木料都经称重、敲击与剖开检视。四成被淘汰。" } },
  { en: "Shape", zh: "成形", img: "/images/e-chisel.jpg", tone: "bg-blush text-ink", sub: "text-graphite", d: { en: "Turned and carved by hand with tools forged from old files. A bead takes a minute; the eye for it, a lifetime.", zh: "手工车制与雕刻，刀具由旧锉刀锻成。车一颗珠只需一分钟，练就眼力却需一生。" } },
  { en: "Finish", zh: "打磨", img: "/images/e-hands-bw.jpg", tone: "bg-stone text-ink", sub: "text-graphite", d: { en: "Seven grades of abrasive, then beeswax and the palm. No lacquer — the lustre is the wood's own oil rising.", zh: "七道砂磨，再以蜂蜡与手掌养护。不上漆——光泽来自木头自身的油脂。" } },
  { en: "Inspect", zh: "检验", img: "/images/p-beads-dark.jpg", tone: "bg-maroon text-cream", sub: "text-rose", d: { en: "Density measured, grain checked under raking light, every piece logged against its batch.", zh: "测量密度、侧光检视，每件作品登记入批次档案。" } },
  { en: "Present", zh: "呈献", img: "/images/p-box.jpg", tone: "bg-cocoa text-cream", sub: "text-rose", d: { en: "Wrapped in handloom cotton and cased, with its provenance card and a handwritten note.", zh: "手织棉布包裹，装盒，附溯源卡与手写便笺。" } },
];
export function Making() {
  const { zh } = useT();
  return (
    <Section className="py-28 md:py-40">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Label>{zh ? "制作" : "The making"}</Label>
            <Heading className="mt-6 text-[clamp(2.8rem,5vw,5rem)]">
              {zh ? "五个步骤，" : "Five stages,"} <em className="text-clay">{zh ? "一双手" : "one pair of hands"}</em>
            </Heading>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-graphite">
              {zh ? "每件作品由一位匠人从头做到尾，并在档案中留下名字。" : "Every object is made start to finish by one artisan, whose name is recorded in its file."}
            </p>
            <div className="mt-8">
              <TextLink href="/craft">{zh ? "走进工坊" : "Inside the atelier"}</TextLink>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {STEPS.map((s, i) => (
            <div key={s.en} className="sticky pb-6" style={{ top: `${110 + i * 22}px` }}>
              <div className={cn("grid items-center gap-6 rounded-[36px] p-5 shadow-[0_-12px_40px_-24px_rgba(43,26,19,0.5)] sm:grid-cols-[0.8fr_1fr] md:p-7", s.tone)}>
                <Photo src={s.img} alt={s.en} shape="arch" className="aspect-[4/5]" sizes="(min-width: 1024px) 24vw, 80vw" />
                <div className="pb-2 pr-2">
                  <p className="font-display text-7xl italic opacity-30">0{i + 1}</p>
                  <h3 className="mt-2 font-display text-5xl">{zh ? s.zh : s.en}</h3>
                  <p className={cn("mt-4 text-[15px] leading-relaxed", s.sub)}>{zh ? s.d.zh : s.d.en}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* 09 — Provenance (maroon) */
export function Provenance() {
  const { zh } = useT();
  const rows = [
    [zh ? "来源" : "Source", zh ? "安得拉邦塞沙查拉姆山 · 2023/117 号政府拍卖批" : "Seshachalam Hills, Andhra Pradesh — auction lot 2023/117"],
    [zh ? "批次" : "Batch", zh ? "心材 212 公斤 · 密度 1.18" : "212 kg heartwood · density 1.18"],
    [zh ? "加工" : "Processing", zh ? "自然风干 18 个月 · 蒂鲁帕蒂车制" : "Air-seasoned 18 months · turned in Tirupati"],
    [zh ? "认证" : "Certification", zh ? "CITES 附录 II 许可 · 监管链记录" : "CITES Appendix II permit · chain of custody"],
  ];
  return (
    <Section tone="maroon" className="overflow-hidden py-28 md:py-40">
      <div className="grid items-center gap-20 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <Parallax speed={0.05}>
            <Photo src="/images/e-hills-mist.jpg" alt="The Eastern Ghats in morning mist" shape="arch" className="aspect-[4/5] w-[86%]" />
          </Parallax>
          <Parallax speed={0.2} className="absolute -bottom-6 right-0 w-[40%]">
            <Photo src="/images/e-temple-tower.jpg" alt="Temple tower" shape="circle" className="aspect-square border-[10px] border-maroon" sizes="220px" />
          </Parallax>
          <p className="mt-4 text-[12px] text-rose">{zh ? "东高止山脉 · 安得拉邦" : "The Eastern Ghats, Andhra Pradesh"}</p>
        </div>
        <div className="lg:col-span-6">
          <Label className="text-rose">{zh ? "溯源" : "Provenance"}</Label>
          <Heading className="mt-6 text-[clamp(2.8rem,5vw,5rem)]">
            {zh ? "每一件，" : "Every piece knows"} <em className="text-ember">{zh ? "都有来处" : "where it came from"}</em>
          </Heading>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-rose">
            {zh ? "小叶紫檀受 CITES 保护。我们只使用有完整文件记录的合法木料，并把记录公开给您。" : "Red sandalwood is protected under CITES. We work only with legally documented stock — and we show you the paperwork."}
          </p>
          <Reveal className="mt-10 rounded-[32px] bg-paper p-7 text-ink md:p-9">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted">{zh ? "溯源档案" : "Provenance record"}</span>
              <span className="rounded-full bg-moss/10 px-3 py-1 text-moss">{zh ? "已验证" : "Verified"}</span>
            </div>
            <p className="mt-4 font-mono text-2xl tracking-wide md:text-3xl">SM-AP-24-017</p>
            <dl className="mt-6">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 border-t border-line py-3.5 text-[14px]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="col-span-2">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/provenance" variant="light" arrow>
              {zh ? "追溯一个批次" : "Trace a batch"}
            </Button>
            <Button href="/sourcing" variant="ghost-light">
              {zh ? "采购政策" : "Sourcing policy"}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 10 + 11 — Science & responsible sourcing */
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
          <Heading className="mt-6 text-[clamp(2.8rem,5vw,5rem)]">
            {zh ? "比水" : "A wood heavier"} <em className="text-clay">{zh ? "更重的木头" : "than water"}</em>
          </Heading>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
            {zh ? "它的红色来自不溶于水的天然色素“紫檀素”。高密度让每颗珠子沉手、耐用，并能随时间形成包浆。" : "Its red comes from santalins — natural pigments water cannot wash out. The density makes each bead heavy in the hand, durable, and able to build a patina over the years."}
          </p>
          <div className="mt-8">
            <TextLink href="/science">{zh ? "阅读科学" : "Read the science"}</TextLink>
          </div>
        </div>
        <div className="rounded-[36px] bg-paper p-7 md:p-10 lg:col-span-6 lg:col-start-7">
          <div className="flex justify-between text-[12px] text-muted">
            <span>{zh ? "气干密度 g/cm³" : "Air-dry density, g/cm³"}</span>
            <span>{zh ? "虚线 = 水" : "Dashed line = water"}</span>
          </div>
          <ul className="relative mt-6 space-y-5">
            <span className="pointer-events-none absolute bottom-0 top-0 border-l border-dashed border-ink/30" style={{ left: `${(1 / 1.3) * 100}%` }} />
            {woods.map((w, i) => (
              <li key={w.en}>
                <div className="flex justify-between text-[14px]">
                  <span className={w.hi ? "font-medium" : "text-graphite"}>{zh ? w.zh : w.en}</span>
                  <span className={cn("tabular-nums", w.hi && "font-medium text-clay")}>{w.v.toFixed(2)}</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-stone">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(w.v / 1.3) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.3, delay: i * 0.08, ease: EASE }}
                    className={cn("h-full rounded-full", w.hi ? "bg-clay" : "bg-graphite/35")}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-24 grid gap-6 md:grid-cols-3">
        {commitments.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.08} className="flex items-center gap-6 rounded-full border border-ink/15 py-4 pl-4 pr-8">
            <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-stone font-display text-3xl">{c.n}</span>
            <span className="text-[14px] leading-snug text-graphite">{c.d}</span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 12 — Gifting (blush collage) */
export function Gifting() {
  const { zh } = useT();
  const occasions = zh ? ["私人礼赠", "企业礼赠", "婚礼", "六十大寿", "酒店礼遇", "设计师合作"] : ["Personal", "Corporate", "Weddings", "60th birthdays", "Hospitality", "Designer collaborations"];
  const festivals = ["Diwali · 排灯节", "春节 · Spring Festival", "中秋 · Mid-Autumn", "Akshaya Tritiya", "Wedding season"];
  return (
    <Section tone="blush" className="overflow-hidden py-28 md:py-40">
      <div className="grid items-center gap-20 lg:grid-cols-12">
        <div className="relative order-2 h-[560px] lg:order-1 lg:col-span-6 lg:h-[680px]">
          <Parallax speed={0.05} className="absolute left-0 top-0 w-[58%]">
            <Photo src="/images/p-wedding.jpg" alt="Henna hands and bangles at a wedding" shape="arch" className="aspect-[3/4]" sizes="(min-width: 1024px) 30vw, 60vw" />
          </Parallax>
          <Parallax speed={0.1} className="absolute right-0 top-[14%] w-[40%]">
            <Photo src="/images/p-box-carved.jpg" alt="Carved gift box" shape="circle" className="aspect-square border-[10px] border-blush" sizes="260px" />
          </Parallax>
          <Parallax speed={0.14} className="absolute bottom-[4%] left-[38%] w-[34%]">
            <Photo src="/images/p-earrings.jpg" alt="Earrings" shape="soft" className="aspect-[4/5] rounded-[28px] border-[10px] border-blush" sizes="240px" />
          </Parallax>
        </div>
        <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <Label>{zh ? "礼赠" : "Gifting"}</Label>
          <Heading className="mt-6 text-[clamp(2.8rem,5vw,5rem)]">
            {zh ? "值得" : "A gift that becomes"} <em className="text-clay">{zh ? "传承的礼物" : "an heirloom"}</em>
          </Heading>
          <p className="mt-6 text-[15px] leading-relaxed text-graphite">
            {zh ? "每件礼物装于漆盒，附手写卡片与溯源档案。婚礼、节庆与企业礼赠，由礼宾团队全程定制。" : "Every gift arrives cased, with a handwritten card and its provenance record. For weddings, festivals and corporate programmes, our gifting team handles everything."}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {occasions.map((o) => (
              <span key={o} className="rounded-full bg-paper/70 px-4 py-2 text-[13px]">
                {o}
              </span>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-muted">{festivals.join("  ·  ")}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/gifting" arrow>
              {zh ? "礼赠服务" : "Explore gifting"}
            </Button>
            <Button href="/enquiries?type=Corporate" variant="outline">
              {zh ? "企业咨询" : "Corporate enquiry"}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 13 — Founder */
export function Founder() {
  const { zh } = useT();
  return (
    <Section className="py-28 md:py-40">
      <div className="grid items-center gap-16 lg:grid-cols-12">
        <div className="relative mx-auto w-full max-w-[460px] lg:col-span-5">
          <Photo src="/images/e-elder-mala.jpg" alt="Hands holding a mala" shape="circle" className="aspect-square" sizes="460px" />
          <Badge text="Why we began · 缘起 · Since 2024 · " className="absolute -right-2 -top-2 bg-page text-graphite md:-right-8" center={<span className="font-display text-3xl italic text-clay">“</span>} />
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <Label>{zh ? "缘起" : "Why we began"}</Label>
          <blockquote className="mt-8 font-display text-[clamp(2rem,3.4vw,3.4rem)] leading-[1.12]">
            {zh ? (
              <>
                “我的祖母每天清晨都会研磨红檀。我想让世界看到，这种木材<em className="text-clay">值得被认真对待</em>——被溯源、被尊重、被好好制作。”
              </>
            ) : (
              <>
                “My grandmother ground red sandalwood every morning. I wanted the world to see this wood <em className="text-clay">treated with the seriousness it deserves</em> — traced, respected, and made well.”
              </>
            )}
          </blockquote>
          <p className="mt-8 text-[14px] text-graphite">{zh ? "创始人，Santalum Maison" : "Founder, Santalum Maison"}</p>
          <div className="mt-8">
            <TextLink href="/founder">{zh ? "阅读创始人手记" : "Read the founder's letter"}</TextLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 14 — Journal */
export function Journal() {
  const { l, zh, locale } = useT();
  return (
    <Section tone="stone" className="py-28 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Label>{zh ? "札记" : "Journal"}</Label>
          <Heading className="mt-6 text-[clamp(2.8rem,5vw,5rem)]">
            {zh ? "关于材质的" : "Notes on"} <em className="text-clay">{zh ? "笔记" : "the material"}</em>
          </Heading>
        </div>
        <Button href="/journal" variant="outline" arrow>
          {zh ? "全部文章" : "All entries"}
        </Button>
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
        {JOURNAL.slice(0, 3).map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08} className={cn(i === 1 && "md:mt-16")}>
            <Link href={`/journal/${p.slug}`} className="group block">
              <Photo src={p.image} alt={p.title.en} shape="soft" className="aspect-[4/5] rounded-[32px]" sizes="(min-width: 768px) 30vw, 100vw" zoom />
              <p className="mt-5 flex items-center gap-3 text-[12px] text-muted">
                <span className="rounded-full border border-ink/20 px-3 py-1">{p.category}</span>
                {fmtDate(p.date, locale)}
              </p>
              <h3 className="mt-3 font-display text-3xl leading-tight transition-colors group-hover:text-clay">{l(p.title)}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 15–17 — Circle, private enquiries, contact */
export function Closing() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  return (
    <section className="bg-page pb-28 md:pb-40">
      <div className="mx-auto max-w-[1680px] px-3 md:px-5">
        <div className="relative overflow-hidden rounded-[48px] bg-maroon px-6 py-20 text-cream md:rounded-[64px] md:px-16 md:py-28">
          <div className="pointer-events-none absolute right-16 top-16 hidden h-[400px] w-[300px] xl:block">
            <Photo src="/images/p-mala-red.jpg" alt="" shape="arch" className="h-full w-full" sizes="300px" />
            <Badge text="Speak with us · 私人咨询 · By appointment · " className="absolute -bottom-10 -left-12 bg-maroon text-rose" center={<span className="font-display text-2xl italic text-cream">S</span>} />
          </div>
          <div className="relative max-w-3xl">
            <Label className="text-rose">{zh ? "私人咨询" : "Private enquiries"}</Label>
            <Heading className="mt-6 text-[clamp(3rem,6vw,6.2rem)]">
              {zh ? "与我们" : "Speak with us,"} <em className="text-ember">{zh ? "私下交谈" : "privately"}</em>
            </Heading>
            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-rose">
              {zh ? "定制、收藏级老料、婚礼与企业礼赠、酒店与设计合作——每一份咨询都由专属顾问亲自回复。" : "Commissions, collector-grade old material, weddings, corporate gifting, hospitality and design — every enquiry is answered personally."}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/enquiries" variant="light" size="lg" arrow>
                {zh ? "提交咨询" : "Make an enquiry"}
              </Button>
              <Button href="/contact" variant="ghost-light" size="lg">
                {zh ? "预约到访" : "Book a studio visit"}
              </Button>
            </div>
          </div>
          <div className="relative mt-20 grid gap-8 border-t border-cream/15 pt-10 text-[14px] md:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-rose">Santalum Circle</p>
              <p className="mt-2">{zh ? "免费加入，优先购买限量批次" : "Free to join · first access to limited batches"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-rose">{zh ? "工作室" : "Studio"}</p>
              <p className="mt-2">Lavelle Road, Bengaluru · {zh ? "仅限预约" : "by appointment"}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-rose">WhatsApp</p>
              <p className="mt-2">{content.whatsapp}</p>
            </div>
            <div className="flex items-center gap-3">
              <QrMark className="h-14 w-14 rounded-md" seed={3} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-rose">{zh ? "微信" : "WeChat"}</p>
                <p className="mt-1">{content.wechat}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
