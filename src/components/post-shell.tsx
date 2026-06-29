import type { CSSProperties, ReactNode } from "react";
import type { PostTheme } from "@/types/post";
import { getFontStyleSheet, getThemeStyle } from "@/lib/mdx";

export function PostShell({
  children,
  theme,
  slug,
  className = "",
}: {
  children: ReactNode;
  theme: PostTheme;
  slug?: string;
  className?: string;
}) {
  const fontCss = getFontStyleSheet(theme);
  const style = getThemeStyle(theme);

  return (
    <div
      className={`post-theme-shell ${className}`}
      data-post-slug={slug}
      style={style as CSSProperties}
    >
      {fontCss ? <style>{fontCss}</style> : null}
      {children}
    </div>
  );
}
