// Shared by the build script and the browser, so this file must not import Node modules.

export const ALLOWED_SCRIPT_HOSTS = ["cdn.jsdelivr.net", "cdnjs.cloudflare.com"];
export const HEIGHT_MESSAGE = "lionshare:height";

const cdns = ALLOWED_SCRIPT_HOSTS.map((h) => `https://${h}`).join(" ");

/**
 * Enforces the custom section rules in the browser, on top of the validator:
 * scripts only from the two CDNs, no forms, no sending data anywhere else.
 */
export const CUSTOM_SECTION_CSP = [
  "default-src 'none'",
  `script-src 'unsafe-inline' ${cdns}`,
  `style-src 'unsafe-inline' 'self' https://fonts.googleapis.com ${cdns}`,
  `font-src data: https://fonts.gstatic.com ${cdns}`,
  "img-src https: data: blob:",
  "media-src https: data: blob:",
  `connect-src ${cdns}`,
  "form-action 'none'",
  "base-uri 'none'",
].join("; ");

/** Posts the content height to the parent page so the iframe never needs its own scrollbar. */
const HEIGHT_SCRIPT = `(function () {
  function send() {
    var b = document.body;
    if (!b) return;
    var s = getComputedStyle(b);
    var h = b.scrollHeight + parseFloat(s.marginTop) + parseFloat(s.marginBottom);
    parent.postMessage({ type: "${HEIGHT_MESSAGE}", height: Math.ceil(h) }, "*");
  }
  document.addEventListener("DOMContentLoaded", function () {
    send();
    if (window.ResizeObserver) new ResizeObserver(send).observe(document.body);
  });
  window.addEventListener("load", send);
})();`;

/** Students keep this line in custom.html; it's replaced by the tokens themselves when the section is served. */
const TOKENS_LINK = /<link\b[^>]*\bhref\s*=\s*["']?\/tokens\.css["']?[^>]*>[ \t]*\n?/gi;

/**
 * Adds the CSP, the height reporter, and the site's design tokens to the top
 * of a student's custom.html.
 *
 * The tokens are inlined rather than linked: the sandboxed frame has an opaque
 * origin, so where the site sits behind a login (a private Codespaces preview)
 * the browser fetches /tokens.css without the login cookie, gets a sign-in
 * page back, and every var(--…) in the section comes out empty.
 */
export function prepareCustomHtml(html: string, tokensCss = ""): string {
  const inject =
    `<meta http-equiv="Content-Security-Policy" content="${CUSTOM_SECTION_CSP}">\n` +
    `<script>${HEIGHT_SCRIPT}</script>\n` +
    (tokensCss ? `<style>\n${tokensCss.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s*\n/g, "\n").trim()}\n</style>\n` : "");
  if (tokensCss) html = html.replace(TOKENS_LINK, "");

  // The CSP must come before anything it governs, so it goes first inside <head>.
  if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (m) => `${m}\n${inject}`);
  if (/<html\b[^>]*>/i.test(html)) return html.replace(/<html\b[^>]*>/i, (m) => `${m}\n<head>\n${inject}</head>`);
  return `<!doctype html>\n<head>\n${inject}</head>\n${html}`;
}
