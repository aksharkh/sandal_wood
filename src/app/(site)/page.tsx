import { CollectionsRail, Hero, MaterialIntro, MeetRedSandalwood, Pillars } from "@/components/home/HomeA";
import { LookCloser, Making, ProvenanceBlock, ScienceBlock, Sourcing, StartWithMaterial } from "@/components/home/HomeB";
import { Circle, EnquiriesContact, Founder, Gifting, JournalTeaser } from "@/components/home/HomeC";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MaterialIntro />
      <MeetRedSandalwood />
      <Pillars />
      <CollectionsRail />
      <StartWithMaterial />
      <LookCloser />
      <Making />
      <ProvenanceBlock />
      <ScienceBlock />
      <Sourcing />
      <Gifting />
      <Circle />
      <JournalTeaser />
      <Founder />
      <EnquiriesContact />
    </>
  );
}
