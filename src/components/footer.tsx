import { Link } from "next-view-transitions";
import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  { href: "/blog", label: "blog" },
  { href: "/tags", label: "tags" },
];

export function Footer() {
  return (
    <footer className="mt-16">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-x-2 text-sm text-[color:var(--muted)]">
          <Link className="transition-opacity hover:opacity-80" href="/">
            {siteConfig.domain}
          </Link>
          <span aria-hidden="true">•</span>
          {footerLinks.map((link, index) => (
            <span key={link.href} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">•</span> : null}
              <Link className="transition-opacity hover:opacity-80" href={link.href}>
                {link.label}
              </Link>
            </span>
          ))}
          <span aria-hidden="true">•</span>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
