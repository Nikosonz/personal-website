import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <ChevronRight size={12} className="shrink-0 opacity-50" />}
            {isLast || !item.href ? (
              <span className={isLast ? "text-[var(--text-primary)] font-medium" : ""}>
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-[var(--accent)] transition-colors duration-150"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
