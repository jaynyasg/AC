# Claims → Oracle routing (the done-criterion)

Every claim the system makes, routed to the **cheapest re-runnable check**. Build
the dominant oracle (the chatbot eval) first; red before green. Re-grade this list
against the running system at audit (prd-compile step 8).

Oracles: **D** deterministic unit test · **E** eval over a golden set · **H** human
judgment / taste · **T** trust (reversible glue).

## Marketing site (content)

| # | Claim | Oracle | Check |
|---|-------|--------|-------|
| S1 | All 6 PRD pages exist with the PRD's copy, verbatim where given | D→H | route renders; copy strings present in DOM; human reads once |
| S2 | $125 diagnostic fee + "credited toward repair" stated on Services | D | string assertion in test + on page |
| S3 | Hours, phone, email, license, brands appear (footer/contact) | D | knowledge-base strings rendered |
| S4 | Maintenance tune-up checklists (spring/fall) complete & correct | D | list items match `knowledge.ts` |
| S5 | Referral page does NOT state what referrers receive | **D** | guard test: forbidden strings absent from any bundle/route |
| S6 | No fabricated testimonials; gallery is honest empty-state | H | human read; no quote strings in source |
| S7 | Cool-blue House-style theme; reads as trustworthy, not slop | H | screenshot review (step 5/7) |
| S8 | Responsive; non-happy states (loading/empty/error) handled | D→H | render + manual resize |

## Booking / contact

| # | Claim | Oracle | Check |
|---|-------|--------|-------|
| B1 | Booking form validates input at the seam (contract) | D | zod parse unit tests |
| B2 | Submit succeeds even with no email provider; never a dead end | D | api unit test + UI shows call/email fallback |
| B3 | Valid submit → 200; invalid → 400 with field errors | D | api handler unit test |

## AI CSR chatbot — THE DOMINANT ORACLE

| # | Claim | Oracle | Check |
|---|-------|--------|-------|
| C1 | Request/response validated against typed contract at the seam | **D** | zod parse-or-fallback unit tests |
| C2 | System prompt contains required company facts + triage script | **D** | system-prompt assembly unit tests |
| C3 | Greets as DI Felice's CSR on first turn | E | golden case (snapshot replay) |
| C4 | "My AC isn't working" → asks the diagnostic triage questions | E | golden case: expects ≥1 triage question |
| C5 | Quotes the $125 diagnostic fee correctly when asked about cost | E | golden case |
| C6 | NEVER discloses the referral reward amount | **D + E** | guard redaction unit test + adversarial golden case |
| C7 | Declines non-AC / out-of-scope questions politely | E | golden case (e.g. "write me a poem") |
| C8 | Does not invent prices/policies beyond the knowledge base | E | golden case (e.g. "how much to replace my furnace?") |
| C9 | Nudges toward booking/calling for service | E | golden case |
| C10 | Output guarded: max length, refusal/empty → safe fallback | **D** | guard unit tests |

## Infra / deploy

| # | Claim | Oracle | Check |
|---|-------|--------|-------|
| I1 | `npm run verify` is green (typecheck + unit + offline eval replay) | D | the gate; bound to Stop hook |
| I2 | Live system runs end-to-end (site + bot answering for real) | **joint** | `vercel dev` / deploy; real input→output (step 7) |
| I3 | Deployed to a live Vercel URL | **hard** | the deploy itself (step 8) |

## Build order (dominant oracle first, red→green)

1. Boundary contract (`shared/contract.ts`) — the spine.
2. Knowledge base + system prompt + guard (`shared/`).
3. **Failing** eval stubs (C1–C10, B1–B3) — red.
4. Manual proof-of-life: one real chat turn on screen, eyeball it.
5. Build site + api to green.
6. Run the real system (site + bot); exercise non-happy states.
7. Re-grade this table; bind `verify` to Stop; deploy.

## Audit re-grade (build complete)

**Green now (`npm run verify` = 35 tests, all passing — typecheck + unit + recorded eval replay):**
S1 S2 S3 S4 S5 S6 S7 S8 · B1 B2 B3 · **C1–C10** · I1.
- C3–C9 recorded against live **gpt-4o-mini** and replayed offline. Eyeballed: greets as
  DI Felice's; quotes $125 credited; **referral reply discloses no amount** (defers to John);
  declines off-topic; invents no price; converts to a booking after triage.
- S5 hard-checked: `grep` of `dist/` finds no referral amount; system prompt & the OpenAI
  SDK confirmed absent from the web bundle (server-side only).
- Taste surface eyeballed across pages + mobile.

**Pending only the live deploy:**
- I2: live end-to-end on Vercel (`vercel dev` or deploy) — the bot is proven correct via the
  recorded eval; this confirms it in the serverless runtime.
- I3: deployed live Vercel URL — `vercel --prod` with `OPENAI_API_KEY` set in project env.
