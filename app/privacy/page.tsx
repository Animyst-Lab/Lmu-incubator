import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Contact, Operator } from "@/components/LegalPage";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Lion Share collects, how it's used, and your choices.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro={
        <p>
          Lion Share is a campus guide to giving back in Los Angeles, built by LMU students and run by <Operator />. This
          policy explains what we collect when you use the site, why, and what choices you have. The short version: we
          don&apos;t use cookies, analytics, or ads, we don&apos;t save chats, and we don&apos;t sell anything about you.
        </p>
      }
    >
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>What you type into the cause matcher.</strong> To suggest a cause, your messages are sent to Anthropic&apos;s
          Claude, an AI model. We don&apos;t save conversations or log what you type. Anthropic processes the messages to
          write a reply, keeps them only for a limited time under its own terms, and doesn&apos;t use them to train its
          models. Please don&apos;t type personal or sensitive information.
        </li>
        <li>
          <strong>Basic technical information.</strong> Like any website, our hosting provider, Vercel, receives your IP
          address, browser type, and the pages you request, so it can deliver the site and keep it secure. To prevent abuse
          of the matcher, we may also keep your IP address and a count of your messages for up to 24 hours.
        </li>
        <li>
          <strong>One setting in your browser.</strong> We store a single item in your browser&apos;s local storage so the
          opening animation only plays on your first visit. It never leaves your device.
        </li>
        <li>
          <strong>Student authors.</strong> Each cause page shows the name, words, and photo of the LMU student who wrote it,
          published with their permission.
        </li>
      </ul>

      <h2>What we don&apos;t do</h2>
      <ul>
        <li>No cookies, analytics, or advertising trackers.</li>
        <li>No accounts, sign-ups, or forms that collect your contact details.</li>
        <li>We don&apos;t sell or share personal information, for advertising or anything else.</li>
      </ul>

      <h2>Other services the site uses</h2>
      <ul>
        <li>
          <strong>Anthropic</strong> runs the AI behind the cause matcher (
          <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">
            Anthropic&apos;s privacy policy
          </a>
          ).
        </li>
        <li>
          <strong>Vercel</strong> hosts the site (
          <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            Vercel&apos;s privacy policy
          </a>
          ).
        </li>
        <li>
          <strong>Google Fonts, jsDelivr, and cdnjs.</strong> Some students&apos; creative sections load fonts or code from
          these services, which receive your IP address when the section loads.
        </li>
        <li>
          <strong>Nonprofits&apos; websites.</strong> Volunteer, donate, and website links take you to the nonprofit&apos;s own
          site, which has its own privacy policy. We don&apos;t receive anything you do there.
        </li>
      </ul>

      <h2>Do Not Track</h2>
      <p>
        We don&apos;t track you across other websites over time, and we don&apos;t let other companies do that through Lion
        Share. So the site works the same way whether or not your browser sends a Do Not Track signal.
      </p>

      <h2>Age</h2>
      <p>
        The cause matcher is for people {LEGAL.chatMinimumAge} and older. Lion Share isn&apos;t directed to children under
        13, and we don&apos;t knowingly collect personal information from them. If you think a child has shared personal
        information with us, contact us and we&apos;ll delete it.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>You can use the whole site without the matcher; every cause is listed on the home page.</li>
        <li>Don&apos;t type anything into the matcher you wouldn&apos;t want an AI service to process.</li>
        <li>
          If something on a cause page is about you, or you&apos;re a student author who wants your page changed or
          removed, contact us.
        </li>
      </ul>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy, we&apos;ll post the new version here and update the effective date at the top. Also see
        our <Link href="/terms">Terms of Use</Link> and <Link href="/disclaimer">Disclaimer</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests about privacy: <Contact />
      </p>
    </LegalPage>
  );
}
