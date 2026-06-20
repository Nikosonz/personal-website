"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export async function markMessageRead(publicId: string) {
  // Server actions are independently callable POST endpoints — middleware only
  // guards /admin/* page routes, so this must authorize itself.
  if (!(await requireAdmin())) throw new Error("Unauthorized");

  await prisma.contactMessage.update({
    where: { publicId },
    data: { read: true },
  });
  revalidatePath("/admin/messages");
}
