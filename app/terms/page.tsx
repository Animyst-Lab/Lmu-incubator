import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Contact, Operator } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using Lion Share and its AI cause matcher.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Use"
      intro={
        <p>
          These terms apply when you use Lion Share, a student project run by <Operator />. By using the site, you agree to
          them. If you don&apos;t agree, please don&apos;t use the site.
        </p>
      }
    >
      <h2>What Lion Share is</h2>
      <p>
        Lion Share is a guide to Los Angeles nonprofits, built by LMU students as a class project. Each cause page is
        written by a student, often with help from AI tools. Lion Share is not affiliated with Loyola Marymount University
        or with the nonprofits listed; see the <Link href="/disclaimer">Disclaimer</Link>.
      </p>

      <h2>The AI cause matcher</h2>
      <ul>
        <li>The matcher is an AI, not a person. Its suggestions can be wrong and aren&apos;t professional advice.</li>
        <li>You must be {LEGAL.chatMinimumAge} or older to use it.</li>
        <li>Don&apos;t type personal or sensitive information, such as your contact details, health, or finances.</li>
        <li>Don&apos;t use it for emergencies. If someone is in danger, call 911.</li>
      </ul>

      <h2>Using the site</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the site or the matcher for anything unlawful, harmful, or harassing;</li>
        <li>send automated requests, scrape the site, or try to overload, break, or get around its security or limits;</li>
        <li>try to make the matcher produce harmful content or anything unrelated to finding a cause;</li>
        <li>copy students&apos; pages and present them as your own.</li>
      </ul>
      <p>We may limit or block access to protect the site and its visitors.</p>

      <h2>Nonprofits, links, and donations</h2>
      <ul>
        <li>
          Lion Share doesn&apos;t collect, process, or hold any money. Volunteer and donate links take you to the
          nonprofit&apos;s own website, and anything you give or sign up for is between you and that nonprofit.
        </li>
        <li>Check with the nonprofit about whether a donation is tax-deductible.</li>
        <li>We don&apos;t control other websites and aren&apos;t responsible for their content or practices.</li>
      </ul>

      <h2>Student content</h2>
      <p>
        Each cause page belongs to the student who wrote it and appears here with their permission. If you think a page
        is inaccurate, uses something without permission, or infringes your rights, contact us and we&apos;ll review it
        promptly, including removing it where appropriate.
      </p>

      <h2>No warranties</h2>
      <p>
        Lion Share is provided &quot;as is&quot; and &quot;as available.&quot; Information about nonprofits, volunteering,
        and donations may be incomplete or out of date, and the matcher may be unavailable or make mistakes. Always confirm
        details on the nonprofit&apos;s official website before you volunteer or give.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent the law allows, the people who build and run Lion Share aren&apos;t liable for any loss or
        damage that comes from using the site, relying on its information or the matcher&apos;s suggestions, or dealing with
        any nonprofit or other website linked from it.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The new version will appear here with a new effective date, and continuing to use the
        site means you accept it.
      </p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the State of California.</p>

      <h2>Contact</h2>
      <p>
        Questions about these terms: <Contact />. Also see our <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </LegalPage>
  );
}
