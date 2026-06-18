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
    const message = err instanceof Error ? err.message : String(err);
    console.error("[upload] Vercel Blob error:", message);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
