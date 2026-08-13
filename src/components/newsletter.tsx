"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { Mail, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * The two subscribe surfaces: a form that lives in the footer, and a popup
 * that appears once per reader and never comes back after it is dismissed.
 *
 * Both render the same `SubscribeForm`, so there is one place where the
 * request shape, the honeypot, and the status copy are defined.
 */

/** Matches the easing used by the other popup on the site. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Set once the reader dismisses or subscribes. Either way, stop asking. */
const DISMISSED_KEY = "newsletter:dismissed";
const SUBSCRIBED_KEY = "newsletter:subscribed";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done"; message: string }
  | { kind: "error"; message: string };

const SUCCESS_COPY: Record<string, string> = {
  "pending": "Check your inbox and click the link to confirm.",
  "already-subscribed": "You are already on the list.",
};

export interface SubscribeFormProps {
  /** Layout variant. The popup stacks tighter than the footer. */
  variant?: "footer" | "popup";
  /** Called after a signup succeeds, so the popup can close itself. */
  onSubscribed?: () => void;
}

export function SubscribeForm({ variant = "footer", onSubscribed }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<FormState>({ kind: "idle" });
  // Per-instance ids. The /newsletter page renders this form while the footer
  // renders another one on the same document, so ids derived from the variant
  // would collide and break the label-to-input association.
  const fieldId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.kind === "submitting") {
      return;
    }

    setState({ kind: "submitting" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setState({
          kind: "error",
          message: typeof payload.error === "string"
            ? payload.error
            : "Something went wrong. Try again.",
        });
        return;
      }

      setState({
        kind: "done",
        message: SUCCESS_COPY[payload.status] ?? SUCCESS_COPY.pending,
      });
      setEmail("");
      onSubscribed?.();
    } catch {
      setState({ kind: "error", message: "Network error. Try again." });
    }
  }

  if (state.kind === "done") {
    return (
      <p className="newsletter-status" data-tone="success" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form className="newsletter-form" data-variant={variant} onSubmit={handleSubmit} noValidate>
      <div className="newsletter-field">
        <label className="sr-only" htmlFor={`${fieldId}-email`}>
          Email address
        </label>
        <input
          id={`${fieldId}-email`}
          className="newsletter-input"
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={state.kind === "submitting"}
        />

        {/* Honeypot. Hidden from people and from screen readers, irresistible
            to form-filling bots. A filled value is dropped server-side. */}
        <div className="newsletter-honeypot" aria-hidden="true">
          <label htmlFor={`${fieldId}-website`}>Website</label>
          <input
            id={`${fieldId}-website`}
            type="text"
            name="website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <button className="newsletter-submit" type="submit" disabled={state.kind === "submitting"}>
          {state.kind === "submitting" ? "..." : "Subscribe"}
        </button>
      </div>

      {state.kind === "error" ? (
        <p className="newsletter-status" data-tone="error" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

/** Read a localStorage flag, treating a blocked/absent store as "not set". */
function hasFlag(key: string) {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

/** Write a localStorage flag, ignoring failures in private-mode browsers. */
function setFlag(key: string) {
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // A reader with storage disabled just sees the popup again next visit.
  }
}

export function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const footerReachedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  // /newsletter already is a signup page, and after a confirmation it says so.
  // Popping up a second ask on top of that reads as broken.
  const onNewsletterPage = usePathname() === "/newsletter";

  // Show after a short delay unless the reader already dismissed or
  // subscribed. The popup stays visible across page navigations because
  // Layout keeps it mounted; only an explicit close sets the localStorage
  // flag and hides it for good.
  useEffect(() => {
    if (onNewsletterPage || hasFlag(DISMISSED_KEY) || hasFlag(SUBSCRIBED_KEY)) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!footerReachedRef.current) {
        setVisible(true);
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [onNewsletterPage]);

  // The footer form is the permanent signup surface. Once it enters the
  // viewport, hide the floating prompt so it cannot cover the form on narrow
  // screens or compete with it on long posts.
  useEffect(() => {
    if (onNewsletterPage) {
      return;
    }

    const footerForm = document.querySelector(".newsletter-footer");
    if (!footerForm) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        footerReachedRef.current = true;
        setVisible(false);
      }
    }, { threshold: 0.1 });

    observer.observe(footerForm);
    return () => observer.disconnect();
  }, [onNewsletterPage]);

  function dismiss() {
    setFlag(DISMISSED_KEY);
    setVisible(false);
  }

  function handleSubscribed() {
    setFlag(SUBSCRIBED_KEY);
    // Leave the success message on screen for a beat before closing.
    window.setTimeout(() => setVisible(false), 2400);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          className="newsletter-popup"
          aria-label="Subscribe to the newsletter"
          initial={reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, transform: "translateY(12px) scale(0.98)" }}
          animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
          exit={reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, transform: "translateY(8px) scale(0.97)" }}
          transition={{ duration: reducedMotion ? 0.12 : 0.2, ease: EASE_OUT }}
        >
          <header className="newsletter-popup-header">
            <span className="newsletter-popup-icon" aria-hidden="true">
              <Mail size={18} strokeWidth={1.8} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="newsletter-popup-eyebrow">Newsletter</span>
              <span className="newsletter-popup-title">Wanna be the first one to read these?</span>
            </span>
            <button
              type="button"
              className="newsletter-close"
              aria-label="Dismiss newsletter signup"
              onClick={dismiss}
            >
              <X aria-hidden="true" size={17} strokeWidth={1.8} />
            </button>
          </header>

          <p className="newsletter-popup-body">
            {"I'll"} send you one email when something new goes up. No spam,
            no tracking, unsubscribe whenever.
          </p>

          <SubscribeForm variant="popup" onSubscribed={handleSubscribed} />
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

export function FooterSubscribe() {
  return (
    <section className="newsletter-footer" aria-labelledby="newsletter-footer-heading">
      <h2 id="newsletter-footer-heading" className="newsletter-footer-heading">
        Get new posts by email
      </h2>
      <p className="newsletter-footer-copy">
        Writeups, notes, and whatever {"I'm"} experimenting with. Only when
        {"there's"} something new.
      </p>
      <SubscribeForm variant="footer" />
    </section>
  );
}
