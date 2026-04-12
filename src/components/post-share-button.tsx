"use client";

import type { MouseEvent } from "react";
import { ShareButton } from "@/components/animate-ui/components/community/share-button";
import { buildShareHref, type SharePlatform } from "@/lib/share-links";

function openShareWindow(href: string) {
  window.open(href, "_blank", "noopener,noreferrer,width=640,height=720");
}

export function PostShareButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const handleShare = (
    platform: SharePlatform,
    event: MouseEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    openShareWindow(buildShareHref(platform, title, url));
  };

  return (
    <ShareButton icon="prefix" onIconClick={handleShare}>
      Share post
    </ShareButton>
  );
}
