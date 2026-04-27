import type { ReactNode } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const plainFooterLinks = [
  { href: "/read", label: "read" },
  { href: "/read/tags", label: "tags" },
  { href: "/blog", label: "enhanced" },
];

export function PlainLayout({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:px-0">
      <div className="flex min-h-screen flex-col justify-between">
        <header className="flex flex-wrap items-center justify-between gap-4 py-10">
          <div>
            <Link
              href="/read"
              className="text-2xl font-semibold text-[color:var(--post-heading,var(--foreground))]"
            >
              {siteConfig.name}
            </Link>
            <p className="mt-1 text-sm text-[color:var(--post-muted,var(--muted))]">
              Plain reading mode.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium uppercase tracking-wide text-[color:var(--post-accent,var(--accent))]">
            <Link href="/read">Read</Link>
            <Link href="/read/tags">Tags</Link>
            <Link href="/blog">Enhanced</Link>
          </nav>
        </header>

        <main id="main-content" className="mb-auto" tabIndex={-1}>
          {children}
        </main>

        <footer className="mt-16 border-t border-[color:var(--post-border,var(--border))] py-8 text-sm text-[color:var(--post-muted,var(--muted))]">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{siteConfig.domain}</span>
            <span aria-hidden="true">•</span>
            {plainFooterLinks.map((link, index) => (
              <span key={link.href} className="inline-flex items-center gap-2">
                {index > 0 ? <span aria-hidden="true">•</span> : null}
                <Link href={link.href}>{link.label}</Link>
              </span>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
