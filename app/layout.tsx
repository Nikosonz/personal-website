import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pouya Karimi — Developer & SEO Specialist",
    template: "%s | Pouya Karimi",
  },
  description:
    "Freelance developer and SEO specialist helping teams build fast, search-friendly products that rank and convert.",
  metadataBase: new URL("https://pouyakarimi.ir"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pouyakarimi.ir",
    siteName: "Pouya Karimi",
    title: "Pouya Karimi — Developer & SEO Specialist",
    description:
      "Freelance developer and SEO specialist helping teams build fast, search-friendly products that rank and convert.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pouya Karimi — Developer & SEO Specialist",
    description:
      "Freelance developer and SEO specialist helping teams build fast, search-friendly products that rank and convert.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
