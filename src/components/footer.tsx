import { Link } from "next-view-transitions";
import { siteConfig } from "@/lib/site-config";

const socialLinks = [
  { href: "https://github.com/Microck", label: "github" },
  { href: "https://x.com/JustMicrock", label: "x" },
  { href: "https://www.youtube.com/@Microck", label: "youtube" },
];

export function Footer() {
  return (
    <footer className="site-footer mt-4">
      <div className="mt-4 mb-8 flex flex-col items-center">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-x-2 text-sm">
          <Link className="transition-opacity hover:opacity-80" href="/">
            {siteConfig.domain}
          </Link>
          <span aria-hidden="true">•</span>
          {socialLinks.map((link, index) => (
            <span key={link.href} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">•</span> : null}
              <a
                className="transition-opacity hover:opacity-80"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </span>
          ))}
          <span aria-hidden="true">•</span>
          <a
            className="transition-opacity hover:opacity-80"
            href="https://ko-fi.com/microck"
            target="_blank"
            rel="noopener noreferrer"
          >
            ko-fi
          </a>
          <span aria-hidden="true">•</span>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
