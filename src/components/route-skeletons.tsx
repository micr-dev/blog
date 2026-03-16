import { Layout } from "@/components/layout";
import { PostShell } from "@/components/post-shell";
import { defaultPostTheme } from "@/lib/site-config";

function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-md ${className}`}
      style={{
        backgroundColor: "color-mix(in srgb, var(--post-border, var(--border)) 35%, transparent)",
      }}
    />
  );
}

export function HomePageSkeleton() {
  return (
    <Layout>
      <div>
        <div className="mb-6 flex justify-center">
          <SkeletonBlock className="h-40 w-full max-w-[960px]" />
        </div>
        <SkeletonBlock className="mx-auto mb-8 h-4 w-56" />
        <div className="space-y-12 border-t border-[color:var(--border)]">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="grid gap-6 py-12 xl:grid-cols-4 xl:gap-8">
              <div className="space-y-4">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="aspect-video w-full" />
              </div>
              <div className="space-y-5 xl:col-span-3">
                <SkeletonBlock className="h-8 w-3/4" />
                <div className="flex gap-3">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-4 w-24" />
                </div>
                <div className="space-y-3">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-11/12" />
                </div>
                <SkeletonBlock className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function ListingPageSkeleton({
  titleWidth = "w-48",
  withSidebar = false,
}: {
  titleWidth?: string;
  withSidebar?: boolean;
}) {
  return (
    <Layout>
      <div>
        <div className="pb-6 pt-6">
          <SkeletonBlock className={`h-12 ${titleWidth} max-w-full`} />
        </div>
        <div className={`flex gap-8 ${withSidebar ? "sm:space-x-0" : ""}`}>
          {withSidebar ? (
            <div className="hidden min-w-[280px] max-w-[280px] rounded border border-[color:var(--border)] bg-[color:var(--card)] p-6 sm:block">
              <SkeletonBlock className="mb-6 h-4 w-24" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-4 w-full" />
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex-1 space-y-12 border-t border-[color:var(--border)]">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="grid gap-6 py-12 xl:grid-cols-4 xl:gap-8">
                <div className="space-y-4">
                  <SkeletonBlock className="h-4 w-28" />
                  <SkeletonBlock className="aspect-video w-full" />
                </div>
                <div className="space-y-5 xl:col-span-3">
                  <SkeletonBlock className="h-8 w-3/4" />
                  <div className="space-y-3">
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-10/12" />
                  </div>
                  <SkeletonBlock className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function TagGridSkeleton() {
  return (
    <Layout>
      <div>
        <div className="pb-6 pt-6">
          <SkeletonBlock className="h-12 w-40" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5"
            >
              <SkeletonBlock className="h-6 w-32" />
              <SkeletonBlock className="mt-3 h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function PostPageSkeleton() {
  return (
    <PostShell theme={defaultPostTheme}>
      <Layout>
        <article>
          <div className="xl:divide-y xl:divide-[color:var(--post-border)]">
            <header className="space-y-6 pt-6 xl:pb-6">
              <SkeletonBlock className="mx-auto h-4 w-28" />
              <SkeletonBlock className="mx-auto h-12 w-3/4 max-w-[720px]" />
            </header>
            <div className="divide-y divide-[color:var(--post-border)] pb-8">
              <div className="space-y-6 pb-8 pt-10">
                <SkeletonBlock className="h-64 w-full" />
                <SkeletonBlock className="h-8 w-56" />
                <div className="space-y-3">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-11/12" />
                  <SkeletonBlock className="h-4 w-10/12" />
                </div>
                <SkeletonBlock className="h-56 w-full" />
                <div className="space-y-3">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-9/12" />
                </div>
              </div>
              <footer className="space-y-8 pt-10">
                <SkeletonBlock className="h-4 w-16" />
                <div className="flex gap-3">
                  <SkeletonBlock className="h-4 w-20" />
                  <SkeletonBlock className="h-4 w-24" />
                </div>
                <div className="flex justify-between gap-6">
                  <SkeletonBlock className="h-10 w-52" />
                  <SkeletonBlock className="h-10 w-52" />
                </div>
              </footer>
            </div>
          </div>
        </article>
      </Layout>
    </PostShell>
  );
}
