"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { parseEditablePost } from "@/lib/post-parser";
import { PostShell } from "@/components/post-shell";
import { getFontStyleSheet, getThemeStyle, renderMdx } from "@/lib/mdx";

const starterDocument = `---
title: "New Post"
date: "2026-03-16"
excerpt: "A short summary for the list pages."
tags:
  - notes
published: true
theme:
  colors:
    background: "#030712"
    foreground: "#f3f4f6"
    accent: "#22d3ee"
    muted: "#9ca3af"
    border: "#1f2937"
    codeBackground: "#0b1120"
    codeForeground: "#e2e8f0"
  fonts:
    body:
      family: "Space Grotesk"
      source: "google"
      value: "Space+Grotesk:wght@300;400;500;700"
    heading:
      family: "Space Grotesk"
      source: "google"
      value: "Space+Grotesk:wght@300;400;500;700"
    mono:
      family: "JetBrains Mono"
      source: "google"
      value: "JetBrains+Mono:wght@400;500;700"
---

## Start writing

Inline code looks like \`const post = true\`.

\`\`\`ts
export function greet(name: string) {
  return \`hello, \${name}\`;
}
\`\`\`

\`\`\`mermaid
flowchart LR
  Draft --> Preview
  Preview --> Publish
\`\`\`

<LinkPreview
  href="https://nextjs.org/docs"
  title="Next.js Documentation"
  description="Routing, rendering strategies, and the app router APIs."
  image="/media/oracle-sniper-writeup/console_victory.jpg"
/>

<ProgressBarV2 label="Reversing" value={86} />
<ProgressBarV2 label="Exploit Stability" value={64} />

<Media
  type="video"
  mode="fill"
  src="/media/slippy-preview.mp4"
  poster="/media/oracle-sniper-writeup/console_victory.jpg"
/>

![Preview still](/media/oracle-sniper-writeup/diagram_problem_solution.svg)

<Media
  src="/media/oracle-sniper-writeup/decodo_dashboard.png"
  alt="Fill image example"
  mode="fill"
  title="Forced 16:9 fill"
/>

<Media
  src="/media/oracle-sniper-writeup/error_screenshot.png"
  alt="Intrinsic image example"
  mode="intrinsic"
  title="Intrinsic ratio"
/>
`;

type FileHandle = FileSystemFileHandle | null;

async function loadPreview(source: string) {
  const parsed = parseEditablePost(source);
  const content = await renderMdx(parsed.content, parsed.theme, {
    clientSafeCodeBlocks: true,
  });

  return {
    title: parsed.frontmatter.title,
    excerpt: parsed.frontmatter.excerpt,
    theme: parsed.theme,
    content,
  };
}

export function LocalEditor() {
  const [source, setSource] = useState(starterDocument);
  const [fileHandle, setFileHandle] = useState<FileHandle>(null);
  const [status, setStatus] = useState("Local-only editor. Open or create an MDX file.");
  const deferredSource = useDeferredValue(source);

  const previewPromise = useMemo(() => loadPreview(deferredSource), [deferredSource]);

  const openFile = async () => {
    const picker = window.showOpenFilePicker;

    if (!picker) {
      setStatus("This editor needs a Chromium browser with File System Access API support.");
      return;
    }

    const [handle] = await picker({
      types: [
        {
          description: "MDX posts",
          accept: { "text/mdx": [".mdx"], "text/plain": [".mdx"] },
        },
      ],
      multiple: false,
    });

    const file = await handle.getFile();
    setSource(await file.text());
    setFileHandle(handle);
    setStatus(`Opened ${handle.name}`);
  };

  const createFile = async () => {
    const picker = window.showSaveFilePicker;

    if (!picker) {
      setStatus("This editor needs a Chromium browser with File System Access API support.");
      return;
    }

    const handle = await picker({
      suggestedName: "new-post.mdx",
      types: [
        {
          description: "MDX posts",
          accept: { "text/mdx": [".mdx"] },
        },
      ],
    });

    const writable = await handle.createWritable();
    await writable.write(source);
    await writable.close();
    setFileHandle(handle);
    setStatus(`Created ${handle.name}`);
  };

  const saveFile = async () => {
    if (!fileHandle) {
      await createFile();
      return;
    }

    const writable = await fileHandle.createWritable();
    await writable.write(source);
    await writable.close();
    setStatus(`Saved ${fileHandle.name}`);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 bg-black px-4 py-6 xl:grid-cols-[minmax(340px,480px)_1fr]">
      <section className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/80 p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-cyan-500 hover:text-cyan-300"
            onClick={() => void openFile()}
          >
            Open file
          </button>
          <button
            type="button"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-cyan-500 hover:text-cyan-300"
            onClick={() => void saveFile()}
          >
            Save file
          </button>
          <button
            type="button"
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-cyan-500 hover:text-cyan-300"
            onClick={() => setSource(starterDocument)}
          >
            Reset template
          </button>
        </div>

        <p className="mb-4 text-sm text-zinc-500">{status}</p>

        <textarea
          className="editor-pane h-[70vh] w-full resize-none rounded-[1.25rem] border border-zinc-800 bg-black/60 p-4 font-mono text-sm leading-7 text-zinc-100 outline-none focus:border-cyan-500"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          spellCheck={false}
        />
      </section>

      <section className="rounded-[1.5rem] border border-zinc-800 bg-zinc-950/60 p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Live preview
          </h1>
          <p className="text-xs text-zinc-500">Same MDX parser and theme system as production posts</p>
        </div>

        <div className="post-scroll h-[78vh] overflow-y-auto rounded-[1.25rem] bg-black/40">
          <EditorPreview previewPromise={previewPromise} />
        </div>
      </section>
    </div>
  );
}

function EditorPreview({
  previewPromise,
}: {
  previewPromise: Promise<{
    title: string;
    excerpt: string;
    theme: ReturnType<typeof parseEditablePost>["theme"];
    content: Awaited<ReturnType<typeof renderMdx>>;
  }>;
}) {
  const [result, setResult] = useState<Awaited<typeof previewPromise> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    previewPromise
      .then((value) => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setResult(value);
        setError(null);
      })
      .catch((cause) => {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(cause instanceof Error ? cause.message : "Preview failed.");
      });
  }, [previewPromise]);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-950/30 p-5 text-sm text-rose-200">
        {error}
      </div>
    );
  }

  if (!result) {
    return <div className="text-sm text-zinc-500">Compiling preview…</div>;
  }

  const fontCss = getFontStyleSheet(result.theme);
  const style = getThemeStyle(result.theme);

  return (
    <PostShell theme={result.theme} className="rounded-[1.25rem]">
      {fontCss ? <style>{fontCss}</style> : null}
      <article className="mx-auto max-w-5xl px-4 sm:px-6 xl:px-0" style={style}>
        <div className="py-10 text-[color:var(--post-foreground)]">
          <div className="mb-10 flex items-center justify-between border-b border-[color:var(--post-border)] pb-6">
            <div className="text-2xl font-semibold">micr.dev</div>
            <div className="text-sm uppercase tracking-[0.25em] text-[color:var(--post-accent)]">
              Preview
            </div>
          </div>
          <header className="border-b border-[color:var(--post-border)] pb-8 text-center">
            <h1 className="mt-4 text-4xl font-extrabold text-[color:var(--post-foreground)]">
              {result.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[color:var(--post-muted)]">
              {result.excerpt}
            </p>
          </header>
          <div className="post-body prose prose-invert max-w-none pt-10">
            {result.content}
          </div>
        </div>
      </article>
    </PostShell>
  );
}
