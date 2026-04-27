import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { renderMdx } from "@/lib/mdx";
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
});
