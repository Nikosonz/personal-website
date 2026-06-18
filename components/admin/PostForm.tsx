"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/server/posts";

type Dir = "ltr" | "rtl";

const RichEditor = dynamic(() => import("./RichEditor"), { ssr: false });

interface Props {
  post?: Post;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default function PostForm({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [tags, setTags] = useState(post?.tags?.join(", ") ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [dir, setDir] = useState<Dir>((post?.dir as Dir) ?? "ltr");
  const [draft, setDraft] = useState(post?.draft ?? true);
  const [coverUrl, setCoverUrl] = useState(post?.coverImageUrl ?? "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription ?? "");
  const [ogTitle, setOgTitle] = useState(post?.ogTitle ?? "");
  const [ogDescription, setOgDescription] = useState(post?.ogDescription ?? "");
  const [ogImage, setOgImage] = useState(post?.ogImage ?? "");
  const [jsonLd, setJsonLd] = useState(post?.jsonLd ?? "");
  const [headHtml, setHeadHtml] = useState(post?.headHtml ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const coverRef = useRef<HTMLInputElement>(null);
  const ogImageRef = useRef<HTMLInputElement>(null);

  // Non-blocking validity hint for the JSON-LD field
  let jsonLdInvalid = false;
  if (jsonLd.trim()) {
    try { JSON.parse(jsonLd); } catch { jsonLdInvalid = true; }
  }

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!post) setSlug(slugify(v));
  }

  async function uploadImage(file: File, setUrl: (url: string) => void) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Image upload failed.");
    } else {
      setUrl(data.url);
    }
    setUploading(false);
  }

  // Persist the post (create or update). Returns the saved id+slug, or null on error.
  async function save(): Promise<{ id: number; slug: string } | null> {
    setError("");
    const body = {
      title,
      slug,
      excerpt,
      content,
      dir,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      coverImageUrl: coverUrl || null,
      metaDescription: metaDescription || null,
      ogTitle: ogTitle || null,
      ogDescription: ogDescription || null,
      ogImage: ogImage || null,
      jsonLd: jsonLd || null,
      headHtml: headHtml || null,
      draft,
    };

    const url = post ? `/api/admin/posts/${post.id}` : "/api/admin/posts";
    const method = post ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save post.");
      return null;
    }
    const saved = await res.json().catch(() => ({}));
    return { id: saved.id ?? post?.id, slug: saved.slug ?? slug };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const saved = await save();
    setSaving(false);
    if (!saved) return;
    router.push("/admin/posts");
    router.refresh();
  }

  // Save first (so the preview matches the form), then open the real blog page
  // in Draft Mode in a new tab.
  async function handlePreview() {
    if (!slug) { setError("Add a slug before previewing."); return; }
    setSaving(true);
    const saved = await save();
    setSaving(false);
    if (!saved) return;
    const previewLocale = dir === "rtl" ? "fa" : "en";
    window.open(
      `/api/draft?slug=${encodeURIComponent(saved.slug)}&locale=${previewLocale}`,
      "_blank"
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">Title</label>
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          dir={dir}
          className={cn(
            "rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors",
            dir === "rtl" && "font-farsi"
          )}
          placeholder="Post title"
        />
      </div>

      {/* Slug */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          required
          dir="ltr"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors"
          placeholder="post-slug (Latin letters, e.g. ai-consulting)"
        />
      </div>

      {/* Excerpt */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">Excerpt</label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          required
          rows={3}
          dir={dir}
          className={cn(
            "rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors resize-none",
            dir === "rtl" && "font-farsi"
          )}
          placeholder="Short description for the post card"
        />
      </div>

      {/* Cover image */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">Cover image</label>
        {coverUrl ? (
          <div className="relative w-fit">
            <img src={coverUrl} alt="cover" className="h-40 rounded-xl object-cover border border-[var(--border)]" />
            <button
              type="button"
              onClick={() => setCoverUrl("")}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverRef.current?.click()}
            disabled={uploading}
            className="flex h-32 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--border)] text-sm text-[var(--text-muted)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors cursor-pointer disabled:opacity-60"
          >
            <ImageIcon size={16} />
            {uploading ? "Uploading…" : "Click to upload cover image"}
          </button>
        )}
        <input
          ref={coverRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], setCoverUrl)}
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">Tags</label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors"
          placeholder="AI, Design, Engineering (comma-separated)"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--text-primary)]">Content</label>
        <RichEditor value={content} onChange={setContent} dir={dir} onDirChange={setDir} />
      </div>

      {/* SEO & Social panel */}
      <details className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)] select-none">
          SEO &amp; Social <span className="font-normal text-[var(--text-muted)]">— optional, advanced</span>
        </summary>

        <div className="mt-5 flex flex-col gap-6">
          {/* Meta description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Meta description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              dir={dir}
              className={cn(
                "rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors resize-none",
                dir === "rtl" && "font-farsi"
              )}
              placeholder="Search-result snippet. Falls back to the excerpt if left blank."
            />
          </div>

          {/* Custom head HTML */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Custom head HTML</label>
            <textarea
              value={headHtml}
              onChange={(e) => setHeadHtml(e.target.value)}
              rows={4}
              spellCheck={false}
              dir="ltr"
              className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors resize-y"
              placeholder={'<meta name="..." content="...">\n<link rel="...">\n<script>…</script>'}
            />
            <p className="text-xs text-[var(--text-muted)]">Injected verbatim on the post page. Best for verification or analytics tags.</p>
          </div>

          {/* Structured data (JSON-LD) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Structured data (JSON-LD)</label>
            <textarea
              value={jsonLd}
              onChange={(e) => setJsonLd(e.target.value)}
              rows={5}
              spellCheck={false}
              dir="ltr"
              className={cn(
                "rounded-xl border bg-[var(--background)] px-3.5 py-2.5 text-xs font-mono text-[var(--text-primary)] outline-none focus:ring-2 transition-colors resize-y",
                jsonLdInvalid
                  ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/20"
              )}
              placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  …\n}'}
            />
            {jsonLdInvalid && <p className="text-xs text-red-500">Not valid JSON — it won&apos;t be rendered on the page until fixed.</p>}
          </div>

          {/* OG title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Social title (OG)</label>
            <input
              value={ogTitle}
              onChange={(e) => setOgTitle(e.target.value)}
              dir={dir}
              className={cn(
                "rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors",
                dir === "rtl" && "font-farsi"
              )}
              placeholder="Falls back to the post title."
            />
          </div>

          {/* OG description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Social description (OG)</label>
            <textarea
              value={ogDescription}
              onChange={(e) => setOgDescription(e.target.value)}
              rows={2}
              dir={dir}
              className={cn(
                "rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors resize-none",
                dir === "rtl" && "font-farsi"
              )}
              placeholder="Falls back to the meta description / excerpt."
            />
          </div>

          {/* OG image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-primary)]">Social image (OG)</label>
            <div className="flex items-center gap-2">
              <input
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                dir="ltr"
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-colors"
                placeholder="Image URL — falls back to the cover image."
              />
              <button
                type="button"
                onClick={() => ogImageRef.current?.click()}
                disabled={uploading}
                className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-colors cursor-pointer disabled:opacity-60"
              >
                {uploading ? "Uploading…" : "Upload"}
              </button>
              <input
                ref={ogImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0], setOgImage)}
              />
            </div>
            {ogImage && <img src={ogImage} alt="OG preview" className="mt-1 h-28 w-fit rounded-lg object-cover border border-[var(--border)]" />}
          </div>
        </div>
      </details>

      {/* Draft toggle */}
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={!draft}
          onChange={(e) => setDraft(!e.target.checked)}
          className="h-4 w-4 rounded accent-[var(--accent)]"
        />
        <span className="text-sm text-[var(--text-primary)]">Publish (uncheck to save as draft)</span>
      </label>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60 cursor-pointer"
        >
          {saving ? "Saving…" : post ? "Update post" : "Create post"}
        </button>
        <button
          type="button"
          onClick={handlePreview}
          disabled={saving}
          title="Saves, then opens the live page in a new tab (Draft Mode)"
          className="rounded-xl border border-[var(--accent)]/40 bg-[var(--accent-subtle)] px-5 py-2.5 text-sm font-semibold text-[var(--accent)] hover:border-[var(--accent)] transition-colors disabled:opacity-60 cursor-pointer"
        >
          Save &amp; Preview
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
