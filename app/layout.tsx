import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pouya Karimi — Developer & Designer",
    template: "%s | Pouya Karimi",
  },
  description:
    "Freelance developer, UI/UX designer, and AI consultant helping teams build exceptional digital products.",
  metadataBase: new URL("https://pouyakarimi.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pouyakarimi.dev",
    siteName: "Pouya Karimi",
    title: "Pouya Karimi — Developer & Designer",
    description:
      "Freelance developer, UI/UX designer, and AI consultant helping teams build exceptional digital products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pouya Karimi — Developer & Designer",
    description:
      "Freelance developer, UI/UX designer, and AI consultant helping teams build exceptional digital products.",
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
