import { useState } from "react";
import {
  BookingRequest,
  parse,
  type BookingResponse,
  type ServiceType,
} from "../../shared/contract";
import { COMPANY } from "../../shared/knowledge";
import { Cta } from "./Bits";
import { Check, Phone } from "./icons";

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "repair", label: "Repair / not working" },
  { value: "maintenance", label: "Maintenance program" },
  { value: "new-system-estimate", label: "Free estimate — new system" },
  { value: "generator", label: "Generac generator" },
  { value: "other", label: "Something else" },
];

type Status = "idle" | "submitting" | "success" | "error";
const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

const fieldCls =
  "w-full rounded-lg border border-line bg-canvas px-3.5 py-2.5 text-[14px] outline-none transition placeholder:text-muted-2 focus:border-brand-400";
const labelCls = "mb-1.5 block text-[12.5px] font-semibold text-ink-2";

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "repair" as ServiceType,
    preferredTime: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validate at the edge with the SAME contract the server uses.
    const parsed = parse(BookingRequest, form);
    if (!parsed.ok) {
      setErrors(parsed.fields);
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.value),
      });
      if (!res.ok) throw new Error(`booking failed: ${res.status}`);
      (await res.json()) as BookingResponse;
      setStatus("success");
    } catch (err) {
      console.error("[booking] submit failed:", err);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-line bg-paper p-7 text-center shadow-card">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-accent-green/10 text-accent-green">
          <Check size={24} />
        </span>
        <h3 className="mt-4 text-[18px] font-semibold">Request received — thank you!</h3>
        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-muted">
          We'll reach out soon to confirm. For anything urgent, call us directly and we'll get right
          on it.
        </p>
        <div className="mt-5 flex justify-center">
          <Cta href={telHref} variant="primary">
            <Phone size={16} /> {COMPANY.phone}
          </Cta>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-card border border-line bg-paper p-6 shadow-card sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="name">Name</label>
          <input id="name" className={fieldCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
          {errors.name && <p className="mt-1 text-[12px] text-accent-red">{errors.name}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="phone">Phone</label>
          <input id="phone" inputMode="tel" className={fieldCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(832) 555-0100" />
          {errors.phone && <p className="mt-1 text-[12px] text-accent-red">{errors.phone}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="email">Email <span className="font-normal text-muted-2">(optional)</span></label>
          <input id="email" inputMode="email" className={fieldCls} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
          {errors.email && <p className="mt-1 text-[12px] text-accent-red">{errors.email}</p>}
        </div>
        <div>
          <label className={labelCls} htmlFor="serviceType">How can we help?</label>
          <select id="serviceType" className={fieldCls} value={form.serviceType} onChange={(e) => set("serviceType", e.target.value as ServiceType)}>
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="preferredTime">Preferred time <span className="font-normal text-muted-2">(optional)</span></label>
          <input id="preferredTime" className={fieldCls} value={form.preferredTime} onChange={(e) => set("preferredTime", e.target.value)} placeholder="e.g. weekday mornings" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="message">Details <span className="font-normal text-muted-2">(optional)</span></label>
          <textarea id="message" rows={3} maxLength={1000} className={fieldCls} value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us what's going on with your system…" />
          {errors.message && <p className="mt-1 text-[12px] text-accent-red">{errors.message}</p>}
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg border border-accent-red/30 bg-accent-red/5 px-3.5 py-2.5 text-[13px] text-ink-2">
          We couldn't submit that just now. Please try again, or call us at{" "}
          <a href={telHref} className="font-semibold text-brand-700 underline">{COMPANY.phone}</a>.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-pill bg-brand-500 px-6 text-[14px] font-semibold text-white shadow-card transition hover:bg-brand-600 active:scale-[0.985] disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Request a visit"}
        </button>
        <span className="text-[12.5px] text-muted">
          Prefer to talk? Call{" "}
          <a href={telHref} className="font-semibold text-brand-700">{COMPANY.phone}</a>
        </span>
      </div>
    </form>
  );
}
