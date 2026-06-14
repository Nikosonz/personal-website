import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  service: z.string().min(1),
  message: z.string().min(20),
});

// Best-effort per-IP rate limit. In-memory, so it only protects within a single
// warm serverless instance — the honeypot below is the primary spam defense.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude guard against unbounded growth
  return recent.length > MAX_PER_WINDOW;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
    }

    const body = await req.json();

    // Honeypot: the hidden "company" field is invisible to humans. If it's filled,
    // it's a bot — return success without saving or emailing so the bot moves on.
    if (typeof body.company === "string" && body.company.trim() !== "") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const data = schema.parse(body);

    const [dbResult, emailResult] = await Promise.allSettled([
      prisma.contactMessage.create({ data }),
      resend
        ? resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>",
            to: "pouyakarimibirgani@gmail.com",
            subject: `New inquiry from ${escapeHtml(data.name)} — ${escapeHtml(data.service)}`,
            html: `<h2>New contact form submission</h2>
<p><b>Name:</b> ${escapeHtml(data.name)}</p>
<p><b>Email:</b> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
<p><b>Service:</b> ${escapeHtml(data.service)}</p>
<p><b>Message:</b></p>
<p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>`,
          })
        : Promise.resolve(),
    ]);

    if (dbResult.status === "rejected") throw dbResult.reason;
    if (emailResult.status === "rejected") {
      console.error("[Contact] Email send failed:", emailResult.reason);
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
