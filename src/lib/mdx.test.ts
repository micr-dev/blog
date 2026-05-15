import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderMdx } from "@/lib/mdx";
import { renderMermaidAscii } from "@/lib/mermaid-ascii";
import { defaultPostTheme } from "@/lib/site-config";

describe("mdx shortcodes", () => {
  it("renders custom MDX components", async () => {
    const rendered = await renderMdx(
      `
<LinkPreview
  href="https://example.com/writeup"
  title="Example write-up"
  description="A demo link preview."
  image="/media/oracle-sniper-writeup/console_victory.jpg"
/>

<ProgressBarV2 label="Progress" value={72} />

<Term tip="A temporary inbox provider used in the early email-verification path.">
  gopretstudio
</Term>

<Media
  type="video"
  mode="fill"
  src="/media/slippy-preview.mp4"
  poster="/media/oracle-sniper-writeup/console_victory.jpg"
/>

<Media src="/media/oracle-sniper-writeup/decodo_dashboard.png" alt="Fill still" mode="fill" />

<Media
  src="/media/oracle-sniper-writeup/error_screenshot.png"
  alt="Intrinsic still"
  mode="intrinsic"
/>

![Still image](/media/oracle-sniper-writeup/diagram_problem_solution.svg)
      `,
      defaultPostTheme,
    );

    const html = renderToStaticMarkup(createElement("div", null, rendered));

    expect(html).toContain("Example write-up");
    expect(html).toContain("Progress");
    expect(html).toContain("A temporary inbox provider used in the early email-verification path.");
    expect(html).toContain("/media/slippy-preview.mp4");
    expect(html).toContain("/media/oracle-sniper-writeup/console_victory.jpg");
    expect(html).toContain("nb-media--fill");
    expect(html).toContain("nb-media--intrinsic");
    expect(html).not.toContain("<p><figure");
  });

  it("renders mermaid blocks as ascii fallbacks in client-safe mode", async () => {
    const rendered = await renderMdx(
      `
\`\`\`mermaid
flowchart LR
    A[flaresolverr] --> B[clearance cookies]
    B --> C[camoufox]
\`\`\`
      `,
      defaultPostTheme,
      { clientSafeCodeBlocks: true },
    );

    const html = renderToStaticMarkup(createElement("div", null, rendered));

    expect(html).toContain("ASCII Diagram Fallback");
    expect(html).toContain("[flaresolverr] -&gt; [clearance cookies]");
    expect(html).toContain("[clearance cookies] -&gt; [camoufox]");
  });

  it("renders ascii fences as dedicated diagram blocks", async () => {
    const rendered = await renderMdx(
      `
\`\`\`ascii
[client] -> [proxy] -> [api]
\`\`\`
      `,
      defaultPostTheme,
    );

    const html = renderToStaticMarkup(createElement("div", null, rendered));

    expect(html).toContain("ASCII Diagram");
    expect(html).toContain("ascii-diagram");
    expect(html).toContain("[client] -&gt; [proxy] -&gt; [api]");
  });

  it("renders reusable markdown layout components", async () => {
    const rendered = await renderMdx(
      `
<MarkdownPanel
  title="Harness working memory snapshots"
  description="Browse durable logs from autonomous runs."
  action={<a href="https://example.com/thread">Open thread</a>}
  tabs={["Codex v1", "Claude Code v1"]}
  bodyHeight={420}
>
  ### THREAD

  Mission folder created at \`records/track_3_optimization/ai/\`.

  <MarkdownGrid columns={2}>
    <MarkdownMetric label="Runs" value="10k" detail="Agent attempts" />
    <MarkdownMetric label="Best" value="2930" tone="success" />
  </MarkdownGrid>
</MarkdownPanel>

<MarkdownGrid columns={2}>
  <MarkdownCard title="Claude v3" badge="2930" tone="success">
    Contra-Muon with SOAP and radial damping.
  </MarkdownCard>
  <MarkdownQuoteCard author="Codex" meta="gpt 5.5 xhigh">
    Thank you to everyone in the speedrun track.
  </MarkdownQuoteCard>
</MarkdownGrid>

<MarkdownFigure
  src="/media/oracle-sniper-writeup/console_victory.jpg"
  alt="Console victory"
  caption="Observed frontier over time."
  fullWidth
/>

<MarkdownCodeBlock
  label="BibTeX"
  copyLabel="Copy BibTeX"
  text={"@article{example,\\n  title = {Example}\\n}"}
/>
      `,
      defaultPostTheme,
    );

    const html = renderToStaticMarkup(createElement("div", null, rendered));

    expect(html).toContain("Harness working memory snapshots");
    expect(html).toContain("Codex v1");
    expect(html).toContain("height:420px");
    expect(html).toContain("THREAD");
    expect(html).toContain("records/track_3_optimization/ai/");
    expect(html).toContain("nb-markdown-panel__body");
    expect(html).toContain("rounded-2xl");
    expect(html).toContain("2930");
    expect(html).toContain("Observed frontier over time.");
    expect(html).toContain("Copy BibTeX");
    expect(html).toContain("@article{example");
  });
});

describe("renderMermaidAscii", () => {
  it("converts simple flowcharts into readable ascii", () => {
    expect(
      renderMermaidAscii(`
flowchart TD
    Client([User]) --> CF["Cloudflare"]
    CF --> Caddy["Caddy on Oracle VPS"]
      `),
    ).toBe(
      [
        "Flowchart (TD)",
        "[User] -> [Cloudflare]",
        "[Cloudflare] -> [Caddy on Oracle VPS]",
      ].join("\n"),
    );
  });

  it("converts sequence diagrams into readable ascii", () => {
    expect(
      renderMermaidAscii(`
sequenceDiagram
    participant A as session a
    participant P as account pool
    Note over P: account #1 is truly exhausted
    A->>P: gets 402
      `),
    ).toBe(
      [
        "Sequence",
        "Note over account pool: account #1 is truly exhausted",
        "session a -> account pool: gets 402",
      ].join("\n"),
    );
  });
});
