import { describe, expect, it } from "vitest";
import { buildShareHref } from "@/lib/share-links";

describe("buildShareHref", () => {
  const title = "using claude opus 4.6 for 1/96th the cost";
  const url = "https://blog.micr.dev/blog/free-opus";

  it("builds the X intent url", () => {
    expect(buildShareHref("x", title, url)).toBe(
      "https://x.com/intent/tweet?text=using%20claude%20opus%204.6%20for%201%2F96th%20the%20cost&url=https%3A%2F%2Fblog.micr.dev%2Fblog%2Ffree-opus",
    );
  });

  it("builds the Bluesky intent url", () => {
    expect(buildShareHref("bluesky", title, url)).toBe(
      "https://bsky.app/intent/compose?text=using%20claude%20opus%204.6%20for%201%2F96th%20the%20cost%20https%3A%2F%2Fblog.micr.dev%2Fblog%2Ffree-opus",
    );
  });

  it("builds the LinkedIn share url", () => {
    expect(buildShareHref("linkedin", title, url)).toBe(
      "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fblog.micr.dev%2Fblog%2Ffree-opus",
    );
  });
});
