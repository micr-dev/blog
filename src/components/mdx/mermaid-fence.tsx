"use client";

import mermaid from "mermaid";
import { useId, useState, useTransition } from "react";
import { useEffect, useEffectEvent } from "react";
import type { PostTheme } from "@/types/post";

function slugifyId(value: string) {
  return value.replace(/[^a-z0-9]/gi, "-").toLowerCase();
}

export function MermaidFence({
  code,
  theme,
}: {
  code: string;
  theme: PostTheme;
}) {
  const id = useId();
  const [svg, setSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const renderChart = useEffectEvent(async () => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          background: "transparent",
          primaryColor: theme.colors.codeBackground,
          primaryTextColor: theme.colors.foreground,
          primaryBorderColor: theme.colors.accent,
          lineColor: theme.colors.muted,
          secondaryColor: theme.colors.codeBackground,
          tertiaryColor: "transparent",
          clusterBkg: theme.colors.codeBackground,
          clusterBorder: theme.colors.border,
          fontFamily: theme.fonts.body.family,
        },
      });

      const rendered = await mermaid.render(slugifyId(`mermaid-${id}`), code);
      setSvg(rendered.svg);
      setError(null);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to render Mermaid.",
      );
      setSvg("");
    }
  });

  useEffect(() => {
    startTransition(() => {
      void renderChart();
    });
  }, [code]);

  return (
    <div className="my-8">
      {error ? (
        <div className="space-y-4">
          <div className="text-sm text-rose-300">{error}</div>
          <pre className="overflow-x-auto text-sm text-[color:var(--post-code-fg)]">
            {code}
          </pre>
        </div>
      ) : (
        <div
          data-mermaid-preview={isPending ? "loading" : "ready"}
          className="post-scroll overflow-x-auto [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full [&_svg]:w-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      )}
    </div>
  );
}
