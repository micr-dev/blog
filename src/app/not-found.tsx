import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-16 sm:px-6 xl:max-w-5xl xl:px-0">
      <section>
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
    </main>
  );
}
