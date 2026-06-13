import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

    // Log the contact form submission (replace with email sending in production)
    console.log("[Contact Form]", {
      name: data.name,
      email: data.email,
      service: data.service,
      message: data.message.slice(0, 100),
    });

    // TODO: Integrate with email service (Resend, SendGrid, nodemailer, etc.)
    // Example with Resend:
    // await resend.emails.send({
    //   from: "contact@pouyakarimi.dev",
    //   to: "pouya@yourdomain.com",
    //   subject: `New inquiry from ${data.name}`,
    //   html: `<p><b>Service:</b> ${data.service}</p><p><b>Email:</b> ${data.email}</p><p>${data.message}</p>`,
    // });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: err.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
