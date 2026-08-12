import { Resend } from "resend";
import { ConfirmSubscriptionEmail, renderEmail } from "@/emails/newsletter-templates";
import {
  buildConfirmationUrl,
  clientKeyFromRequest,
  consumeRateLimit,
  CONFIRMATION_TOKEN_TTL_MS,
  getNewsletterConfig,
  isValidEmail,
  normalizeEmail,
  signConfirmationToken,
  verifyConfirmationToken,
} from "@/lib/newsletter";

/**
 * Newsletter signup (POST) and double opt-in confirmation (GET).
 *
 * The two halves live in one route because they are one flow: POST stores the
 * address as an unsubscribed contact and mails a signed link, GET verifies
 * that link and flips the contact to subscribed. Only confirmed contacts ever
 * receive a broadcast, which is what keeps the bounce and spam rates inside
 * Resend's thresholds.
 */

/** Node APIs (crypto) and the Resend SDK both need the Node.js runtime. */
export const runtime = "nodejs";

type SubscribeStatus = "pending" | "already-subscribed";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function jsonOk(status: SubscribeStatus) {
  return Response.json({ status });
}

/** Shape every Resend SDK call returns: one of `data` or `error` is set. */
type ResendResult = { error: { message: string; name: string } | null };

/**
 * Turn a Resend error response into a thrown error.
 *
 * The SDK reports failures in the `error` field instead of rejecting, so an
 * unchecked call looks like it succeeded. Ignoring that is how a bad API key
 * ends up silently dropping signups.
 * @throws If the call reported an error.
 */
function assertOk(result: ResendResult, action: string) {
  if (result.error) {
    throw new Error(`${action} failed: ${result.error.name} ${result.error.message}`);
  }
}

/**
 * Attach a contact to the broadcast segment, tolerating failure.
 *
 * New contacts are created with the segment already set, so this only matters
 * for addresses that predate the segment or that Resend already considers a
 * member. Neither case should be able to fail a signup or, worse, turn a
 * successful confirmation into an error page.
 */
async function ensureInSegment(resend: Resend, email: string, segmentId: string) {
  const result = await resend.contacts.segments.add({ email, segmentId });

  if (result.error) {
    console.warn("[newsletter] segment attach skipped", result.error);
  }
}

export async function POST(request: Request) {
  let config;

  try {
    config = getNewsletterConfig();
  } catch (cause) {
    console.error("[newsletter] configuration error", cause);
    return jsonError("The newsletter is not available right now.", 503);
  }

  if (!consumeRateLimit(clientKeyFromRequest(request), Date.now())) {
    return jsonError("Too many signups from here. Try again later.", 429);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }

  const body = payload as { email?: unknown; website?: unknown };

  // Honeypot: the form renders a hidden `website` field that humans never see.
  // Anything that fills it gets a success response and no email, so the bot has
  // no signal that it was caught.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return jsonOk("pending");
  }

  if (typeof body.email !== "string") {
    return jsonError("Expected an email address.", 400);
  }

  const email = normalizeEmail(body.email);

  if (!isValidEmail(email)) {
    return jsonError("That does not look like an email address.", 400);
  }

  const resend = new Resend(config.apiKey);

  try {
    const existing = await resend.contacts.get({ email });

    // A first-time signup legitimately 404s here. Anything else (a bad key, a
    // rate limit) is a real failure and must not be mistaken for "new contact".
    if (existing.error && existing.error.name !== "not_found") {
      assertOk(existing, "contacts.get");
    }

    // Telling a repeat signup that they are already on the list is friendlier
    // than silently re-sending, and it saves a transactional email. It does
    // reveal whether an address is subscribed, which is an acceptable trade
    // for a personal blog list.
    if (existing.data && !existing.data.unsubscribed) {
      return jsonOk("already-subscribed");
    }

    if (existing.data) {
      // Known address that never confirmed, or one that opted out and came
      // back. Make sure it is still attached to the broadcast segment.
      await ensureInSegment(resend, email, config.segmentId);
    } else {
      assertOk(
        await resend.contacts.create({
          email,
          unsubscribed: true,
          segments: [{ id: config.segmentId }],
        }),
        "contacts.create",
      );
    }

    const token = signConfirmationToken(
      email,
      config.secret,
      Date.now() + CONFIRMATION_TOKEN_TTL_MS,
    );

    const { html, text } = await renderEmail(
      ConfirmSubscriptionEmail({ confirmationUrl: buildConfirmationUrl(token) }),
    );

    const sent = await resend.emails.send({
      from: config.from,
      to: email,
      subject: "Confirm your subscription",
      html,
      text,
    });

    if (sent.error) {
      console.error("[newsletter] confirmation send failed", sent.error);
      return jsonError("Could not send the confirmation email.", 502);
    }

    return jsonOk("pending");
  } catch (cause) {
    console.error("[newsletter] subscribe failed", cause);
    return jsonError("Could not sign you up right now.", 502);
  }
}

/** Outcomes the confirmation landing page knows how to render. */
type ConfirmState = "confirmed" | "expired" | "invalid" | "error";

function redirectToLanding(request: Request, state: ConfirmState) {
  const target = new URL(`/newsletter?state=${state}`, request.url);
  // 303 so the browser issues a clean GET and the token leaves the address bar.
  return Response.redirect(target, 303);
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) {
    return redirectToLanding(request, "invalid");
  }

  let config;

  try {
    config = getNewsletterConfig();
  } catch (cause) {
    console.error("[newsletter] configuration error", cause);
    return redirectToLanding(request, "error");
  }

  const result = verifyConfirmationToken(token, config.secret, Date.now());

  if (!result.ok) {
    return redirectToLanding(request, result.reason === "expired" ? "expired" : "invalid");
  }

  const resend = new Resend(config.apiKey);

  try {
    // Confirming is idempotent: clicking the link twice lands on the same
    // state, which matters because mail clients pre-fetch links.
    assertOk(
      await resend.contacts.update({ email: result.email, unsubscribed: false }),
      "contacts.update",
    );
    await ensureInSegment(resend, result.email, config.segmentId);

    return redirectToLanding(request, "confirmed");
  } catch (cause) {
    console.error("[newsletter] confirmation failed", cause);
    return redirectToLanding(request, "error");
  }
}
