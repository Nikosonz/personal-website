// Self-hosted fonts via next/font — replaces the render-blocking Google Fonts
// @import. next/font fetches at build, serves from /_next/static/media, preloads,
// and adds size-adjust fallbacks. Each exposes a CSS variable consumed by the
// @theme font tokens in globals.css (--font-heading/body/mono/farsi).
import { Archivo, Space_Grotesk, JetBrains_Mono, Vazirmatn } from "next/font/google";

export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-vazir",
  display: "swap",
});

// Convenience: all four variable classes for the <html> element.
export const fontVariables = `${archivo.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${vazirmatn.variable}`;
