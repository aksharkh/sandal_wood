import type { Customer, Enquiry, Order, OrderStatus, PaymentMethod, PaymentStatus, Recommendation } from "../types";
import { SEED_PRODUCTS } from "./products";
import { rng } from "../utils";

const PEOPLE: [string, string, string, string, Customer["region"]][] = [
  ["Aarav Mehta", "Mumbai", "Maharashtra", "India", "India"],
  ["Ishita Rao", "Bengaluru", "Karnataka", "India", "India"],
  ["Vihaan Kapoor", "New Delhi", "Delhi", "India", "India"],
  ["Diya Iyer", "Chennai", "Tamil Nadu", "India", "India"],
  ["Kavya Reddy", "Hyderabad", "Telangana", "India", "India"],
  ["Rehan Shah", "Ahmedabad", "Gujarat", "India", "India"],
  ["Nisha Menon", "Kochi", "Kerala", "India", "India"],
  ["Aditya Singh", "Jaipur", "Rajasthan", "India", "India"],
  ["Tara Banerjee", "Kolkata", "West Bengal", "India", "India"],
  ["Kabir Malhotra", "Gurugram", "Haryana", "India", "India"],
  ["Wang Lei 王磊", "Shanghai 上海", "Shanghai", "China", "China"],
  ["Li Na 李娜", "Beijing 北京", "Beijing", "China", "China"],
  ["Chen Jie 陈杰", "Shenzhen 深圳", "Guangdong", "China", "China"],
  ["Zhang Wei 张伟", "Hangzhou 杭州", "Zhejiang", "China", "China"],
  ["Liu Yang 刘洋", "Chengdu 成都", "Sichuan", "China", "China"],
  ["Zhao Min 赵敏", "Guangzhou 广州", "Guangdong", "China", "China"],
  ["Huang Qi 黄琪", "Suzhou 苏州", "Jiangsu", "China", "China"],
  ["Sun Hao 孙浩", "Xiamen 厦门", "Fujian", "China", "China"],
  ["Lin Wen", "Singapore", "Singapore", "Singapore", "International"],
  ["Farah Dossani", "Dubai", "Dubai", "UAE", "International"],
  ["Oliver Grant", "London", "England", "United Kingdom", "International"],
  ["Priya Nair", "Hyderabad", "Telangana", "India", "India"],
  ["Sameer Joshi", "Pune", "Maharashtra", "India", "India"],
  ["Mei Tan 谭美", "Hong Kong 香港", "Hong Kong", "China", "China"],
];

const r = rng(2026);
const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];

export const SEED_CUSTOMERS: Customer[] = PEOPLE.map(([name, city, , country, region], i) => {
  const handle = name.split(" ")[0].toLowerCase() + "." + name.split(" ")[1].toLowerCase().replace(/[^a-z]/g, "");
  const joined = new Date(2025, 6 + Math.floor(r() * 12), 1 + Math.floor(r() * 27));
  return {
    id: `C${(1001 + i).toString()}`,
    name,
    email: region === "China" ? `${handle}@qq.com` : `${handle}@${pick(["gmail.com", "outlook.com", "icloud.com"])}`,
    phone:
      region === "China"
        ? `+86 1${Math.floor(30 + r() * 60)} ${Math.floor(1000 + r() * 8999)} ${Math.floor(1000 + r() * 8999)}`
        : region === "India"
          ? `+91 9${Math.floor(1000 + r() * 8999)} ${Math.floor(10000 + r() * 89999)}`
          : `+${pick(["65", "971", "44"])} ${Math.floor(1000 + r() * 8999)} ${Math.floor(1000 + r() * 8999)}`,
    city,
    country,
    region,
    joined: joined.toISOString().slice(0, 10),
    tier: r() > 0.75 ? "Circle Gold" : r() > 0.3 ? "Circle" : "Guest",
    tags: [pick(["Collector", "Gifting", "Ritual", "Jewellery", "Corporate"]), ...(r() > 0.7 ? ["VIP"] : [])],
  };
});

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "packed", "shipped", "delivered"];
const methodsFor = (region: Customer["region"]): PaymentMethod[] =>
  region === "China" ? ["Alipay", "WeChat Pay", "UnionPay"] : region === "India" ? ["UPI", "Card", "NetBanking"] : ["Card", "PayPal"];

function makeOrders(): Order[] {
  const out: Order[] = [];
  const now = new Date("2026-09-29T10:00:00+05:30").getTime();
  for (let i = 0; i < 84; i++) {
    const c = pick(SEED_CUSTOMERS);
    const ageDays = Math.floor(Math.pow(r(), 1.6) * 180);
    const created = new Date(now - ageDays * 864e5 - Math.floor(r() * 864e5));
    const nLines = r() > 0.72 ? 2 : 1;
    const lines = Array.from({ length: nLines }, () => {
      const p = pick(SEED_PRODUCTS);
      const v = pick(p.variants);
      return {
        productId: p.id,
        variantId: v.id,
        name: p.name.en,
        variant: v.label.en,
        sku: v.sku,
        qty: r() > 0.85 ? 2 : 1,
        price: p.price + v.priceDelta,
      };
    });
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const shipping = c.region === "India" ? (subtotal > 5000 ? 0 : 250) : c.region === "China" ? 1800 : 2600;
    const discount = r() > 0.85 ? Math.round(subtotal * 0.1) : 0;
    // Indicative: India GST is included in price; China CBEC tax is added on top.
    const tax = c.region === "India" ? Math.round((subtotal - discount) * (0.03 / 1.03)) : c.region === "China" ? Math.round((subtotal - discount) * 0.091) : 0;

    let stage = ageDays > 12 ? 4 : ageDays > 6 ? 3 : ageDays > 3 ? 2 : ageDays > 1 ? 1 : 0;
    if (r() > 0.85) stage = Math.max(0, stage - 1);
    let status: OrderStatus = STATUS_FLOW[stage];
    let payment: PaymentStatus = "paid";
    const roll = r();
    if (roll > 0.95) {
      status = "cancelled";
      payment = "refunded";
    } else if (roll > 0.92 && stage === 4) {
      status = "returned";
      payment = "refunded";
    } else if (status === "pending" && r() > 0.6) payment = r() > 0.5 ? "pending" : "failed";

    const timeline = STATUS_FLOW.slice(0, stage + 1).map((s, k) => ({
      at: new Date(created.getTime() + k * 1.3 * 864e5).toISOString(),
      status: s,
    }));
    if (status === "cancelled" || status === "returned")
      timeline.push({ at: new Date(created.getTime() + (stage + 1) * 864e5).toISOString(), status });

    const carrier = c.region === "India" ? pick(["Blue Dart", "Delhivery"]) : c.region === "China" ? pick(["DHL Express", "SF Express 顺丰"]) : "FedEx";
    out.push({
      id: `SM-${(26000 + 84 - i).toString()}`,
      createdAt: created.toISOString(),
      customerId: c.id,
      customerName: c.name,
      email: c.email,
      phone: c.phone,
      region: c.region,
      lines,
      subtotal,
      shipping,
      tax,
      discount,
      total: subtotal + shipping - discount + (c.region === "China" ? tax : 0),
      currency: c.region === "China" ? "CNY" : c.region === "India" ? "INR" : "USD",
      status,
      payment,
      method: pick(methodsFor(c.region)),
      address: {
        name: c.name,
        phone: c.phone,
        line1: `${Math.floor(r() * 200) + 1}, ${pick(["Residency Road", "Lotus Towers", "Garden Lane", "世纪大道", "Palm Grove", "锦绣路"])}`,
        city: c.city,
        state: PEOPLE.find((p) => p[0] === c.name)?.[2] ?? "",
        postcode: c.region === "China" ? `${Math.floor(100000 + r() * 800000)}` : `${Math.floor(400000 + r() * 199999)}`,
        country: c.country,
      },
      giftWrap: r() > 0.5,
      giftMessage: r() > 0.7 ? pick(["Happy Diwali, with love", "新春快乐，万事如意", "For your 60th — Papa", "Congratulations on the new beginning"]) : undefined,
      carrier: stage >= 3 ? carrier : undefined,
      tracking: stage >= 3 ? `${carrier.slice(0, 2).toUpperCase()}${Math.floor(1e9 + r() * 8e9)}` : undefined,
      timeline,
      channel: c.region === "China" && r() > 0.6 ? "WeChat" : r() > 0.85 ? "WhatsApp" : r() > 0.95 ? "Boutique" : "Web",
    });
  }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const SEED_ORDERS = makeOrders();

export const SEED_ENQUIRIES: Enquiry[] = [
  { id: "E-3101", type: "Corporate", name: "Radhika Sen", email: "radhika@tatvahotels.in", company: "Tatva Hotels", country: "India", budget: "₹8–10 L", message: "Looking for 120 engraved keepsake boxes for our Diwali partner gifting, delivery by 20 October.", status: "in-progress", createdAt: "2026-09-26", assignee: "Meera", preferredChannel: "Email" },
  { id: "E-3102", type: "Private", name: "周先生", email: "zhou.collector@163.com", country: "China", budget: "¥50,000+", message: "想了解老料藏家念珠是否还有编号靠前的，另外希望定制2.0厘米金星手串。", status: "new", createdAt: "2026-09-28", preferredChannel: "WeChat" },
  { id: "E-3103", type: "Hospitality", name: "Anil Varghese", email: "anil@kumarakomretreat.com", company: "Kumarakom Retreat", country: "India", message: "Amenity program: sandalwood comb + powder in 40 suites, recurring quarterly.", status: "quoted", createdAt: "2026-09-19", assignee: "Arjun", preferredChannel: "WhatsApp" },
  { id: "E-3104", type: "Designer", name: "Sophie Laurent", email: "studio@laurent.fr", company: "Studio Laurent", country: "France", message: "Interior collaboration — inlaid heartwood panels for a boutique in Paris.", status: "in-progress", createdAt: "2026-09-15", assignee: "Meera", preferredChannel: "Email" },
  { id: "E-3105", type: "Gifting", name: "Karthik Iyer", email: "karthik.iyer@gmail.com", country: "India", budget: "₹60,000", message: "Wedding in December — 2 pairs of wedding bangles engraved with our date, and 30 small boxes for family.", status: "won", createdAt: "2026-09-08", assignee: "Arjun", preferredChannel: "WhatsApp" },
  { id: "E-3106", type: "Corporate", name: "Huang Li 黄立", email: "huangli@lumenpartners.cn", company: "Lumen Partners", country: "China", budget: "¥120,000", message: "春节客户礼品，约80套新春礼盒，需要中文贺卡与公司logo。", status: "new", createdAt: "2026-09-27", preferredChannel: "WeChat" },
  { id: "E-3107", type: "Private", name: "Nandini Rao", email: "nandini@rao.family", country: "India", message: "Visit by appointment at the Bengaluru studio this Saturday for my mother's 70th birthday.", status: "closed", createdAt: "2026-08-30", assignee: "Meera", preferredChannel: "Phone" },
  { id: "E-3108", type: "Other", name: "Dr. Suresh Pillai", email: "s.pillai@ayurcollege.edu", country: "India", message: "Bulk powder for research on traditional formulations — need certificate of analysis.", status: "in-progress", createdAt: "2026-09-22", assignee: "Arjun", preferredChannel: "Email" },
];

export const SEED_RECOMMENDATIONS: Recommendation[] = [
  { id: "R-01", title: "Curated for you — homepage", placement: "home-curated", productIds: ["p01", "p02", "p03", "p10"], audience: "All", active: true, startsAt: "2026-09-01", impressions: 48210, clicks: 3920, conversions: 312 },
  { id: "R-02", title: "Pairs well with (product page)", placement: "pdp-pairs", productIds: ["p14", "p11", "p05", "p13"], audience: "All", active: true, startsAt: "2026-08-15", impressions: 22840, clicks: 1710, conversions: 146 },
  { id: "R-03", title: "Complete the ritual (bag)", placement: "bag-upsell", productIds: ["p14", "p13", "p11"], audience: "All", active: true, startsAt: "2026-07-01", impressions: 9120, clicks: 820, conversions: 97 },
  { id: "R-04", title: "Spring Festival · China edit", placement: "china-edit", productIds: ["p18", "p01", "p10", "p06"], audience: "China", active: false, startsAt: "2027-01-10", endsAt: "2027-02-20", impressions: 0, clicks: 0, conversions: 0 },
  { id: "R-05", title: "Diwali gifting edit", placement: "gifting-edit", productIds: ["p16", "p12", "p17", "p07"], audience: "India", active: true, startsAt: "2026-09-20", endsAt: "2026-11-05", impressions: 6400, clicks: 710, conversions: 58 },
];
