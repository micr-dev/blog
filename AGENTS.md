# Project Agent Instructions

This is Microck's personal blog. You must help him add, make, or edit any blogs.

## Publishing and Email Notifications

- Publishing a blog post and notifying subscribers are separate actions.
- Before sending, scheduling, or triggering an email notification for a published post, you MUST ask Microck for explicit confirmation.
- Treat a post marked as published as insufficient consent to notify subscribers. Posts may be published as drafts, for testing, or without an email notification.

When asked to convert a written text into a blog, you should:

1. Go through the whole text with multiple subagents and verify that the grammar is fully correct.
2. Go through the whole text with multiple subagents and verify that the capitalization is fully correct.
3. Go through the whole text with multiple subagents and verify that the person used throughout the text stays consistent.
4. Implement any elements that you think fit, like markdown blocks, tables, quotes, etc. Available elements include standard Markdown, GitHub-flavored Markdown, and project-supported MDX components. Use the cheat sheet below when deciding what fits.
5. Thoroughly inspect the source document (including docx relationship targets, embedded hyperlinks, notes, and external references) and verify that every single hyperlink present in the original text is preserved and embedded in the post.

In this pass, make sure to maintain the original voice and don't change any text unless told to, or the text is incorrect.

Afterwards, you should:

1. Go through the whole text with multiple subagents and add some formatting to the text: bold, italics, etc. Just make sure to not overdo it, just add it where it fits.
2. Go through the whole text with multiple subagents and add "tooltips" to words that the reader might not know, like technicisms or rare words not known by outsiders. The description in the tooltip should be simple and objective, it shouldn't have any actual content from the actual blog, it should be a definition so that the user knows what it is.

## Blog Element Cheat Sheet

Use these elements only when they make the blog clearer or easier to read. Do not add formatting just to make the page look busy.

### Standard Markdown and GFM

- Headings: Use `##` and `###` to create clear sections. Do not over-split short posts.
- Paragraphs: Use normal paragraphs for the main voice of the blog.
- Bold: Use `**text**` for important phrases, warnings, or key takeaways.
- Italics: Use `*text*` for light emphasis, tone, or a phrase that should feel slightly set apart.
- Links: Use links for sources, tools, references, and related pages. Inline blog links should use normal text color with an underline, not the accent color.
- Ordered lists: Use numbered lists when order matters, like steps or rankings.
- Unordered lists: Use bullet lists for related points where order does not matter.
- Blockquotes: Use `>` for quoted text, pulled-out claims, or a sentence that deserves emphasis.
- Inline code: Use backticks for commands, filenames, variables, package names, and short code terms.
- Code blocks: Use fenced code blocks for commands, config, logs, snippets, or examples.
- Tables: Use tables for comparisons, scorecards, timelines, options, or structured facts.
- Horizontal rules: Use `---` only for a strong section break in long posts.
- Footnotes: Use footnotes for small clarifications that would interrupt the flow.
- Images: Use images when the reader needs to see a result, interface, diagram, or artifact.
- Captions: Use captions when an image needs context that is not already obvious.
- Mermaid blocks: Use fenced `mermaid` blocks for diagrams when relationships are clearer visually.
- ASCII or diagram blocks: Use fenced `ascii` or `diagram` blocks for simple terminal-style diagrams.

### Project MDX Components

- `<Term tip="Definition">word</Term>`: Use for tooltips on technical, rare, or outsider-unfriendly words. The tip must be a simple definition, not extra blog content.
- `<Media src="/path.png" alt="Description" title="Caption" />`: Use for images or videos that need the blog's media styling.
- `<MarkdownFigure src="/path.png" alt="Description" caption="Caption" />`: Use for a featured image with a clear caption.
- `<MarkdownPanel title="Title">...</MarkdownPanel>`: Use for a focused aside, walkthrough block, or contained example.
- `<MarkdownGrid columns={2}>...</MarkdownGrid>`: Use when multiple cards or metrics should sit side by side on wide screens.
- `<MarkdownCard title="Title">...</MarkdownCard>`: Use for a self-contained idea, note, comparison item, or mini case study.
- `<MarkdownMetric label="Label" value="Value" />`: Use for a single number or short measurable result.
- `<MarkdownQuoteCard author="Name">...</MarkdownQuoteCard>`: Use for a styled quote when attribution matters.
- `<MarkdownCodeBlock text={`code here`} label="Label" />`: Use when a copyable code block needs a label.
- `<LinkPreview href="..." title="..." image="..." />`: Use for important external references that deserve a visual preview.
- `<ProgressBarV2 label="Label" value={75} />`: Use for progress, scores, or percentage-style values.
