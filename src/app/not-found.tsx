import { Link } from "next-view-transitions";
import { Layout } from "@/components/layout";

export default function NotFound() {
  return (
    <Layout>
      <section className="py-16">
        <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--accent)]">404</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
          The page you asked for does not exist, or the URL is wrong.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-medium text-[color:var(--foreground)] transition-opacity hover:opacity-80"
          >
            Go home
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-medium text-[color:var(--foreground)] transition-opacity hover:opacity-80"
          >
            Browse posts
          </Link>
        </div>
      </section>
    </Layout>
  );
}
