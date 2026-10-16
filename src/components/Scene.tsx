import { useLayoutEffect, type CSSProperties, type ReactNode } from "react";

export type SceneName =
  | "trust"
  | "services"
  | "sizing"
  | "maintenance"
  | "area"
  | "reviews"
  | "tips"
  | "referral"
  | "contact";

const SCENE_IMG: Record<SceneName, { src: string; position?: "from-top" | "from-bottom" }> = {
  trust: { src: "/media/scenes/bubble-ice-b.jpg" },
  services: { src: "/media/scenes/lagoon-bergs.jpg" },
  sizing: { src: "/media/scenes/tabular-berg.jpg", position: "from-bottom" },
  maintenance: { src: "/media/scenes/clear-ice.jpg" },
  area: { src: "/media/scenes/berg-underwater.jpg" },
  reviews: { src: "/media/scenes/ice-plates.jpg" },
  tips: { src: "/media/scenes/ice-sheet.jpg", position: "from-top" },
  referral: { src: "/media/scenes/blue-berg.jpg" },
  contact: { src: "/media/scenes/cape-york-cove.jpg" },
};

const TONE: Record<SceneName, "scene-light" | "scene-dark"> = {
  trust: "scene-light",
  services: "scene-dark",
  sizing: "scene-light",
  maintenance: "scene-light",
  area: "scene-dark",
  reviews: "scene-light",
  tips: "scene-light",
  referral: "scene-dark",
  contact: "scene-light",
};

const PARTICLES: Record<SceneName, string> = {
  trust: "has-crystals",
  services: "has-snow",
  sizing: "has-crystals",
  maintenance: "has-drift",
  area: "has-snow",
  reviews: "has-crystals",
  tips: "has-drift",
  referral: "has-crystals",
  contact: "has-drift",
};

const BAND: Record<SceneName, string> = {
  trust: "band band-cream",
  services: "band band-night",
  sizing: "band band-cream",
  maintenance: "band band-sand",
  area: "band band-night",
  reviews: "band band-cream",
  tips: "band band-cream",
  referral: "referral",
  contact: "band band-cream",
};

export function revealDelay(ms: number): CSSProperties {
  return { "--d": `${ms}ms` } as CSSProperties;
}

/** Marks in-view blocks before enabling the reveal so the first screen never flashes hidden. */
export function useSceneReveal(pathname: string) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (motion.matches || !("IntersectionObserver" in window)) {
      nodes.forEach((el) => el.classList.add("is-in"));
      root.classList.remove("can-reveal");
      return;
    }

    root.classList.remove("can-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of nodes) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) el.classList.add("is-in");
      else observer.observe(el);
    }
    root.classList.add("can-reveal");
    return () => observer.disconnect();
  }, [pathname]);
}

export function Scene({
  name,
  id,
  labelledBy,
  tight = false,
  underHeader = false,
  className = "",
  children,
}: {
  name: SceneName;
  id?: string;
  labelledBy?: string;
  tight?: boolean;
  underHeader?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const img = SCENE_IMG[name];
  const classes = [
    BAND[name],
    "scene",
    TONE[name],
    PARTICLES[name],
    tight ? "band-tight" : "",
    underHeader ? "under-header" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={classes} data-scene={name} aria-labelledby={labelledBy}>
      <div className="scene-bg" aria-hidden="true">
        <img src={img.src} alt="" className={img.position} />
      </div>
      {children}
    </section>
  );
}

export function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`shell${className ? ` ${className}` : ""}`}>{children}</div>;
}
