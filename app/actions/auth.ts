"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/server/db";
import { createSession, deleteSession } from "@/lib/session";

// Best-effort per-IP brute-force throttle for the login endpoint. In-memory, so
// it only protects within a single warm serverless instance, but it meaningfully
// raises the cost of online password guessing on top of bcrypt(cost 12).
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, number[]>();

function tooManyAttempts(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) attempts.clear(); // crude guard against unbounded growth
  return recent.length > MAX_ATTEMPTS;
}

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error: string }> {
  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooManyAttempts(ip)) {
    return { error: "Too many attempts. Please try again later." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid email or password." };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "Invalid email or password." };

  await createSession(user.publicId, user.role);
  redirect("/admin/posts");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
