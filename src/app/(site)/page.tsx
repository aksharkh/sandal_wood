import { Closing, Collections, Curated, Founder, Gifting, Hero, Intro, Journal, LookCloser, Making, Provenance, ScienceSourcing, Story } from "@/components/home/Home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Story />
      <Collections />
      <Curated />
      <LookCloser />
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
