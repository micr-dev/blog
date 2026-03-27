import {
  Children,
  isValidElement,
  type CSSProperties,
  type ReactNode,
} from "react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";
import { CodeFence } from "@/components/mdx/code-fence";
import {
  IframeEmbed,
  ImageEmbed,
  Media,
  VideoEmbed,
} from "@/components/mdx/media-embed";
import {
  LinkPreview,
  ProgressBarV2,
} from "@/components/mdx/next-bricks";
import { Term } from "@/components/mdx/term";
import { MermaidFence } from "@/components/mdx/mermaid-fence";
import type { PostTheme } from "@/types/post";

function remarkUnwrapStandaloneMedia() {
  return (tree: {
    children?: Array<Record<string, unknown>>;
  }) => {
    const visit = (node: Record<string, unknown>) => {
      if (!Array.isArray(node.children)) {
        return;
      }

      node.children = node.children.flatMap((child) => {
        if (!child || typeof child !== "object") {
          return [child];
        }

        visit(child as Record<string, unknown>);

        if ((child as { type?: string }).type !== "paragraph") {
          return [child];
        }

        const content = Array.isArray((child as { children?: unknown[] }).children)
          ? (child as { children: Array<Record<string, unknown>> }).children.filter(
              (entry) =>
                entry.type !== "text"
                || typeof entry.value !== "string"
                || entry.value.trim().length > 0,
            )
          : [];

        if (content.length === 1 && content[0]?.type === "image") {
          return content;
        }

        return [child];
      });
    };

    visit(tree as Record<string, unknown>);
  };
}

function guessFontFormat(value: string) {
  if (value.endsWith(".woff2")) return "woff2";
  if (value.endsWith(".woff")) return "woff";
  if (value.endsWith(".otf")) return "opentype";
  if (value.endsWith(".ttf")) return "truetype";
  return "woff2";
}

export function getThemeStyle(theme: PostTheme): CSSProperties {
  return {
    ["--post-background" as string]: theme.colors.background,
    ["--post-body" as string]: theme.colors.body,
    ["--post-heading" as string]: theme.colors.heading,
    ["--post-accent" as string]: theme.colors.accent,
    ["--post-muted" as string]: theme.colors.muted,
    ["--post-border" as string]: theme.colors.border,
    ["--post-code-bg" as string]: theme.colors.codeBackground,
    ["--post-code-fg" as string]: theme.colors.codeForeground,
    ["--font-post-body" as string]: `"${theme.fonts.body.family}"`,
    ["--font-post-heading" as string]: `"${theme.fonts.heading.family}"`,
    ["--font-post-mono" as string]: `"${theme.fonts.mono.family}"`,
  };
}

export function getFontStyleSheet(theme: PostTheme) {
  const fonts = Object.values(theme.fonts);
  const googleFamilies = [...new Set(
    fonts
      .filter((font) => font.source === "google")
      .map((font) => font.value.trim()),
  )];
  const localFaces = [...new Map(
    fonts
      .filter((font) => font.source === "local")
      .map((font) => [font.family, font]),
  ).values()];

  const imports = googleFamilies.length
    ? `@import url("https://fonts.googleapis.com/css2?${googleFamilies
        .map((family) => `family=${family}`)
        .join("&")}&display=swap");`
    : "";

  const fontFaces = localFaces
    .map(
      (font) => `
@font-face {
  font-family: "${font.family}";
  src: url("${font.value}") format("${guessFontFormat(font.value)}");
  font-display: swap;
}`,
    )
    .join("\n");

  return `${imports}\n${fontFaces}`.trim();
}

function getLanguageName(className?: string) {
  if (!className) return "";
  const match = className.match(/language-([\w-]+)/);
  return match?.[1] ?? "";
}

function getPreProps(children: ReactNode) {
  if (
    !children ||
    typeof children !== "object" ||
    !("props" in children) ||
    typeof children.props !== "object" ||
    children.props === null
  ) {
    return null;
  }

  const props = children.props as {
    className?: string;
    children?: string;
  };

  return {
    className: props.className,
    code: typeof props.children === "string" ? props.children.trimEnd() : "",
  };
}

function PreviewCodeFence({
  code,
  theme,
}: {
  code: string;
  theme: PostTheme;
}) {
  return (
    <pre
      className="astro-code github-dark post-scroll my-6 overflow-x-auto rounded-md p-4"
      style={{
        backgroundColor: theme.colors.codeBackground,
        color: theme.colors.codeForeground,
      }}
      tabIndex={0}
    >
      <code>{code}</code>
    </pre>
  );
}

function isMediaBlock(child: ReactNode) {
  if (!isValidElement(child)) {
    return false;
  }

  const props =
    typeof child.props === "object" && child.props !== null
      ? (child.props as { className?: string })
      : {};
  const className =
    typeof props.className === "string" ? props.className : "";

  if (className.includes("nb-media")) {
    return true;
  }

  return child.type === "figure"
    || child.type === "img"
    || child.type === "video"
    || child.type === "iframe";
}

export function getMdxComponents(
  theme: PostTheme,
  options?: {
    clientSafeCodeBlocks?: boolean;
  },
): MDXComponents {
  return {
    a: (props) => (
      <a
        {...props}
        target={props.href?.startsWith("/") ? undefined : "_blank"}
        rel={props.href?.startsWith("/") ? undefined : "noopener noreferrer"}
      />
    ),
    img: (props) => <ImageEmbed {...props} />,
    video: (props) => <VideoEmbed {...props} />,
    iframe: (props) => <IframeEmbed {...props} />,
    Media,
    LinkPreview,
    ProgressBarV2,
    Term,
    code: ({ className, children, ...props }) => {
      if (className?.startsWith("language-")) {
        return <code className={className} {...props}>{children}</code>;
      }

      return (
        <code className="post-inline-code" {...props}>
          {children}
        </code>
      );
    },
    p: ({ children, ...props }) => {
      const items = Children.toArray(children).filter((child) => {
        return !(typeof child === "string" && child.trim().length === 0);
      });

      if (items.length === 1 && isMediaBlock(items[0])) {
        return <>{items[0]}</>;
      }

      return <p {...props}>{children}</p>;
    },
    pre: ({ children }) => {
      const resolved = getPreProps(children);

      if (!resolved) {
        return <pre>{children}</pre>;
      }

      const language = getLanguageName(resolved.className);

      if (language === "mermaid") {
        return <MermaidFence code={resolved.code} theme={theme} />;
      }

      if (options?.clientSafeCodeBlocks) {
        return <PreviewCodeFence code={resolved.code} theme={theme} />;
      }

      return (
        <CodeFence
          code={resolved.code}
          language={language || "text"}
          theme={theme}
        />
      );
    },
  };
}

export async function renderMdx(
  source: string,
  theme: PostTheme,
  options?: {
    clientSafeCodeBlocks?: boolean;
  },
) {
  const mdxModule = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm, remarkUnwrapStandaloneMedia],
    useMDXComponents: () => getMdxComponents(theme, options),
  });

  const Content = mdxModule.default;

  return <Content />;
}
