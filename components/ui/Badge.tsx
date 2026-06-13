import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted";
}

const variantClasses = {
  default:
    "bg-[var(--border)] text-[var(--text-muted)]",
  accent:
    "bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent)]/20",
  muted:
    "border border-[var(--border)] text-[var(--text-muted)]",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
