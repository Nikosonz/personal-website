import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function RootPage() {
  // Prefer a returning visitor's explicit language choice (set by the locale switcher).
  const cookieStore = await cookies();
  const saved = cookieStore.get("NEXT_LOCALE")?.value;
  if (saved === "fa" || saved === "en") {
    redirect(`/${saved}`);
  }

  // Fall back to Accept-Language: if the browser prefers Farsi, serve Farsi.
  // Everyone else (including Googlebot, which sends no language preference) gets English.
  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  const prefersFarsi = /\bfa\b/i.test(acceptLanguage.split(",")[0] ?? "");
  redirect(prefersFarsi ? "/fa" : "/en");
}
