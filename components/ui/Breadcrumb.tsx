import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

// Escape `<` so a `</script>` in any label can't break out of the JSON-LD tag.
const ldJson = (s: string) => s.replace(/</g, "\\u003c");

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${SITE_URL}${item.href}` }),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: ldJson(JSON.stringify(breadcrumbSchema)) }}
      />
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
