import Anthropic from "@anthropic-ai/sdk";
import { buildCauseIndex } from "@/lib/causeIndex";
import { getAllCauses } from "@/lib/causes";
import { checkConversation, requestSchema, runMatch, type CallModel } from "@/lib/match";
import { buildReplySchema, buildSystemPrompt } from "@/lib/matchPrompt";
import { allowRequest, visitorIdFrom } from "@/lib/ratelimit";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
// Models that accept server-side refusal fallback (`fallbacks: "default"`).
const SUPPORTS_FALLBACK = ["claude-sonnet-5-5", "claude-opus-5-5", "claude-opus-5", "claude-fable-5-1"].includes(MODEL);
const TIMEOUT_MS = 8000;

// The cause list is fixed at build time, so the index and schema are built once.
const index = buildCauseIndex(getAllCauses());
const replySchema = buildReplySchema(index.map((c) => c.slug));

const client = process.env.ANTHROPIC_API_KEY ? new Anthropic({ timeout: TIMEOUT_MS, maxRetries: 0 }) : null;

const callClaude: CallModel = async (messages, visitorTurns) => {
  const response = await client!.beta.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: buildSystemPrompt(index, visitorTurns),
    messages,
    output_config: {
      format: { type: "json_schema", schema: replySchema },
      // Haiku 4.5 doesn't take an effort setting; newer models do, and low keeps them fast.
      ...(MODEL.startsWith("claude-haiku") ? {} : { effort: "low" as const }),
    },
    // If the model declines for safety reasons, the API retries on its recommended fallback model.
    ...(SUPPORTS_FALLBACK ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
  });
  if (response.stop_reason !== "end_turn") throw new Error(`stop_reason ${response.stop_reason}`);
  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("no text block");
  return text.text;
};

const json = (body: unknown, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  // Conversations are never stored or logged. Only failure reasons are logged.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Send the conversation as JSON." }, 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return json({ error: "That message couldn't be read. Try starting over." }, 400);

  const problem = checkConversation(parsed.data.messages);
  if (problem) return json({ error: problem }, 400);

  if (!(await allowRequest(visitorIdFrom(request.headers)))) {
    return json({ error: "You've chatted a lot today. Browse every cause below instead." }, 429);
  }

  if (index.length === 0) return json({ error: "There are no causes to match yet." }, 503);

  const result = await runMatch(parsed.data.messages, index, client ? callClaude : null, (why) => {
    // Without a key, the keyword matcher is the expected path, not a failure worth logging.
    if (client) console.warn(`[lion-share] /api/match used keyword fallback: ${why}`);
  });
  return json(result);
}
