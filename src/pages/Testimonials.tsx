import { COMPANY } from "../../shared/knowledge";
import { ReviewsBand } from "../components/Bands";
import { usePageMeta } from "../lib/pageMeta";

export default function Testimonials() {
  usePageMeta(
    "Testimonials — Di Felice's HVAC",
    `Customer reviews for ${COMPANY.name} are on the way. Share your experience with ${COMPANY.owner}'s team in ${COMPANY.area}.`,
  );
  return <ReviewsBand underHeader />;
}
