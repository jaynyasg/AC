import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { EVAL_CASES } from "./cases";

/**
 * Offline eval gate (CLAIMS.md C3–C9). Replays recorded snapshots and re-runs the
 * golden assertions — deterministic, no network, no money. Part of `npm run verify`.
 *
 * If a snapshot is missing, the case is skipped with a loud note rather than
 * failing — a flaky/red-by-default gate trains you to ignore it. Record with
 * `npm run eval:record` (needs ANTHROPIC_API_KEY) to turn the dominant oracle green.
 */
const SNAP_DIR = join(dirname(fileURLToPath(import.meta.url)), "snapshots");

interface Snapshot {
  id: string;
  reply: string;
}

const anyRecorded = EVAL_CASES.some((c) => existsSync(join(SNAP_DIR, `${c.id}.json`)));

describe("CSR chatbot golden eval (snapshot replay)", () => {
  if (!anyRecorded) {
    it.skip("no snapshots recorded — run `npm run eval:record` (needs ANTHROPIC_API_KEY)", () => {});
  }

  for (const c of EVAL_CASES) {
    const path = join(SNAP_DIR, `${c.id}.json`);
    const run = existsSync(path) ? it : it.skip;
    run(`[${c.claim}] ${c.id}: ${c.assert("").detail}`, () => {
      const snap = JSON.parse(readFileSync(path, "utf8")) as Snapshot;
      const verdict = c.assert(snap.reply);
      expect(verdict.pass, `reply did not satisfy: ${verdict.detail}\n--- reply ---\n${snap.reply}`).toBe(
        true,
      );
    });
  }
});
