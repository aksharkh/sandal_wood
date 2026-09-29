"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useMemo, useState, type ReactNode } from "react";
import { PageHero, Prose } from "../content/Blocks";
import { Button, Heading, Label, Photo, ProductPhoto, Reveal, Section } from "../motion/primitives";
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

  const rows = hit
    ? [
        [zh ? "来源" : "Source", l(hit.provenance.source)],
        [zh ? "采伐年份" : "Harvested", hit.provenance.harvested],
        [zh ? "密度" : "Density", `${hit.provenance.density} g/cm³`],
        [zh ? "加工" : "Processing", l(hit.provenance.processing)],
        [zh ? "认证与文件" : "Certification", l(hit.provenance.certification)],
      ]
    : [];

  return (
    <>
      <PageHero
        eyebrow={zh ? "溯源" : "Provenance"}
        title={zh ? "输入批次号，看见它的一生" : "Enter a batch. See its whole life."}
        lead={zh ? "每件作品都附有印着批次编号的溯源卡。在这里输入，即可查看来源、加工与认证文件。" : "Every piece ships with a provenance card printed with its batch number. Enter it here to see source, processing and certification."}
        image="/images/e-hills-mist.jpg"
      />
      <Section tone="paper" className="py-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(q);
          }}
          className="flex max-w-2xl items-end gap-4"
        >
          <label className="flex-1">
            <span className="text-[12px] text-muted">{zh ? "批次编号" : "Batch number"}</span>
            <input value={q} onChange={(e) => setQ(e.target.value.toUpperCase())} className="field font-mono text-xl tracking-wider" placeholder="SM-AP-24-017" />
          </label>
          <Button type="submit">{zh ? "查询" : "Trace"}</Button>
        </form>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13px]">
          <span className="text-muted">{zh ? "示例：" : "Try:"}</span>
          {batches.map((b) => (
            <button key={b} onClick={() => { setQ(b); setQuery(b); }} className={cn("font-mono", query === b ? "text-ink underline underline-offset-4" : "text-graphite hover:text-ink")}>
              {b}
            </button>
          ))}
        </div>

        {hit ? (
          <motion.div key={hit.provenance.batch} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-14 grid gap-12 lg:grid-cols-12">
            <div className="border-t border-ink lg:col-span-7">
              <div className="flex items-baseline justify-between py-5">
                <p className="font-mono text-3xl tracking-wide">{hit.provenance.batch}</p>
                <span className="text-[13px] text-moss">● {zh ? "已验证" : "Verified"}</span>
              </div>
              <dl>
                {rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 border-t border-line py-4 text-[14px]">
                    <dt className="text-muted">{k}</dt>
                    <dd className="col-span-2">{v}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-3 gap-4 border-t border-line py-4 text-[14px]">
                  <dt className="text-muted">{zh ? "文件" : "Documents"}</dt>
                  <dd className="col-span-2 space-x-4">
                    {(zh ? ["拍卖证明", "CITES 许可", "密度证书"] : ["Auction certificate", "CITES permit", "Density certificate"]).map((d) => (
                      <span key={d} className="underline underline-offset-4">{d}</span>
                    ))}
                  </dd>
                </div>
              </dl>
              <p className="mt-4 text-[12px] text-muted">{zh ? "示例数据；正式文件由客户在上线前提供。" : "Sample record; documents are supplied by the client before launch."}</p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <Label>{zh ? "由此批次制作" : "Made from this batch"}</Label>
              <ul className="mt-5 space-y-4">
                {using.map((p) => (
                  <li key={p.id}>
                    <Link href={`/product/${p.slug}`} className="group flex items-center gap-4">
                      <ProductPhoto p={p} className="aspect-square w-20 shrink-0" sizes="80px" />
                      <span className="text-[14px] group-hover:underline group-hover:underline-offset-4">{l(p.name)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <p className="mt-14 text-graphite">{zh ? "未找到该批次，请检查溯源卡上的编号。" : "No record for that batch. Please check the number on your provenance card."}</p>
        )}
      </Section>
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
      <PageHero eyebrow={zh ? "札记" : "Journal"} title={zh ? "关于材质、匠人与语境的笔记" : "Notes on material, makers and context"} />
      <Section className="pb-28">
        <div className="no-scrollbar flex gap-6 overflow-x-auto border-b border-line pb-4 text-[13px]">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("shrink-0", cat === c ? "text-ink underline underline-offset-[6px]" : "text-graphite hover:text-ink")}>
              {c}
            </button>
          ))}
        </div>
        {lead && (
          <Link href={`/journal/${lead.slug}`} className="group mt-12 grid gap-10 lg:grid-cols-12">
            <Photo src={lead.image} alt={lead.title.en} className="aspect-[4/3] lg:col-span-7" zoom />
            <div className="flex flex-col justify-center lg:col-span-5">
              <p className="text-[12px] text-muted">{lead.category} · {lead.readMins} min · {fmtDate(lead.date, locale)}</p>
              <Heading className="mt-4 text-[clamp(2rem,3.4vw,3.2rem)] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-8">{l(lead.title)}</Heading>
              <p className="mt-5 max-w-lg text-[15px] text-graphite">{l(lead.excerpt)}</p>
            </div>
          </Link>
        )}
        <div className="mt-20 grid gap-x-6 gap-y-14 md:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.05}>
              <Link href={`/journal/${p.slug}`} className="group block">
                <Photo src={p.image} alt={p.title.en} className="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" zoom />
                <p className="mt-4 text-[12px] text-muted">{p.category}</p>
                <h3 className="mt-1 font-display text-2xl leading-snug">{l(p.title)}</h3>
                <p className="mt-2 text-[14px] text-graphite">{l(p.excerpt)}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}

export function JournalArticle({ slug }: { slug: string }) {
  const { l, zh, locale } = useT();
  const post = JOURNAL.find((j) => j.slug === slug);
  if (!post) return null;
  const next = JOURNAL[(JOURNAL.indexOf(post) + 1) % JOURNAL.length];
  return (
    <article className="bg-page">
      <header className="mx-auto max-w-3xl px-5 pb-12 pt-16 text-center">
        <p className="text-[12px] text-muted">{post.category} · {post.readMins} min · {fmtDate(post.date, locale)}</p>
        <Heading as="h1" className="mt-6 text-[clamp(2.6rem,5vw,4.6rem)]">{l(post.title)}</Heading>
        <p className="mx-auto mt-6 max-w-xl text-[17px] text-graphite">{l(post.excerpt)}</p>
      </header>
      <div className="mx-auto mb-16 max-w-[1200px] px-5 md:px-10">
        <Photo src={post.image} alt={post.title.en} priority className="aspect-[16/9]" sizes="(min-width: 1200px) 1200px, 100vw" />
      </div>
      <Prose>
        {post.body.map((b, i) => (
          <p key={i} className={i === 0 ? "text-[19px] text-ink" : undefined}>{l(b)}</p>
        ))}
      </Prose>
      <div className="mx-auto max-w-2xl border-t border-line px-5 py-14 md:px-0">
        <p className="text-[12px] text-muted">{zh ? "下一篇" : "Next"}</p>
        <Link href={`/journal/${next.slug}`} className="mt-2 block font-display text-3xl hover:underline hover:decoration-1 hover:underline-offset-8">{l(next.title)}</Link>
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

export function EnquiryForm() {
  const { zh } = useT();
  const params = useSearchParams();
  const addEnquiry = useMaison((s) => s.addEnquiry);
  const initialType = (params.get("type") as EnquiryType) || "Private";
  const [type, setType] = useState<EnquiryType>(ENQ_TYPES.some((t) => t.k === initialType) ? initialType : "Private");
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", country: zh ? "China" : "India", budget: "", message: "", channel: zh ? "WeChat" : "WhatsApp" });
  const [sent, setSent] = useState<string | null>(null);

  if (sent) {
    return (
      <div className="border-t border-ink pt-10">
        <Heading className="text-4xl">{zh ? "我们已收到您的咨询" : "Thank you — we have your enquiry"}</Heading>
        <p className="mt-4 max-w-md text-[15px] text-graphite">
          {zh ? `咨询编号 ${sent}。顾问将在 24 小时内与您联系。` : `Reference ${sent}. An advisor will be in touch on ${f.channel} within 24 hours.`}
        </p>
      </div>
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
    >
      <Label>{zh ? "咨询类型" : "Nature of enquiry"}</Label>
      <div className="mt-4 flex flex-wrap gap-2">
        {ENQ_TYPES.map((t) => (
          <button type="button" key={t.k} onClick={() => setType(t.k)} className={cn("border px-4 py-2 text-[13px] transition-colors", type === t.k ? "border-ink bg-ink text-page" : "border-line hover:border-ink")}>
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
          {["India", "China", "Hong Kong", "Singapore", "UAE", "United Kingdom", "United States", "Other"].map((c) => <option key={c}>{c}</option>)}
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
      <div className="mt-6 flex flex-wrap items-center gap-5 text-[13px]">
        <span className="text-muted">{zh ? "首选联系方式" : "Reply by"}</span>
        {["WhatsApp", "WeChat", "Email", "Phone"].map((c) => (
          <label key={c} className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="channel" checked={f.channel === c} onChange={() => setF({ ...f, channel: c })} className="accent-[#1c1a17]" />
            {c === "WeChat" ? "微信 WeChat" : c}
          </label>
        ))}
      </div>
      <Button type="submit" size="lg" className="mt-10">{zh ? "提交咨询" : "Send enquiry"}</Button>
    </form>
  );
}

function ContactDetails() {
  const { zh } = useT();
  const content = useMaison((s) => s.content);
  const rows: [string, ReactNode][] = [
    ["WhatsApp", <a key="w" className="hover:underline" href={`https://wa.me/${content.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{content.whatsapp}</a>],
    ["Email", <a key="e" className="hover:underline" href={`mailto:${content.email}`}>{content.email}</a>],
    [zh ? "工作室" : "Studio", `Lavelle Road, Bengaluru 560001 · ${zh ? "仅限预约" : "by appointment"}`],
    [zh ? "时间" : "Hours", zh ? "周一至周六 10:00–20:00 IST（北京时间 12:30–22:30）" : "Mon–Sat, 10:00–20:00 IST (12:30–22:30 Beijing)"],
  ];
  return (
    <div>
      <dl className="border-t border-ink">
        {rows.map(([k, v]) => (
          <div key={k} className="border-b border-line py-4 text-[14px]">
            <dt className="text-[12px] text-muted">{k}</dt>
            <dd className="mt-1">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex items-center gap-4 text-[14px]">
        <QrMark className="h-20 w-20" seed={5} />
        <div>
          <p>{zh ? "微信顾问（普通话）" : "WeChat advisor (Mandarin)"}</p>
          <p className="mt-1 font-mono text-graphite">{content.wechat}</p>
        </div>
      </div>
    </div>
  );
}

export function EnquiriesPage() {
  const { zh } = useT();
  return (
    <>
      <PageHero eyebrow={zh ? "私人咨询" : "Private enquiries"} title={zh ? "与我们私下交谈" : "Speak with us privately"} lead={zh ? "定制作品、收藏级老料、企业礼赠、酒店与设计合作——每一份咨询都由专属顾问亲自回复。" : "Commissions, collector-grade old material, corporate gifting, hospitality and design collaborations — every enquiry answered personally."} />
      <Section tone="paper" className="py-20">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7"><EnquiryForm /></div>
          <div className="lg:col-span-4 lg:col-start-9"><ContactDetails /></div>
        </div>
      </Section>
    </>
  );
}

export function ContactPage() {
  const { zh } = useT();
  const [slot, setSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [days] = useState(() =>
    Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return d;
    }),
  );
  const [day, setDay] = useState(0);
  const slots = ["11:00", "12:30", "15:00", "16:30", "18:00"];
  return (
    <>
      <PageHero eyebrow={zh ? "联系我们" : "Contact"} title={zh ? "预约到访，或随时来信" : "Visit by appointment, or simply write"} image="/images/e-temple-pillars.jpg" />
      <Section tone="paper" className="py-20">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Label>{zh ? "预约到访 · 班加罗尔工作室" : "Book a visit · Bengaluru studio"}</Label>
            {booked ? (
              <div className="mt-6 border-t border-ink pt-8">
                <Heading className="text-4xl">{zh ? "期待与您见面" : "We look forward to receiving you"}</Heading>
                <p className="mt-3 text-graphite">{days[day].toLocaleDateString(zh ? "zh-CN" : "en-GB", { weekday: "long", day: "numeric", month: "long" })} · {slot}</p>
              </div>
            ) : (
              <>
                <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
                  {days.map((d, i) => (
                    <button key={i} onClick={() => setDay(i)} className={cn("w-20 shrink-0 border py-3 text-center", day === i ? "border-ink bg-ink text-page" : "border-line hover:border-ink")}>
                      <span className="block text-[11px] uppercase tracking-wider opacity-70">{d.toLocaleDateString(zh ? "zh-CN" : "en-GB", { weekday: "short" })}</span>
                      <span className="mt-1 block font-display text-2xl">{d.getDate()}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {slots.map((s) => (
                    <button key={s} onClick={() => setSlot(s)} className={cn("border px-4 py-2 font-mono text-[13px]", slot === s ? "border-ink bg-ink text-page" : "border-line hover:border-ink")}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
                  <input className="field" placeholder={zh ? "姓名" : "Name"} />
                  <input className="field" placeholder={zh ? "电话" : "Phone"} />
                </div>
                <Button className="mt-8" size="lg" disabled={!slot} onClick={() => setBooked(true)}>{zh ? "确认预约" : "Request appointment"}</Button>
              </>
            )}
            <div className="mt-20">
              <Label>{zh ? "或留言" : "Or write to us"}</Label>
              <div className="mt-6"><EnquiryForm /></div>
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9"><ContactDetails /></div>
        </div>
      </Section>
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
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-8 text-[14px]">
          {Object.entries(LEGAL).map(([k, v]) => (
            <Link key={k} href={`/legal/${k}`} className={k === slug ? "text-ink underline underline-offset-4" : "text-graphite hover:text-ink"}>
              {zh ? v.zh : v.title}
            </Link>
          ))}
        </div>
      </Prose>
    </>
  );
}
