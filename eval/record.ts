import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runChat } from "../shared/agent";
import { CHAT_MODEL } from "../shared/agent";
import { EVAL_CASES } from "./cases";

/**
 * LIVE recorder — spends real OpenAI credits. Run on demand:
 *   OPENAI_API_KEY=... npm run eval:record
 * Calls the real agent for each golden case and writes a snapshot the offline
 * gate replays. Optionally pass a case id to record just one: `npm run eval:record greeting`.
 */
const SNAP_DIR = join(dirname(fileURLToPath(import.meta.url)), "snapshots");

interface Snapshot {
  id: string;
  claim: string;
  model: string;
  messages: { role: string; content: string }[];
  reply: string;
}

async function main(): Promise<void> {
  if (!process.env.OPENAI_API_KEY) {
    console.error("✗ OPENAI_API_KEY is not set. Set it before recording (this spends credits).");
    process.exit(1);
  }
  const only = process.argv[2];
  const cases = only ? EVAL_CASES.filter((c) => c.id === only) : EVAL_CASES;
  if (cases.length === 0) {
    console.error(`✗ No case matches "${only}". Known: ${EVAL_CASES.map((c) => c.id).join(", ")}`);
    process.exit(1);
  }

  mkdirSync(SNAP_DIR, { recursive: true });
  for (const c of cases) {
    process.stdout.write(`recording ${c.id} … `);
    const { reply } = await runChat([...c.messages]);
    const snap: Snapshot = {
      id: c.id,
      claim: c.claim,
      model: CHAT_MODEL,
      messages: c.messages.map((m) => ({ role: m.role, content: m.content })),
      reply,
    };
    writeFileSync(join(SNAP_DIR, `${c.id}.json`), JSON.stringify(snap, null, 2) + "\n");
    const verdict = c.assert(reply);
    console.log(verdict.pass ? "ok" : `⚠ FAILS assertion (${verdict.detail})`);
  }
  console.log(`\nSaved ${cases.length} snapshot(s) to eval/snapshots/. Run \`npm run verify\` to gate.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
