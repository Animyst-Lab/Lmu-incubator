import { z } from "zod";
import type { CauseIndexEntry } from "./causeIndex";
import { keywordMatch } from "./keywordMatch";
import { MAX_MESSAGE_CHARS, MAX_VISITOR_TURNS } from "./matchPrompt";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type MatchResponse =
  | { type: "question"; text: string; source: "llm" }
  | { type: "match"; slug: string; reason: string; alternates: string[]; source: "llm" | "keyword" };

/** What the model is asked to return (see buildReplySchema). */
const modelReplySchema = z.object({
  type: z.enum(["question", "match"]),
  text: z.string(),
  slug: z.string(),
  reason: z.string(),
  alternates: z.array(z.string()),
});

/** Calls the LLM and returns its raw JSON text. Throws on any failure. */
export type CallModel = (messages: ChatMessage[], visitorTurns: number) => Promise<string>;

export const requestSchema = z.object({
  messages: z
    .array(
      z.strictObject({
        role: z.enum(["user", "assistant"]),
        // Assistant turns come back from the browser, so they're capped too.
        content: z.string().trim().min(1).max(500),
      }),
    )
    .min(1)
    .max(MAX_VISITOR_TURNS * 2),
});

/** Checks the conversation limits. Returns a visitor-facing error, or null if the request is fine. */
export function checkConversation(messages: ChatMessage[]): string | null {
  if (messages[0].role !== "user") return "The conversation has to start with a visitor message.";
  const visitor = messages.filter((m) => m.role === "user");
  if (visitor.length > MAX_VISITOR_TURNS) return "This chat has reached its limit. Start over to try again.";
  if (visitor.some((m) => m.content.length > MAX_MESSAGE_CHARS)) {
    return `Messages can be up to ${MAX_MESSAGE_CHARS} characters.`;
  }
  return null;
}

function fallback(messages: ChatMessage[], index: CauseIndexEntry[]): MatchResponse {
  const said = messages.filter((m) => m.role === "user").map((m) => m.content);
  const result = keywordMatch(said, index);
  if (!result) throw new Error("No causes to match");
  return { type: "match", ...result, source: "keyword" };
}

/**
 * Runs one turn of the hero chat. Asks the model when one is configured, then
 * checks everything it returns. Any failure, bad slug, or missing model falls
 * back to the keyword matcher, so the hero always ends on a real cause.
 */
export async function runMatch(
  messages: ChatMessage[],
  index: CauseIndexEntry[],
  callModel: CallModel | null,
  onFallback: (why: string) => void = () => {},
): Promise<MatchResponse> {
  if (!callModel) {
    onFallback("no model configured");
    return fallback(messages, index);
  }

  const visitorTurns = messages.filter((m) => m.role === "user").length;
  let reply: z.infer<typeof modelReplySchema>;
  try {
    reply = modelReplySchema.parse(JSON.parse(await callModel(messages, visitorTurns)));
  } catch (error) {
    onFallback(error instanceof Error ? `${error.name}: ${error.message}` : "model call failed");
    return fallback(messages, index);
  }

  const known = new Set(index.map((c) => c.slug));

  if (reply.type === "question") {
    const text = reply.text.trim();
    if (text && visitorTurns < MAX_VISITOR_TURNS) return { type: "question", text, source: "llm" };
    onFallback(text ? "model asked a question after the last turn" : "model returned an empty question");
    return fallback(messages, index);
  }

  if (!known.has(reply.slug)) {
    onFallback("model returned an unknown slug");
    return fallback(messages, index);
  }

  const alternates = [...new Set(reply.alternates)].filter((s) => known.has(s) && s !== reply.slug).slice(0, 2);
  return {
    type: "match",
    slug: reply.slug,
    reason: reply.reason.trim() || "It lines up with what you told us.",
    alternates,
    source: "llm",
  };
}
