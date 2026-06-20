import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ChatResponse, parse, ChatRequest } from "../shared/contract";
import { runChat } from "../shared/agent";

// POST /api/chat — validate the request at the seam, run one CSR turn, validate
// the response, return it. The agent never throws (it degrades to a safe
// fallback), so a model/auth/network failure still yields a usable 200.
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const parsed = parse(ChatRequest, req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: "Invalid chat request", fields: parsed.fields });
    return;
  }

  try {
    const guarded = await runChat(parsed.value.messages);
    const out = parse(ChatResponse, guarded);
    if (!out.ok) {
      // Our own output failed its contract — never serve unvalidated; degrade safely.
      console.error("[chat] response failed contract:", out.fields);
      res.status(200).json({
        reply: "Sorry — please call us at 832-726-7401 and we'll help right away.",
        fallback: true,
      } satisfies ChatResponse);
      return;
    }
    res.status(200).json(out.value);
  } catch (err) {
    console.error("[chat] handler error:", err);
    res.status(200).json({
      reply: "Sorry — please call us at 832-726-7401 and we'll help right away.",
      fallback: true,
    } satisfies ChatResponse);
  }
}
