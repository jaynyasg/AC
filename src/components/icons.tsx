import { type SVGProps } from "react";

// Small inline icon set tuned for an HVAC site — no icon dependency.
type IconProps = SVGProps<SVGSVGElement> & { size?: number };
const base = (size: number, p: IconProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export function Snowflake({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19M12 5l-2.5 2.5M12 5l2.5 2.5M12 19l-2.5-2.5M12 19l2.5-2.5M5 12l2.5-2.5M5 12l2.5 2.5M19 12l-2.5-2.5M19 12l-2.5 2.5" />
    </svg>
  );
}
export function Phone({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}
export function Wrench({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M14.7 6.3a4 4 0 0 0-5 5L3 18l3 3 6.7-6.7a4 4 0 0 0 5-5l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z" />
    </svg>
  );
}
export function Leaf({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 20c10 2 16-4 16-14 0 0-12-2-15 5-1.6 3.8 1 7 1 7M4 20s2-6 8-9" />
    </svg>
  );
}
export function Shield({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
export function Star({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="currentColor" stroke="none">
      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z" />
    </svg>
  );
}
export function Check({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
export function ArrowRight({ size = 16, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
export function Menu({ size = 22, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
export function X({ size = 20, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
export function Send({ size = 18, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}
export function Chat({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)}>
      <path d="M21 12a8 8 0 0 1-11.3 7.3L3 21l1.7-6.7A8 8 0 1 1 21 12z" />
      <path d="M8.5 11h.01M12 11h.01M15.5 11h.01" />
    </svg>
  );
}
