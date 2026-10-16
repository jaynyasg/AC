import { useState, type CSSProperties } from "react";
import {
  BookingRequest,
  parse,
  type BookingResponse,
  type ServiceType,
} from "../../shared/contract";
import { COMPANY, LINKS } from "../../shared/knowledge";

const SERVICE_OPTIONS: { value: ServiceType; label: string }[] = [
  { value: "repair", label: "Repair / not working" },
  { value: "maintenance", label: "Maintenance program" },
  { value: "new-system-estimate", label: "Free estimate — new system" },
  { value: "generator", label: "Generac generator" },
  { value: "other", label: "Something else" },
];

type Status = "idle" | "submitting" | "success" | "error";
const telHref = `tel:${COMPANY.phone.replace(/\D/g, "")}`;

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
      <div className="book-form" role="status">
        <h3>Request received — thank you!</h3>
        <p>
          We'll reach out soon to confirm. For anything urgent, call us directly and we'll get right
          on it.
        </p>
        <p>
          <a className="btn btn-cyan" href={telHref}>
            {COMPANY.phone}
          </a>
          {LINKS.googleReview && (
            <>
              {" "}
              <a className="btn btn-ink" href={LINKS.googleReview}>
                Leave a Google review
              </a>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form
      id="book-form"
      className="book-form"
      data-reveal
      style={{ "--d": "80ms" } as CSSProperties}
      onSubmit={onSubmit}
      noValidate
    >
      <h3>Book service</h3>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={form.name}
          aria-invalid={errors.name ? "true" : "false"}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Your name"
        />
        <p className="field-error">{errors.name ?? ""}</p>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            value={form.phone}
            aria-invalid={errors.phone ? "true" : "false"}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="(832) 555-0100"
          />
          <p className="field-error">{errors.phone ?? ""}</p>
        </div>
        <div className="field">
          <label htmlFor="email">
            Email <span>(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={form.email}
            aria-invalid={errors.email ? "true" : "false"}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@email.com"
          />
          <p className="field-error">{errors.email ?? ""}</p>
        </div>
      </div>
      <div className="field">
        <label htmlFor="serviceType">How can we help?</label>
        <select
          id="serviceType"
          name="serviceType"
          value={form.serviceType}
          onChange={(e) => set("serviceType", e.target.value as ServiceType)}
        >
          {SERVICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="preferredTime">
          Preferred time <span>(optional)</span>
        </label>
        <input
          id="preferredTime"
          name="preferredTime"
          type="text"
          autoComplete="off"
          value={form.preferredTime}
          onChange={(e) => set("preferredTime", e.target.value)}
          placeholder="e.g. weekday mornings"
        />
      </div>
      <div className="field">
        <label htmlFor="message">
          Details <span>(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          value={form.message}
          aria-invalid={errors.message ? "true" : "false"}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us what's going on with your system…"
        />
        <p className="field-error">{errors.message ?? ""}</p>
      </div>

      {status === "error" && (
        <p className="form-status" role="status">
          We couldn't submit that just now. Please try again, or call us at{" "}
          <a href={telHref}>{COMPANY.phone}</a>.
        </p>
      )}

      <button className="btn btn-ink" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request a visit"}
      </button>
      <p className="fine">
        Prefer to talk? Call <a href={telHref}>{COMPANY.phone}</a>
      </p>
    </form>
  );
}
