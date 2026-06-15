"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { verifySession } from "@/lib/session";

export async function markMessageRead(id: number) {
  // Server actions are independently callable POST endpoints — middleware only
  // guards /admin/* page routes, so this must verify the session itself.
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/admin/messages");
}
