import { beforeEach, describe, expect, it } from "vitest";
import {
  buildConfirmationUrl,
  clientKeyFromRequest,
  consumeRateLimit,
  isValidEmail,
  normalizeEmail,
  resetRateLimit,
  signConfirmationToken,
  verifyConfirmationToken,
} from "@/lib/newsletter";

const SECRET = "test-secret-value";
const NOW = 1_760_000_000_000;
const HOUR = 60 * 60 * 1000;

describe("normalizeEmail", () => {
  it("lowercases and trims", () => {
    expect(normalizeEmail("  Reader@Example.COM ")).toBe("reader@example.com");
  });
});

describe("isValidEmail", () => {
  it("accepts ordinary addresses", () => {
    expect(isValidEmail("reader@example.com")).toBe(true);
    expect(isValidEmail("first.last+tag@sub.example.co.uk")).toBe(true);
  });

  it("rejects addresses that cannot be delivered to", () => {
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("reader")).toBe(false);
    expect(isValidEmail("reader@example")).toBe(false);
    expect(isValidEmail("reader@@example.com")).toBe(false);
    expect(isValidEmail("reader example@test.com")).toBe(false);
    expect(isValidEmail("a@b.c, x@y.z")).toBe(false);
  });

  it("rejects addresses over the RFC 5321 length cap", () => {
    expect(isValidEmail(`${"a".repeat(250)}@example.com`)).toBe(false);
  });
});

describe("confirmation tokens", () => {
  it("round-trips the address it was issued for", () => {
    const token = signConfirmationToken("Reader@Example.com", SECRET, NOW + HOUR);

    expect(verifyConfirmationToken(token, SECRET, NOW)).toEqual({
      ok: true,
      email: "reader@example.com",
    });
  });

  it("rejects a token signed with a different secret", () => {
    const token = signConfirmationToken("reader@example.com", SECRET, NOW + HOUR);

    expect(verifyConfirmationToken(token, "other-secret", NOW)).toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it("rejects a tampered payload", () => {
    const token = signConfirmationToken("reader@example.com", SECRET, NOW + HOUR);
    const [, signature] = token.split(".");
    const forged = `${Buffer.from("attacker@evil.com|99999999999999").toString("base64url")}.${signature}`;

    expect(verifyConfirmationToken(forged, SECRET, NOW)).toEqual({
      ok: false,
      reason: "invalid",
    });
  });

  it("reports expiry separately so the reader can be told to sign up again", () => {
    const token = signConfirmationToken("reader@example.com", SECRET, NOW - 1);

    expect(verifyConfirmationToken(token, SECRET, NOW)).toEqual({
      ok: false,
      reason: "expired",
    });
  });

  it("rejects tokens that are not in payload.signature form", () => {
    expect(verifyConfirmationToken("", SECRET, NOW).ok).toBe(false);
    expect(verifyConfirmationToken("nodot", SECRET, NOW).ok).toBe(false);
    expect(verifyConfirmationToken(".onlysignature", SECRET, NOW).ok).toBe(false);
    expect(verifyConfirmationToken("onlypayload.", SECRET, NOW).ok).toBe(false);
  });

  it("survives a signature of a different length without throwing", () => {
    const token = signConfirmationToken("reader@example.com", SECRET, NOW + HOUR);
    const truncated = `${token.split(".")[0]}.short`;

    expect(verifyConfirmationToken(truncated, SECRET, NOW)).toEqual({
      ok: false,
      reason: "invalid",
    });
  });
});

describe("buildConfirmationUrl", () => {
  it("escapes the token into the query string", () => {
    expect(buildConfirmationUrl("abc.def+ghi")).toBe(
      "https://blog.micr.dev/api/newsletter?token=abc.def%2Bghi",
    );
  });
});

describe("consumeRateLimit", () => {
  beforeEach(() => {
    resetRateLimit();
  });

  it("allows a burst then blocks within the window", () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(consumeRateLimit("1.2.3.4", NOW)).toBe(true);
    }

    expect(consumeRateLimit("1.2.3.4", NOW)).toBe(false);
  });

  it("keeps buckets separate per client", () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      consumeRateLimit("1.2.3.4", NOW);
    }

    expect(consumeRateLimit("5.6.7.8", NOW)).toBe(true);
  });

  it("lets the window slide", () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      consumeRateLimit("1.2.3.4", NOW);
    }

    expect(consumeRateLimit("1.2.3.4", NOW + HOUR + 1)).toBe(true);
  });
});

describe("clientKeyFromRequest", () => {
  it("takes the first hop of x-forwarded-for", () => {
    const request = new Request("https://blog.micr.dev/api/newsletter", {
      headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18" },
    });

    expect(clientKeyFromRequest(request)).toBe("203.0.113.5");
  });

  it("falls back to a shared bucket rather than to no limit", () => {
    const request = new Request("https://blog.micr.dev/api/newsletter");

    expect(clientKeyFromRequest(request)).toBe("unknown");
  });
});
