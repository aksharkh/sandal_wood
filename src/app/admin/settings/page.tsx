"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useMaison } from "@/lib/store";
import { RATES } from "@/lib/utils";
import { Btn, Field, PageHead, Panel, Toggle, toast } from "@/components/admin/ui";

const PAYMENTS = [
  { k: "UPI", region: "India", on: true },
  { k: "Cards (Visa · Mastercard · RuPay · Amex)", region: "India / Intl", on: true },
  { k: "Net banking", region: "India", on: true },
  { k: "No-cost EMI", region: "India", on: true },
  { k: "Alipay 支付宝", region: "China", on: true },
  { k: "WeChat Pay 微信支付", region: "China", on: true },
  { k: "UnionPay 银联", region: "China", on: true },
  { k: "PayPal", region: "International", on: false },
];

export default function SettingsPage() {
  const resetDemo = useMaison((s) => s.resetDemo);
  const [pay, setPay] = useState(PAYMENTS);
  const [rates, setRates] = useState({ CNY: RATES.CNY, USD: RATES.USD });

  return (
    <div className="space-y-6">
      <PageHead title="Settings" sub="Payments, shipping zones, currencies and taxes" actions={<Btn variant="gold" onClick={() => toast("Settings saved")}>Save settings</Btn>} />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Payment methods">
          <ul className="divide-y divide-bone/[0.05]">
            {pay.map((p, i) => (
              <li key={p.k} className="flex items-center justify-between py-3 text-sm">
                <span>
                  <span className="text-bone/85">{p.k}</span>
                  <span className="ml-2 text-[11px] text-bone/40">{p.region}</span>
                </span>
                <Toggle on={p.on} onChange={(v) => setPay(pay.map((x, j) => (j === i ? { ...x, on: v } : x)))} />
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-bone/35">Gateway (e.g. Razorpay / Stripe for India & international; Alipay+ / WeChat Pay cross-border for China) is connected in the integrations phase.</p>
        </Panel>
        <Panel title="Currencies">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Ledger"><input className="admin-input" value="INR ₹" disabled /></Field>
            <Field label="1 INR → CNY"><input className="admin-input tabular-nums" value={rates.CNY} onChange={(e) => setRates({ ...rates, CNY: Number(e.target.value) })} /></Field>
            <Field label="1 INR → USD"><input className="admin-input tabular-nums" value={rates.USD} onChange={(e) => setRates({ ...rates, USD: Number(e.target.value) })} /></Field>
          </div>
          <p className="mt-4 text-[11px] text-bone/35">Display rates. Charged amounts are set by the payment gateway at checkout.</p>
        </Panel>
        <Panel title="Shipping zones">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-bone/40">
                <th className="pb-2">Zone</th>
                <th className="pb-2">Carrier</th>
                <th className="pb-2">Rate</th>
                <th className="pb-2">ETA</th>
              </tr>
            </thead>
            <tbody className="text-bone/75">
              <tr className="border-t border-bone/[0.05]"><td className="py-2.5">India</td><td>Blue Dart · Delhivery</td><td>₹250 · free ≥ ₹5,000</td><td>1–4 d</td></tr>
              <tr className="border-t border-bone/[0.05]"><td className="py-2.5">Mainland China</td><td>DHL · SF Express</td><td>₹1,800 · free ≥ ₹30,000 · DDP</td><td>7–10 d</td></tr>
              <tr className="border-t border-bone/[0.05]"><td className="py-2.5">International</td><td>FedEx</td><td>₹2,600 · DAP</td><td>5–9 d</td></tr>
            </tbody>
          </table>
        </Panel>
        <Panel title="Taxes">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="India GST" hint="Indicative — confirm HSN classification with your CA"><input className="admin-input" defaultValue="3%" /></Field>
            <Field label="China CBEC composite tax" hint="Collected at checkout (DDP)"><input className="admin-input" defaultValue="9.1%" /></Field>
          </div>
        </Panel>
        <Panel title="Demo data" className="xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-sm text-bone/55">This front-end stores catalogue, orders and enquiries in the browser until the backend is built. Reset to restore the original sample data.</p>
            <Btn variant="danger" onClick={() => { if (confirm("Reset all catalogue, order and enquiry data to the original samples?")) { resetDemo(); toast("Demo data restored"); } }}>
              <RotateCcw className="h-4 w-4" /> Reset demo data
            </Btn>
          </div>
        </Panel>
      </div>
    </div>
  );
}
