"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/10";

export default function ContactForm({ locale: _locale }: { locale: string }) {
  const t = useTranslations("contact.form");
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
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, company: honeypotRef.current?.value ?? "" }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setServerError(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent-subtle)] p-12 text-center">
        <CheckCircle size={40} className="text-[var(--accent)]" />
        <p className="font-semibold text-[var(--text-primary)]">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">{t("name")}</label>
        <input
          {...register("name")}
          placeholder={t("name")}
          className={cn(inputClass, errors.name && "border-red-500")}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">{t("email")}</label>
        <input
          {...register("email")}
          type="email"
          placeholder="you@example.com"
          className={cn(inputClass, errors.email && "border-red-500")}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {/* Service */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">{t("service")}</label>
        <select
          {...register("service")}
          className={cn(inputClass, errors.service && "border-red-500")}
          defaultValue=""
        >
          <option value="" disabled>
            {t("service_placeholder")}
          </option>
          {(["web", "uiux", "ai", "consulting", "other"] as const).map((key) => (
            <option key={key} value={key}>
              {t(`services.${key}`)}
            </option>
          ))}
        </select>
        {errors.service && <p className="text-xs text-red-500">{errors.service.message}</p>}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">{t("message")}</label>
        <textarea
          {...register("message")}
          rows={5}
          placeholder={t("message_placeholder")}
          className={cn(inputClass, "resize-none", errors.message && "border-red-500")}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
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
  );
}
