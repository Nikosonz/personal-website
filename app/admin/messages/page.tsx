import { prisma } from "@/lib/db";
import MarkReadButton from "@/components/admin/MarkReadButton";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">Messages</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {messages.length} total · {unread} unread
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No messages yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-5 transition-colors ${
                msg.read
                  ? "border-[var(--border)] bg-[var(--surface)]"
                  : "border-[var(--accent)]/30 bg-[var(--accent-subtle)]"
              }`}
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{msg.name}</p>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2.5 py-0.5 text-xs text-[var(--text-muted)]">
                    {msg.service}
                  </span>
                  <time className="text-xs text-[var(--text-muted)]">
                    {new Date(msg.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  {!msg.read && <MarkReadButton id={msg.id} />}
                </div>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-muted)]">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
