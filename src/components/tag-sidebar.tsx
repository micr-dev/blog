import { Link } from "next-view-transitions";
import type { TagSummary } from "@/types/post";

export function TagSidebar({ tags }: { tags: TagSummary[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="hidden h-full max-h-screen min-w-[280px] max-w-[280px] flex-wrap overflow-auto rounded border border-[color:var(--border)] bg-[color:var(--card)] sm:flex">
      <div className="w-full px-6 py-4">
        <h3 className="mb-4 font-bold uppercase text-[color:var(--accent)]">All Posts</h3>
        <ul>
          {tags.map((tag) => (
            <li key={tag.slug} className="my-3">
              <Link
                href={`/tags/${tag.slug}`}
                className="px-3 py-2 text-sm font-medium uppercase text-[color:var(--muted)] transition-colors hover:text-[color:var(--accent)]"
              >
                {tag.name} ({tag.count})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
