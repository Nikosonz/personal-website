"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { LogOut, FileText, PlusCircle, Inbox, LayoutDashboard, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function NavLink({ href, icon: Icon, children }: { href: string; icon: LucideIcon; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        pathname === href
          ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
          : "text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]"
      )}
    >
      <Icon size={15} />
      {children}
    </Link>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-dvh bg-[var(--background)]">
      <aside className="w-56 shrink-0 border-e border-[var(--border)] bg-[var(--surface)] flex flex-col">
        <div className="px-5 py-5 border-b border-[var(--border)]">
          <span className="font-heading text-base font-bold text-[var(--text-primary)]">
            Admin
          </span>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          <NavLink href="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
          <NavLink href="/admin/posts" icon={FileText}>Posts</NavLink>
          <NavLink href="/admin/posts/new" icon={PlusCircle}>New Post</NavLink>
          <NavLink href="/admin/messages" icon={Inbox}>Messages</NavLink>
        </nav>
        <div className="p-3 border-t border-[var(--border)]">
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
