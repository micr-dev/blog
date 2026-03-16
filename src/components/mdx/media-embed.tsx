import type { ComponentPropsWithoutRef, ReactNode } from "react";

type MediaMode = "intrinsic" | "fill";

function joinClasses(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function MediaShell({
  children,
  caption,
  mode,
}: {
  children: ReactNode;
  caption?: string;
  mode: MediaMode;
}) {
  return (
    <figure className={joinClasses("nb-media not-prose", `nb-media--${mode}`)}>
      <div className="nb-media__asset">{children}</div>
      {caption ? <figcaption className="nb-media__caption">{caption}</figcaption> : null}
    </figure>
  );
}

type ImageEmbedProps = ComponentPropsWithoutRef<"img"> & {
  mode?: MediaMode;
};

export function ImageEmbed({
  alt,
  className,
  mode = "intrinsic",
  title,
  ...props
}: ImageEmbedProps) {
  const resolvedAlt = alt ?? "";

  return (
    <MediaShell caption={typeof title === "string" ? title : undefined} mode={mode}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...props}
        alt={resolvedAlt}
        loading="lazy"
        className={joinClasses("nb-media__content", className)}
      />
    </MediaShell>
  );
}

type VideoEmbedProps = ComponentPropsWithoutRef<"video"> & {
  mode?: MediaMode;
};

export function VideoEmbed({
  className,
  controls,
  mode = "fill",
  playsInline,
  preload,
  title,
  ...props
}: VideoEmbedProps) {
  return (
    <MediaShell caption={typeof title === "string" ? title : undefined} mode={mode}>
      <video
        {...props}
        controls={controls ?? true}
        playsInline={playsInline ?? true}
        preload={preload ?? "metadata"}
        className={joinClasses("nb-media__content", className)}
      />
    </MediaShell>
  );
}

type ImageMediaProps = { type?: "image"; mode?: MediaMode } & ComponentPropsWithoutRef<"img">;
type VideoMediaProps = { type: "video"; mode?: MediaMode } & ComponentPropsWithoutRef<"video">;

export function Media({ type, ...props }: ImageMediaProps | VideoMediaProps) {
  if (type === "video") {
    return <VideoEmbed {...(props as VideoEmbedProps)} />;
  }

  return <ImageEmbed {...(props as ImageEmbedProps)} />;
}

type IframeEmbedProps = ComponentPropsWithoutRef<"iframe"> & {
  mode?: Extract<MediaMode, "fill">;
};

export function IframeEmbed({
  allowFullScreen,
  className,
  ...props
}: IframeEmbedProps) {
  return (
    <figure className="nb-media not-prose nb-media--fill">
      <div className="nb-media__asset">
        <iframe
          {...props}
          loading="lazy"
          allowFullScreen={allowFullScreen ?? true}
          className={joinClasses("nb-media__content", className)}
        />
      </div>
    </figure>
  );
}
