// The gate (prd-compile step 8): offline, deterministic, fast. Bound to the
// project Stop hook. Live/networked/LLM oracles (eval:record, deploy) run on
// demand, never here.
import { spawnSync } from "node:child_process";

const steps = [
  ["typecheck", "tsc", ["--noEmit"]],
  ["unit + offline eval replay", "vitest", ["run"]],
];

const win = process.platform === "win32";
for (const [name, cmd, args] of steps) {
  console.log(`\n▶ ${name}`);
  // On Windows, run via shell as one string (avoids DEP0190 arg-escaping warning).
  const r = win
    ? spawnSync([cmd, ...args].join(" "), { stdio: "inherit", shell: true })
    : spawnSync(cmd, args, { stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`\n✗ verify failed at: ${name}`);
    process.exit(1);
  }
  console.log(`✓ ${name}`);
}
console.log("\n✓ verify green");
