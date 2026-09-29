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

/** Adds the CSP and the height reporter to the top of a student's custom.html. */
export function prepareCustomHtml(html: string): string {
  const inject =
    `<meta http-equiv="Content-Security-Policy" content="${CUSTOM_SECTION_CSP}">\n` +
    `<script>${HEIGHT_SCRIPT}</script>\n`;

  // The CSP must come before anything it governs, so it goes first inside <head>.
  if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, (m) => `${m}\n${inject}`);
  if (/<html\b[^>]*>/i.test(html)) return html.replace(/<html\b[^>]*>/i, (m) => `${m}\n<head>\n${inject}</head>`);
  return `<!doctype html>\n<head>\n${inject}</head>\n${html}`;
}
