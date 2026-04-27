import { Link } from "next-view-transitions";
import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  { href: "/blog", label: "blog" },
  { href: "/tags", label: "tags" },
];

export function Footer() {
  return (
    <footer className="mt-16">
      <div className="mb-8 flex flex-col items-center gap-3">
        <a
          href="https://ko-fi.com/microck"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] transition-opacity hover:opacity-80"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 4C2 3.44772 2.44772 3 3 3H19C20.6569 3 22 4.34315 22 6V12C22 13.6569 20.6569 15 19 15H18C18 18.3137 15.3137 21 12 21C8.68629 21 6 18.3137 6 15H3C2.44772 15 2 14.5523 2 14V4ZM8 15C8 17.2091 9.79086 19 12 19C14.2091 19 16 17.2091 16 15H8ZM4 5V13H19C19.5523 13 20 12.5523 20 12V6C20 5.44772 19.5523 5 19 5H4Z"
              fill="currentColor"
            />
          </svg>
          <span>Buy me a coffee</span>
        </a>
        <div className="flex flex-wrap items-center justify-center gap-x-2 text-sm text-[color:var(--muted)]">
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
