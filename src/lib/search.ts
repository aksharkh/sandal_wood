import type { Product } from "./types";
import { COLLECTIONS } from "./data/products";

const SYNONYMS: Record<string, string[]> = {
  bracelet: ["手串", "bracelet", "wrist"],
  手串: ["bracelet"],
  mala: ["念珠", "mala", "beads", "japa", "108"],
  念珠: ["mala"],
  bangle: ["手镯", "bangle", "kada"],
  手镯: ["bangle"],
  gift: ["礼", "gift", "gifting", "present"],
  礼物: ["gift"],
  wedding: ["婚礼", "wedding", "marriage"],
  婚礼: ["wedding"],
  powder: ["檀粉", "powder", "tilak"],
  earrings: ["耳坠", "earring"],
  pendant: ["吊坠", "pendant", "necklace"],
  ring: ["指环", "ring"],
};

/**
 * Lightweight natural-language search: matches EN + 中文 names, tags, collections,
 * and understands “under 10000” / “below ₹5,000” / “一万以下” budget phrases.
 * A stand-in for the optional AI search phase in the scope of work.
 */
export function searchProducts(products: Product[], raw: string) {
  const q = raw.toLowerCase().replace(/[₹¥,]/g, "");
  let max = Infinity;
  const under = q.match(/(?:under|below|less than|<)\s*(\d+)(k)?/);
  if (under) max = Number(under[1]) * (under[2] ? 1000 : 1);
  if (/一万|1万/.test(q) && /以下|以内/.test(q)) max = 10000;
  if (/五千|5千/.test(q) && /以下|以内/.test(q)) max = 5000;

  const words = q
    .replace(/(?:under|below|less than|<)\s*\d+k?/, "")
    .split(/\s+/)
    .filter((w) => w && !["a", "the", "for", "show", "me", "red", "sandalwood", "以下", "的"].includes(w));
  const expanded = words.flatMap((w) => [w, ...(SYNONYMS[w] ?? []), ...Object.entries(SYNONYMS).filter(([k]) => w.includes(k)).flatMap(([, v]) => v)]);

  return products
    .map((p) => {
      const coll = COLLECTIONS.find((c) => c.slug === p.collection);
      const hay = [p.name.en, p.name.zh, p.subtitle.en, p.subtitle.zh, p.visual, p.tags.join(" "), p.occasion?.join(" "), coll?.name.en, coll?.name.zh]
        .join(" ")
        .toLowerCase();
      const score = expanded.length === 0 ? 1 : expanded.reduce((s, w) => s + (hay.includes(w.toLowerCase()) ? 1 : 0), 0);
      return { p, score };
    })
    .filter(({ p, score }) => score > 0 && p.price + Math.min(0, ...p.variants.map((v) => v.priceDelta)) <= max)
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .map(({ p }) => p);
}
