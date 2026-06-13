"use server";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/server/db";
import { createSession, deleteSession } from "@/lib/session";

export async function loginAction(
  _prev: { error?: string } | undefined,
  formData: FormData
): Promise<{ error: string }> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "Invalid email or password." };

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return { error: "Invalid email or password." };

  await createSession(user.id);
  redirect("/admin/posts");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
