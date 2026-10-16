import { COMPANY } from "../../shared/knowledge";
import { ContactBand } from "../components/Bands";
import { usePageMeta } from "../lib/pageMeta";

export default function Book() {
  const hours = COMPANY.hours.map((h) => `${h.days} ${h.time}`).join(", ");
  usePageMeta(
    "Contact — Di Felice's HVAC",
    `Book a repair, tune-up, or free estimate with ${COMPANY.name}. Call ${COMPANY.phone} or email ${COMPANY.email}. Hours ${hours}.`,
  );
  return <ContactBand underHeader />;
}
