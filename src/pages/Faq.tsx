import { FAQ_TIPS } from "../../shared/knowledge";
import { Card, Eyebrow, Section, SectionHeading } from "../components/Bits";
import { Check } from "../components/icons";

export default function Faq() {
  return (
    <>
      <Section wash className="border-b border-line">
        <Eyebrow>FAQ &amp; Homeowner Tips</Eyebrow>
        <SectionHeading
          title="Simple habits that keep your system healthy"
          lead="A few things every homeowner can do to add longevity and avoid common issues. The dangerous components are handled during our maintenance visits — these are the safe ones you can manage yourself."
        />
      </Section>

      <Section>
        <ol className="grid gap-4 lg:grid-cols-2">
          {FAQ_TIPS.map((tip, i) => (
            <li key={tip}>
              <Card className="flex h-full gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-[14px] font-semibold text-brand-600">
                  {i + 1}
                </span>
                <p className="text-[14.5px] leading-relaxed text-ink-2">{tip}</p>
              </Card>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex items-start gap-3 rounded-card border border-brand-200 bg-brand-50/60 px-5 py-4">
          <Check size={18} className="mt-0.5 shrink-0 text-brand-600" />
          <p className="text-[14px] leading-relaxed text-ink-2">
            Still have a question about your AC or heating? Tap the chat bubble in the corner — our
            assistant can help any time, day or night.
          </p>
        </div>
      </Section>
    </>
  );
}
