"use client";

import { useEffect, useRef, useState } from "react";
import type { CauseSummary } from "@/lib/causes";
import type { ChatMessage, MatchResponse } from "@/lib/match";
import { MAX_MESSAGE_CHARS, OPENING_QUESTION } from "@/lib/matchPrompt";
import { ArrowRight, LogoMark } from "./icons";
import MatchResult from "./MatchResult";

const SUGGESTIONS = ["I love animals", "I want to help kids", "I only have weekends", "I'd rather donate"];

type Match = Extract<MatchResponse, { type: "match" }>;

type Props = {
  causes: CauseSummary[];
};

export default function ChatMatcher({ causes }: Props) {
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

  const card = "rounded-card-sm bg-white/75 p-2 shadow-sm ring-1 ring-line/70 backdrop-blur-xl";

  if (match && matched) {
    return (
      <div aria-live="polite" className={card}>
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
    <div className={`${card} text-left`}>
      <div className="flex items-center gap-3 rounded-control bg-ink-card px-3 py-2.5 text-white">
        <span className="grid size-8 place-items-center rounded-full bg-white/10">
          <LogoMark className="text-base text-accent-from" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Cause matcher</p>
          <p className="text-xs text-white/60">A few questions, then a match</p>
        </div>
      </div>

      <div
        ref={threadRef}
        className="flex max-h-72 min-h-40 flex-col gap-2.5 overflow-y-auto px-2 py-4"
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
          <div className="flex items-center gap-1 self-start rounded-2xl rounded-bl-md bg-surface px-4 py-3" aria-label="Thinking">
            {[0, 150, 300].map((d) => (
              <span key={d} className="size-1.5 animate-bounce rounded-full bg-ink/50" style={{ animationDelay: `${d}ms` }} />
            ))}
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-2 pb-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              disabled={pending}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm transition-all duration-300 ease-snap hover:-translate-y-0.5 hover:border-ink/30 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p role="alert" className="px-2 pb-2 text-sm font-medium text-accent-strong">
          {error}
        </p>
      )}

      <form
        className="flex items-center gap-2 rounded-control bg-surface p-1.5"
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
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_MESSAGE_CHARS}
          autoComplete="off"
          placeholder="Type what you care about…"
          className="min-w-0 flex-1 bg-transparent px-3 py-2 text-base placeholder:text-ink/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending || !input.trim()}
          aria-label="Send"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-ink-card text-white transition-all duration-300 ease-snap hover:scale-105 disabled:opacity-30"
        >
          <ArrowRight />
        </button>
      </form>
      <p className="px-2 pb-1 pt-2 text-xs text-ink/60">Don&apos;t share personal info. Chats aren&apos;t saved.</p>
    </div>
  );
}

function Bubble({ role, children }: { role: ChatMessage["role"]; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <p
      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-snug ${
        mine ? "self-end rounded-br-md bg-ink-card text-white" : "self-start rounded-bl-md bg-surface text-ink"
      }`}
    >
      <span className="sr-only">{mine ? "You: " : "Matcher: "}</span>
      {children}
    </p>
  );
}
