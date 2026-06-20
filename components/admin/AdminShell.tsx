"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import {
  LogOut, FileText, PlusCircle, Inbox, LayoutDashboard,
  ChevronLeft, ChevronRight, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

function NavLink({
  href, icon: Icon, children, collapsed,
}: {
  href: string; icon: LucideIcon; children: React.ReactNode; collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      title={collapsed ? String(children) : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
          : "text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]"
      )}
    >
      <Icon size={15} className="shrink-0" />
      {!collapsed && <span>{children}</span>}
    </Link>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("admin_sidebar_open");
    if (stored !== null) setOpen(stored === "1");
  }, []);

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      localStorage.setItem("admin_sidebar_open", next ? "1" : "0");
      return next;
    });
  };

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="flex min-h-dvh bg-[var(--background)]">
      <aside
        className={cn(
          "shrink-0 border-e border-[var(--border)] bg-[var(--surface)] flex flex-col transition-[width] duration-200 overflow-hidden",
          open ? "w-56" : "w-14"
        )}
      >
        {/* Header + toggle */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-[var(--border)]">
          {open && (
            <span className="font-heading text-base font-bold text-[var(--text-primary)] px-1">Admin</span>
          )}
          <button
            onClick={toggle}
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] transition-colors",
              !open && "mx-auto"
            )}
          >
            {open ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-2 flex-1">
          <NavLink href="/admin" icon={LayoutDashboard} collapsed={!open}>Dashboard</NavLink>
          <NavLink href="/admin/posts" icon={FileText} collapsed={!open}>Posts</NavLink>
          <NavLink href="/admin/posts/new" icon={PlusCircle} collapsed={!open}>New Post</NavLink>
          <NavLink href="/admin/messages" icon={Inbox} collapsed={!open}>Messages</NavLink>
        </nav>

        <div className="p-2 border-t border-[var(--border)]">
          <form action={logoutAction}>
            <button
              type="submit"
              title={!open ? "Sign out" : undefined}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              <LogOut size={15} className="shrink-0" />
              {open && <span>Sign out</span>}
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
