import {
  Closing,
  Collections,
  Curated,
  Founder,
  Gifting,
  Hero,
  Journal,
  LookCloser,
  Making,
  MaterialMarquee,
  Meet,
  Pillars,
  Provenance,
  ScienceSourcing,
} from "@/components/home/Home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MaterialMarquee />
      <Meet />
      <Pillars />
      <Collections />
      <Curated />
      <LookCloser />
      <Making />
      <Provenance />
      <ScienceSourcing />
      <Gifting />
      <Founder />
      <Journal />
      <Closing />
    </>
  );
}
