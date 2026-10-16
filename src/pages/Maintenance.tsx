import { COMPANY, MEMBERSHIP_PLANS } from "../../shared/knowledge";
import { MaintenanceBand } from "../components/Bands";
import { usePageMeta } from "../lib/pageMeta";

export default function Maintenance() {
  const prices = MEMBERSHIP_PLANS.map((plan) => `${plan.name} ${plan.price}`).join(", ");
  usePageMeta(
    "Maintenance & Membership — Di Felice's HVAC",
    `Bi-yearly spring and fall HVAC tune-ups from ${COMPANY.name}, plus membership plans: ${prices}. Enroll online or call ${COMPANY.phone}.`,
  );
  return <MaintenanceBand underHeader />;
}
