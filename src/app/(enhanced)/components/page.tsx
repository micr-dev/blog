import type { Metadata } from "next";
import { Layout } from "@/components/layout";
import { PostShell } from "@/components/post-shell";
import { renderMdx } from "@/lib/mdx";
import { defaultPostTheme } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "MDX Components",
  description: "Internal gallery for blog MDX components.",
};

const componentsMdx = `
# MDX Components

This page renders the reusable Markdown and MDX components available to future blog posts.

## Standard Markdown

Plain paragraphs, [links](https://example.com), **strong text**, inline \`code\`, lists, tables, and quotes use the blog prose theme.

> Blockquotes keep the active post colors and spacing.

- First list item
- Second list item
- Third list item with \`inline code\`

| Component | Purpose | Notes |
| --- | --- | --- |
| MarkdownPanel | Bordered callout sections | Supports title, description, action |
| MarkdownCard | Reusable information cards | Supports default, accent, success tones |
| MarkdownMetric | Compact stat blocks | Works inside grids |

## CodeFence

\`\`\`ts
type Run = {
  agent: "codex" | "claude";
  steps: number;
};

const bestRun = {
  agent: "claude",
  steps: 2930,
} satisfies Run;
\`\`\`

## MermaidFence

\`\`\`mermaid
flowchart LR
    Draft[Draft MDX] --> Render[Render with components]
    Render --> Publish[Publish blog]
\`\`\`

## AsciiFence

\`\`\`ascii
[writer] -> [mdx] -> [component map] -> [post]
\`\`\`

## Media

<Media
  src="/media/oracle-sniper-writeup/console_victory.jpg"
  alt="Console victory"
  title="Intrinsic image media"
  mode="intrinsic"
/>

<Media
  type="video"
  src="/media/slippy-preview.mp4"
  poster="/media/oracle-sniper-writeup/console_victory.jpg"
  title="Fill video media"
  mode="fill"
/>

<iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="Iframe media"
/>

## LinkPreview

<LinkPreview
  href="https://github.com/KellerJordan/modded-nanogpt"
  title="modded-nanogpt"
  description="A community training speedrun benchmark."
  image="/media/oracle-sniper-writeup/console_victory.jpg"
/>

## ProgressBarV2

<ProgressBarV2 label="Benchmark progress" value={72} />

## Term

Use <Term tip="A tooltip-style annotation rendered inline from MDX.">annotated terms</Term> or <Term tip="The code path uses the same inline-code styling."><code>code terms</code></Term> inside prose.

## MarkdownPanel

<MarkdownPanel
  title="Harness working memory snapshots"
  description="Browse the durable THREAD.md logs from the first Codex and Claude Code runs."
  action={<a href="https://example.com/thread">Open thread</a>}
  tabs={["Codex v1", "Claude Code v1"]}
  activeTab={0}
  bodyHeight={420}
>
  ### THREAD

  Append-only chronological log. One entry per significant moment - subagent return, decision, run launched, surprise finding, blocker. Capture *why* you chose X over Y.

  A fresh orchestrator re-orients from the tail. Don't delete entries.

  ---

  #### 2026-04-29 - mission scoped

  Mission folder created at \`records/track_3_optimization/ai/\`.

  Goal: find an optimizer / HP / schedule / init combination that beats Muon at 3500 steps on the \`track_3_optimization\` benchmark. Open-ended; unlimited compute on 1 node.

  Files in place: \`AGENTS.md\`, \`goal.md\`, \`plan.md\`, this \`THREAD.md\`.

  - Current Muon best log hits target at step 3500 with final val loss 3.27673.
  - AdamW baseline log hits target at step 5625 with final val loss 3.27903.
</MarkdownPanel>

## MarkdownGrid, MarkdownMetric, and MarkdownCard

<MarkdownGrid columns={3}>
  <MarkdownMetric label="Runs" value="10k" detail="Autonomous attempts" />
  <MarkdownMetric label="Hours" value="14k" detail="H200 hours" tone="accent" />
  <MarkdownMetric label="Best" value="2930" detail="Current record" tone="success" />
</MarkdownGrid>

<MarkdownGrid columns={2}>
  <MarkdownCard title="Claude v3" meta="opus 4.7 xhigh" badge="2930" tone="success">
    Contra-Muon with SOAP, radial damping, and tuned schedule parameters.
  </MarkdownCard>
  <MarkdownCard title="Codex v3" meta="gpt 5.5 xhigh" badge="2950">
    Contra-Muon, Soft-Muon, NorMuon-lite, and targeted SOAP branches.
  </MarkdownCard>
</MarkdownGrid>

<MarkdownGrid columns={2}>
  <MarkdownCard title="Accent card" tone="accent">
    Use the accent tone when the card should inherit the current post accent color.
  </MarkdownCard>
  <MarkdownCard title="Default card">
    Use the default tone for quiet supporting content.
  </MarkdownCard>
</MarkdownGrid>

## MarkdownQuoteCard

<MarkdownGrid columns={2}>
  <MarkdownQuoteCard author="Claude Code" meta="opus 4.7 xhigh">
    A reusable quote card for acknowledgments, testimonials, or generated notes.
  </MarkdownQuoteCard>
  <MarkdownQuoteCard author="Codex" meta="gpt 5.5 xhigh">
    The card preserves the same dark bordered visual treatment as the reference article.
  </MarkdownQuoteCard>
</MarkdownGrid>

## MarkdownFigure

<MarkdownFigure
  src="/media/oracle-sniper-writeup/console_victory.jpg"
  alt="Console victory"
  caption="Standard MarkdownFigure with a caption."
/>

<MarkdownFigure
  src="/media/oracle-sniper-writeup/dolphin_config.jpg"
  alt="Dolphin configuration"
  caption="Full-width MarkdownFigure for large visual evidence."
  fullWidth
/>

## MarkdownCodeBlock

<MarkdownCodeBlock
  label="BibTeX"
  copyLabel="Copy BibTeX"
  copiedLabel="Copied"
  text={"@article{example2026components,\\n  title = {MDX Components},\\n  year = {2026}\\n}"}
/>
`;

export default async function ComponentsPage() {
  const article = await renderMdx(componentsMdx, defaultPostTheme);

  return (
    <PostShell theme={defaultPostTheme}>
      <Layout>
        <article className="pb-12 pt-10">
          <div className="post-body prose prose-invert max-w-none">
            {article}
          </div>
        </article>
      </Layout>
    </PostShell>
  );
}
