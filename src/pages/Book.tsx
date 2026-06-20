import { COMPANY } from "../../shared/knowledge";
import BookingForm from "../components/BookingForm";
import { Eyebrow, Section } from "../components/Bits";
import { Phone, Shield, Snowflake } from "../components/icons";

export default function Book() {
  return (
    <Section wash>
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Eyebrow>Book / Free Estimate</Eyebrow>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Let's get your comfort sorted
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-2">
            Tell us a bit about what you need — a repair, a tune-up, or a free estimate on a new
            system — and we'll reach out to schedule. Estimates on new AC systems and Generac
            generators are free.
          </p>

          <ul className="mt-7 space-y-3 text-[14px] text-ink-2">
            <li className="flex items-center gap-3"><Snowflake size={18} className="text-brand-500" /> ${COMPANY.diagnosticFee} diagnostic — credited toward your repair</li>
            <li className="flex items-center gap-3"><Shield size={18} className="text-brand-500" /> Licensed &amp; insured · {COMPANY.license}</li>
            <li className="flex items-center gap-3"><Phone size={18} className="text-brand-500" /> Urgent? Call <a href={`tel:${COMPANY.phone.replace(/\D/g, "")}`} className="font-semibold text-brand-700">{COMPANY.phone}</a></li>
          </ul>

          <div className="mt-7 rounded-card border border-line bg-paper p-4 text-[13px] text-muted shadow-card">
            <p className="font-semibold text-ink-2">Hours</p>
            {COMPANY.hours.map((h) => (
              <p key={h.days} className="mt-1 flex justify-between gap-6">
                <span>{h.days}</span>
                <span>{h.time}</span>
              </p>
            ))}
          </div>
        </div>

        <BookingForm />
      </div>
    </Section>
  );
}
