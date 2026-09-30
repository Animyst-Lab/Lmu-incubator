import matter from "gray-matter";

/** Thrown when answers.md isn't plain YAML front matter. The message is written for students. */
export class AnswersFormatError extends Error {}

const refuse = () => {
  throw new AnswersFormatError("must start with a line that's just three dashes (---), as in the template.");
};

/**
 * Reads the YAML front matter of an answers.md file.
 *
 * gray-matter picks a parser from the text after the opening dashes, and for
 * `---js` it runs the front matter as JavaScript. Students write these files,
 * so only a plain `---` opening is accepted and every non-YAML parser throws.
 */
export function readAnswersFrontMatter(text: string): unknown {
  if (!/^---\r?\n/.test(text)) refuse();
  return matter(text, { engines: { javascript: refuse, js: refuse, coffee: refuse, json: refuse } }).data;
}
