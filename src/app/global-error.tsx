"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 sm:px-6 xl:max-w-5xl xl:px-0">
          <p className="text-sm uppercase tracking-[0.3em] text-[color:var(--accent)]">500</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Something broke
          </h1>
          <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
            The page crashed while rendering. You can retry the request or go back to the blog index.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              className="rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-medium transition-opacity hover:opacity-80"
              onClick={() => reset()}
            >
              Try again
            </button>
            <Link
              href="/blog"
              className="rounded-full border border-[color:var(--border)] px-5 py-3 text-sm font-medium transition-opacity hover:opacity-80"
            >
              Browse posts
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
