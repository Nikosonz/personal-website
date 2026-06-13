import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  service: z.string().min(1),
  message: z.string().min(20),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        service: data.service,
        message: data.message,
      },
    });

    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Contact Form <onboarding@resend.dev>",
        to: "pouyakarimibirgani@gmail.com",
        subject: `New inquiry from ${data.name} — ${data.service}`,
        html: `<h2>New contact form submission</h2>
<p><b>Name:</b> ${data.name}</p>
<p><b>Email:</b> <a href="mailto:${data.email}">${data.email}</a></p>
<p><b>Service:</b> ${data.service}</p>
<p><b>Message:</b></p>
<p>${data.message.replace(/\n/g, "<br>")}</p>`,
      });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
