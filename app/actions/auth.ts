"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/server/db";
import { createSession, deleteSession } from "@/lib/session";
import { allow, loginLimit, clientIp } from "@/lib/ratelimit";

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error: string }> {
  // Distributed per-IP brute-force throttle (8 / 15 min) on top of bcrypt(12).
  const ip = clientIp(await headers());
  if (!(await allow(loginLimit, ip))) {
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
