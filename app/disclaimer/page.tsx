import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Contact } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Lion Share is a student project, not affiliated with LMU or the nonprofits it lists.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Disclaimer"
      title="Disclaimer"
      intro={<p>Lion Share is a student project. Please read this before relying on anything on the site.</p>}
    >
      <h2>Not affiliated with LMU</h2>
      <p>
        Lion Share is built by students at Loyola Marymount University, but it is not an official LMU website. It is not
        affiliated with, sponsored by, or endorsed by Loyola Marymount University. The names Loyola Marymount University
        and LMU belong to the university and are used here only to describe who built the site.
      </p>

      <h2>Not affiliated with the nonprofits</h2>
      <p>
        Lion Share is independent of the nonprofits it lists. Featuring a nonprofit doesn&apos;t mean it endorses Lion Share,
        and Lion Share doesn&apos;t endorse or guarantee any nonprofit.
      </p>

      <h2>Information may be wrong or out of date</h2>
      <p>
        Students write each cause page, often with help from AI tools, using the nonprofit&apos;s own website. Details like
        volunteer requirements, schedules, and what a donation provides can change or be summarized imperfectly.{" "}
        <strong>Always confirm details on the nonprofit&apos;s official website</strong> before you volunteer or give.
      </p>

      <h2>The cause matcher is AI</h2>
      <p>
        The matcher on the home page is an AI, not a person. It suggests causes from the pages on this site, and it can
        make mistakes. Treat its suggestions as a starting point.
      </p>

      <h2>Not professional advice</h2>
      <p>
        Nothing on Lion Share is legal, tax, financial, medical, or other professional advice. Ask the nonprofit or a
        qualified professional about things like tax deductions.
      </p>

      <h2>Donations and links</h2>
      <p>
        Lion Share never handles money. Donate and volunteer links go to the nonprofit&apos;s own website, which has its own
        terms and privacy policy.
      </p>

      <p className="mt-10">
        Questions or corrections: <Contact />. See also our <Link href="/terms">Terms of Use</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
