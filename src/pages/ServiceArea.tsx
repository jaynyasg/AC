import { COMPANY } from "../../shared/knowledge";
import { AreaBand } from "../components/Bands";
import { usePageMeta } from "../lib/pageMeta";

export default function ServiceArea() {
  const hours = COMPANY.hours.map((h) => `${h.days} ${h.time}`).join(", ");
  usePageMeta(
    "Service area — Di Felice's HVAC",
    `${COMPANY.name} serves ${COMPANY.area}. Commercial and residential installation and repair. Texas license ${COMPANY.license}. Hours ${hours}.`,
  );
  return <AreaBand underHeader />;
}
