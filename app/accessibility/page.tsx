import type { Metadata } from "next";
import LegalPage, { Contact } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Lion Share's accessibility goals and how to report a barrier.",
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      eyebrow="Accessibility"
      title="Accessibility"
      intro={
        <p>
          We want everyone to be able to find a cause on Lion Share. We aim to meet the Web Content Accessibility
          Guidelines (WCAG) 2.1 at level AA.
        </p>
      }
    >
      <h2>What we&apos;ve built in</h2>
      <ul>
        <li>Every page works with a keyboard, with a visible focus outline and a link to skip to the content.</li>
        <li>Text and buttons are designed to meet WCAG color contrast, and pages work at phone widths and when zoomed.</li>
        <li>Animations stop if your device is set to reduce motion.</li>
        <li>Images have text descriptions, and the cause matcher announces new messages to screen readers.</li>
      </ul>

      <h2>Known limitations</h2>
      <p>
        Each cause page includes a creative section designed by a student, such as a quiz or a calculator. We give students
        guidelines and review each page, but these sections can vary, and some may be harder to use with assistive
        technology.
      </p>

      <h2>Report a barrier</h2>
      <p>
        If something on Lion Share is hard to use, tell us which page and what happened: <Contact />. We&apos;ll do our
        best to fix it.
      </p>
    </LegalPage>
  );
}
