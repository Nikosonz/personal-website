import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pouya Karimi — SEO Specialist & Full-Stack Developer",
    template: "%s | Pouya Karimi",
  },
  description:
    "Freelance SEO specialist and full-stack developer helping teams build fast, search-friendly products that rank on Google and grow without paid ads.",
  metadataBase: new URL("https://pouyakarimi.ir"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pouyakarimi.ir",
    siteName: "Pouya Karimi",
    title: "Pouya Karimi — SEO Specialist & Full-Stack Developer",
    description:
      "Freelance SEO specialist and full-stack developer helping teams build fast, search-friendly products that rank on Google and grow without paid ads.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pouya Karimi — SEO Specialist & Full-Stack Developer",
    description:
      "Freelance SEO specialist and full-stack developer helping teams build fast, search-friendly products that rank on Google and grow without paid ads.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
