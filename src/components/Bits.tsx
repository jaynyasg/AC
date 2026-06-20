import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "./icons";

// Small, content-agnostic building blocks shared across pages.

export function Section({
  children,
  className = "",
  wash = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  wash?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={(wash ? "wash-cool " : "") + className}>
      <div className="container-page py-14 sm:py-20">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600">
      {children}
    </p>
  );
}

export function SectionHeading({ title, lead }: { title: ReactNode; lead?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      {lead && <p className="mt-3 text-[15px] leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

type CtaVariant = "primary" | "dark" | "ghost";
const ctaBase =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-pill px-5 text-[14px] font-semibold transition active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/50";
const ctaVariants: Record<CtaVariant, string> = {
  primary: "bg-brand-500 text-white shadow-card hover:bg-brand-600",
  dark: "bg-ink text-white shadow-card hover:bg-[#1c1c22]",
  ghost: "border border-line bg-paper text-ink hover:border-brand-300 hover:text-brand-700",
};

export function Cta({
  to,
  href,
  children,
  variant = "primary",
  arrow = false,
  className = "",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: CtaVariant;
  arrow?: boolean;
  className?: string;
}) {
  const cls = `${ctaBase} ${ctaVariants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight className="transition-transform group-hover:translate-x-0.5" />}
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={to ?? "#"} className={cls}>
      {inner}
    </Link>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-card border border-line bg-paper p-6 shadow-card transition hover:shadow-card-hover ${className}`}
    >
      {children}
    </div>
  );
}

export function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[14.5px] leading-relaxed text-ink-2">
          <Check size={18} className="mt-0.5 shrink-0 text-brand-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
