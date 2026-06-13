import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifySession } from "@/lib/session";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 415 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 5 MB limit." }, { status: 413 });
  }

  const ext = file.type.split("/")[1];
  try {
    const blob = await put(`blog/${Date.now()}.${ext}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[upload] Vercel Blob error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
