"use client";

import { useEffect, useRef, useState } from "react";
import type { CauseSummary } from "@/lib/causes";
import type { ChatMessage, MatchResponse } from "@/lib/match";
import { MAX_MESSAGE_CHARS, OPENING_QUESTION } from "@/lib/matchPrompt";
import MatchResult from "./MatchResult";

const SUGGESTIONS = ["I love animals", "I want to help kids", "I only have weekends", "I'd rather donate"];

type Match = Extract<MatchResponse, { type: "match" }>;

type Props = {
  causes: CauseSummary[];
  /** Called on every keystroke so the background can react. */
  onActivity?: () => void;
};

export default function ChatMatcher({ causes, onActivity }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const bySlug = new Map(causes.map((c) => [c.slug, c]));
  const matched = match ? bySlug.get(match.slug) : undefined;

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [messages, pending]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!content || pending) return;

    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json()) as MatchResponse | { error: string };
      if (!res.ok || "error" in data) {
        setError("error" in data ? data.error : "Something went wrong. Try again.");
        setMessages(messages); // Let them resend.
        setInput(content);
        return;
      }
      if (data.type === "question") {
        setMessages([...next, { role: "assistant", content: data.text }]);
      } else {
        setMatch(data);
      }
    } catch {
      setError("Couldn't reach the matcher. Check your connection and try again.");
      setMessages(messages);
      setInput(content);
    } finally {
      setPending(false);
    }
  }

  function startOver() {
    setMessages([]);
    setMatch(null);
    setError(null);
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  if (match && matched) {
    return (
      <div aria-live="polite">
        <MatchResult
          cause={matched}
          reason={match.reason}
          alternates={match.alternates.map((s) => bySlug.get(s)).filter((c): c is CauseSummary => !!c)}
          onStartOver={startOver}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface/85 text-left shadow-xl backdrop-blur-md">
      <div
        ref={threadRef}
        className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4 sm:p-5"
        role="log"
        aria-live="polite"
        aria-label="Chat with the cause matcher"
      >
        <Bubble role="assistant">{OPENING_QUESTION}</Bubble>
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>
            {m.content}
          </Bubble>
        ))}
        {pending && (
          <div className="flex items-center gap-1 self-start rounded-2xl bg-bg px-4 py-3" aria-label="Thinking">
            {[0, 150, 300].map((d) => (
              <span key={d} className="size-2 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3 sm:px-5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={pending}
              className="rounded-full border border-line bg-bg px-3 py-1.5 text-sm transition-colors hover:border-accent-strong hover:text-accent-strong disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="px-4 pb-2 text-sm text-accent-strong sm:px-5">
          {error}
        </p>
      )}

      <form
        className="flex items-center gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Your message
        </label>
        <input
          ref={inputRef}
          id="chat-input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            onActivity?.();
          }}
          maxLength={MAX_MESSAGE_CHARS}
          autoComplete="off"
          placeholder="Type what you care about…"
          className="min-w-0 flex-1 rounded-full bg-bg px-4 py-2.5 text-base placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          className="shrink-0 rounded-full bg-ink px-5 py-2.5 font-semibold text-bg transition-colors hover:bg-accent-strong disabled:opacity-40"
        >
          Send
        </button>
      </form>
      <p className="px-4 pb-3 text-xs text-muted sm:px-5">Don&apos;t share personal info. Chats aren&apos;t saved.</p>
    </div>
  );
}

function Bubble({ role, children }: { role: ChatMessage["role"]; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <p
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-snug ${
        mine ? "self-end rounded-br-md bg-ink text-bg" : "self-start rounded-bl-md bg-bg text-ink"
      }`}
    >
      <span className="sr-only">{mine ? "You: " : "Matcher: "}</span>
      {children}
    </p>
  );
}
