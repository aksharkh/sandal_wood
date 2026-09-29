"use client";

import { useState } from "react";
import { Reorder } from "motion/react";
import { ExternalLink, GripVertical, Plus, Rocket, Trash2, X } from "lucide-react";
import { useMaison } from "@/lib/store";
import type { Placement, Recommendation } from "@/lib/types";
import { Btn, Drawer, Field, PageHead, Panel, Toggle, toast } from "@/components/admin/ui";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { cn, money } from "@/lib/utils";

const PLACEMENTS: { k: Placement; label: string; where: string; href: string }[] = [
  { k: "home-curated", label: "Homepage · Curated for you", where: "Homepage, ‘Start with the material’", href: "/" },
  { k: "china-edit", label: "China edit", where: "Homepage for visitors browsing in CNY", href: "/" },
  { k: "pdp-pairs", label: "Product page · Pairs well with", where: "Every product page", href: "/product/gold-star-bracelet" },
  { k: "bag-upsell", label: "Bag · Complete the ritual", where: "Bag drawer & bag page", href: "/bag" },
  { k: "gifting-edit", label: "Gifting edit", where: "Gifting landing & emails", href: "/gifting" },
];

export default function RecommendationsPage() {
  const recs = useMaison((s) => s.recommendations);
  const upsert = useMaison((s) => s.upsertRecommendation);
  const [editing, setEditing] = useState<Recommendation | null>(null);

  const push = (r: Recommendation) => {
    // Only one active set per placement+audience: pushing one pauses its siblings.
    recs.filter((x) => x.id !== r.id && x.placement === r.placement && x.audience === r.audience && x.active).forEach((x) => upsert({ ...x, active: false }));
    upsert({ ...r, active: true });
    toast(`Pushed live · ${PLACEMENTS.find((p) => p.k === r.placement)?.label}`);
  };

  return (
    <div className="space-y-6">
      <PageHead
        title="Recommendations"
        sub="Choose what the storefront recommends, where, and to whom — changes go live instantly"
        actions={
          <Btn variant="gold" onClick={() => setEditing({ id: `R-${Date.now().toString(36)}`, title: "New recommendation", placement: "home-curated", productIds: [], audience: "All", active: false, startsAt: new Date().toISOString().slice(0, 10), impressions: 0, clicks: 0, conversions: 0 })}>
            <Plus className="h-4 w-4" /> New set
          </Btn>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {recs.map((r) => (
          <RecCard key={r.id} r={r} onEdit={() => setEditing(structuredClone(r))} onPush={() => push(r)} />
        ))}
      </div>
      <RecEditor rec={editing} onClose={() => setEditing(null)} onPush={push} />
    </div>
  );
}

function RecCard({ r, onEdit, onPush }: { r: Recommendation; onEdit: () => void; onPush: () => void }) {
  const products = useMaison((s) => s.products);
  const upsert = useMaison((s) => s.upsertRecommendation);
  const place = PLACEMENTS.find((p) => p.k === r.placement)!;
  const ctr = r.impressions ? (r.clicks / r.impressions) * 100 : 0;
  const cvr = r.clicks ? (r.conversions / r.clicks) * 100 : 0;
  return (
    <Panel className={cn(r.active && "border-gold/25")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("h-2 w-2 rounded-full", r.active ? "bg-[#4ade80]" : "bg-bone/25")} />
            <span className="text-[11px] uppercase tracking-[0.16em] text-bone/45">{r.active ? "Live" : "Paused"} · {r.audience}</span>
          </div>
          <button onClick={onEdit} className="mt-2 text-left font-display text-2xl hover:text-gold">{r.title}</button>
          <p className="text-xs text-bone/40">{place.where}</p>
        </div>
        <Toggle on={r.active} onChange={(v) => { if (v) onPush(); else { upsert({ ...r, active: false }); toast("Paused"); } }} />
      </div>
      <div className="mt-5 flex gap-2">
        {r.productIds.map((id) => {
          const p = products.find((x) => x.id === id);
          return p ? (
            <div key={id} className="w-1/4 min-w-0">
              <div className="aspect-square overflow-hidden rounded-xl bg-[#1a100d]"><ProductVisual kind={p.visual} tone={p.tone} image={p.images?.[0]} className="h-full w-full" glow={false} /></div>
              <p className="mt-1 truncate text-[11px] text-bone/55">{p.name.en}</p>
            </div>
          ) : null;
        })}
        {r.productIds.length === 0 && <p className="text-sm text-bone/35">No products selected.</p>}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-bone/[0.06] pt-4 text-center">
        {[
          ["Impressions", r.impressions.toLocaleString("en-IN")],
          ["CTR", `${ctr.toFixed(1)}%`],
          ["Conversion", `${cvr.toFixed(1)}%`],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="font-display text-xl tabular-nums">{v}</p>
            <p className="text-[10px] uppercase tracking-[0.14em] text-bone/35">{k}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-bone/40">
        <span>{r.startsAt}{r.endsAt ? ` → ${r.endsAt}` : " → ongoing"}</span>
        <a href={place.href} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gold">Preview <ExternalLink className="h-3 w-3" /></a>
      </div>
    </Panel>
  );
}

function RecEditor({ rec, onClose, onPush }: { rec: Recommendation | null; onClose: () => void; onPush: (r: Recommendation) => void }) {
  const products = useMaison((s) => s.products);
  const upsert = useMaison((s) => s.upsertRecommendation);
  const del = useMaison((s) => s.deleteRecommendation);
  const [r, setR] = useState<Recommendation | null>(null);
  const [q, setQ] = useState("");
  if (rec && (!r || r.id !== rec.id)) setR(rec);
  if (!rec || !r) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;

  const set = (patch: Partial<Recommendation>) => setR({ ...r, ...patch });
  const available = products.filter((p) => p.status === "active" && !r.productIds.includes(p.id) && (!q || p.name.en.toLowerCase().includes(q.toLowerCase())));
  const close = () => {
    setR(null);
    onClose();
  };

  return (
    <Drawer
      open
      onClose={close}
      width={640}
      title={<input value={r.title} onChange={(e) => set({ title: e.target.value })} className="w-full bg-transparent font-display text-2xl outline-none" aria-label="Title" />}
      footer={
        <div className="flex justify-between gap-2">
          <Btn size="sm" variant="danger" onClick={() => { del(r.id); toast("Deleted"); close(); }}><Trash2 className="h-3.5 w-3.5" /> Delete</Btn>
          <div className="flex gap-2">
            <Btn size="sm" onClick={() => { upsert(r); toast("Saved as draft"); close(); }}>Save</Btn>
            <Btn size="sm" variant="gold" disabled={!r.productIds.length} onClick={() => { onPush(r); close(); }}><Rocket className="h-3.5 w-3.5" /> Push live</Btn>
          </div>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Placement">
          <select className="admin-input" value={r.placement} onChange={(e) => set({ placement: e.target.value as Placement })}>
            {PLACEMENTS.map((p) => <option key={p.k} value={p.k}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Audience">
          <select className="admin-input" value={r.audience} onChange={(e) => set({ audience: e.target.value as Recommendation["audience"] })}>
            {["All", "India", "China", "Circle members"].map((a) => <option key={a}>{a}</option>)}
          </select>
        </Field>
        <Field label="Starts"><input type="date" className="admin-input" value={r.startsAt} onChange={(e) => set({ startsAt: e.target.value })} /></Field>
        <Field label="Ends (optional)"><input type="date" className="admin-input" value={r.endsAt ?? ""} onChange={(e) => set({ endsAt: e.target.value || undefined })} /></Field>
      </div>

      <p className="mt-8 text-[11px] uppercase tracking-[0.14em] text-bone/45">Selected · drag to reorder</p>
      <Reorder.Group axis="y" values={r.productIds} onReorder={(ids) => set({ productIds: ids })} className="mt-3 space-y-2">
        {r.productIds.map((id, i) => {
          const p = products.find((x) => x.id === id);
          if (!p) return null;
          return (
            <Reorder.Item key={id} value={id} className="flex cursor-grab items-center gap-3 rounded-2xl border border-bone/[0.08] bg-[#160e0b] p-2 pr-3 active:cursor-grabbing">
              <GripVertical className="h-4 w-4 text-bone/30" />
              <span className="font-mono text-xs text-bone/35">{i + 1}</span>
              <span className="h-10 w-10 overflow-hidden rounded-lg bg-[#1a100d]"><ProductVisual kind={p.visual} tone={p.tone} image={p.images?.[0]} className="h-full w-full" glow={false} /></span>
              <span className="flex-1 text-sm">{p.name.en}</span>
              <span className="text-xs tabular-nums text-bone/45">{money(p.price)}</span>
              <button onClick={() => set({ productIds: r.productIds.filter((x) => x !== id) })} className="text-bone/35 hover:text-danger" aria-label="Remove"><X className="h-4 w-4" /></button>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      {r.productIds.length === 0 && <p className="mt-2 text-sm text-bone/35">Add products from the list below.</p>}

      <p className="mt-8 text-[11px] uppercase tracking-[0.14em] text-bone/45">Add products</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…" className="admin-input mt-3" />
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {available.map((p) => (
          <button key={p.id} onClick={() => set({ productIds: [...r.productIds, p.id] })} className="group rounded-2xl border border-bone/[0.06] p-2 text-left hover:border-gold/40">
            <div className="aspect-square overflow-hidden rounded-xl bg-[#1a100d]"><ProductVisual kind={p.visual} tone={p.tone} image={p.images?.[0]} className="h-full w-full" glow={false} /></div>
            <p className="mt-1.5 truncate text-[11px] text-bone/70 group-hover:text-bone">{p.name.en}</p>
          </button>
        ))}
      </div>
    </Drawer>
  );
}
