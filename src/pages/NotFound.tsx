import { Cta, Section } from "../components/Bits";

export default function NotFound() {
  return (
    <Section>
      <div className="mx-auto max-w-lg py-12 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">This page took a vacation</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          We couldn't find what you were looking for — but we can still help you stay comfortable.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <Cta to="/" variant="primary">Back home</Cta>
          <Cta to="/book" variant="ghost">Book a visit</Cta>
        </div>
      </div>
    </Section>
  );
}
