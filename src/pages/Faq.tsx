import { COMPANY } from "../../shared/knowledge";
import { TipsBand } from "../components/Bands";
import { usePageMeta } from "../lib/pageMeta";

export default function Faq() {
  usePageMeta(
    "FAQ & Homeowner Tips — Di Felice's HVAC",
    `Filter, drain-line, and safety habits for your AC and heating system. Questions welcome at ${COMPANY.phone}. ${COMPANY.name}, ${COMPANY.area}.`,
  );
  return <TipsBand underHeader showChatNote />;
}
