import { Closing, Collections, Curated, Curtain, Founder, Gifting, Hero, Intro, Journal, Making, Pillars, Provenance, ScienceSourcing, Ticker } from "@/components/home/Home";

export default function HomePage() {
  return (
    <>
      <Curtain />
      <Hero />
      <Ticker />
      <Intro />
      <Collections />
      <Curated />
      <Pillars />
      <Making />
      <Provenance />
      <ScienceSourcing />
      <Gifting />
      <Journal />
      <Founder />
      <Closing />
    </>
  );
}
