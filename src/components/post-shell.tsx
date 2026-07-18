import type { CSSProperties, ReactNode } from "react";
import { AiDetectionPopup } from "@/components/ai-detection-popup";
import type { AiDetection, PostTheme } from "@/types/post";
import { getFontStyleSheet, getThemeStyle } from "@/lib/mdx";

export function PostShell({
  children,
  theme,
  slug,
  aiDetection,
  className = "",
}: {
  children: ReactNode;
  theme: PostTheme;
  slug?: string;
  aiDetection?: AiDetection;
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
      {aiDetection ? <AiDetectionPopup detection={aiDetection} /> : null}
    </div>
  );
}
