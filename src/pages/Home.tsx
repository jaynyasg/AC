import {
  AreaBand,
  ContactBand,
  MaintenanceBand,
  ReferralBand,
  ReviewsBand,
  ServicesBand,
  SizingBand,
  TipsBand,
  TrustBand,
} from "../components/Bands";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBand />
      <ServicesBand />
      <SizingBand />
      <MaintenanceBand />
      <AreaBand />
      <ReviewsBand />
      <TipsBand tight />
      <ReferralBand />
      <ContactBand />
    </>
  );
}
