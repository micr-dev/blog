"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "next-view-transitions";
import { siteConfig } from "@/lib/site-config";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 flex-col items-center justify-center gap-1 text-current"
    >
      <span
        className={`block h-0.5 w-6 bg-current transition-transform ${
          open ? "translate-y-1.5 rotate-45" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-6 bg-current transition-opacity ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`block h-0.5 w-6 bg-current transition-transform ${
          open ? "-translate-y-1.5 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="flex items-center justify-between py-10 text-[color:var(--post-foreground)]">
      <Link href="/" aria-label={siteConfig.name}>
        <div className="text-2xl font-semibold transition-colors hover:text-[color:var(--post-accent)]">
          {siteConfig.name}
        </div>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        {siteConfig.navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hidden font-medium transition-colors sm:block ${
              isActive(link.href)
                ? "text-[color:var(--post-accent)]"
                : "text-[color:var(--post-foreground)]/85 hover:text-[color:var(--post-foreground)]"
            }`}
          >
            {link.label}
          </Link>
        ))}

        <button
          type="button"
          className="text-[color:var(--post-foreground)] sm:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 sm:hidden"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--post-background) 96%, black 4%)",
          }}
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-10">
            <Link href="/" onClick={() => setOpen(false)}>
              <div className="text-2xl font-semibold text-[color:var(--post-foreground)]">
                {siteConfig.name}
              </div>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <MenuIcon open />
            </button>
          </div>
          <nav className="mx-auto mt-8 flex max-w-3xl flex-col gap-6 px-6">
            <Link
              href="/"
              className={`text-2xl font-bold tracking-widest ${
                pathname === "/" ? "text-[color:var(--post-accent)]" : "text-[color:var(--post-foreground)]"
              }`}
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-2xl font-bold tracking-widest ${
                  isActive(link.href)
                    ? "text-[color:var(--post-accent)]"
                    : "text-[color:var(--post-foreground)]"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
