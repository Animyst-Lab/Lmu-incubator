import type { Metadata, Viewport } from "next";
import { Onest } from "next/font/google";
import RevealObserver from "@/components/RevealObserver";
import "./globals.css";

const onest = Onest({ variable: "--font-onest", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Lion Share", template: "%s | Lion Share" },
  description: "A campus guide to giving back in Los Angeles, built by LMU students.",
};

export const viewport: Viewport = { themeColor: "#0A0A0A" };

/**
 * Runs before first paint. `js` turns on the scroll reveals. The intro loader
 * only plays on a visitor's first time on the home page, and never with
 * reduced motion; otherwise `intro-done` is set straight away.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");var skip=true;try{skip=location.pathname!=="/"||!!localStorage.getItem("ls-intro-seen")||matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}if(skip)d.classList.add("intro-done","no-intro")})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The boot script adds classes to <html> before React hydrates.
    <html lang="en" className={`${onest.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh overflow-x-hidden font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:rounded-control focus:bg-ink-card focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
