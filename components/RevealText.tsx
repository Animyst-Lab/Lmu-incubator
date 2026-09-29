import type { CSSProperties, ElementType } from "react";

type Props = {
  as?: ElementType;
  className?: string;
  delay?: number;
  intro?: boolean;
  id?: string;
} & (
  | {
      /** Line reveal: each line slides up out of a clip, staggered. */
      lines: string[];
      lineStagger?: number;
    }
  | {
      /** Word reveal: each word rises in, staggered. `muted` words follow in a lighter color. */
      text: string;
      muted?: string;
      wordStagger?: number;
    }
);

const delayStyle = (ms: number) => ({ "--rd": `${ms}ms` }) as CSSProperties;

/** Headings that reveal line by line or word by word when scrolled into view. */
export default function RevealText(props: Props) {
  const { as: Tag = "h2", className = "", delay = 0, intro = false, id } = props;
  const common = { id, "data-reveal": "", ...(intro ? { "data-intro": "" } : {}) };

  if ("lines" in props) {
    const stagger = props.lineStagger ?? 120;
    return (
      <Tag {...common} className={`reveal-lines ${className}`}>
        {props.lines.map((line, i) => (
          <span key={i} className="reveal-line">
            <span style={delayStyle(delay + i * stagger)}>{line}</span>
          </span>
        ))}
      </Tag>
    );
  }

  const stagger = props.wordStagger ?? 35;
  const words = props.text.split(/\s+/).filter(Boolean).map((w) => ({ w, muted: false }));
  const mutedWords = (props.muted ?? "").split(/\s+/).filter(Boolean).map((w) => ({ w, muted: true }));
  return (
    <Tag {...common} className={`reveal-words ${className}`}>
      {[...words, ...mutedWords].map(({ w, muted }, i) => (
        <span key={i}>
          <span className={`reveal-word ${muted ? "text-subtle" : ""}`} style={delayStyle(delay + i * stagger)}>
            {w}
          </span>{" "}
        </span>
      ))}
    </Tag>
  );
}
