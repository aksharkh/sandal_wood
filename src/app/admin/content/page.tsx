"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useMaison, type SiteContent } from "@/lib/store";
import { JOURNAL } from "@/lib/data/journal";
import { Btn, Field, PageHead, Panel, toast } from "@/components/admin/ui";
import { fmtDate } from "@/lib/utils";

export default function ContentPage() {
  const content = useMaison((s) => s.content);
  const setContent = useMaison((s) => s.setContent);
  const [c, setC] = useState<SiteContent>(content);
  const [lang, setLang] = useState<"en" | "zh">("en");
  const [prevContent, setPrevContent] = useState(content);
  if (content !== prevContent) {
    setPrevContent(content);
    setC(content);
  }
  const dirty = JSON.stringify(c) !== JSON.stringify(content);

  const bi = (k: "heroTitle" | "heroSub" | "announcement", v: string) => setC({ ...c, [k]: { ...c[k], [lang]: v } });

  return (
    <div className="space-y-6">
      <PageHead
        title="Content"
        sub="Homepage copy, announcement bar and contact channels — bilingual"
        actions={
          <>
            <Btn variant="subtle" disabled={!dirty} onClick={() => setC(content)}>Discard</Btn>
            <Btn variant="gold" disabled={!dirty} onClick={() => { setContent(c); toast("Published to storefront"); }}>Publish</Btn>
          </>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <Panel title="Homepage" action={
          <div className="flex rounded-lg border border-bone/10 p-0.5 text-xs">
            {(["en", "zh"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={lang === l ? "rounded-md bg-bone px-2.5 py-1 text-ink" : "px-2.5 py-1 text-bone/55"}>{l === "en" ? "English" : "中文"}</button>
            ))}
          </div>
        }>
          <div className="space-y-4">
            <Field label="Announcement bar"><input className="admin-input" value={c.announcement[lang] ?? ""} onChange={(e) => bi("announcement", e.target.value)} /></Field>
            <Field label="Hero headline"><input className="admin-input" value={c.heroTitle[lang] ?? ""} onChange={(e) => bi("heroTitle", e.target.value)} /></Field>
            <Field label="Hero sub-line"><textarea rows={3} className="admin-input resize-none" value={c.heroSub[lang] ?? ""} onChange={(e) => bi("heroSub", e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="WhatsApp"><input className="admin-input" value={c.whatsapp} onChange={(e) => setC({ ...c, whatsapp: e.target.value })} /></Field>
              <Field label="WeChat ID"><input className="admin-input" value={c.wechat} onChange={(e) => setC({ ...c, wechat: e.target.value })} /></Field>
              <Field label="Email"><input className="admin-input" value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} /></Field>
            </div>
          </div>
        </Panel>
        <Panel title="Live preview" action={<Link href="/" target="_blank" className="flex items-center gap-1 text-xs text-gold hover:underline">Open site <ExternalLink className="h-3 w-3" /></Link>}>
          <div className="overflow-hidden rounded-2xl border border-bone/[0.07]">
            <div className="bg-oxblood/70 px-4 py-1.5 text-center text-[9px] tracking-[0.2em] text-bone/80">{(c.announcement[lang] || c.announcement.en).toUpperCase()}</div>
            <div className="relative bg-[radial-gradient(90%_70%_at_60%_30%,#2a0c08_0%,#0b0706_70%)] px-6 pb-8 pt-24">
              <p className="text-[9px] uppercase tracking-[0.3em] text-gold">{lang === "zh" ? "小叶紫檀 · 印度" : "Red Sandalwood · India"}</p>
              <p className="mt-3 font-display text-5xl font-light leading-[0.95]">{c.heroTitle[lang] || c.heroTitle.en}</p>
              <p className="mt-4 max-w-sm text-xs leading-relaxed text-bone/60">{c.heroSub[lang] || c.heroSub.en}</p>
              <div className="mt-5 flex gap-2">
                <span className="rounded-full bg-santal px-4 py-2 text-[9px] uppercase tracking-[0.18em]">{lang === "zh" ? "探索系列" : "Explore the collections"}</span>
                <span className="rounded-full border border-bone/25 px-4 py-2 text-[9px] uppercase tracking-[0.18em]">{lang === "zh" ? "认识材质" : "Meet the material"}</span>
              </div>
            </div>
          </div>
          {dirty && <p className="mt-3 text-xs text-[#e8c264]">Unpublished changes</p>}
        </Panel>
      </div>
      <Panel title="Journal" pad={false}>
        <ul>
          {JOURNAL.map((j) => (
            <li key={j.slug} className="flex items-center justify-between gap-4 border-t border-bone/[0.05] px-6 py-3.5 text-sm first:border-t-0">
              <span className="min-w-0">
                <span className="block truncate text-bone/85">{j.title.en}</span>
                <span className="text-[11px] text-bone/40">{j.category} · {fmtDate(j.date)} · EN + 中文</span>
              </span>
              <Link href={`/journal/${j.slug}`} target="_blank" className="shrink-0 text-xs text-gold hover:underline">View</Link>
            </li>
          ))}
        </ul>
        <p className="border-t border-bone/[0.05] px-6 py-4 text-xs text-bone/35">Full article editing (rich text, images, scheduling) connects to the CMS chosen in the backend phase.</p>
      </Panel>
    </div>
  );
}
