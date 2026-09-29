"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Building2, Mail, MessageCircle, Phone, UserRound } from "lucide-react";
import { useMaison } from "@/lib/store";
import type { Enquiry, EnquiryStatus } from "@/lib/types";
import { Btn, Drawer, EnquiryBadge, Field, PageHead, toast } from "@/components/admin/ui";
import { ExportMenu } from "@/components/admin/Shell";
import { enquiryRows } from "@/lib/export";
import { cn, fmtDate } from "@/lib/utils";

const COLS: { k: EnquiryStatus; label: string }[] = [
  { k: "new", label: "New" },
  { k: "in-progress", label: "In progress" },
  { k: "quoted", label: "Quoted" },
  { k: "won", label: "Won" },
  { k: "closed", label: "Closed" },
];
const TEAM = ["Meera", "Arjun", "Lin (中文)", "Unassigned"];

export default function EnquiriesPage() {
  const enquiries = useMaison((s) => s.enquiries);
  const patch = useMaison((s) => s.patchEnquiry);
  const [type, setType] = useState("all");
  const [drag, setDrag] = useState<string | null>(null);
  const [over, setOver] = useState<EnquiryStatus | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const list = enquiries.filter((e) => type === "all" || e.type === type);
  const open = enquiries.find((e) => e.id === openId);

  return (
    <div className="space-y-6">
      <PageHead
        title="Enquiries"
        sub="Private, gifting, corporate, designer and hospitality — drag cards between stages"
        actions={
          <>
            <select className="admin-input !w-auto" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All types</option>
              {["Private", "Gifting", "Corporate", "Designer", "Hospitality", "Other"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <ExportMenu name="enquiries" sheet="Enquiries" rows={() => enquiryRows(list)} />
          </>
        }
      />
      <div className="thin-scroll flex gap-4 overflow-x-auto pb-4">
        {COLS.map((col) => {
          const items = list.filter((e) => e.status === col.k);
          return (
            <div
              key={col.k}
              onDragOver={(e) => {
                e.preventDefault();
                setOver(col.k);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={() => {
                if (drag) {
                  patch(drag, { status: col.k });
                  toast(`Moved to ${col.label}`);
                }
                setDrag(null);
                setOver(null);
              }}
              className={cn(
                "flex w-[290px] shrink-0 flex-col border p-3 transition-colors",
                over === col.k ? "border-clay/40 bg-clay/[0.04]" : "border-line bg-stone",
              )}
            >
              <div className="flex items-center justify-between px-2 pb-3 pt-1">
                <span className="text-[12px] uppercase tracking-[0.18em] text-graphite">{col.label}</span>
                <span className="rounded-full bg-stone px-2 text-[12px] tabular-nums text-graphite">{items.length}</span>
              </div>
              <div className="min-h-[120px] space-y-2">
                {items.map((e) => (
                  <motion.button
                    layout
                    key={e.id}
                    draggable
                    onDragStart={() => setDrag(e.id)}
                    onClick={() => setOpenId(e.id)}
                    className="block w-full cursor-grab border border-line bg-paper p-4 text-left transition-colors hover:border-line active:cursor-grabbing"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-stone px-2 py-0.5 text-[12px] uppercase tracking-[0.12em] text-graphite">{e.type}</span>
                      <span className="font-mono text-[12px] text-muted">{e.id}</span>
                    </div>
                    <p className="mt-3 text-sm text-ink">{e.name}</p>
                    {e.company && <p className="text-[12px] text-muted">{e.company}</p>}
                    <p className="mt-2 line-clamp-2 text-xs text-graphite">{e.message}</p>
                    <div className="mt-3 flex items-center justify-between text-[12px] text-muted">
                      <span>
                        {e.country}
                        {e.budget ? ` · ${e.budget}` : ""}
                      </span>
                      <span>{e.assignee ?? "—"}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <EnquiryDrawer e={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

function EnquiryDrawer({ e, onClose }: { e?: Enquiry; onClose: () => void }) {
  const patch = useMaison((s) => s.patchEnquiry);
  const content = useMaison((s) => s.content);
  if (!e)
    return (
      <Drawer open={false} onClose={onClose} title="">
        {null}
      </Drawer>
    );
  const reply = encodeURIComponent(`Dear ${e.name.split(" ")[0]}, thank you for your ${e.type.toLowerCase()} enquiry with Santalum Maison (${e.id}).`);
  return (
    <Drawer
      open
      onClose={onClose}
      title={
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-display text-2xl">{e.name}</span>
          <EnquiryBadge status={e.status} />
        </div>
      }
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <a
            href={`mailto:${e.email}?subject=${encodeURIComponent(`Your enquiry ${e.id}`)}&body=${reply}`}
            className="inline-flex h-8 items-center gap-2 border border-ink/12 px-3 text-xs hover:border-line"
          >
            <Mail className="h-3.5 w-3.5" /> Email
          </a>
          {e.phone && e.preferredChannel !== "WeChat" && (
            <a
              href={`https://wa.me/${e.phone.replace(/\D/g, "")}?text=${reply}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-8 items-center gap-2 border border-ink/12 px-3 text-xs hover:border-line"
            >
              <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
            </a>
          )}
          <Btn
            size="sm"
            variant="solid"
            onClick={() => {
              patch(e.id, { status: "quoted" });
              toast("Marked as quoted");
            }}
          >
            Mark quoted
          </Btn>
        </div>
      }
    >
      <div className="space-y-5 text-sm">
        <div className="border border-line p-4">
          <p className="text-[12px] uppercase tracking-[0.14em] text-muted">
            {e.type} · {fmtDate(e.createdAt)} · {e.id}
          </p>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-ink">{e.message}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-ink">
          <p className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-clay" /> {e.name}
          </p>
          {e.company && (
            <p className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-clay" /> {e.company}
            </p>
          )}
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-clay" /> {e.email}
          </p>
          {e.phone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-clay" /> {e.phone}
            </p>
          )}
          <p>Country: {e.country}</p>
          <p>Budget: {e.budget ?? "—"}</p>
          <p>
            Prefers: {e.preferredChannel ?? "—"}
            {e.preferredChannel === "WeChat" ? ` (add ${content.wechat})` : ""}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Stage">
            <select
              className="admin-input"
              value={e.status}
              onChange={(ev) => {
                patch(e.id, { status: ev.target.value as EnquiryStatus });
                toast("Stage updated");
              }}
            >
              {COLS.map((c) => (
                <option key={c.k} value={c.k}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Assignee">
            <select
              className="admin-input"
              value={e.assignee ?? "Unassigned"}
              onChange={(ev) => {
                patch(e.id, { assignee: ev.target.value === "Unassigned" ? undefined : ev.target.value });
                toast("Assigned");
              }}
            >
              {TEAM.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    </Drawer>
  );
}
