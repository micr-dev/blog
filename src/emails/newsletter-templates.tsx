import type { ReactElement } from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  render,
  Section,
  Text,
} from "@react-email/components";
import { siteConfig } from "@/lib/site-config";

/**
 * The two emails this blog sends, rendered by React Email into the
 * table-and-inline-style HTML that mail clients actually support.
 *
 * Both are plain components: the publish script and the subscribe route pass
 * post data in as props, so the layout lives here and only the content changes
 * per send. Colors mirror the site's dark theme rather than importing from
 * globals.css, because email clients have no access to the stylesheet and no
 * support for CSS custom properties.
 */

/**
 * Render a template to the `html` and `text` pair Resend expects.
 *
 * Both the API route and the publish script render here rather than handing a
 * React element to the Resend SDK. The SDK resolves `@react-email/render`
 * through a dynamic import, which does not survive Next's server bundling and
 * fails at runtime with "Failed to render React component". Rendering up front
 * sidesteps that, and it means the dry-run preview is byte-for-byte what gets
 * delivered.
 *
 * The plain-text alternative is not optional in practice: a multipart message
 * scores better with spam filters than an HTML-only one.
 */
export async function renderEmail(element: ReactElement) {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  return { html, text };
}

const palette = {
  background: "#1e1e1e",
  surface: "#242424",
  border: "#27272a",
  heading: "#f5f5f5",
  body: "#d4d4d8",
  muted: "#a1a1aa",
  accent: "#f582db",
};

const fontStack
  = "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const styles = {
  body: {
    margin: 0,
    padding: "24px 0",
    backgroundColor: palette.background,
    fontFamily: fontStack,
  },
  container: {
    width: "100%",
    maxWidth: "560px",
    margin: "0 auto",
    padding: "32px 24px",
    backgroundColor: palette.surface,
    borderRadius: "12px",
    border: `1px solid ${palette.border}`,
  },
  eyebrow: {
    margin: "0 0 8px",
    color: palette.muted,
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  heading: {
    margin: "0 0 16px",
    color: palette.heading,
    fontSize: "24px",
    lineHeight: "32px",
    fontWeight: 700,
  },
  paragraph: {
    margin: "0 0 16px",
    color: palette.body,
    fontSize: "16px",
    lineHeight: "26px",
  },
  button: {
    display: "inline-block",
    padding: "12px 22px",
    backgroundColor: palette.accent,
    color: palette.background,
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
    textDecoration: "none",
  },
  cover: {
    width: "100%",
    height: "auto",
    margin: "0 0 24px",
    borderRadius: "8px",
  },
  divider: {
    margin: "28px 0 16px",
    border: "none",
    borderTop: `1px solid ${palette.border}`,
  },
  footer: {
    margin: 0,
    color: palette.muted,
    fontSize: "13px",
    lineHeight: "21px",
  },
  footerLink: {
    color: palette.muted,
    textDecoration: "underline",
  },
  fallbackLink: {
    margin: "0 0 16px",
    color: palette.muted,
    fontSize: "13px",
    lineHeight: "21px",
    wordBreak: "break-all" as const,
  },
} as const;

export interface ConfirmSubscriptionEmailProps {
  confirmationUrl: string;
}

/**
 * Double opt-in email. Deliberately short: the only job is to get the click
 * that flips the contact from `unsubscribed` to subscribed, and a terse mail
 * with one link is the least likely to be flagged as spam.
 */
export function ConfirmSubscriptionEmail({
  confirmationUrl,
}: ConfirmSubscriptionEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Confirm your subscription to {siteConfig.domain}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.eyebrow}>{siteConfig.domain}</Text>
          <Heading style={styles.heading}>One click and you are in</Heading>
          <Text style={styles.paragraph}>
            Confirm this address to get an email when a new post goes up.
            {" "}
            {siteConfig.tagline}, nothing else.
          </Text>

          <Section style={{ margin: "0 0 24px" }}>
            <Link href={confirmationUrl} style={styles.button}>
              Confirm subscription
            </Link>
          </Section>

          <Text style={styles.fallbackLink}>
            If the button does not work, paste this into your browser:
            {" "}
            {confirmationUrl}
          </Text>

          <Hr style={styles.divider} />
          <Text style={styles.footer}>
            You are getting this because someone entered this address at
            {" "}
            {siteConfig.domain}. If that was not you, ignore this email and
            nothing happens. The link expires in 7 days.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export interface NewPostEmailProps {
  title: string;
  excerpt: string;
  url: string;
  date: string;
  tags: string[];
  coverUrl?: string;
}

/**
 * The post announcement. `{{{contact.first_name|there}}}` and
 * `{{{RESEND_UNSUBSCRIBE_URL}}}` are Resend merge tags, substituted per
 * recipient at send time. The unsubscribe tag is required in every broadcast:
 * Resend renders the working link and handles the opt-out itself.
 */
export function NewPostEmail({
  title,
  excerpt,
  url,
  date,
  tags,
  coverUrl,
}: NewPostEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{excerpt}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.eyebrow}>
            New post
            {" · "}
            {date}
          </Text>

          {coverUrl ? (
            <Img src={coverUrl} alt="" width={512} style={styles.cover} />
          ) : null}

          <Heading style={styles.heading}>{title}</Heading>

          {/* One string, not `Hi {tag},` in pieces: React separates adjacent
              text children with HTML comments, which is harmless but noisy. */}
          <Text style={styles.paragraph}>{"Hi {{{contact.first_name|there}}},"}</Text>
          <Text style={styles.paragraph}>{excerpt}</Text>

          <Section style={{ margin: "0 0 24px" }}>
            <Link href={url} style={styles.button}>
              Read the post
            </Link>
          </Section>

          {tags.length > 0 ? (
            <Text style={styles.footer}>Filed under: {tags.join(", ")}</Text>
          ) : null}

          <Hr style={styles.divider} />
          <Text style={styles.footer}>
            You signed up for new posts at
            {" "}
            <Link href={`https://${siteConfig.domain}`} style={styles.footerLink}>
              {siteConfig.domain}
            </Link>
            .
            {" "}
            <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={styles.footerLink}>
              Unsubscribe
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
