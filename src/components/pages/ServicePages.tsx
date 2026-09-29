"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowUpRight, Check, FileCheck2, Leaf, MapPin, Search, ShieldCheck, Factory } from "lucide-react";
import { PageHero, Prose } from "../content/Blocks";
import { EASE, Eyebrow, LuxButton, Reveal } from "../motion/primitives";
import { ProductVisual } from "../visual/ProductVisual";
import { useMaison, useT } from "@/lib/store";
import { JOURNAL } from "@/lib/data/journal";
import { LEGAL } from "@/lib/data/legal";
import type { EnquiryType } from "@/lib/types";
import { cn, fmtDate } from "@/lib/utils";
import { QrMark } from "../site/Footer";

/* ─────────────── Provenance with batch lookup ─────────────── */
export function ProvenancePage() {
  const { zh, l } = useT();
  const params = useSearchParams();
  const products = useMaison((s) => s.products);
  const batches = useMemo(() => [...new Set(products.map((p) => p.provenance.batch))].sort(), [products]);
  const [q, setQ] = useState(params.get("batch") ?? "SM-AP-24-017");
  const [query, setQuery] = useState(q);
  const hit = products.find((p) => p.provenance.batch.toUpperCase() === query.trim().toUpperCase());
  const using = products.filter((p) => p.provenance.batch === hit?.provenance.batch);

  const chain = hit
    ? [
        { icon: MapPin, k: zh ? "来源" : "Source", v: l(hit.provenance.source), d: zh ? `采伐年份 ${hit.provenance.harvested}` : `Harvest year ${hit.provenance.harvested}` },
        { icon: Leaf, k: zh ? "批次" : "Batch", v: hit.provenance.batch, d: zh ? `密度 ${hit.provenance.density} g/cm³` : `Density ${hit.provenance.density} g/cm³` },
        { icon: Factory, k: zh ? "加工" : "Processing", v: l(hit.provenance.processing) },
        { icon: ShieldCheck, k: zh ? "认证与文件" : "Certification & documents", v: l(hit.provenance.certification) },
      ]
    : [];

  return (
    <>
      <PageHero
        eyebrow={zh ? "溯源" : "Provenance"}
        title={zh ? "输入批次号，看见它的一生。" : "Enter a batch. See its whole life."}
        lead={zh ? "每件作品都附有溯源卡，上面印有批次编号。在这里输入，即可查看来源、加工与认证文件。" : "Every piece ships with a provenance card printed with its batch number. Enter it here to see source, processing and certification."}
      />
      <section className="mx-auto max-w-[1200px] px-5 pb-24 md:px-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(q);
          }}
          className="flex items-center gap-4 rounded-full border border-bone/15 bg-umber px-6 py-2 focus-within:border-gold"
        >
          <Search className="h-5 w-5 text-gold" strokeWidth={1.3} />
          <input value={q} onChange={(e) => setQ(e.target.value.toUpperCase())} className="w-full bg-transparent py-3 font-mono text-lg tracking-[0.15em] outline-none" placeholder="SM-AP-24-017" />
          <LuxButton type="submit" size="sm" magnetic={false}>{zh ? "查询" : "Trace"}</LuxButton>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          {batches.map((b) => (
            <button key={b} onClick={() => { setQ(b); setQuery(b); }} className={cn("rounded-full border px-3 py-1.5 font-mono text-[11px]", query === b ? "border-gold text-gold" : "border-bone/10 text-bone/50 hover:text-bone")}>
              {b}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {hit ? (
            <motion.div key={hit.provenance.batch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: EASE }} className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              <div className="relative overflow-hidden rounded-[32px] border border-gold/20 bg-gradient-to-br from-cocoa to-ink p-8 md:p-10">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gold">PROVENANCE RECORD</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-jade/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-jade">
                    <Check className="h-3 w-3" /> {zh ? "已验证" : "Verified"}
                  </span>
                </div>
                <p className="mt-6 font-mono text-4xl tracking-wider">{hit.provenance.batch}</p>
                <ol className="relative mt-10 space-y-8 before:absolute before:bottom-2 before:left-[19px] before:top-2 before:w-px before:bg-gradient-to-b before:from-gold/60 before:to-transparent">
                  {chain.map((c, i) => (
                    <motion.li key={c.k} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: EASE }} className="relative flex gap-5">
                      <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/30 bg-ink text-gold">
                        <c.icon className="h-4 w-4" strokeWidth={1.4} />
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.24em] text-bone/40">{c.k}</p>
                        <p className="mt-1 text-sm text-bone/85">{c.v}</p>
                        {c.d && <p className="mt-0.5 font-mono text-xs text-bone/45">{c.d}</p>}
                      </div>
                    </motion.li>
                  ))}
                </ol>
                <div className="mt-10 flex flex-wrap gap-2">
                  {(zh ? ["拍卖证明.pdf", "CITES 许可.pdf", "密度证书.pdf"] : ["Auction-certificate.pdf", "CITES-permit.pdf", "Density-certificate.pdf"]).map((d) => (
                    <span key={d} className="flex items-center gap-2 rounded-full border border-bone/10 px-3 py-1.5 text-xs text-bone/60">
                      <FileCheck2 className="h-3.5 w-3.5 text-gold" /> {d}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-bone/35">{zh ? "文件在客户确认后提供；此处为示例数据。" : "Documents are supplied by the client before launch; records shown here are sample data."}</p>
              </div>
              <div className="rounded-[32px] border border-bone/[0.08] p-8">
                <p className="text-[10px] uppercase tracking-[0.28em] text-bone/40">{zh ? "由此批次制作" : "Made from this batch"}</p>
                <ul className="mt-5 space-y-3">
                  {using.map((p) => (
                    <li key={p.id}>
                      <Link href={`/product/${p.slug}`} className="group flex items-center gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-umber">
                          <ProductVisual kind={p.visual} tone={p.tone} className="h-full w-full" glow={false} />
                        </div>
                        <span className="flex-1 font-display text-lg group-hover:text-blush">{l(p.name)}</span>
                        <ArrowUpRight className="h-4 w-4 text-bone/30 group-hover:text-gold" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center text-bone/50">
              {zh ? "未找到该批次。请检查溯源卡上的编号。" : "No record for that batch. Check the number on your provenance card."}
            </motion.p>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}

/* ─────────────── Journal ─────────────── */
export function JournalIndex() {
  const { l, zh, locale } = useT();
  const cats = ["All", "Material", "Making", "People", "Object", "Indian Context"] as const;
  const [cat, setCat] = useState<(typeof cats)[number]>("All");
  const list = JOURNAL.filter((j) => cat === "All" || j.category === cat);
  const [lead, ...rest] = list;
  return (
    <>
      <PageHero eyebrow={zh ? "札记" : "Journal"} title={zh ? "关于材质、匠人与语境的笔记。" : "Notes on material, makers and context."} />
      <section className="mx-auto max-w-[1600px] px-5 pb-28 md:px-10">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("shrink-0 rounded-full border px-4 py-2 text-xs", cat === c ? "border-bone bg-bone text-ink" : "border-bone/15 text-bone/70 hover:border-bone/40")}>
              {c}
            </button>
          ))}
        </div>
        {lead && (
          <Reveal>
            <Link href={`/journal/${lead.slug}`} className="group mt-12 grid gap-10 lg:grid-cols-2">
              <div className="aspect-[4/3] overflow-hidden rounded-[32px] bg-gradient-to-br from-cocoa to-ink">
                <ProductVisual kind={lead.visual} tone={0.45} seed={3} className="h-full w-full transition-transform duration-[1.4s] group-hover:scale-110" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{lead.category} · {lead.readMins} min</p>
                <h2 className="mt-4 font-display text-4xl font-light leading-tight group-hover:text-blush md:text-6xl">{l(lead.title)}</h2>
                <p className="mt-5 max-w-lg text-bone/60">{l(lead.excerpt)}</p>
                <p className="mt-6 font-mono text-xs text-bone/40">{fmtDate(lead.date, locale)}</p>
              </div>
            </Link>
          </Reveal>
        )}
        <div className="mt-20 grid gap-x-6 gap-y-14 md:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.08}>
              <Link href={`/journal/${p.slug}`} className="group block">
                <div className="aspect-[4/5] overflow-hidden rounded-[26px] bg-gradient-to-br from-cocoa to-ink">
                  <ProductVisual kind={p.visual} tone={0.3 + i * 0.1} seed={20 + i} className="h-full w-full transition-transform duration-[1.4s] group-hover:scale-110" />
                </div>
                <p className="mt-5 text-[10px] uppercase tracking-[0.28em] text-gold">{p.category}</p>
                <h3 className="mt-2 font-display text-2xl leading-snug group-hover:text-blush">{l(p.title)}</h3>
                <p className="mt-2 text-sm text-bone/50">{l(p.excerpt)}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}

export function JournalArticle({ slug }: { slug: string }) {
  const { l, zh, locale } = useT();
  const post = JOURNAL.find((j) => j.slug === slug);
  if (!post) return null;
  const next = JOURNAL[(JOURNAL.indexOf(post) + 1) % JOURNAL.length];
  return (
    <article>
      <header className="relative overflow-hidden pb-16 pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(158,47,31,.3),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">{post.category} · {post.readMins} min · {fmtDate(post.date, locale)}</p>
          <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] md:text-7xl">{l(post.title)}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-bone/60">{l(post.excerpt)}</p>
        </div>
      </header>
      <div className="mx-auto mb-20 aspect-[21/9] max-w-[1400px] overflow-hidden rounded-[36px] bg-gradient-to-br from-cocoa to-ink px-5">
        <ProductVisual kind={post.visual} tone={0.45} seed={7} className="h-full w-full" />
      </div>
      <Prose>
        {post.body.map((b, i) => (
          <Reveal key={i}>
            <p className={i === 0 ? "text-xl leading-relaxed text-bone first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-ember" : undefined}>{l(b)}</p>
          </Reveal>
        ))}
      </Prose>
      <div className="mx-auto max-w-3xl border-t border-bone/10 px-5 py-16 md:px-0">
        <p className="text-[10px] uppercase tracking-[0.3em] text-bone/40">{zh ? "下一篇" : "Next"}</p>
        <Link href={`/journal/${next.slug}`} className="mt-3 flex items-center justify-between gap-6 font-display text-3xl hover:text-blush md:text-4xl">
          {l(next.title)} <ArrowUpRight className="h-6 w-6 shrink-0" />
        </Link>
      </div>
    </article>
  );
}

/* ─────────────── Enquiries & contact ─────────────── */
const ENQ_TYPES: { k: EnquiryType; en: string; zh: string }[] = [
  { k: "Private", en: "Private commission", zh: "私人定制" },
  { k: "Gifting", en: "Gifting", zh: "礼赠" },
  { k: "Corporate", en: "Corporate gifting", zh: "企业礼赠" },
  { k: "Designer", en: "Designer collaboration", zh: "设计师合作" },
  { k: "Hospitality", en: "Hospitality", zh: "酒店合作" },
  { k: "Other", en: "Other", zh: "其他" },
];

export function EnquiryForm({ compact }: { compact?: boolean }) {
  const { zh } = useT();
  const params = useSearchParams();
  const addEnquiry = useMaison((s) => s.addEnquiry);
  const initialType = (params.get("type") as EnquiryType) || "Private";
  const [type, setType] = useState<EnquiryType>(ENQ_TYPES.some((t) => t.k === initialType) ? initialType : "Private");
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", country: zh ? "China" : "India", budget: "", message: "", channel: zh ? "WeChat" : "WhatsApp" });
  const [sent, setSent] = useState<string | null>(null);

  if (sent) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[32px] border border-gold/25 bg-gold/[0.04] p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-ink"><Check className="h-6 w-6" /></span>
        <p className="mt-6 font-display text-4xl">{zh ? "我们已收到。" : "Received, with thanks."}</p>
        <p className="mt-3 text-bone/60">{zh ? `咨询编号 ${sent}。顾问将在 24 小时内通过${f.channel === "WeChat" ? "微信" : f.channel}联系您。` : `Reference ${sent}. An advisor will reach you on ${f.channel} within 24 hours.`}</p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const id = `E-${3100 + Math.floor(Math.random() * 800)}`;
        addEnquiry({
          id,
          type,
          name: f.name,
          email: f.email,
          phone: f.phone,
          company: f.company || undefined,
          country: f.country,
          budget: f.budget || undefined,
          message: f.message,
          status: "new",
          createdAt: new Date().toISOString().slice(0, 10),
          preferredChannel: f.channel as "Email" | "WhatsApp" | "WeChat" | "Phone",
        });
        setSent(id);
      }}
      className={cn(!compact && "rounded-[32px] border border-bone/[0.08] bg-umber p-8 md:p-10")}
    >
      <p className="text-[10px] uppercase tracking-[0.28em] text-bone/40">{zh ? "咨询类型" : "Nature of enquiry"}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {ENQ_TYPES.map((t) => (
          <button type="button" key={t.k} onClick={() => setType(t.k)} className={cn("rounded-full border px-4 py-2 text-xs transition-colors", type === t.k ? "border-gold bg-gold/15 text-gold" : "border-bone/15 text-bone/65 hover:border-bone/40")}>
            {zh ? t.zh : t.en}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
        <input required className="field" placeholder={zh ? "姓名" : "Name"} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input required type="email" className="field" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input className="field" placeholder={zh ? "电话 / 微信号" : "Phone / WhatsApp"} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        {(type === "Corporate" || type === "Designer" || type === "Hospitality") && <input className="field" placeholder={zh ? "公司" : "Company"} value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} />}
        <select className="field" value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })}>
          {["India", "China", "Hong Kong", "Singapore", "UAE", "United Kingdom", "United States", "Other"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="field" value={f.budget} onChange={(e) => setF({ ...f, budget: e.target.value })}>
          <option value="">{zh ? "预算（可选）" : "Budget (optional)"}</option>
          <option>₹25,000 – 1,00,000</option>
          <option>₹1–5 L</option>
          <option>₹5 L +</option>
          <option>¥5,000 – 20,000</option>
          <option>¥20,000 +</option>
        </select>
      </div>
      <textarea required rows={4} className="field resize-none" placeholder={zh ? "请告诉我们您的想法、数量与时间" : "Tell us what you have in mind — quantity, timing, occasion"} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
      <p className="mt-6 text-[10px] uppercase tracking-[0.28em] text-bone/40">{zh ? "首选联系方式" : "Preferred channel"}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {["WhatsApp", "WeChat", "Email", "Phone"].map((c) => (
          <button type="button" key={c} onClick={() => setF({ ...f, channel: c })} className={cn("rounded-full border px-4 py-2 text-xs", f.channel === c ? "border-bone bg-bone text-ink" : "border-bone/15 text-bone/65")}>
            {c === "WeChat" ? "微信 WeChat" : c}
          </button>
        ))}
      </div>
      <LuxButton type="submit" size="lg" className="mt-10" magnetic={false}>{zh ? "提交咨询" : "Send enquiry"}</LuxButton>
    </form>
  );
}

export function EnquiriesPage() {
  const { zh } = useT();
  return (
    <>
      <PageHero eyebrow={zh ? "私人咨询" : "Private enquiries"} title={zh ? "与我们私下交谈。" : "Speak with us privately."} lead={zh ? "定制作品、收藏级老料、企业礼赠、酒店与设计合作——每一份咨询都由专属顾问亲自回复。" : "Commissions, collector-grade old material, corporate gifting, hospitality and design collaborations — every enquiry is answered personally."} />
      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-28 md:px-10 lg:grid-cols-[1.4fr_1fr]">
        <EnquiryForm />
        <ContactCard />
      </section>
    </>
  );
}

function ContactCard() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  return (
    <div className="space-y-4">
      <div className="rounded-[32px] border border-bone/[0.08] p-8">
        <Eyebrow>{zh ? "直接联系" : "Direct"}</Eyebrow>
        <ul className="mt-6 space-y-4 text-sm">
          <li><span className="block text-[10px] uppercase tracking-[0.24em] text-bone/40">WhatsApp</span><a className="hover:text-gold" href={`https://wa.me/${content.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{content.whatsapp}</a></li>
          <li><span className="block text-[10px] uppercase tracking-[0.24em] text-bone/40">Email</span><a className="hover:text-gold" href={`mailto:${content.email}`}>{content.email}</a></li>
          <li><span className="block text-[10px] uppercase tracking-[0.24em] text-bone/40">{zh ? "工作室" : "Studio"}</span>Lavelle Road, Bengaluru 560001 · {zh ? "仅限预约" : "by appointment"}</li>
          <li><span className="block text-[10px] uppercase tracking-[0.24em] text-bone/40">{zh ? "时间" : "Hours"}</span>{zh ? "周一至周六 10:00–20:00 IST（北京时间 12:30–22:30）" : "Mon–Sat 10:00–20:00 IST (12:30–22:30 Beijing)"}</li>
        </ul>
      </div>
      <div className="flex items-center gap-5 rounded-[32px] border border-bone/[0.08] p-8">
        <QrMark className="h-24 w-24 rounded-lg" seed={5} />
        <div>
          <p className="font-display text-xl">{zh ? "微信顾问" : "WeChat advisor"}</p>
          <p className="mt-1 text-xs text-bone/50">{zh ? "普通话服务" : "Mandarin-speaking"}</p>
          <p className="mt-2 font-mono text-sm text-gold">{content.wechat}</p>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  const { zh } = useT();
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
  });
  const [day, setDay] = useState(0);
  const slots = ["11:00", "12:30", "15:00", "16:30", "18:00"];
  return (
    <>
      <PageHero eyebrow={zh ? "联系我们" : "Contact"} title={zh ? "预约到访，或随时来信。" : "Visit by appointment, or simply write."} />
      <section className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-28 md:px-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[32px] border border-bone/[0.08] bg-umber p-8 md:p-10">
          <Eyebrow>{zh ? "预约到访 · 班加罗尔工作室" : "Visit by appointment · Bengaluru studio"}</Eyebrow>
          {booked ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-ink"><Check className="h-6 w-6" /></span>
              <p className="mt-6 font-display text-3xl">{zh ? "期待与您见面。" : "We look forward to receiving you."}</p>
              <p className="mt-2 text-bone/60">{days[day].toLocaleDateString(zh ? "zh-CN" : "en-GB", { weekday: "long", day: "numeric", month: "long" })} · {slot}</p>
            </motion.div>
          ) : (
            <>
              <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto">
                {days.map((d, i) => (
                  <button key={i} onClick={() => setDay(i)} className={cn("flex w-20 shrink-0 flex-col items-center rounded-2xl border py-3 transition-colors", day === i ? "border-gold bg-gold/10" : "border-bone/10 hover:border-bone/30")}>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-bone/50">{d.toLocaleDateString(zh ? "zh-CN" : "en-GB", { weekday: "short" })}</span>
                    <span className="mt-1 font-display text-2xl">{d.getDate()}</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {slots.map((s) => (
                  <button key={s} onClick={() => setSlot(s)} className={cn("rounded-full border px-5 py-2.5 font-mono text-sm", slot === s ? "border-bone bg-bone text-ink" : "border-bone/15 text-bone/70 hover:border-bone/40")}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
                <input className="field" placeholder={zh ? "姓名" : "Name"} />
                <input className="field" placeholder={zh ? "电话" : "Phone"} />
              </div>
              <LuxButton className="mt-8" size="lg" disabled={!slot} onClick={() => setBooked(true)} magnetic={false}>{zh ? "确认预约" : "Request appointment"}</LuxButton>
            </>
          )}
          <div className="mt-12 border-t border-bone/10 pt-10">
            <Eyebrow>{zh ? "或留言" : "Or write to us"}</Eyebrow>
            <div className="mt-6">
              <EnquiryForm compact />
            </div>
          </div>
        </div>
        <ContactCard />
      </section>
    </>
  );
}

/* ─────────────── Legal ─────────────── */
export function LegalPage({ slug }: { slug: string }) {
  const { zh } = useT();
  const doc = LEGAL[slug];
  if (!doc) return null;
  return (
    <>
      <PageHero eyebrow={zh ? "政策" : "Policies"} title={zh ? doc.zh : doc.title} lead={zh ? "最终法律文本将由客户及其法律顾问提供并审核。" : "Final legal text will be supplied and approved by the client and their legal advisor."} />
      <Prose>
        {doc.sections.map(([h, p]) => (
          <div key={h}>
            <h2>{h}</h2>
            <p className="mt-3">{p}</p>
          </div>
        ))}
        <div className="flex flex-wrap gap-2 pt-10">
          {Object.entries(LEGAL).map(([k, v]) => (
            <Link key={k} href={`/legal/${k}`} className={cn("rounded-full border px-4 py-2 text-xs", k === slug ? "border-gold text-gold" : "border-bone/15 text-bone/60 hover:text-bone")}>
              {zh ? v.zh : v.title}
            </Link>
          ))}
        </div>
      </Prose>
    </>
  );
}
