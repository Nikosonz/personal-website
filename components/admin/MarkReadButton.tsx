"use client";

import { markMessageRead } from "@/app/actions/messages";

export default function MarkReadButton({ id }: { id: string }) {
  return (
    <button
      onClick={() => markMessageRead(id)}
      className="rounded-full bg-[var(--accent)] px-2.5 py-0.5 text-xs font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
    >
      Mark read
    </button>
  );
}
