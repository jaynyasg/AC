# Di Felice's HVAC Corp. — Website + AI CSR Chatbot

Marketing website for a Houston-area HVAC company, plus an on-demand pop-up AI
customer-service chatbot. Built from `PRD.md` via the `prd-compile` method
(`CLAIMS.md` holds the claim → oracle routing and is the done-criterion).

## Locked decisions (from the up-front batched forks)

- **Scope:** Full marketing site **+** a working LLM CSR chatbot.
- **Stakes:** Production-grade; **deploy live** (Vercel) is the final oracle.
- **Chatbot:** OpenAI gpt-4o-mini-powered CSR — greets, answers AC/company questions from a
  knowledge base, runs the diagnostic **triage** questions (from `ac/CSR ai building.pdf`),
  and nudges toward booking/calling. Gated by a golden-Q/A eval.
- **Look & feel:** "Cool-blue clean & trustworthy" — House-style structure
  (components, spacing, Inter Tight) themed around `ac/background.png`'s cool blues.

## Stack / hosting

- **Web:** Vite + React 18 + TypeScript + React Router + Tailwind v3 (House-style
  preset). SPA, one route per PRD page. Chat widget mounts in the shared layout
  → present on every page ("pop-up on each page").
- **API:** Vercel serverless functions in `api/` — `chat.ts` (OpenAI SDK, gpt-4o-mini) and
  `booking.ts` (booking/contact request). No database; no auth. Stateless.
- **Shared:** `shared/` is pure TS (no React), imported by both `src/` and `api/`:
  the typed boundary **contract** (Zod), the AC **knowledge base**, the CSR
  **system prompt**, and the response **guard**.
- **Hosting:** Vercel. SPA + serverless. `vercel.json` rewrites.

## Boundaries (hard rules)

- **Never state on the website what referrers receive.** The 10%-of-profit gift is
  shared privately, NOT on the site (PRD Networking page). The chatbot must also
  never disclose it — enforced in the system prompt AND a deterministic guard.
- **No fabricated social proof.** Testimonials are TODO and real before/after job
  photos don't exist yet → the Gallery page is an honest empty-state, not invented
  quotes. Stock/decorative images are never captioned as "our work."
- **Bot stays in its lane.** Answers AC/HVAC + company questions only; politely
  declines unrelated topics; never invents prices/policies beyond the knowledge
  base. The only hard fact it quotes is the **$125 diagnostic fee** and the listed
  hours/services. It is triage + scheduling help, **not** a binding quote.
- **Validate at every seam.** Parse external/LLM payloads against the contract;
  fall back gracefully on refusal / truncation / shape-drift.

## Commands

- `npm run dev` — Vite dev server (web). `vercel dev` — web + serverless together.
- `npm run verify` — **the gate**: typecheck (`tsc --noEmit`) + unit + offline eval
  replay. Deterministic, offline, fast. Bound to the project `Stop` hook.
- `npm run eval:record` — **on demand, costs money**: hit live OpenAI, refresh
  `eval/snapshots/`. Needs `OPENAI_API_KEY`. Never part of `verify`.
- `npm run build` — production build.

## Going live (the irreducible manual steps)

The build is complete and the offline gate is green. Three steps need YOUR credentials:

1. **Add the API key.** Copy `.env.example` → `.env.local` and set `OPENAI_API_KEY`.
   (Optional: `RESEND_API_KEY` + `BOOKING_TO_EMAIL` to actually email booking requests.)
2. **Record the chatbot eval, then gate.** `npm run eval:record` (spends a few cents of
   OpenAI credit) writes `eval/snapshots/`; then `npm run verify` turns the dominant
   oracle (claims C3–C9) green. Re-record after changing the prompt/KB.
3. **Deploy.** `vercel` (preview) then `vercel --prod`. Set `OPENAI_API_KEY` (and any
   email vars) in the Vercel project's Environment Variables. `vercel dev` runs the site +
   serverless functions together locally if you want to exercise the live bot first.

**Recommended (optional) Stop-hook gate** — bind `verify` so it can't silently rot. Add to
`.claude/settings.json` (I can't self-edit that file; paste it yourself):
```json
{ "hooks": { "Stop": [ { "hooks": [ { "type": "command", "command": "npm run verify" } ] } ] } }
```

## Environment

- `OPENAI_API_KEY` — required at runtime for the chatbot (and `eval:record`).
- `RESEND_API_KEY` + `BOOKING_TO_EMAIL` — optional; if set, `api/booking` emails the
  request. If unset, booking still succeeds (logged) and the UI shows call/email
  fallbacks (832-726-7401 / difeliceshvac@gmail.com) so the path is never dead.

## Company facts (single source of truth → `shared/knowledge.ts`)

Di Felice's HVAC Corp. · John Di Felice · 832-726-7401 · difeliceshvac@gmail.com ·
License TACLA85527C · Commercial & Residential, Install & Repair, Licensed & Insured ·
Brands: Generac, Lennox, Rheem, Carrier · Hours Mon–Fri 8am–5pm, Sat 9am–noon ·
Diagnostic fee $125 (credited toward repair) · Free estimates on new systems/generators.

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec

## Documented solutions

`docs/solutions/` — documented solutions to past problems (bugs + best practices), organized by category with YAML frontmatter (`module`, `tags`, `problem_type`). Relevant when implementing or debugging in documented areas.
