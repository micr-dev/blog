import { createHmac, timingSafeEqual } from "node:crypto";
import { siteConfig } from "@/lib/site-config";

/**
 * Shared newsletter plumbing for the subscribe/confirm API route and the
 * publish script.
 *
 * Design notes:
 * - There is no database. Resend's contact list is the only store, and the
 *   double opt-in link carries its own HMAC-signed payload, so nothing has to
 *   be persisted between the form submit and the confirmation click.
 * - Signing/verification take the secret and the clock as arguments so they
 *   stay pure and testable. The route wraps them with the environment.
 */

/** How long a confirmation link stays valid. Long enough to survive an inbox
 * that only gets checked at the weekend, short enough to bound replay. */
export const CONFIRMATION_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Rate-limit window and allowance per client key (see `consumeRateLimit`). */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

/**
 * Deliberately loose address check. Real validation is the confirmation email
 * itself: an address that cannot receive mail never becomes a subscriber, so
 * anything stricter here only rejects valid-but-unusual addresses.
 */
const EMAIL_PATTERN = /^[^\s@,;:<>()[\]\\]+@[^\s@.,;:<>()[\]\\]+(\.[^\s@.,;:<>()[\]\\]+)+$/;

/** RFC 5321 caps the whole address at 254 characters. */
const MAX_EMAIL_LENGTH = 254;

/** Canonical public origin, used to build confirmation and post links. */
export const siteOrigin = `https://${siteConfig.domain}`;

/**
 * Lowercase and trim an address so the same person cannot be stored twice
 * under different casing. The local part is technically case-sensitive, but no
 * mail provider in practice treats it that way.
 */
export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

/** Whether a normalized address is plausible enough to send a confirmation to. */
export function isValidEmail(value: string) {
  return value.length > 0
    && value.length <= MAX_EMAIL_LENGTH
    && EMAIL_PATTERN.test(value);
}

/** Encode bytes or text as base64url, which is safe to drop into a query string. */
function toBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

/** Compute the signature for a token payload. */
function signPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/**
 * Build a self-contained confirmation token: `base64url(email|expiry).signature`.
 *
 * The email is inside the token so the confirm handler knows who to subscribe
 * without a lookup table, and the expiry is inside the signed payload so it
 * cannot be extended by editing the URL.
 */
export function signConfirmationToken(
  email: string,
  secret: string,
  expiresAt: number,
) {
  const payload = `${normalizeEmail(email)}|${expiresAt}`;
  const encoded = toBase64Url(payload);
  return `${encoded}.${signPayload(encoded, secret)}`;
}

export type ConfirmationTokenResult =
  | { ok: true; email: string }
  | { ok: false; reason: "malformed" | "invalid" | "expired" };

/**
 * Verify a confirmation token and recover the address it was issued for.
 *
 * `expired` is reported separately from `invalid` so the landing page can tell
 * the reader to sign up again instead of implying something went wrong.
 */
export function verifyConfirmationToken(
  token: string,
  secret: string,
  now: number,
): ConfirmationTokenResult {
  const separatorIndex = token.lastIndexOf(".");

  if (separatorIndex <= 0 || separatorIndex === token.length - 1) {
    return { ok: false, reason: "malformed" };
  }

  const encoded = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const expected = signPayload(encoded, secret);
  const signatureBytes = Buffer.from(signature);
  const expectedBytes = Buffer.from(expected);

  // Length must match before timingSafeEqual, which throws on a length mismatch.
  if (
    signatureBytes.length !== expectedBytes.length
    || !timingSafeEqual(signatureBytes, expectedBytes)
  ) {
    return { ok: false, reason: "invalid" };
  }

  const payload = Buffer.from(encoded, "base64url").toString("utf8");
  const separator = payload.lastIndexOf("|");

  if (separator <= 0) {
    return { ok: false, reason: "malformed" };
  }

  const email = payload.slice(0, separator);
  const expiresAt = Number(payload.slice(separator + 1));

  if (!Number.isFinite(expiresAt)) {
    return { ok: false, reason: "malformed" };
  }

  if (now > expiresAt) {
    return { ok: false, reason: "expired" };
  }

  if (!isValidEmail(email)) {
    return { ok: false, reason: "malformed" };
  }

  return { ok: true, email };
}

/** Sliding-window counters keyed by client IP, scoped to one server instance. */
const rateLimitBuckets = new Map<string, number[]>();

/**
 * Allow at most `RATE_LIMIT_MAX_REQUESTS` signups per key per hour.
 *
 * This is per serverless instance rather than global, so it is a speed bump
 * against a single noisy client, not a guarantee. It exists to protect the
 * Resend free tier's 100 transactional emails/day, which the confirmation
 * emails draw from. The honeypot field and the double opt-in flow do the rest:
 * an unconfirmed contact stays `unsubscribed` and never receives a broadcast.
 */
export function consumeRateLimit(key: string, now: number) {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recent = (rateLimitBuckets.get(key) ?? []).filter(
    (timestamp) => timestamp > windowStart,
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitBuckets.set(key, recent);
    return false;
  }

  recent.push(now);
  rateLimitBuckets.set(key, recent);

  // Opportunistic cleanup so a long-lived instance does not accumulate keys
  // for clients that stopped sending requests.
  if (rateLimitBuckets.size > 5_000) {
    for (const [bucketKey, timestamps] of rateLimitBuckets) {
      if (timestamps.every((timestamp) => timestamp <= windowStart)) {
        rateLimitBuckets.delete(bucketKey);
      }
    }
  }

  return true;
}

/** Drop all rate-limit state. Exported for tests. */
export function resetRateLimit() {
  rateLimitBuckets.clear();
}

/**
 * Resolve the client IP from the proxy headers Vercel sets.
 * Falls back to a constant so a missing header degrades to a shared bucket
 * rather than to no limit at all.
 */
export function clientKeyFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export interface NewsletterConfig {
  apiKey: string;
  segmentId: string;
  from: string;
  secret: string;
}

/**
 * Read the newsletter environment. Throws with the missing names listed, so a
 * misconfigured deploy fails loudly at the first request instead of silently
 * dropping signups.
 * @throws If any required environment variable is unset.
 */
export function getNewsletterConfig(): NewsletterConfig {
  const variables = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_SEGMENT_ID: process.env.RESEND_SEGMENT_ID,
    NEWSLETTER_FROM: process.env.NEWSLETTER_FROM,
    NEWSLETTER_SECRET: process.env.NEWSLETTER_SECRET,
  };

  const missing = Object.entries(variables)
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Newsletter is not configured. Missing: ${missing.join(", ")}`);
  }

  return {
    apiKey: variables.RESEND_API_KEY as string,
    segmentId: variables.RESEND_SEGMENT_ID as string,
    from: variables.NEWSLETTER_FROM as string,
    secret: variables.NEWSLETTER_SECRET as string,
  };
}

/** Build the absolute confirmation URL that goes into the opt-in email. */
export function buildConfirmationUrl(token: string) {
  return `${siteOrigin}/api/newsletter?token=${encodeURIComponent(token)}`;
}
