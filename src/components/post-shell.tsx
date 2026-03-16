import type { CSSProperties, ReactNode } from "react";
import type { PostTheme } from "@/types/post";
import { getFontStyleSheet, getThemeStyle } from "@/lib/mdx";

export function PostShell({
  children,
  theme,
  className = "",
}: {
  children: ReactNode;
  theme: PostTheme;
  className?: string;
}) {
  const fontCss = getFontStyleSheet(theme);
  const style = getThemeStyle(theme);

  return (
    <div
      className={`post-theme-shell ${className}`}
      style={style as CSSProperties}
    >
      {fontCss ? <style>{fontCss}</style> : null}
      {children}
    </div>
  );
}
