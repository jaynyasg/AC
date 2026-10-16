import { Link } from "react-router-dom";
import { Scene, Shell } from "../components/Scene";

export default function NotFound() {
  return (
    <Scene name="sizing" labelledBy="missing-title" underHeader>
      <Shell>
        <p className="eyebrow">404</p>
        <h2 id="missing-title">This page took a vacation</h2>
        <p>
          We couldn't find what you were looking for — but we can still help you stay comfortable.
        </p>
        <p>
          <Link className="btn btn-ink" to="/">
            Back home
          </Link>{" "}
          <Link className="btn btn-cyan" to="/book">
            Book a visit
          </Link>
        </p>
      </Shell>
    </Scene>
  );
}
