import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: "blog",
    template: `%s | blog`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: `https://${siteConfig.domain}`,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#1e1e1e",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let devTools: React.ReactNode = null;

  if (process.env.NODE_ENV === "development") {
    const { AgentationRoot } = await import("@/components/agentation-root");
    devTools = <AgentationRoot />;
  }

  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
        {devTools}
      </body>
    </html>
  );
}
