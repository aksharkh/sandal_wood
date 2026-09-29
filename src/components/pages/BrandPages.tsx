"use client";

import { CTABand, FactGrid, PageHero, Split, Statement } from "../content/Blocks";
import { Button, Heading, Label, Photo, Reveal, Section, TextLink } from "../motion/primitives";
import { LookCloser, Making, ScienceSourcing } from "../home/Home";
import { useT } from "@/lib/store";
import { cn } from "@/lib/utils";

export function MaisonPage() {
  const { zh } = useT();
  return (
    <>
      <PageHero
        eyebrow={zh ? "品牌之家" : "The Maison"}
        title={zh ? "一个只做一种木材的品牌" : "A house devoted to one material"}
        lead={zh ? "Santalum Maison 诞生于南印度，只使用小叶紫檀。当材料足够珍贵，最好的设计便是克制。" : "Santalum Maison was founded in South India to work with a single material — red sandalwood. When a material is this rare, the best design is restraint."}
        image="/images/e-temple-tower.jpg"
      />
      <Statement cite={zh ? "品牌信条" : "Our creed"}>{zh ? "材质第一，工艺其次，我们的名字最后。" : "The material first. The craft second. Our name, last."}</Statement>
      <Split eyebrow={zh ? "印度语境" : "Indian context"} title={zh ? "在寺庙与厨房之间" : "Between the temple and the kitchen"} image="/images/e-kumkum.jpg">
        <p>{zh ? "在南印度，红檀从不只是奢侈品。它被研磨成粉点在额头，被敷在婴儿的皮肤上，被献于神前。我们的作品源自这种日常的神圣感。" : "In South India, red sandalwood was never only a luxury. It is ground for the forehead, pasted onto a child's skin, offered at the shrine. Our objects come from that everyday sacredness."}</p>
        <p>{zh ? "我们与蒂鲁帕蒂的车木匠人家族合作，他们的手艺已传承三代。每一件作品，都由一位匠人从头做到尾。" : "We work with families of turners in Tirupati whose craft goes back three generations. Every object is made start to finish by one artisan."}</p>
      </Split>
      <Split eyebrow={zh ? "中国语境" : "Chinese context"} title={zh ? "明代宫廷的小叶紫檀" : "The zitan of the Ming court"} image="/images/p-mala-hand.jpg" flip tone="stone">
        <p>{zh ? "小叶紫檀自明代起便是中国宫廷最珍视的木材，被制成家具、印盒与念珠。今天，一串满金星的手串依然是藏家眼中的传家宝。" : "Since the Ming dynasty, xiaoye zitan has been the most prized wood at the Chinese court — made into furniture, seal boxes and prayer beads. A gold-star bracelet remains an heirloom in any collector's eyes."}</p>
        <p>{zh ? "我们为中国藏家提供完整的产地文件、密度证书，以及直邮到家、税费预付的配送服务。" : "For collectors in China we provide full origin paperwork, density certificates, and duties-prepaid delivery to the door."}</p>
      </Split>
      <FactGrid
        items={[
          { k: zh ? "创立" : "Founded", v: "2024", d: zh ? "蒂鲁帕蒂 · 班加罗尔" : "Tirupati · Bengaluru" },
          { k: zh ? "匠人" : "Artisans", v: "14", d: zh ? "三个车木家族" : "Across three turning families" },
          { k: zh ? "选料淘汰率" : "Refused at selection", v: "40%", d: zh ? "不合格木料绝不使用" : "Billets that never become objects" },
          { k: zh ? "配送" : "Delivering to", v: "31", d: zh ? "个国家与地区" : "Countries, incl. mainland China" },
        ]}
      />
      <CTABand title={zh ? "从材质开始" : "Begin with the material"} href="/collections" label={zh ? "探索系列" : "Explore the collections"} />
    </>
  );
}

export function FounderPage() {
  const { zh } = useT();
  const paras = zh
    ? [
        "我在蒂鲁帕蒂长大，离塞沙查拉姆山只有一小时车程。每天清晨，祖母都会在一块湿石上研磨红檀，把那抹红点在我的额头。",
        "很多年后，我在上海一家古董店里看到一串小叶紫檀手串，标价是我在印度见过的任何木器的一百倍。店主告诉我，这种木头“来自印度的一座山”。那一刻我意识到，这种材料的故事从未被它的故乡讲述过。",
        "同时我也看到了阴暗面：非法砍伐、走私、无法追溯的木料。一种如此珍贵的材料，却很少被认真对待。",
        "Santalum Maison 的初衷很简单：只使用合法、有记录的木料；把每一份文件公开给买家；让匠人的名字与作品一起流传。我们宁可做得少，也不愿做错。",
      ]
    : [
        "I grew up in Tirupati, an hour from the Seshachalam hills. Every morning my grandmother ground red sandalwood on a wet stone and pressed the red onto my forehead.",
        "Years later, in an antiques shop in Shanghai, I saw a zitan bracelet priced at a hundred times anything I had seen made of it in India. The owner told me the wood came “from a mountain in India”. I realised the story of this material had never been told by the place it comes from.",
        "I also saw the shadow side — illegal felling, smuggling, wood no one could trace. A material this precious was rarely treated seriously.",
        "Santalum Maison began with a simple intent: work only with legal, documented stock; show every buyer the paperwork; let the artisans' names travel with their work. We would rather make less than make it wrong.",
      ];
  return (
    <>
      <PageHero eyebrow={zh ? "缘起" : "Why we began"} title={zh ? "创始人手记" : "A letter from the founder"} image="/images/e-elder-mala.jpg" />
      <Section tone="paper" className="py-24">
        <div className="mx-auto max-w-2xl">
          {paras.map((p, i) => (
            <Reveal key={i}>
              <p className={i === 0 ? "font-display text-3xl leading-snug" : "mt-8 text-[17px] leading-[1.85] text-graphite"}>{p}</p>
            </Reveal>
          ))}
          <p className="mt-12 border-t border-line pt-6 text-[14px] text-graphite">{zh ? "创始人，Santalum Maison" : "Founder, Santalum Maison"}</p>
        </div>
      </Section>
      <CTABand title={zh ? "认识这种木材" : "Meet the material"} href="/material" label={zh ? "材质" : "The Material"} />
    </>
  );
}

export function MaterialPage() {
  const { zh } = useT();
  const props = [
    { k: zh ? "纹理" : "Grain", t: zh ? "牛毛纹，细密如丝" : "Cow-hair grain, fine as silk", d: zh ? "慢生木材的纹理细密波动，老料尤其明显。" : "Slow growth lays down fine, wavy lines — most visible in old material.", img: "/images/e-grain-rich.jpg" },
    { k: zh ? "色泽" : "Colour", t: zh ? "从余烬到陈酒" : "From ember to old wine", d: zh ? "新切面呈橙红，氧化后转深红，多年后近乎紫黑。" : "Orange-red when cut, deepening to oxblood, then near-violet over years.", img: "/images/p-grain-red.jpg" },
    { k: zh ? "触感" : "Touch", t: zh ? "沉手、温润、微凉" : "Heavy, warm, faintly cool", d: zh ? "高密度带来压手感；天然油脂让表面愈摸愈亮。" : "Density gives weight in the palm; natural oils brighten the surface with handling.", img: "/images/p-mala-red.jpg" },
  ];
  return (
    <>
      <PageHero
        eyebrow={zh ? "材质" : "The Material"}
        title={zh ? "认识小叶紫檀" : "Meet red sandalwood"}
        lead={zh ? "Pterocarpus santalinus——世界上最致密、最受追捧的木材之一，只生长在南印度东高止山脉的几座山丘。" : "Pterocarpus santalinus — one of the densest, most sought-after woods on earth, native only to a few hills of the Eastern Ghats in South India."}
        image="/images/p-carving.jpg"
      />
      <Section className="pb-24">
        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {props.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.06}>
              <Photo src={p.img} alt={p.t} className="aspect-[4/5]" sizes="(min-width: 768px) 33vw, 100vw" />
              <p className="mt-5 text-[12px] text-muted">{p.k}</p>
              <h3 className="mt-1 font-display text-3xl">{p.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-graphite">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>
      <LookCloser />
      <ScienceSourcing />
      <Split eyebrow={zh ? "与檀香的区别" : "Not sandalwood"} title={zh ? "同名，不同木" : "Same name, different wood"} image="/images/e-smoke.jpg" tone="stone">
        <p>{zh ? "檀香（Santalum album）以香气闻名，用于提炼精油；小叶紫檀属于豆科，几乎无香，珍贵之处在于色、密度与纹理。" : "Sandalwood (Santalum album) is prized for fragrance and distilled for oil. Red sandalwood is a legume tree — almost scentless, valued for colour, density and grain."}</p>
        <p>{zh ? "简单辨别：小叶紫檀在湿石上摩擦会留下红痕，并能沉于水。" : "A simple test: red sandalwood leaves a red trace on a wet stone, and it sinks."}</p>
      </Split>
      <CTABand title={zh ? "看看它如何被制作" : "See how it is made"} href="/craft" label={zh ? "工艺" : "The Making"} />
    </>
  );
}

export function CraftPage() {
  const { zh } = useT();
  return (
    <>
      <PageHero
        eyebrow={zh ? "工艺" : "Making"}
        title={zh ? "五个步骤，一双手" : "Five stages, one pair of hands"}
        lead={zh ? "选料、成形、打磨、检验、呈献。每件作品由一位匠人从头做到尾，并在档案中留下名字。" : "Select, shape, finish, inspect, present. Each object is made start to finish by one artisan, whose name is recorded in its file."}
        image="/images/e-chisel.jpg"
      />
      <Making />
      <Split eyebrow={zh ? "匠人" : "The turners"} title={zh ? "脚踏车床，旧锉刀" : "A foot-driven lathe; tools forged from old files"} image="/images/e-hands-bw.jpg" tone="stone">
        <p>{zh ? "我们合作的三个家族仍使用脚踏车床——比电动车床慢，却让匠人随时感受木头的阻力。" : "The three families we work with still use foot-driven lathes — slower than electric, but they let the turner feel the wood's resistance at every moment."}</p>
        <p>{zh ? "刀具由旧锉刀锻造，每位匠人都有自己的一套。" : "The tools are forged from old files, and each turner keeps their own set — which is why, under a loupe, you can tell whose hands made a bead."}</p>
      </Split>
      <FactGrid
        items={[
          { k: zh ? "风干" : "Seasoning", v: zh ? "18 月" : "18 mo" },
          { k: zh ? "砂磨" : "Abrasive grades", v: "7" },
          { k: zh ? "每串念珠" : "Per 108 mala", v: zh ? "3 天" : "3 days" },
          { k: zh ? "珍藏盒" : "Keepsake box", v: zh ? "9 天" : "9 days" },
        ]}
      />
      <CTABand title={zh ? "每件作品都可追溯" : "Every piece can be traced"} href="/provenance" label={zh ? "溯源" : "Provenance"} />
    </>
  );
}

export function SciencePage() {
  const { zh } = useT();
  return (
    <>
      <PageHero eyebrow={zh ? "科学" : "Science"} title={zh ? "为什么它是红色的，又为什么会沉" : "Why it is red, and why it sinks"} image="/images/p-powder.jpg" />
      <ScienceSourcing />
      <Split eyebrow={zh ? "色素" : "Pigment"} title={zh ? "紫檀素：不溶于水的红" : "Santalins: a red water cannot wash out"} image="/images/e-kumkum.jpg" tone="stone">
        <p>{zh ? "小叶紫檀的颜色来自紫檀素 A 与 B——不溶于水、可溶于酒精的天然色素。" : "The colour comes from santalins A and B — natural pigments insoluble in water but soluble in alcohol. It's why the wood marks wet stone yet doesn't bleed in rain."}</p>
        <p>{zh ? "历史上，它被用作纺织染料与食品着色剂；在阿育吠陀中，被视为清凉、镇静之物。" : "Historically it dyed textiles and coloured food; in Ayurveda it is considered cooling and calming."}</p>
      </Split>
      <Split eyebrow={zh ? "密度" : "Density"} title={zh ? "沉水测试" : "The float test"} image="/images/p-beads-dark.jpg" flip>
        <p>{zh ? "优质心材的气干密度可达 1.05–1.26 g/cm³。我们为每个批次测量并记录密度，低于 1.05 的木料一律不用。" : "Good heartwood reaches an air-dry density of 1.05–1.26 g/cm³. We measure and record density for every batch, and refuse anything below 1.05."}</p>
        <p>{zh ? "沉水只说明密度，并不能单独证明真伪。完整判断应结合纹理、色泽、荧光反应与产地文件。" : "Sinking shows density, not authenticity on its own. A full assessment combines grain, colour, fluorescence and origin paperwork."}</p>
      </Split>
      <CTABand title={zh ? "负责任地采购" : "Sourced responsibly"} href="/sourcing" label={zh ? "采购政策" : "Our sourcing"} />
    </>
  );
}

export function SourcingPage() {
  const { zh } = useT();
  const commitments = zh
    ? [
        ["只用合法存料", "我们只从印度政府（安得拉邦林业部门）组织的公开拍卖中采购已登记的存料。"],
        ["完整监管链", "每一块木料从拍卖、运输、加工到成品都有记录，并与批次编号绑定。"],
        ["CITES 合规", "小叶紫檀列于 CITES 附录 II。所有出口均持有效许可。"],
        ["回馈山林", "营收的 5% 用于东高止山脉的再造林与反盗伐巡护。"],
      ]
    : [
        ["Legal stock only", "We buy only registered stock sold at public auctions run by the Government of India (Andhra Pradesh Forest Department)."],
        ["Full chain of custody", "Every billet is recorded from auction to transport, processing and finished object — bound to its batch number."],
        ["CITES compliant", "Red sandalwood is listed in CITES Appendix II. Every export travels with a valid permit."],
        ["Giving back to the hills", "5% of revenue funds replanting and anti-poaching patrols in the Eastern Ghats."],
      ];
  return (
    <>
      <PageHero eyebrow={zh ? "负责任的采购" : "Responsible sourcing"} title={zh ? "宁可少做，不可做错" : "Make less. Never make it wrong."} lead={zh ? "小叶紫檀是受保护物种。我们的政策很简单：没有文件，就没有木头。" : "Red sandalwood is a protected species. Our policy is simple: no paperwork, no wood."} image="/images/e-hills-valley.jpg" />
      <Section className="pb-24">
        <div className="grid border-t border-line md:grid-cols-2">
          {commitments.map(([t, d], i) => (
            <div key={t} className={cn("border-b border-line py-10", i % 2 === 0 ? "md:pr-12" : "md:border-l md:pl-12")}>
              <p className="text-[12px] text-muted">0{i + 1}</p>
              <h3 className="mt-2 font-display text-3xl">{t}</h3>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-graphite">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <Statement>{zh ? "如果一块木头无法说明它的来处，它就不会成为我们的作品。" : "If a piece of wood cannot tell us where it came from, it will never become one of ours."}</Statement>
      <CTABand title={zh ? "追溯一个批次" : "Trace a batch yourself"} href="/provenance" label={zh ? "溯源查询" : "Provenance lookup"} />
    </>
  );
}

export function GiftingPage() {
  const { zh } = useT();
  const kinds = [
    { t: zh ? "私人礼赠" : "Personal", d: zh ? "手写卡片、漆盒礼装，可刻字。" : "Handwritten card, lacquer case, optional engraving.", img: "/images/p-earrings.jpg" },
    { t: zh ? "企业礼赠" : "Corporate", d: zh ? "10 件起订，企业标志刻印，中英文贺卡。" : "From 10 pieces — logo engraving, bilingual cards, consolidated delivery.", img: "/images/p-box.jpg" },
    { t: zh ? "人生节点" : "Milestones", d: zh ? "婚礼对镯、六十大寿、满月礼。" : "Wedding pairs, 60th birthdays, a child's first ceremony.", img: "/images/p-bride.jpg" },
    { t: zh ? "酒店礼遇" : "Hospitality", d: zh ? "客房礼品与定制设施，季度供应。" : "Suite amenities and bespoke fittings, supplied quarterly.", img: "/images/p-comb.jpg" },
  ];
  const calendar = [
    ["Jan – Feb", "春节 · Spring Festival", zh ? "新春礼盒、长辈手串" : "New Year edits, bracelets for elders"],
    ["Apr – May", "Akshaya Tritiya", zh ? "吉祥之日，购置珍宝" : "An auspicious day to acquire"],
    ["September", "中秋 · Mid-Autumn", zh ? "团圆之礼" : "Gifts of reunion"],
    ["Oct – Nov", "Diwali · 排灯节", zh ? "企业与家庭礼赠高峰" : "Peak corporate and family gifting"],
  ];
  return (
    <>
      <PageHero eyebrow={zh ? "礼赠" : "Gifting"} title={zh ? "值得传承的礼物" : "Gifts that become heirlooms"} lead={zh ? "从排灯节到春节，从婚礼到董事会——我们的礼宾团队会处理一切。" : "From Diwali to Spring Festival, weddings to boardrooms — our gifting team handles everything."} image="/images/p-wedding.jpg">
        <div className="flex flex-wrap items-center gap-6">
          <Button href="/collections/gifting">{zh ? "礼赠系列" : "Shop gifting"}</Button>
          <TextLink href="/enquiries?type=Gifting">{zh ? "礼赠咨询" : "Gifting enquiry"}</TextLink>
        </div>
      </PageHero>
      <Section tone="paper" className="py-24">
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
          {kinds.map((k, i) => (
            <Reveal key={k.t} delay={i * 0.05}>
              <Photo src={k.img} alt={k.t} className="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, 50vw" />
              <h3 className="mt-4 font-display text-2xl">{k.t}</h3>
              <p className="mt-1 text-[14px] text-graphite">{k.d}</p>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section className="py-24">
        <Label>{zh ? "节庆日历" : "The gifting calendar"}</Label>
        <Heading className="mt-4 text-[clamp(2.2rem,3.6vw,3.4rem)]">{zh ? "提前规划" : "Plan ahead"}</Heading>
        <div className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {calendar.map(([m, t, d], i) => (
            <div key={t} className={cn("border-b border-line py-8 lg:border-b-0", i > 0 && "lg:border-l lg:pl-8")}>
              <p className="text-[12px] text-muted">{m}</p>
              <p className="mt-2 font-display text-2xl">{t}</p>
              <p className="mt-2 text-[14px] text-graphite">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <CTABand title={zh ? "告诉我们您的场合" : "Tell us the occasion"} sub={zh ? "我们会在 24 小时内给出方案。" : "We'll return a proposal within 24 hours."} href="/enquiries?type=Corporate" label={zh ? "提交咨询" : "Make an enquiry"} />
    </>
  );
}
