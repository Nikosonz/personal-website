import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/session";
import { allow, uploadLimit, clientIp } from "@/lib/ratelimit";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 20 uploads / 10 min, keyed by admin then IP.
  const key = `${session.userId}:${clientIp(req.headers)}`;
  if (!(await allow(uploadLimit, key))) {
    return NextResponse.json({ error: "Too many uploads. Please try again shortly." }, { status: 429 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided." }, { status: 400 });

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 415 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File exceeds 5 MB limit." }, { status: 413 });
  }

  // Fail loudly if the Blob store isn't wired up, instead of a generic 500.
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("[upload] BLOB_READ_WRITE_TOKEN is missing from this deployment.");
    return NextResponse.json(
      { error: "Image storage not configured (BLOB_READ_WRITE_TOKEN missing). Connect a Vercel Blob store and redeploy." },
      { status: 500 }
    );
  }

  const ext = file.type.split("/")[1];
  try {
    const blob = await put(`blog/${Date.now()}.${ext}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    // Log the real cause server-side; return a generic message so internals
    // (store config, infra details) aren't mapped by clients.
    console.error("[upload] Vercel Blob error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
