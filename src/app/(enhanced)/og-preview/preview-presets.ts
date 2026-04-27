import type { OgPreviewTheme } from "@/lib/og";

export interface PreviewThemePreset {
  id: string;
  name: string;
  theme: OgPreviewTheme;
}

export const previewGalleryTitle = "how i got unlimited claude opus 4.6 for free";

export const previewThemePresets: PreviewThemePreset[] = [
  {
    id: "terminal-acid",
    name: "Terminal Acid",
    theme: {
      leftPanel: "#0A1204",
      rightPanel: "#13260D",
      logo: "#D9FFD1",
      title: "#72FD00",
      scythe: "#F6DD00",
      fontFamily: "Space Grotesk",
    },
  },
  {
    id: "warning-tape",
    name: "Warning Tape",
    theme: {
      leftPanel: "#121212",
      rightPanel: "#2A1A00",
      logo: "#FFF3B0",
      title: "#FFD400",
      scythe: "#FF6A00",
      fontFamily: "Space Grotesk",
    },
  },
  {
    id: "cobalt-noise",
    name: "Cobalt Noise",
    theme: {
      leftPanel: "#08111F",
      rightPanel: "#132744",
      logo: "#D8E7FF",
      title: "#7CC4FF",
      scythe: "#F05DFF",
      fontFamily: "Space Grotesk",
    },
  },
  {
    id: "burnt-paper",
    name: "Burnt Paper",
    theme: {
      leftPanel: "#1C120D",
      rightPanel: "#362018",
      logo: "#F4DDCE",
      title: "#FFB38A",
      scythe: "#FF4D2D",
      fontFamily: "anthropicSerif",
    },
  },
  {
    id: "rose-lab",
    name: "Rose Lab",
    theme: {
      leftPanel: "#170B14",
      rightPanel: "#2E1032",
      logo: "#FFD9F6",
      title: "#FF84D8",
      scythe: "#71FCAA",
      fontFamily: "anthropicSerif",
    },
  },
  {
    id: "ivory-night",
    name: "Ivory Night",
    theme: {
      leftPanel: "#101114",
      rightPanel: "#1A1F29",
      logo: "#F2EFE8",
      title: "#FFF7E8",
      scythe: "#F4A261",
      fontFamily: "anthropicSerif",
    },
  },
  {
    id: "cyan-static",
    name: "Cyan Static",
    theme: {
      leftPanel: "#041419",
      rightPanel: "#08242D",
      logo: "#D8FBFF",
      title: "#6BF2FF",
      scythe: "#FF5D8F",
      fontFamily: "Space Grotesk",
    },
  },
  {
    id: "ash-violet",
    name: "Ash Violet",
    theme: {
      leftPanel: "#15131C",
      rightPanel: "#221E30",
      logo: "#F2E8FF",
      title: "#C7A6FF",
      scythe: "#FFD166",
      fontFamily: "anthropicSerif",
    },
  },
  {
    id: "monochrome-signal",
    name: "Monochrome Signal",
    theme: {
      leftPanel: "#0B0B0C",
      rightPanel: "#19191B",
      logo: "#F5F5F5",
      title: "#FFFFFF",
      scythe: "#FF3B30",
      fontFamily: "Space Grotesk",
    },
  },
] as const;
