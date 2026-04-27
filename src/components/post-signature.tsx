"use client";

import { Signature } from "@/components/spell-ui/signature";

export function PostSignature({ name }: { name: string }) {
  return (
    <div className="not-prose mt-10 flex justify-end">
      <div className="max-w-full py-2">
        <Signature
          text={name}
          color="var(--post-heading)"
          fontSize={22}
          inView
          className="block h-auto max-w-full overflow-visible"
        />
      </div>
    </div>
  );
}
