import {
  CircleEnquiriesContact,
  Collections,
  Curated,
  Founder,
  Gifting,
  Hero,
  Intro,
  Journal,
  LookCloser,
  Making,
  Meet,
  Pillars,
  Provenance,
  ScienceSourcing,
} from "@/components/home/Home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Intro />
      <Meet />
      <Pillars />
      <Collections />
      <Curated />
      <LookCloser />
      <Making />
      <Provenance />
      <ScienceSourcing />
      <Gifting />
      <Journal />
      <Founder />
      <CircleEnquiriesContact />
    </>
  );
}
