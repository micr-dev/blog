"use client";

import { useState } from "react";

export function CopyButton({
  text,
  copyLabel = "Copy",
  copiedLabel = "Copied",
}: {
  text: string;
  copyLabel?: string;
  copiedLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copyText}
      className="rounded-full border border-[color:var(--post-border)] bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-[color:var(--post-body)]/80 transition hover:border-[color:var(--post-accent)] hover:bg-white/[0.1] hover:text-[color:var(--post-heading)]"
    >
      {copied ? copiedLabel : copyLabel}
    </button>
  );
}
