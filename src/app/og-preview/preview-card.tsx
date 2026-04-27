"use client";

import {
  DEFAULT_SCYTHE_ROTATION,
  DEFAULT_SCYTHE_SCALE,
  DEFAULT_TITLE_SCALE,
  getOgTitleStyle,
  getScytheFrame,
  ogLayout,
  type OgPreviewTheme,
} from "@/lib/og";

export function PreviewCard({
  title,
  theme,
  logoSrc,
  scytheSrc,
  titleScale = DEFAULT_TITLE_SCALE,
  scytheScale = DEFAULT_SCYTHE_SCALE,
  scytheRotation = DEFAULT_SCYTHE_ROTATION,
}: {
  title: string;
  theme: OgPreviewTheme;
  logoSrc: string;
  scytheSrc: string;
  titleScale?: number;
  scytheScale?: number;
  scytheRotation?: number;
}) {
  const scytheFrame = getScytheFrame(1);

  return (
    <div
      style={{
        position: "relative",
        width: ogLayout.width,
        height: ogLayout.height,
        overflow: "hidden",
        background: theme.leftPanel,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: ogLayout.leftPanelWidth,
          background: theme.leftPanel,
        }}
      >
        {/* Data-URI SVGs are tinted server-side, so Next image optimization is not useful here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          style={{
            position: "absolute",
            left: ogLayout.logo.left,
            top: ogLayout.logo.top,
            width: ogLayout.logo.width,
            height: ogLayout.logo.height,
          }}
        />
        <h1
          style={{
            ...getOgTitleStyle(title, titleScale),
            color: theme.title,
            fontFamily: theme.fontFamily,
          }}
        >
          {title}
        </h1>
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: ogLayout.rightPanelWidth,
          height: ogLayout.height,
          overflow: "visible",
          background: theme.rightPanel,
        }}
      >
        {/* Data-URI SVGs are tinted server-side, so Next image optimization is not useful here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={scytheSrc}
          alt=""
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: scytheFrame.width,
            height: scytheFrame.height,
            transform: `translate(-50%, -50%) rotate(${scytheRotation}deg) scale(${scytheScale})`,
            transformOrigin: "center",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}
