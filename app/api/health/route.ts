import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/db";

// Liveness + DB-readiness probe for uptime monitoring and post-deploy smoke
// checks. Cheap `SELECT 1` round-trip → 200 if the DB answers, 503 otherwise.
// No auth (the proxy skips /api); returns no internals on failure.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json(
      { status: "ok", timestamp: new Date().toISOString() },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[health] DB check failed:", err);
    return NextResponse.json(
      { status: "error" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
