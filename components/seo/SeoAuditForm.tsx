"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  website: z.string().min(3),
  email: z.string().email(),
});
type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10";

// On-site SEO audit lead form. Reuses POST /api/contact (saved as a
// ContactMessage + emailed), so requests land in the existing /admin/messages
// inbox with no schema change. service="seo-audit"; the URL becomes the message.
export default function SeoAuditForm() {
  const t = useTranslations("seo_audit");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError(false);
    const url = /^https?:\/\//i.test(data.website) ? data.website : `https://${data.website}`;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          service: "seo-audit",
          message: `درخواست تحلیل رایگان سئو — وب‌سایت: ${url}`,
          company: honeypotRef.current?.value ?? "",
        }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setServerError(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-subtle)] p-10 text-center">
        <CheckCircle size={40} className="text-[var(--accent)]" />
        <p className="font-semibold text-[var(--text-primary)]">{t("success")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--surface)] p-6 sm:p-8">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
          <Search size={18} />
        </span>
        <div>
          <h2 className="font-heading text-xl font-bold text-[var(--text-primary)]">{t("title")}</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{t("subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Honeypot — hidden from humans; bots that fill it are silently rejected */}
        <input
          ref={honeypotRef}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">{t("name")}</label>
            <input {...register("name")} placeholder={t("name")} className={cn(inputClass, errors.name && "border-red-500")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">{t("email")}</label>
            <input {...register("email")} type="email" placeholder="you@example.com" dir="ltr" className={cn(inputClass, errors.email && "border-red-500")} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">{t("website")}</label>
          <input {...register("website")} placeholder="example.com" dir="ltr" className={cn(inputClass, errors.website && "border-red-500")} />
        </div>

        {serverError && <p className="text-sm text-red-500">{t("error")}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("sending")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      </form>
    </div>
  );
}
