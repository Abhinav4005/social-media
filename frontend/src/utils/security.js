/**
 * Validates and sanitizes redirect URLs to prevent Open Redirect Phishing attacks.
 * Rejects external URLs (e.g. "https://evil.com") and protocol-relative URLs (e.g. "//evil.com").
 *
 * @param {string} targetUrl - Target redirect URL from query string / state
 * @param {string} fallbackUrl - Safe fallback relative URL (default "/")
 * @returns {string} Safe internal relative URL or fallbackUrl
 */
export function getSafeRedirectUrl(targetUrl = "", fallbackUrl = "/") {
  if (!targetUrl || typeof targetUrl !== "string") return fallbackUrl;

  const trimmed = targetUrl.trim();

  if (!trimmed.startsWith("/")) return fallbackUrl;

  if (trimmed.startsWith("//")) return fallbackUrl;

  if (trimmed.toLowerCase().startsWith("/\\") || /^\/[a-z0-9]+:/i.test(trimmed)) {
    return fallbackUrl;
  }

  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const parsed = new URL(trimmed, origin);
    if (parsed.origin !== origin) {
      return fallbackUrl;
    }
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return fallbackUrl;
  }
}
