import type { Review } from "../types";
import { SEED_PRODUCTS } from "./products";
import { rng } from "../utils";

type Tpl = Omit<Review, "id" | "productId" | "date" | "helpful" | "variant">;

const POOL: Tpl[] = [
  { author: "Ananya R.", city: "Bengaluru", country: "IN", rating: 5, verified: true, title: "Heavier than I expected — in the best way", body: "You feel the density the moment you pick it up. The colour is a deep, almost wine red and after two weeks it has already started to glow. Packaging felt like opening an heirloom." },
  { author: "王先生", city: "上海", country: "CN", rating: 5, verified: true, title: "金星很满，料子正", body: "收到后第一时间做了沉水测试，确实沉水。金星明显，牛毛纹细密，包浆速度很快。附带的批次证书让人放心，会回购。" },
  { author: "Rohit M.", city: "Mumbai", country: "IN", rating: 5, verified: true, title: "Gifted to my father", body: "Bought this for Papa's 60th. He has worn chandan malas his whole life and said this was the finest he has held. The handwritten card was a lovely touch." },
  { author: "李女士", city: "北京", country: "CN", rating: 5, verified: true, title: "送礼很有面子", body: "盒子质感非常高级，朱红漆盒配烫金，送给长辈很合适。物流从印度发过来大概八天，清关顺利。" },
  { author: "Meera S.", city: "Chennai", country: "IN", rating: 4, verified: true, title: "Beautiful, sizing runs slightly small", body: "Exquisite finish and the gold line is so fine. I'd suggest going one size up if you are between sizes — the team exchanged mine within a week without fuss." },
  { author: "陈先生", city: "深圳", country: "CN", rating: 5, verified: true, title: "细节到位", body: "每颗珠子的孔道都很干净，没有崩口。木香淡淡的，很安神。客服用微信沟通，响应很快。" },
  { author: "Kabir A.", city: "New Delhi", country: "IN", rating: 5, verified: true, title: "Quiet luxury, truly", body: "No loud branding, just the material speaking for itself. The provenance card with the batch number is something I have never seen from an Indian brand. Proud of this." },
  { author: "Priya N.", city: "Hyderabad", country: "IN", rating: 5, verified: true, title: "Smells like my grandmother's puja room", body: "That faint woody fragrance took me straight back. Genuine raktachandan — you can tell from the way it leaves a red trace on a wet stone." },
  { author: "张女士", city: "杭州", country: "CN", rating: 4, verified: true, title: "颜色比图片更深", body: "实物颜色比网页上更深一些，偏紫红，个人更喜欢。希望以后可以出更多小尺寸款式。" },
  { author: "Arjun V.", city: "Kochi", country: "IN", rating: 5, verified: true, title: "Craftsmanship you can see", body: "Look closely and you can see the tool marks have been polished out by hand. UPI payment was instant and it arrived in two days in a beautiful box." },
  { author: "Lin W.", city: "Singapore", country: "SG", rating: 5, verified: true, title: "Worth every rupee", body: "I've bought zitan in Guangzhou and this compares with the very best. Transparent documentation made the purchase easy to trust." },
  { author: "Sanya K.", city: "Pune", country: "IN", rating: 5, verified: false, title: "Stunning in person", body: "Saw it at a private viewing in Pune first and ordered online the same night. The gold inlay catches candlelight beautifully." },
  { author: "刘先生", city: "成都", country: "CN", rating: 5, verified: true, title: "老料无疑", body: "密度证书写的1.2以上，上手压手，油性十足。这个价格在国内很难买到同等级的老料。" },
  { author: "Farah D.", city: "Dubai", country: "AE", rating: 5, verified: true, title: "Perfect corporate gift", body: "We ordered thirty for our partners through the corporate team — each was engraved and delivered on time. Several clients wrote back asking where it was from." },
  { author: "Vikram P.", city: "Jaipur", country: "IN", rating: 4, verified: true, title: "Lovely, wish there were more colours of cord", body: "The piece itself is flawless. Would love a black or indigo silk cord option in future." },
];

export function reviewsFor(productId: string): Review[] {
  const idx = SEED_PRODUCTS.findIndex((p) => p.id === productId);
  const r = rng(idx * 97 + 13);
  const n = 5 + Math.floor(r() * 4);
  const picked = new Set<number>();
  while (picked.size < n) picked.add(Math.floor(r() * POOL.length));
  return [...picked].map((i, k) => {
    const d = new Date(2026, 8, 20);
    d.setDate(d.getDate() - Math.floor(r() * 200) - k * 3);
    return {
      ...POOL[i],
      id: `${productId}-r${k}`,
      productId,
      date: d.toISOString().slice(0, 10),
      helpful: Math.floor(r() * 90),
    };
  });
}
