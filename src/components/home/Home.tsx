"use client";

import Link from "next/link";
import { useState } from "react";
import { useMaison, usePlacement, useShop, useT } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import { JOURNAL } from "@/lib/data/journal";
import { regionFromCurrency } from "@/lib/cart";
import { ProductCard } from "../shop/ProductCard";
import { QrMark } from "../site/Footer";
import { Button, Heading, Label, Photo, Reveal, Section, TextLink } from "../motion/primitives";
import { cn, fmtDate } from "@/lib/utils";

/* 01 — Red Sandalwood / India */
export function Hero() {
  const { t, l, zh } = useT();
  const content = useMaison((s) => s.content);
  return (
    <section className="bg-page">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-16 pt-10 md:px-10 lg:min-h-[calc(100svh-112px)] lg:grid-cols-12 lg:gap-16 lg:pb-10">
        <div className="flex flex-col justify-end lg:col-span-5 lg:pb-10">
          <Reveal>
            <Label>{zh ? "小叶紫檀 · 印度" : "Red sandalwood · India"}</Label>
            <Heading as="h1" className="mt-6 text-[clamp(3.2rem,6.4vw,6.8rem)]">
              {l(content.heroTitle)}
            </Heading>
            <p className="mt-7 max-w-md text-[16px] leading-relaxed text-graphite">{l(content.heroSub)}</p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button href="/collections" size="lg">{t("cta.shop")}</Button>
              <TextLink href="/material">{t("cta.material")}</TextLink>
            </div>
          </Reveal>
        </div>
        <div className="lg:col-span-7">
          <Photo src="/images/p-carving.jpg" alt="Hand-carved red heartwood" priority className="aspect-[4/5] lg:h-full lg:aspect-auto" sizes="(min-width: 1024px) 58vw, 100vw" />
          <p className="mt-3 flex justify-between text-[12px] text-muted">
            <span>{zh ? "小叶紫檀心材，手工雕刻" : "Pterocarpus santalinus heartwood, hand-carved"}</span>
            <span>Tirupati</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* 02 — Material introduction */
export function Intro() {
  const { zh } = useT();
  return (
    <Section className="py-28 md:py-40">
      <Reveal className="mx-auto max-w-4xl text-center">
        <p className="font-display text-[clamp(1.9rem,3.4vw,3.1rem)] leading-[1.18]">
          {zh
            ? "有些材料是被挑选的。小叶紫檀却需要等待——在土里数十年，在工坊里数月，在腕上一生。"
            : "Some materials are chosen. Red sandalwood is earned — decades in the ground, months in the atelier, and a lifetime on the wrist."}
        </p>
      </Reveal>
    </Section>
  );
}

/* 03 — Meet Red Sandalwood */
export function Meet() {
  const { zh } = useT();
  const facts = [
    { v: "1.18", u: "g/cm³", d: zh ? "平均密度——沉于水" : "Average density. It sinks in water." },
    { v: "30+", u: zh ? "年" : "years", d: zh ? "形成可用心材所需" : "For a tree to form workable heartwood." },
    { v: "1", u: zh ? "个产区" : "region", d: zh ? "南印度东高止山脉" : "On earth: the Eastern Ghats of South India." },
    { v: "108", u: zh ? "颗" : "beads", d: zh ? "一串念珠，逐颗手工车制" : "In a mala, each one turned by hand." },
  ];
  return (
    <Section tone="stone" className="py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <Photo src="/images/p-grain-red.jpg" alt="Red sandalwood grain" className="aspect-[4/5]" />
        </Reveal>
        <div className="flex flex-col justify-center lg:col-span-5 lg:col-start-8">
          <Reveal>
            <Label>{zh ? "认识小叶紫檀" : "Meet red sandalwood"}</Label>
            <Heading className="mt-5 text-[clamp(2.4rem,4vw,3.8rem)]">
              <em>Pterocarpus santalinus</em>
            </Heading>
            <p className="mt-6 text-[16px] leading-relaxed text-graphite">
              {zh
                ? "它只生长在南印度的少数山丘。心材色如余烬，经年转为深紫；密度高到可沉于水；上品散布细小金星。在中国，它被称作“小叶紫檀”，自明代起便是宫廷至宝。"
                : "It grows in only a few hills of South India. The heartwood is the colour of embers, deepening towards violet with age; dense enough to sink; the finest scattered with tiny golden flecks. In China it is xiǎoyè zǐtán — treasured at court since the Ming dynasty."}
            </p>
          </Reveal>
          <dl className="mt-12 grid grid-cols-2 border-t border-line">
            {facts.map((f, i) => (
              <div key={i} className={cn("border-b border-line py-6", i % 2 === 0 && "border-r pr-6", i % 2 === 1 && "pl-6")}>
                <dt className="font-display text-4xl">
                  {f.v} <span className="font-sans text-[12px] text-muted">{f.u}</span>
                </dt>
                <dd className="mt-2 text-[13px] leading-snug text-graphite">{f.d}</dd>
              </div>
            ))}
          </dl>
          <TextLink href="/material" className="mt-10 self-start">{zh ? "了解材质" : "About the material"}</TextLink>
        </div>
      </div>
    </Section>
  );
}

/* 04 — Material / Craft / Restraint */
export function Pillars() {
  const { zh } = useT();
  const items = [
    { t: zh ? "材质" : "Material", d: zh ? "只使用有文件记录的政府拍卖心材。每件作品都有可追溯的批次编号。" : "Only documented, government-auctioned heartwood. Every piece carries a batch number you can trace.", img: "/images/e-grain-rich.jpg", href: "/material" },
    { t: zh ? "工艺" : "Craft", d: zh ? "蒂鲁帕蒂三代车木匠人手工完成。光泽来自木头本身，而非漆面。" : "Turned by three generations of craftsmen in Tirupati. The lustre is the wood's own — never lacquer.", img: "/images/e-chisel.jpg", href: "/craft" },
    { t: zh ? "克制" : "Restraint", d: zh ? "没有张扬的标志。四成木料在选料阶段即被舍弃。" : "No loud logos, no excess. Four in ten billets are refused at selection.", img: "/images/p-incense.jpg", href: "/maison" },
  ];
  return (
    <Section className="py-24 md:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <Heading className="text-[clamp(2.4rem,4vw,3.8rem)]">{zh ? "材质、工艺、克制" : "Material, craft, restraint"}</Heading>
        <p className="max-w-sm text-[15px] text-graphite">{zh ? "三个原则，决定我们做什么——以及不做什么。" : "Three principles that decide what we make — and, more often, what we don't."}</p>
      </div>
      <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
        {items.map((it, i) => (
          <Reveal key={it.t} delay={i * 0.08}>
            <Link href={it.href} className="group block">
              <Photo src={it.img} alt={it.t} className="aspect-[3/4]" sizes="(min-width: 768px) 33vw, 100vw" zoom />
              <p className="mt-5 text-[12px] text-muted">0{i + 1}</p>
              <h3 className="mt-1 font-display text-3xl">{it.t}</h3>
              <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-graphite">{it.d}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 05 — Collections */
export function Collections() {
  const { l, zh } = useT();
  const [first, ...rest] = COLLECTIONS;
  return (
    <Section tone="paper" className="py-24 md:py-32">
      <div className="flex items-end justify-between">
        <div>
          <Label>{zh ? "系列" : "Collections"}</Label>
          <Heading className="mt-4 text-[clamp(2.4rem,4vw,3.8rem)]">{zh ? "同一种木，五种形态" : "One material, five forms"}</Heading>
        </div>
        <TextLink href="/collections" className="hidden md:inline-flex">{zh ? "全部作品" : "All objects"}</TextLink>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-4 md:grid-rows-2">
        <Reveal className="md:col-span-2 md:row-span-2">
          <Link href={`/collections/${first.slug}`} className="group block h-full">
            <Photo src={first.image} alt={first.name.en} className="aspect-[4/5] md:aspect-auto md:h-[calc(100%-4.5rem)]" zoom />
            <div className="mt-4 flex items-baseline justify-between">
              <h3 className="font-display text-3xl">{l(first.name)}</h3>
              <span className="text-[13px] text-muted">{l(first.kicker)}</span>
            </div>
          </Link>
        </Reveal>
        {rest.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.06}>
            <Link href={`/collections/${c.slug}`} className="group block">
              <Photo src={c.image} alt={c.name.en} className="aspect-[4/3]" sizes="(min-width: 768px) 25vw, 100vw" zoom />
              <h3 className="mt-3 font-display text-2xl">{l(c.name)}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 06 — Start with the material (products pushed from admin → Recommendations) */
export function Curated() {
  const { t, zh } = useT();
  const currency = useShop((s) => s.currency);
  const china = usePlacement("china-edit", "China");
  const curated = usePlacement("home-curated");
  const list = (regionFromCurrency(currency) === "China" && china.length ? china : curated).slice(0, 4);
  return (
    <Section className="py-24 md:py-32">
      <div className="flex items-end justify-between">
        <div>
          <Label>{zh ? "从材质开始" : "Start with the material"}</Label>
          <Heading className="mt-4 text-[clamp(2.4rem,4vw,3.8rem)]">{zh ? "为您甄选" : "Selected pieces"}</Heading>
        </div>
        <TextLink href="/collections">{t("cta.viewAll")}</TextLink>
      </div>
      <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
        {list.map((p, i) => (
          <ProductCard key={p.id} p={p} index={i} />
        ))}
      </div>
    </Section>
  );
}

/* 07 — Look closer */
const SIGNS = [
  { x: 32, y: 36, en: "Gold star", zh: "金星", d: { en: "Crystallised deposits that glint like stars — a mark of mature heartwood.", zh: "如星闪烁的结晶沉积——成熟心材的标志。" } },
  { x: 64, y: 30, en: "Cow-hair grain", zh: "牛毛纹", d: { en: "A fine, wavy grain found only in dense, slow-grown wood.", zh: "细密波状纹理，仅见于致密慢生的木材。" } },
  { x: 55, y: 70, en: "Natural oil", zh: "油性", d: { en: "Resin that surfaces with handling and builds a patina.", zh: "随盘玩渗出的油脂，形成包浆。" } },
  { x: 22, y: 72, en: "Colour", zh: "色泽", d: { en: "Ember orange when cut; close to violet after years in light.", zh: "新切为橙红，经年光照后近乎紫黑。" } },
];
export function LookCloser() {
  const { zh } = useT();
  const [active, setActive] = useState(0);
  return (
    <Section tone="stone" className="py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Label>{zh ? "细看" : "Look closer"}</Label>
          <Heading className="mt-4 text-[clamp(2.4rem,4vw,3.8rem)]">{zh ? "价值，在细节之中" : "The value is in the detail"}</Heading>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
            {zh ? "藏家通过这四个特征辨别小叶紫檀的品级。" : "Collectors judge red sandalwood by four signs. Each piece we make is assessed against all of them."}
          </p>
          <ol className="mt-10 border-t border-line">
            {SIGNS.map((s, i) => (
              <li key={s.en} className="border-b border-line">
                <button onMouseEnter={() => setActive(i)} onClick={() => setActive(i)} className="flex w-full items-start gap-5 py-5 text-left">
                  <span className={cn("mt-1 text-[12px] tabular-nums", active === i ? "text-clay" : "text-muted")}>0{i + 1}</span>
                  <span>
                    <span className="font-display text-2xl">{zh ? s.zh : s.en}</span>
                    <span className="ml-3 text-[13px] text-muted">{zh ? s.en : s.zh}</span>
                    {active === i && <span className="mt-2 block text-[14px] text-graphite">{zh ? s.d.zh : s.d.en}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative lg:col-span-7">
          <Photo src="/images/e-grain-rich.jpg" alt="Close-up of heartwood grain" className="aspect-[4/5] lg:aspect-[5/6]" />
          {SIGNS.map((s, i) => (
            <button
              key={s.en}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              aria-label={s.en}
            >
              <span className={cn("grid h-8 w-8 place-items-center rounded-full border text-[11px] transition-colors", active === i ? "border-paper bg-paper text-ink" : "border-paper/80 text-paper")}>{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* 08 — Making */
const STEPS = [
  { en: "Select", zh: "选料", img: "/images/e-bark.jpg", d: { en: "Each billet is weighed, sounded and split. Four in ten are refused.", zh: "每块木料都经称重、敲击与剖开检视。四成被淘汰。" } },
  { en: "Shape", zh: "成形", img: "/images/e-chisel.jpg", d: { en: "Turned and carved by hand, with tools forged from old files.", zh: "手工车制与雕刻，刀具由旧锉刀锻成。" } },
  { en: "Finish", zh: "打磨", img: "/images/e-hands-bw.jpg", d: { en: "Seven grades of abrasive, then beeswax and the palm. No lacquer.", zh: "七道砂磨，再以蜂蜡与手掌养护。不上漆。" } },
  { en: "Inspect", zh: "检验", img: "/images/p-beads-dark.jpg", d: { en: "Density measured, grain checked in raking light, logged to its batch.", zh: "测量密度、侧光检视，登记入批次档案。" } },
  { en: "Present", zh: "呈献", img: "/images/p-box.jpg", d: { en: "Wrapped in handloom cotton, cased, with its provenance card.", zh: "手织棉布包裹，装盒，附溯源卡。" } },
];
export function Making() {
  const { zh } = useT();
  return (
    <section className="bg-page py-24 md:py-32">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between px-5 md:px-10">
        <div>
          <Label>{zh ? "制作" : "The making"}</Label>
          <Heading className="mt-4 text-[clamp(2.4rem,4vw,3.8rem)]">{zh ? "五个步骤，一双手" : "Five stages, one pair of hands"}</Heading>
        </div>
        <TextLink href="/craft" className="hidden md:inline-flex">{zh ? "走进工坊" : "Inside the atelier"}</TextLink>
      </div>
      <div className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 md:px-10 xl:mx-auto xl:grid xl:max-w-[1440px] xl:grid-cols-5 xl:overflow-visible">
        {STEPS.map((s, i) => (
          <Reveal key={s.en} delay={i * 0.06} className="w-[72vw] shrink-0 snap-start sm:w-[40vw] xl:w-auto">
            <Photo src={s.img} alt={s.en} className="aspect-[3/4]" sizes="(min-width: 1280px) 20vw, 70vw" />
            <p className="mt-4 text-[12px] text-muted">0{i + 1}</p>
            <h3 className="font-display text-2xl">{zh ? s.zh : s.en}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-graphite">{zh ? s.d.zh : s.d.en}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 09 — Provenance: the single deep-red chapter */
export function Provenance() {
  const { zh } = useT();
  const rows = [
    [zh ? "来源" : "Source", zh ? "安得拉邦塞沙查拉姆山 · 2023/117 号政府拍卖批" : "Seshachalam Hills, Andhra Pradesh — government auction lot 2023/117"],
    [zh ? "批次" : "Batch", zh ? "心材 212 公斤 · 密度 1.18" : "212 kg heartwood · density 1.18"],
    [zh ? "加工" : "Processing", zh ? "自然风干 18 个月 · 蒂鲁帕蒂车制 · 油养" : "Air-seasoned 18 months · turned in Tirupati · oil-finished"],
    [zh ? "认证" : "Certification", zh ? "CITES 附录 II 许可 · 监管链记录" : "CITES Appendix II permit · chain-of-custody record"],
  ];
  return (
    <>
      <div className="relative">
        <Photo src="/images/e-hills-mist.jpg" alt="Hills of the Eastern Ghats in morning mist" className="h-[60vh] min-h-[380px] w-full" sizes="100vw" />
        <p className="absolute bottom-4 left-5 text-[12px] text-paper md:left-10">{zh ? "东高止山脉 · 安得拉邦" : "The Eastern Ghats, Andhra Pradesh"}</p>
      </div>
      <Section tone="clay" className="py-24 md:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label className="text-rose">{zh ? "溯源" : "Provenance"}</Label>
            <Heading className="mt-4 text-[clamp(2.4rem,4vw,3.8rem)] text-paper">{zh ? "每一件，都有来处" : "Every piece knows where it came from"}</Heading>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-rose">
              {zh ? "小叶紫檀受 CITES 保护。我们只使用有完整文件记录的合法木料，并把记录公开给您。" : "Red sandalwood is protected under CITES. We work only with legally documented stock — and we show you the paperwork."}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/provenance" variant="light">{zh ? "追溯一个批次" : "Trace a batch"}</Button>
              <TextLink href="/sourcing" className="text-paper">{zh ? "采购政策" : "Sourcing policy"}</TextLink>
            </div>
          </div>
          <Reveal className="bg-paper p-8 text-ink md:p-12 lg:col-span-6 lg:col-start-7">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-muted">{zh ? "溯源档案" : "Provenance record"}</span>
              <span className="text-moss">● {zh ? "已验证" : "Verified"}</span>
            </div>
            <p className="mt-4 font-mono text-2xl tracking-wide md:text-3xl">SM-AP-24-017</p>
            <dl className="mt-8 border-t border-line">
              {rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 border-b border-line py-4 text-[14px]">
                  <dt className="text-muted">{k}</dt>
                  <dd className="col-span-2">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>
    </>
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
    <Section className="py-24 md:py-32">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Label>{zh ? "科学" : "Science"}</Label>
          <Heading className="mt-4 text-[clamp(2.4rem,4vw,3.8rem)]">{zh ? "比水更重的木头" : "A wood heavier than water"}</Heading>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-graphite">
            {zh
              ? "它的红色来自不溶于水的天然色素“紫檀素”。高密度让每颗珠子沉手、耐用，并能随时间形成包浆。"
              : "Its red comes from santalins — natural pigments that water cannot wash out. The density makes each bead heavy in the hand, durable, and able to build a patina over years."}
          </p>
          <TextLink href="/science" className="mt-8">{zh ? "阅读科学" : "Read the science"}</TextLink>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="flex justify-between border-b border-ink pb-3 text-[12px] text-muted">
            <span>{zh ? "气干密度 (g/cm³)" : "Air-dry density (g/cm³)"}</span>
            <span>{zh ? "水 = 1.00" : "Water = 1.00"}</span>
          </div>
          <ul>
            {woods.map((w) => (
              <li key={w.en} className="grid grid-cols-[1fr_2fr_auto] items-center gap-4 border-b border-line py-3.5 text-[14px]">
                <span className={w.hi ? "font-medium" : "text-graphite"}>{zh ? w.zh : w.en}</span>
                <span className="relative h-px bg-line">
                  <span className={cn("absolute left-0 top-1/2 h-[3px] -translate-y-1/2", w.hi ? "bg-clay" : "bg-graphite/40")} style={{ width: `${(w.v / 1.3) * 100}%` }} />
                  <span className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-ink/40" style={{ left: `${(1 / 1.3) * 100}%` }} />
                </span>
                <span className="tabular-nums">{w.v.toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] text-muted">{zh ? "典型值，因产地与含水率而异。竖线为水的密度。" : "Typical values; vary with origin and moisture. The tick marks the density of water."}</p>
        </div>
      </div>
      <div className="mt-24 grid border-t border-line md:grid-cols-3">
        {commitments.map((c, i) => (
          <Reveal key={c.n} delay={i * 0.06} className={cn("py-10 md:px-10", i > 0 && "border-t border-line md:border-l md:border-t-0", i === 0 && "md:pl-0")}>
            <p className="font-display text-6xl">{c.n}</p>
            <p className="mt-3 max-w-[260px] text-[14px] text-graphite">{c.d}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 12 — Gifting */
export function Gifting() {
  const { zh } = useT();
  const kinds = zh
    ? [["私人", "送给懂得欣赏的人"], ["企业", "10 件起订，可刻企业标志"], ["人生节点", "婚礼、六十与七十大寿"], ["酒店", "令人难忘的客房礼遇"], ["设计师合作", "为空间定制的木作"]]
    : [["Personal", "For those who notice"], ["Corporate", "From ten pieces, engraved"], ["Milestones", "Weddings, 60th and 70th birthdays"], ["Hospitality", "Amenities that are remembered"], ["Designer collaborations", "Bespoke heartwood for interiors"]];
  return (
    <Section tone="stone" className="py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <Photo src="/images/p-wedding.jpg" alt="Hands with henna and bangles at a South Indian wedding" className="aspect-[4/3]" />
        </Reveal>
        <div className="flex flex-col justify-center lg:col-span-5">
          <Label>{zh ? "礼赠" : "Gifting"}</Label>
          <Heading className="mt-4 text-[clamp(2.4rem,4vw,3.8rem)]">{zh ? "值得传承的礼物" : "A gift that becomes an heirloom"}</Heading>
          <p className="mt-6 text-[15px] leading-relaxed text-graphite">
            {zh ? "每件礼物装于漆盒，附手写卡片与溯源档案。排灯节、婚礼、春节，或任何重要时刻。" : "Every gift arrives cased, with a handwritten card and its provenance record — for Diwali, weddings, Spring Festival, or any moment that matters."}
          </p>
          <ul className="mt-8 border-t border-line">
            {kinds.map(([k, d]) => (
              <li key={k} className="flex items-baseline justify-between gap-4 border-b border-line py-3.5 text-[14px]">
                <span className="font-medium">{k}</span>
                <span className="text-right text-graphite">{d}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Button href="/gifting">{zh ? "礼赠服务" : "Explore gifting"}</Button>
            <TextLink href="/enquiries?type=Corporate">{zh ? "企业咨询" : "Corporate enquiry"}</TextLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* 13 — Journal */
export function Journal() {
  const { l, zh, locale } = useT();
  return (
    <Section className="py-24 md:py-32">
      <div className="flex items-end justify-between">
        <div>
          <Label>{zh ? "札记" : "Journal"}</Label>
          <Heading className="mt-4 text-[clamp(2.4rem,4vw,3.8rem)]">{zh ? "关于材质的笔记" : "Notes on the material"}</Heading>
        </div>
        <TextLink href="/journal" className="hidden md:inline-flex">{zh ? "全部文章" : "All entries"}</TextLink>
      </div>
      <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
        {JOURNAL.slice(0, 3).map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.06}>
            <Link href={`/journal/${p.slug}`} className="group block">
              <Photo src={p.image} alt={p.title.en} className="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" zoom />
              <p className="mt-4 text-[12px] text-muted">{p.category} · {fmtDate(p.date, locale)}</p>
              <h3 className="mt-2 font-display text-2xl leading-snug group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{l(p.title)}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 14 — Founder */
export function Founder() {
  const { zh } = useT();
  return (
    <Section tone="paper" className="py-24 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <Photo src="/images/e-elder-mala.jpg" alt="Hands holding a mala" className="aspect-[4/5]" />
        </Reveal>
        <div className="lg:col-span-6 lg:col-start-7">
          <Label>{zh ? "缘起" : "Why we began"}</Label>
          <blockquote className="mt-6 font-display text-[clamp(1.9rem,3vw,2.9rem)] leading-[1.2]">
            {zh
              ? "“我的祖母每天清晨都会研磨红檀。我想让世界看到，这种木材值得被认真对待——被溯源、被尊重、被好好制作。”"
              : "“My grandmother ground red sandalwood every morning. I wanted the world to see this wood treated with the seriousness it deserves — traced, respected, and made well.”"}
          </blockquote>
          <p className="mt-8 text-[14px] text-graphite">{zh ? "创始人，Santalum Maison" : "Founder, Santalum Maison"}</p>
          <TextLink href="/founder" className="mt-8">{zh ? "阅读创始人手记" : "Read the founder's letter"}</TextLink>
        </div>
      </div>
    </Section>
  );
}

/* 15–17 — Santalum Circle, private enquiries, contact */
export function CircleEnquiriesContact() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  return (
    <Section className="py-24 md:py-32">
      <div className="grid gap-px bg-line md:grid-cols-3">
        <div className="bg-page p-0 py-10 md:pr-10">
          <Label>Santalum Circle</Label>
          <h3 className="mt-4 font-display text-3xl">{zh ? "一个安静的收藏者圈子" : "A quiet circle of collectors"}</h3>
          <p className="mt-4 text-[14px] leading-relaxed text-graphite">
            {zh ? "优先购买限量批次、私人鉴赏会邀请、终身免费油养。免费加入。" : "First access to limited batches, private viewings and lifetime re-oiling. Free to join."}
          </p>
          <TextLink href="/account" className="mt-6">{zh ? "加入" : "Join the Circle"}</TextLink>
        </div>
        <div className="bg-page py-10 md:px-10">
          <Label>{zh ? "私人咨询" : "Private enquiries"}</Label>
          <h3 className="mt-4 font-display text-3xl">{zh ? "定制、收藏与合作" : "Commissions, collecting, collaborations"}</h3>
          <p className="mt-4 text-[14px] leading-relaxed text-graphite">
            {zh ? "婚礼、企业礼赠、酒店与设计合作——由专属顾问亲自回复。" : "Weddings, corporate gifting, hospitality and design — every enquiry answered personally."}
          </p>
          <TextLink href="/enquiries" className="mt-6">{zh ? "提交咨询" : "Make an enquiry"}</TextLink>
        </div>
        <div className="bg-page py-10 md:pl-10">
          <Label>{zh ? "联系我们" : "Contact"}</Label>
          <h3 className="mt-4 font-display text-3xl">{zh ? "班加罗尔工作室" : "Bengaluru studio"}</h3>
          <p className="mt-4 text-[14px] leading-relaxed text-graphite">
            Lavelle Road, Bengaluru 560001 · {zh ? "仅限预约" : "by appointment"}
            <br />
            WhatsApp {content.whatsapp}
          </p>
          <div className="mt-5 flex items-center gap-3 text-[13px] text-graphite">
            <QrMark className="h-12 w-12" seed={3} />
            {zh ? "微信" : "WeChat"}: {content.wechat}
          </div>
          <TextLink href="/contact" className="mt-6">{zh ? "预约到访" : "Book a visit"}</TextLink>
        </div>
      </div>
    </Section>
  );
}
