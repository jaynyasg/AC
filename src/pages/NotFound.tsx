import { Link } from "react-router-dom";
import { BookServiceLink } from "../components/BookServiceLink";
import { Scene, Shell } from "../components/Scene";
import { usePageMeta } from "../lib/pageMeta";

export default function NotFound() {
  usePageMeta(
    "Page not found — Di Felice's HVAC",
    "That page isn't on the Di Felice's HVAC site. Head home or book a visit in Houston, TX.",
  );
  return (
    <Scene name="sizing" labelledBy="missing-title" underHeader>
      <Shell>
        <p className="eyebrow">404</p>
        <h2 id="missing-title">
          This page <span>took a vacation</span>
        </h2>
        <p>
          We couldn't find what you were looking for — but we can still help you stay comfortable.
        </p>
        <p>
          <Link className="btn btn-ink" to="/">
            Back home
          </Link>{" "}
          <BookServiceLink className="btn btn-cyan">Book a visit</BookServiceLink>
        </p>
      </Shell>
    </Scene>
  );
}
