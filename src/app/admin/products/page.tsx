"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Archive, Copy, ExternalLink, ImagePlus, LayoutGrid, List, Percent, Plus, Search, Star, Trash2 } from "lucide-react";
import { useMaison } from "@/lib/store";
import { COLLECTIONS } from "@/lib/data/products";
import type { CollectionSlug, Product, ProductStatus, VisualKind } from "@/lib/types";
import { Btn, Drawer, Field, PageHead, Panel, Th, Toggle, toast } from "@/components/admin/ui";
import { ExportMenu } from "@/components/admin/Shell";
import { ProductVisual } from "@/components/visual/ProductVisual";
import { productRows } from "@/lib/export";
import { cn, money, stockOf } from "@/lib/utils";

const inr = (n: number) => money(n, "INR");
const VISUALS: VisualKind[] = ["bracelet", "mala", "bangle", "pendant", "earrings", "ring", "cufflinks", "brooch", "comb", "box", "powder", "incense"];
const STATUS_CLS: Record<ProductStatus, string> = {
  active: "bg-[#4ade80]/12 text-[#7ee8a3]",
  draft: "bg-[#e2b340]/12 text-[#e8c264]",
  archived: "bg-bone/[0.06] text-bone/45",
};

const blank = (): Product => ({
  id: `p${Date.now().toString(36)}`,
  slug: "",
  name: { en: "", zh: "" },
  subtitle: { en: "", zh: "" },
  description: { en: "", zh: "" },
  collection: "jewellery",
  price: 10000,
  status: "draft",
  visual: "pendant",
  tone: 0.45,
  variants: [{ id: `v${Date.now().toString(36)}`, label: { en: "One size", zh: "均码" }, priceDelta: 0, stock: 10, sku: `SM-${Math.floor(1000 + Math.random() * 8999)}` }],
  tags: [],
  details: [],
  provenance: {
    batch: "SM-AP-25-003",
    harvested: "2024",
    density: "1.12",
    source: { en: "Government-auctioned heartwood, Seshachalam Hills, Andhra Pradesh", zh: "政府拍卖心材 · 安得拉邦塞沙查拉姆山" },
    processing: { en: "Air-seasoned 18 months · hand-turned in Tirupati", zh: "自然风干18个月 · 蒂鲁帕蒂手工车制" },
    certification: { en: "CITES Appendix II export permit · density certificate", zh: "CITES附录II出口许可 · 密度证书" },
  },
  rating: 0,
  reviewCount: 0,
  createdAt: new Date().toISOString().slice(0, 10),
  occasion: [],
});

function ProductsInner() {
  const params = useSearchParams();
  const products = useMaison((s) => s.products);
  const patchProduct = useMaison((s) => s.patchProduct);
  const upsertProduct = useMaison((s) => s.upsertProduct);
  const [q, setQ] = useState("");
  const [coll, setColl] = useState<"all" | CollectionSlug>("all");
  const [status, setStatus] = useState<"all" | ProductStatus>("all");
  const [view, setView] = useState<"table" | "grid">("table");
  const [editing, setEditing] = useState<Product | null>(null);
  const [sel, setSel] = useState<string[]>([]);
  const [bulkPct, setBulkPct] = useState("");

  // Deep links from the command palette (?edit=p01) open the editor.
  const editParam = params.get("edit");
  const [prevEdit, setPrevEdit] = useState<string | null>(null);
  if (editParam !== prevEdit) {
    setPrevEdit(editParam);
    const p = editParam ? products.find((x) => x.id === editParam) : undefined;
    if (p) setEditing(structuredClone(p));
  }

  const list = useMemo(
    () =>
      products
        .filter((p) => coll === "all" || p.collection === coll)
        .filter((p) => status === "all" || p.status === status)
        .filter((p) => !q || (p.name.en + (p.name.zh ?? "") + p.variants.map((v) => v.sku).join(" ")).toLowerCase().includes(q.toLowerCase())),
    [products, coll, status, q],
  );

  const applyBulk = () => {
    const pct = Number(bulkPct);
    if (!pct || !sel.length) return;
    sel.forEach((id) => {
      const p = products.find((x) => x.id === id)!;
      patchProduct(id, { price: Math.round((p.price * (1 + pct / 100)) / 100) * 100 });
    });
    toast(`${sel.length} prices ${pct > 0 ? "raised" : "lowered"} by ${Math.abs(pct)}%`);
    setBulkPct("");
    setSel([]);
  };

  return (
    <div className="space-y-6">
      <PageHead
        title="Catalogue"
        sub={`${products.filter((p) => p.status === "active").length} live · ${products.filter((p) => p.status === "draft").length} drafts · ${products.filter((p) => p.status === "archived").length} archived`}
        actions={
          <>
            <ExportMenu name="catalogue" sheet="Catalogue" rows={() => productRows(list)} />
            <Btn variant="gold" onClick={() => setEditing(blank())}><Plus className="h-4 w-4" /> New product</Btn>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-10 min-w-[240px] flex-1 items-center gap-2 rounded-xl border border-bone/10 bg-bone/[0.02] px-3 focus-within:border-gold/50">
          <Search className="h-4 w-4 text-bone/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, 中文名, SKU…" className="w-full bg-transparent text-sm outline-none placeholder:text-bone/30" />
        </div>
        <select className="admin-input !w-auto" value={coll} onChange={(e) => setColl(e.target.value as typeof coll)}>
          <option value="all">All collections</option>
          {COLLECTIONS.map((c) => <option key={c.slug} value={c.slug}>{c.name.en}</option>)}
        </select>
        <select className="admin-input !w-auto" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="all">Any status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <div className="flex rounded-xl border border-bone/10 p-1">
          <button onClick={() => setView("table")} className={cn("rounded-lg p-1.5", view === "table" ? "bg-bone/10 text-bone" : "text-bone/40")} aria-label="Table"><List className="h-4 w-4" /></button>
          <button onClick={() => setView("grid")} className={cn("rounded-lg p-1.5", view === "grid" ? "bg-bone/10 text-bone" : "text-bone/40")} aria-label="Grid"><LayoutGrid className="h-4 w-4" /></button>
        </div>
      </div>

      {sel.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-gold/25 bg-gold/[0.05] px-4 py-3 text-sm">
          <span className="mr-2 text-gold">{sel.length} selected</span>
          <div className="flex items-center gap-1 rounded-xl border border-bone/10 px-2">
            <Percent className="h-3.5 w-3.5 text-bone/40" />
            <input value={bulkPct} onChange={(e) => setBulkPct(e.target.value)} placeholder="+10 / −5" className="h-8 w-20 bg-transparent text-sm outline-none" />
          </div>
          <Btn size="sm" variant="gold" onClick={applyBulk}>Adjust prices</Btn>
          <Btn size="sm" onClick={() => { sel.forEach((id) => patchProduct(id, { status: "active" })); toast("Published"); setSel([]); }}>Publish</Btn>
          <Btn size="sm" onClick={() => { sel.forEach((id) => patchProduct(id, { status: "archived" })); toast("Archived"); setSel([]); }}><Archive className="h-3.5 w-3.5" /> Archive</Btn>
          <Btn size="sm" variant="subtle" onClick={() => setSel([])}>Clear</Btn>
        </div>
      )}

      {view === "table" ? (
        <Panel pad={false}>
          <div className="thin-scroll overflow-x-auto">
            <table className="w-full min-w-[960px] text-sm">
              <thead className="border-b border-bone/[0.06]">
                <tr>
                  <Th className="w-10 pl-6">
                    <input type="checkbox" className="accent-[#c9a46a]" checked={list.length > 0 && list.every((p) => sel.includes(p.id))} onChange={(e) => setSel(e.target.checked ? list.map((p) => p.id) : [])} aria-label="Select all" />
                  </Th>
                  <Th>Product</Th>
                  <Th>Collection</Th>
                  <Th>Price (INR)</Th>
                  <Th>Variants</Th>
                  <Th>Stock</Th>
                  <Th>Rating</Th>
                  <Th>Status</Th>
                  <Th className="pr-6" />
                </tr>
              </thead>
              <tbody>
                {list.map((p) => {
                  const stock = stockOf(p);
                  return (
                    <tr key={p.id} className="border-t border-bone/[0.04] hover:bg-bone/[0.02]">
                      <td className="pl-6"><input type="checkbox" className="accent-[#c9a46a]" checked={sel.includes(p.id)} onChange={() => setSel(sel.includes(p.id) ? sel.filter((x) => x !== p.id) : [...sel, p.id])} aria-label={`Select ${p.name.en}`} /></td>
                      <td className="px-4 py-3">
                        <button onClick={() => setEditing(structuredClone(p))} className="flex items-center gap-3 text-left">
                          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#1a100d]"><ProductVisual kind={p.visual} tone={p.tone} image={p.images?.[0]} className="h-full w-full" glow={false} /></span>
                          <span>
                            <span className="flex items-center gap-2 text-bone/90 hover:text-gold">{p.name.en}{p.featured && <Star className="h-3 w-3 fill-gold text-gold" />}</span>
                            <span className="text-xs text-bone/40">{p.name.zh}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-bone/60">{COLLECTIONS.find((c) => c.slug === p.collection)?.name.en}</td>
                      <td className="px-4 py-3">
                        <input
                          key={p.price}
                          defaultValue={p.price}
                          onBlur={(e) => {
                            const v = Number(e.target.value.replace(/\D/g, ""));
                            if (v && v !== p.price) {
                              patchProduct(p.id, { price: v });
                              toast(`${p.name.en}: ${inr(v)}`);
                            }
                          }}
                          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                          className="w-28 rounded-lg border border-transparent bg-transparent px-2 py-1 tabular-nums hover:border-bone/10 focus:border-gold/50 focus:bg-bone/[0.03] focus:outline-none"
                          aria-label={`Price for ${p.name.en}`}
                        />
                        {p.compareAt && <p className="px-2 text-[11px] text-bone/35 line-through">{inr(p.compareAt)}</p>}
                      </td>
                      <td className="px-4 py-3 text-bone/60">{p.variants.length}</td>
                      <td className="px-4 py-3">
                        <span className={cn("tabular-nums", stock === 0 ? "text-[#fa9a9a]" : stock <= 8 ? "text-[#e8c264]" : "text-bone/70")}>{stock}</span>
                      </td>
                      <td className="px-4 py-3 text-bone/60">{p.rating ? `${p.rating.toFixed(1)} · ${p.reviewCount}` : "—"}</td>
                      <td className="px-4 py-3">
                        <select value={p.status} onChange={(e) => { patchProduct(p.id, { status: e.target.value as ProductStatus }); toast(`${p.name.en} → ${e.target.value}`); }} className={cn("cursor-pointer rounded-full border-0 px-2.5 py-1 text-[11px] font-medium outline-none", STATUS_CLS[p.status])}>
                          <option value="active">active</option>
                          <option value="draft">draft</option>
                          <option value="archived">archived</option>
                        </select>
                      </td>
                      <td className="pr-6 text-right">
                        <a href={`/product/${p.slug}`} target="_blank" rel="noreferrer" className="inline-grid h-8 w-8 place-items-center rounded-lg text-bone/40 hover:bg-bone/5 hover:text-bone" aria-label="View on store"><ExternalLink className="h-3.5 w-3.5" /></a>
                        <button onClick={() => { const c = structuredClone(p); c.id = `p${Date.now().toString(36)}`; c.slug = `${p.slug}-copy`; c.name.en += " (copy)"; c.status = "draft"; upsertProduct(c); toast("Duplicated as draft"); }} className="inline-grid h-8 w-8 place-items-center rounded-lg text-bone/40 hover:bg-bone/5 hover:text-bone" aria-label="Duplicate"><Copy className="h-3.5 w-3.5" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {list.map((p) => (
            <button key={p.id} onClick={() => setEditing(structuredClone(p))} className="group overflow-hidden rounded-3xl border border-bone/[0.07] bg-bone/[0.02] text-left transition-colors hover:border-gold/30">
              <div className="aspect-square bg-[#1a100d]"><ProductVisual kind={p.visual} tone={p.tone} image={p.images?.[0]} className="h-full w-full transition-transform duration-700 group-hover:scale-105" /></div>
              <div className="p-4">
                <p className="truncate text-sm text-bone/90">{p.name.en}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="tabular-nums text-bone/60">{inr(p.price)}</span>
                  <span className={cn("rounded-full px-2 py-0.5", STATUS_CLS[p.status])}>{p.status}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <ProductEditor product={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function ProductEditor({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const upsertProduct = useMaison((s) => s.upsertProduct);
  const deleteProduct = useMaison((s) => s.deleteProduct);
  const exists = useMaison((s) => !!product && s.products.some((p) => p.id === product.id));
  const [p, setP] = useState<Product | null>(product);
  const [tab, setTab] = useState<"basics" | "variants" | "media" | "provenance">("basics");
  const [prevProduct, setPrevProduct] = useState(product);
  if (product !== prevProduct) {
    setPrevProduct(product);
    setP(product);
    setTab("basics");
  }
  if (!p) return <Drawer open={false} onClose={onClose} title="">{null}</Drawer>;

  const set = (patch: Partial<Product>) => setP({ ...p, ...patch });
  const save = () => {
    if (!p.name.en.trim()) return toast("Add an English name first");
    const slug = p.slug || p.name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    upsertProduct({ ...p, slug });
    toast(exists ? "Product saved" : "Product created");
    onClose();
  };

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 4).forEach((f) => {
      if (f.size > 1.5e6) return toast(`${f.name} is over 1.5 MB — compress it first`);
      const r = new FileReader();
      r.onload = () => setP((cur) => (cur ? { ...cur, images: [...(cur.images ?? []), String(r.result)].slice(0, 4) } : cur));
      r.readAsDataURL(f);
    });
  };

  return (
    <Drawer
      open
      onClose={onClose}
      width={760}
      title={
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-bone/40">{exists ? "Edit product" : "New product"}</p>
          <p className="mt-1 truncate font-display text-2xl">{p.name.en || "Untitled"}</p>
        </div>
      }
      footer={
        <div className="flex items-center justify-between gap-2">
          {exists ? (
            <Btn size="sm" variant="danger" onClick={() => { if (confirm(`Delete ${p.name.en}? This cannot be undone.`)) { deleteProduct(p.id); toast("Product deleted"); onClose(); } }}>
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </Btn>
          ) : <span />}
          <div className="flex gap-2">
            <Btn size="sm" variant="subtle" onClick={onClose}>Cancel</Btn>
            <Btn size="sm" variant="gold" onClick={save}>{exists ? "Save changes" : "Create product"}</Btn>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-[#1a100d]">
            <ProductVisual kind={p.visual} tone={p.tone} image={p.images?.[0]} className="h-full w-full" />
          </div>
          <p className="mt-2 text-center text-[11px] text-bone/35">Live preview</p>
          <div className="mt-4 space-y-3">
            <Field label="Status">
              <select className="admin-input" value={p.status} onChange={(e) => set({ status: e.target.value as ProductStatus })}>
                <option value="active">Active — visible</option>
                <option value="draft">Draft — hidden</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Toggle on={!!p.featured} onChange={(v) => set({ featured: v })} label="Featured" />
          </div>
        </div>

        <div>
          <div className="mb-5 flex gap-1 rounded-xl border border-bone/10 p-1">
            {(["basics", "variants", "media", "provenance"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn("flex-1 rounded-lg py-1.5 text-xs capitalize", tab === t ? "bg-bone text-ink" : "text-bone/55 hover:text-bone")}>{t}</button>
            ))}
          </div>

          {tab === "basics" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name (English)"><input className="admin-input" value={p.name.en} onChange={(e) => set({ name: { ...p.name, en: e.target.value } })} /></Field>
              <Field label="名称 (中文)"><input className="admin-input" value={p.name.zh ?? ""} onChange={(e) => set({ name: { ...p.name, zh: e.target.value } })} /></Field>
              <Field label="Subtitle (EN)"><input className="admin-input" value={p.subtitle.en} onChange={(e) => set({ subtitle: { ...p.subtitle, en: e.target.value } })} /></Field>
              <Field label="副标题 (中文)"><input className="admin-input" value={p.subtitle.zh ?? ""} onChange={(e) => set({ subtitle: { ...p.subtitle, zh: e.target.value } })} /></Field>
              <Field label="Description (EN)" className="sm:col-span-2"><textarea rows={3} className="admin-input resize-none" value={p.description.en} onChange={(e) => set({ description: { ...p.description, en: e.target.value } })} /></Field>
              <Field label="描述 (中文)" className="sm:col-span-2"><textarea rows={3} className="admin-input resize-none" value={p.description.zh ?? ""} onChange={(e) => set({ description: { ...p.description, zh: e.target.value } })} /></Field>
              <Field label="Collection">
                <select className="admin-input" value={p.collection} onChange={(e) => set({ collection: e.target.value as CollectionSlug })}>
                  {COLLECTIONS.map((c) => <option key={c.slug} value={c.slug}>{c.name.en}</option>)}
                </select>
              </Field>
              <Field label="URL slug" hint="Auto-generated from name if empty"><input className="admin-input font-mono" value={p.slug} onChange={(e) => set({ slug: e.target.value })} /></Field>
              <Field label="Base price (INR)"><input className="admin-input tabular-nums" inputMode="numeric" value={p.price} onChange={(e) => set({ price: Number(e.target.value.replace(/\D/g, "")) || 0 })} /></Field>
              <Field label="Compare-at price (INR)" hint="Shows as strikethrough"><input className="admin-input tabular-nums" inputMode="numeric" value={p.compareAt ?? ""} onChange={(e) => set({ compareAt: Number(e.target.value.replace(/\D/g, "")) || undefined })} /></Field>
              <Field label="Tags" hint="Comma-separated" className="sm:col-span-2"><input className="admin-input" value={p.tags.join(", ")} onChange={(e) => set({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} /></Field>
              <Field label="Occasions" className="sm:col-span-2">
                <div className="flex flex-wrap gap-1.5">
                  {["gift", "wedding", "ritual", "spring-festival", "diwali", "corporate", "collector", "milestone", "self"].map((o) => (
                    <button type="button" key={o} onClick={() => set({ occasion: p.occasion?.includes(o) ? p.occasion.filter((x) => x !== o) : [...(p.occasion ?? []), o] })} className={cn("rounded-full border px-3 py-1 text-xs", p.occasion?.includes(o) ? "border-gold bg-gold/15 text-gold" : "border-bone/10 text-bone/55")}>{o}</button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {tab === "variants" && (
            <div className="space-y-3">
              {p.variants.map((v, i) => (
                <div key={v.id} className="grid grid-cols-12 gap-2 rounded-2xl border border-bone/[0.07] p-3">
                  <input className="admin-input col-span-4" value={v.label.en} placeholder="Label" onChange={(e) => set({ variants: p.variants.map((x, j) => (j === i ? { ...x, label: { ...x.label, en: e.target.value } } : x)) })} />
                  <input className="admin-input col-span-3" value={v.label.zh ?? ""} placeholder="中文" onChange={(e) => set({ variants: p.variants.map((x, j) => (j === i ? { ...x, label: { ...x.label, zh: e.target.value } } : x)) })} />
                  <input className="admin-input col-span-2 tabular-nums" value={v.priceDelta} title="Price difference vs base (INR)" onChange={(e) => set({ variants: p.variants.map((x, j) => (j === i ? { ...x, priceDelta: Number(e.target.value) || 0 } : x)) })} />
                  <input className="admin-input col-span-2 tabular-nums" value={v.stock} title="Stock" onChange={(e) => set({ variants: p.variants.map((x, j) => (j === i ? { ...x, stock: Number(e.target.value.replace(/\D/g, "")) || 0 } : x)) })} />
                  <button disabled={p.variants.length === 1} onClick={() => set({ variants: p.variants.filter((_, j) => j !== i) })} className="col-span-1 grid place-items-center text-bone/35 hover:text-danger disabled:opacity-20" aria-label="Remove variant"><Trash2 className="h-4 w-4" /></button>
                  <p className="col-span-12 px-1 font-mono text-[11px] text-bone/35">{v.sku} · sells at {inr(p.price + v.priceDelta)}</p>
                </div>
              ))}
              <p className="text-[11px] text-bone/35">Columns: label · 中文 · price difference (INR) · stock</p>
              <Btn size="sm" onClick={() => set({ variants: [...p.variants, { id: `v${Date.now().toString(36)}`, label: { en: "New variant", zh: "" }, priceDelta: 0, stock: 0, sku: `SM-${Math.floor(1000 + Math.random() * 8999)}` }] })}>
                <Plus className="h-3.5 w-3.5" /> Add variant
              </Btn>
            </div>
          )}

          {tab === "media" && (
            <div className="space-y-5">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-bone/15 p-8 text-center text-sm text-bone/55 hover:border-gold/40">
                <ImagePlus className="h-6 w-6 text-gold" />
                Upload product photography (up to 4, ≤1.5 MB each)
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
              </label>
              {!!p.images?.length && (
                <div className="grid grid-cols-4 gap-3">
                  {p.images.map((src, i) => (
                    <div key={i} className="group relative aspect-square overflow-hidden rounded-xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt="" className="h-full w-full object-cover" />
                      <button onClick={() => set({ images: p.images!.filter((_, j) => j !== i) })} className="absolute right-1 top-1 hidden rounded-lg bg-black/70 p-1 group-hover:block" aria-label="Remove image"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-bone/45">Or use a generated render</p>
                <div className="grid grid-cols-6 gap-2">
                  {VISUALS.map((v) => (
                    <button key={v} onClick={() => set({ visual: v })} className={cn("aspect-square overflow-hidden rounded-xl border bg-[#1a100d]", p.visual === v ? "border-gold" : "border-transparent")} title={v}>
                      <ProductVisual kind={v} tone={p.tone} className="h-full w-full" glow={false} />
                    </button>
                  ))}
                </div>
                <Field label={`Wood tone · ${Math.round(p.tone * 100)}`} className="mt-4">
                  <input type="range" min={0} max={1} step={0.01} value={p.tone} onChange={(e) => set({ tone: Number(e.target.value) })} className="w-full accent-[#c9a46a]" />
                </Field>
              </div>
            </div>
          )}

          {tab === "provenance" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Batch"><input className="admin-input font-mono" value={p.provenance.batch} onChange={(e) => set({ provenance: { ...p.provenance, batch: e.target.value.toUpperCase() } })} /></Field>
              <Field label="Harvest year"><input className="admin-input" value={p.provenance.harvested} onChange={(e) => set({ provenance: { ...p.provenance, harvested: e.target.value } })} /></Field>
              <Field label="Density g/cm³"><input className="admin-input" value={p.provenance.density} onChange={(e) => set({ provenance: { ...p.provenance, density: e.target.value } })} /></Field>
              {(["source", "processing", "certification"] as const).map((k) => (
                <Field key={k} label={k} className="sm:col-span-3">
                  <input className="admin-input" value={p.provenance[k].en} onChange={(e) => set({ provenance: { ...p.provenance, [k]: { ...p.provenance[k], en: e.target.value } } })} />
                  <input className="admin-input mt-2" placeholder="中文" value={p.provenance[k].zh ?? ""} onChange={(e) => set({ provenance: { ...p.provenance, [k]: { ...p.provenance[k], zh: e.target.value } } })} />
                </Field>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsInner />
    </Suspense>
  );
}
