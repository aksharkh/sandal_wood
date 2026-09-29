"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { ProductVisual } from "../visual/ProductVisual";
import { EASE, Eyebrow, LineLink, LuxButton, Parallax, Reveal, SplitReveal, Tilt } from "../motion/primitives";
import { useMaison, useT } from "@/lib/store";
import { JOURNAL } from "@/lib/data/journal";
import { fmtDate } from "@/lib/utils";
import { QrMark } from "../site/Footer";

/* 12 — Gifting */
export function Gifting() {
  const { zh } = useT();
  const occasions = [
    { en: "Personal", zh: "私人", d: { en: "For the ones who notice", zh: "送给懂得欣赏的人" }, kind: "pendant" as const },
    { en: "Corporate", zh: "企业", d: { en: "Engraved, at any scale", zh: "可刻字，任意规模" }, kind: "cufflinks" as const },
    { en: "Milestones", zh: "人生节点", d: { en: "Weddings, 60th, 70th", zh: "婚礼、六十与七十大寿" }, kind: "bangle" as const },
    { en: "Hospitality", zh: "酒店", d: { en: "Amenities that are remembered", zh: "令人难忘的客房礼遇" }, kind: "comb" as const },
  ];
  const festivals = ["Diwali · 排灯节", "Wedding season · 婚礼季", "春节 · Spring Festival", "中秋 · Mid-Autumn", "Raksha Bandhan", "Akshaya Tritiya"];
  return (
    <section className="relative overflow-hidden bg-oxblood/40">
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_30%,rgba(158,47,31,.35),transparent_70%)]" />
      <div className="relative mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>{zh ? "礼赠" : "Gifting"}</Eyebrow>
            <h2 className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">
              <SplitReveal text={zh ? "值得被珍藏的礼物。" : "A gift that becomes an heirloom."} />
            </h2>
          </div>
          <div className="flex flex-col justify-end">
            <Reveal>
              <p className="max-w-md text-[15px] leading-relaxed text-bone/65">
                {zh
                  ? "每件礼物都装于朱红漆盒，附手写卡片与溯源档案。婚礼、节庆与企业礼赠，我们的礼宾团队可以为您全程定制。"
                  : "Every gift arrives in an oxblood lacquer case with a handwritten card and its provenance record. For weddings, festivals and corporate programmes, our gifting team handles everything."}
              </p>
            </Reveal>
            <div className="mt-6 flex flex-wrap gap-2">
              {festivals.map((f, i) => (
                <motion.span key={f} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-full border border-gold/25 px-3 py-1.5 text-[11px] text-gold/90">
                  {f}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {occasions.map((o, i) => (
            <Reveal key={o.en} delay={i * 0.08}>
              <Tilt className="group relative aspect-[3/4] overflow-hidden rounded-[26px] border border-bone/[0.08] bg-gradient-to-b from-cocoa to-ink">
                <Link href="/gifting" className="absolute inset-0 z-10" aria-label={o.en} />
                <ProductVisual kind={o.kind} tone={0.35 + i * 0.08} seed={30 + i} glow className="absolute inset-x-[8%] top-[4%] h-[62%] transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display text-3xl">{zh ? o.zh : o.en}</p>
                  <p className="mt-1 text-xs text-bone/50">{zh ? o.d.zh : o.d.en}</p>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <LuxButton href="/gifting" variant="gold">{zh ? "礼赠服务" : "Explore gifting"}</LuxButton>
          <LuxButton href="/enquiries?type=Corporate" variant="ghost">{zh ? "企业礼赠咨询" : "Corporate enquiry"}</LuxButton>
        </div>
      </div>
    </section>
  );
}

/* 13 — Santalum Circle */
export function Circle() {
  const { zh } = useT();
  const perks = zh
    ? ["限量批次优先购买", "私人鉴赏会邀请", "免费终身油养服务", "生日礼遇与刻字", "专属顾问（WhatsApp / 微信）"]
    : ["First access to limited batches", "Invitations to private viewings", "Complimentary lifetime re-oiling", "Birthday gift & free engraving", "A dedicated advisor on WhatsApp / WeChat"];
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="relative overflow-hidden rounded-[40px] p-[1px]">
        <div className="absolute inset-0 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0%,#c9a46a_10%,transparent_25%,transparent_50%,#9e2f1f_60%,transparent_75%)] [animation-duration:12s]" style={{ transformOrigin: "50% 50%", scale: "2" }} />
        <div className="relative grid gap-12 rounded-[39px] bg-ink px-8 py-14 md:px-16 md:py-20 lg:grid-cols-2">
          <div>
            <Eyebrow>Santalum Circle</Eyebrow>
            <h2 className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">
              {zh ? "一个安静的" : "A quiet"} <em className="text-gradient-gold">{zh ? "圈子" : "circle"}</em>
              {zh ? "。" : " of collectors."}
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-bone/60">
              {zh ? "免费加入。消费累计达 ¥10,000 / ₹1,00,000 自动升级为金卡会员。" : "Free to join. Circle Gold is extended automatically after ₹1,00,000 / ¥10,000 in purchases."}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <LuxButton href="/account" variant="gold">{zh ? "加入会员圈" : "Join the Circle"}</LuxButton>
            </div>
          </div>
          <ul className="space-y-0">
            {perks.map((p, i) => (
              <motion.li key={p} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.8, ease: EASE }} className="flex items-center justify-between border-b border-bone/[0.08] py-5">
                <span className="text-bone/85">{p}</span>
                <span className="font-mono text-[10px] text-gold">0{i + 1}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* 14 — Journal */
export function JournalTeaser() {
  const { l, zh, locale } = useT();
  const posts = JOURNAL.slice(0, 3);
  return (
    <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10 md:pb-40">
      <div className="flex items-end justify-between">
        <div>
          <Eyebrow>{zh ? "札记" : "Journal"}</Eyebrow>
          <h2 className="mt-5 font-display text-5xl font-light md:text-7xl">{zh ? "关于材质的笔记" : "Notes on the material"}</h2>
        </div>
        <LineLink href="/journal" className="hidden text-gold md:inline-flex">{zh ? "全部文章" : "All entries"}</LineLink>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.1}>
            <Link href={`/journal/${p.slug}`} className="group block">
              <div className={`relative overflow-hidden rounded-[26px] bg-gradient-to-br from-cocoa to-ink ${i === 0 ? "aspect-[4/5]" : "aspect-[4/5] md:mt-16"}`}>
                <Parallax speed={0.08} className="absolute inset-0">
                  <ProductVisual kind={p.visual} tone={0.3 + i * 0.12} seed={40 + i} className="h-full w-full scale-110 transition-transform duration-[1.4s] group-hover:scale-125" />
                </Parallax>
                <span className="absolute left-5 top-5 rounded-full bg-ink/50 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur">{p.category}</span>
              </div>
              <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">
                {fmtDate(p.date, locale)} · {p.readMins} min
              </p>
              <h3 className="mt-2 font-display text-2xl leading-snug transition-colors group-hover:text-blush md:text-3xl">{l(p.title)}</h3>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* 15 — Founder */
export function Founder() {
  const { zh } = useT();
  return (
    <section className="relative overflow-hidden bg-bone text-ink">
      <div className="mx-auto grid max-w-[1600px] items-center gap-16 px-5 py-28 md:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:py-40">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-gradient-to-br from-santal via-oxblood to-ink">
            <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ backgroundImage: "repeating-linear-gradient(95deg, rgba(0,0,0,.25) 0 1px, transparent 1px 7px)" }} />
            <ProductVisual kind="mala" tone={0.5} seed={51} glow={false} className="absolute inset-[10%]" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-bone">
              <div>
                <p className="font-display text-2xl">{zh ? "创始人" : "The Founder"}</p>
                <p className="text-xs text-bone/60">{zh ? "蒂鲁帕蒂 · 班加罗尔" : "Tirupati · Bengaluru"}</p>
              </div>
              <span className="font-mono text-[10px] text-bone/50">{zh ? "肖像待提供" : "Portrait to follow"}</span>
            </div>
          </div>
        </Reveal>
        <div>
          <Eyebrow className="text-santal [&>span]:bg-santal/60">{zh ? "缘起" : "Why we began"}</Eyebrow>
          <blockquote className="mt-8 font-display text-4xl font-light italic leading-[1.15] md:text-[3.4rem]">
            <SplitReveal
              stagger={0.025}
              text={
                zh
                  ? "“我的祖母每天清晨都会研磨红檀。我想让世界看到，这种木材值得被认真对待——被溯源、被尊重、被好好制作。”"
                  : "“My grandmother ground red sandalwood every morning. I wanted the world to see this wood treated with the seriousness it deserves — traced, respected, and made well.”"
              }
            />
          </blockquote>
          <Reveal delay={0.3}>
            <div className="mt-10 flex items-center gap-6">
              <svg viewBox="0 0 200 60" className="h-12 w-40 text-santal">
                <motion.path d="M5 40 C 25 5, 40 55, 60 30 S 90 10, 100 35 S 130 50, 140 25 S 175 20, 195 38" fill="none" stroke="currentColor" strokeWidth="1.6" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease: EASE }} />
              </svg>
              <LineLink href="/founder" className="text-santal">{zh ? "阅读创始人手记" : "Read the founder's letter"}</LineLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* 16 + 17 — Private enquiries & contact */
export function EnquiriesContact() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <div className="group relative h-full overflow-hidden rounded-[36px] border border-bone/[0.07] bg-gradient-to-br from-oxblood via-cocoa to-ink p-10 md:p-14">
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-ember/20 blur-[100px] transition-transform duration-1000 group-hover:scale-125" />
            <Eyebrow>{zh ? "私人咨询" : "Private enquiries"}</Eyebrow>
            <h2 className="relative mt-6 max-w-xl font-display text-5xl font-light leading-[1.02] md:text-6xl">
              {zh ? "定制、收藏、合作——与我们私下交谈。" : "Commissions, collecting, collaborations — speak with us privately."}
            </h2>
            <div className="relative mt-8 flex flex-wrap gap-2">
              {(zh ? ["私人定制", "婚礼与礼赠", "企业礼品", "设计师合作", "酒店与空间"] : ["Private commission", "Weddings & gifting", "Corporate", "Designer collaboration", "Hospitality"]).map((t) => (
                <span key={t} className="rounded-full border border-bone/15 px-3 py-1.5 text-xs text-bone/70">{t}</span>
              ))}
            </div>
            <div className="relative mt-10">
              <LuxButton href="/enquiries" size="lg">{zh ? "提交咨询" : "Make an enquiry"} <ArrowUpRight className="h-4 w-4" /></LuxButton>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="flex h-full flex-col rounded-[36px] border border-bone/[0.07] bg-umber p-10">
            <Eyebrow>{zh ? "联系我们" : "Contact"}</Eyebrow>
            <ul className="mt-8 flex-1 space-y-6 text-sm">
              <li className="flex gap-4">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <span className="text-bone/75">
                  {zh ? "班加罗尔工作室 · 仅限预约" : "Bengaluru studio · by appointment"}
                  <span className="block text-bone/45">Lavelle Road, Bengaluru 560001</span>
                </span>
              </li>
              <li className="flex gap-4">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <Link href="/contact" className="text-bone/75 hover:text-bone">{zh ? "预约到访 →" : "Book a visit →"}</Link>
              </li>
              <li className="flex gap-4">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.4} />
                <a href={`https://wa.me/${content.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-bone/75 hover:text-bone">WhatsApp {content.whatsapp}</a>
              </li>
            </ul>
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-bone/[0.04] p-4">
              <QrMark className="h-16 w-16 rounded" seed={3} />
              <p className="text-xs text-bone/60">
                {zh ? "扫码添加微信顾问" : "Scan to reach our Mandarin-speaking advisor on WeChat"}
                <span className="mt-1 block font-mono text-bone/80">{content.wechat}</span>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
