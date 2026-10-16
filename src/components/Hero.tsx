import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { COMPANY } from "../../shared/knowledge";

const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

const STATS = [
  { value: `$${COMPANY.diagnosticFee}`, label: "Diagnostic — credited toward your repair" },
  { value: "Free", label: "Estimates on new AC systems & generators" },
  { value: "Licensed", label: `Texas ${COMPANY.license}` },
];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const root = document.documentElement;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (!video) return;
      if (motion.matches) {
        video.pause();
        root.classList.add("video-off");
        return;
      }
      root.classList.remove("video-off");
      video.muted = true;
      const play = video.play();
      if (play && typeof play.catch === "function") {
        play.catch(() => root.classList.add("video-off"));
      }
    };

    const onError = () => root.classList.add("video-off");
    video?.addEventListener("error", onError);
    apply();
    motion.addEventListener?.("change", apply);
    return () => {
      video?.removeEventListener("error", onError);
      motion.removeEventListener?.("change", apply);
    };
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-media-wrap" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/media/hero-poster.jpg"
        >
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
        <img className="hero-fallback" src="/media/hero-poster.jpg" alt="" />
        <div className="hero-shade" />
        <div className="airflow">
          <span className="wisp wisp-1" />
          <span className="wisp wisp-2" />
          <span className="wisp wisp-3" />
          <span className="wisp wisp-4" />
          <span className="wisp wisp-5" />
          <span className="spark spark-1" />
          <span className="spark spark-2" />
          <span className="spark spark-3" />
          <span className="spark spark-4" />
          <span className="spark spark-5" />
          <span className="spark spark-6" />
        </div>
      </div>

      <div className="shell hero-copy">
        <p className="eyebrow eyebrow-light">Cool air, clear answers · Houston, TX</p>
        <h1>
          Cool air,
          <span>clear answers.</span>
        </h1>
        <p className="lede">
          Comfort you can feel before we say a word. Licensed Houston HVAC — repair, installation,
          and maintenance, with right-sized systems and clear next steps. With {COMPANY.experienceYears}+
          years of experience, we explain the issue, then make booking or calling simple.
        </p>
        <div className="hero-actions">
          <a className="btn btn-cyan" href={telHref}>
            Call now
          </a>
          <Link className="btn btn-ghost" to="/#contact">
            Book service
          </Link>
        </div>
        <dl className="hero-stats">
          {STATS.map((stat) => (
            <div key={stat.value}>
              <dt>{stat.value}</dt>
              <dd>{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
