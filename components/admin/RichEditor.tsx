"use client";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon, ImageIcon, Minus,
  AlignLeft, AlignRight, Code2, ExternalLink, Pencil, Unlink,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Dir = "ltr" | "rtl";

interface Props {
  value: string;
  onChange: (html: string) => void;
  dir: Dir;
  onDirChange: (dir: Dir) => void;
}

function ToolbarBtn({
  onClick, active, children, title,
}: {
  onClick: () => void; active?: boolean; children: React.ReactNode; title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`flex h-7 w-7 items-center justify-center rounded text-xs transition-colors cursor-pointer ${
        active
          ? "bg-[var(--accent)] text-white"
          : "text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichEditor({ value, onChange, dir, onDirChange }: Props) {
  const [sourceMode, setSourceMode] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your post content here…" }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[400px] px-4 py-3 focus:outline-none text-[var(--text-primary)] [&_a]:text-[var(--accent)] [&_code]:bg-[var(--accent-subtle)] [&_code]:px-1 [&_code]:rounded [&_blockquote]:border-s-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:ps-4 [&_blockquote]:italic [&_blockquote]:text-[var(--text-muted)]",
      },
    },
  });

  if (!editor) return null;

  // Add or edit a link. Pre-fills the prompt with the current href when editing;
  // empty input removes the link.
  function applyLink(initial = "") {
    const url = window.prompt("Link URL", initial);
    if (url === null) return; // cancelled
    if (url.trim() === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    const allowed = /^(https?:\/\/|mailto:|\/)/i;
    if (!allowed.test(url)) {
      alert("Only http, https, mailto, and relative URLs are allowed.");
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function insertImage() {
    const file = await pickFile();
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error ?? "Image upload failed.");
      return;
    }
    // Prompt for alt text on insert (SEO + accessibility). Empty is allowed
    // for decorative images.
    const alt = window.prompt("Alt text (describe the image for SEO & screen readers)", "") ?? "";
    editor!.chain().focus().setImage({ src: data.url, alt }).run();
  }

  // Edit the alt text of the currently-selected image.
  function editImageAlt() {
    const current = (editor!.getAttributes("image").alt as string) ?? "";
    const alt = window.prompt("Alt text", current);
    if (alt === null) return; // cancelled
    editor!.chain().focus().updateAttributes("image", { alt }).run();
  }

  function pickFile(): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => resolve(input.files?.[0] ?? null);
      input.click();
    });
  }

  const t = editor;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 border-b border-[var(--border)] px-2 py-1.5">
        <ToolbarBtn title="Bold" active={t.isActive("bold")} onClick={() => t.chain().focus().toggleBold().run()}>
          <Bold size={13} />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" active={t.isActive("italic")} onClick={() => t.chain().focus().toggleItalic().run()}>
          <Italic size={13} />
        </ToolbarBtn>
        <ToolbarBtn title="Underline" active={t.isActive("underline")} onClick={() => t.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={13} />
        </ToolbarBtn>
        <div className="w-px h-5 self-center bg-[var(--border)] mx-1" />
        <ToolbarBtn title="Heading 2" active={t.isActive("heading", { level: 2 })} onClick={() => t.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={13} />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={t.isActive("heading", { level: 3 })} onClick={() => t.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={13} />
        </ToolbarBtn>
        <div className="w-px h-5 self-center bg-[var(--border)] mx-1" />
        <ToolbarBtn title="Bullet list" active={t.isActive("bulletList")} onClick={() => t.chain().focus().toggleBulletList().run()}>
          <List size={13} />
        </ToolbarBtn>
        <ToolbarBtn title="Ordered list" active={t.isActive("orderedList")} onClick={() => t.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={13} />
        </ToolbarBtn>
        <ToolbarBtn title="Blockquote" active={t.isActive("blockquote")} onClick={() => t.chain().focus().toggleBlockquote().run()}>
          <Quote size={13} />
        </ToolbarBtn>
        <ToolbarBtn title="Code" active={t.isActive("code")} onClick={() => t.chain().focus().toggleCode().run()}>
          <Code size={13} />
        </ToolbarBtn>
        <ToolbarBtn title="Divider" onClick={() => t.chain().focus().setHorizontalRule().run()}>
          <Minus size={13} />
        </ToolbarBtn>
        <div className="w-px h-5 self-center bg-[var(--border)] mx-1" />
        <ToolbarBtn title="Link" active={t.isActive("link")} onClick={() => applyLink(t.getAttributes("link").href ?? "")}>
          <LinkIcon size={13} />
        </ToolbarBtn>
        <ToolbarBtn title="Image" onClick={insertImage}>
          <ImageIcon size={13} />
        </ToolbarBtn>
        <div className="w-px h-5 self-center bg-[var(--border)] mx-1" />
        <ToolbarBtn title="Left-to-right" active={dir === "ltr"} onClick={() => onDirChange("ltr")}>
          <AlignLeft size={13} />
        </ToolbarBtn>
        <ToolbarBtn title="Right-to-left (Persian)" active={dir === "rtl"} onClick={() => onDirChange("rtl")}>
          <AlignRight size={13} />
        </ToolbarBtn>
        <div className="w-px h-5 self-center bg-[var(--border)] mx-1" />
        <ToolbarBtn
          title="Edit raw HTML"
          active={sourceMode}
          onClick={() => {
            // Leaving source mode: push the edited HTML back into the editor
            if (sourceMode) editor!.commands.setContent(value || "");
            setSourceMode((s) => !s);
          }}
        >
          <Code2 size={13} />
        </ToolbarBtn>
      </div>
      {sourceMode ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          className="w-full min-h-[400px] px-4 py-3 font-mono text-xs text-[var(--text-primary)] bg-[var(--surface)] outline-none resize-y"
          placeholder="<p>Edit the post's raw HTML…</p>"
        />
      ) : (
        <div dir={dir} className={cn(dir === "rtl" && "font-farsi")}>
          <EditorContent editor={editor} />
          {/* Popup shown when the caret is inside a link */}
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor }) => editor.isActive("link")}
            className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 shadow-lg"
          >
            <a
              href={t.getAttributes("link").href}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="max-w-[180px] truncate text-xs text-[var(--accent)] underline"
            >
              {t.getAttributes("link").href}
            </a>
            <span className="w-px h-4 bg-[var(--border)]" />
            <ToolbarBtn title="Open in new tab" onClick={() => window.open(t.getAttributes("link").href, "_blank", "noopener")}>
              <ExternalLink size={13} />
            </ToolbarBtn>
            <ToolbarBtn title="Edit link" onClick={() => applyLink(t.getAttributes("link").href ?? "")}>
              <Pencil size={13} />
            </ToolbarBtn>
            <ToolbarBtn title="Remove link" onClick={() => t.chain().focus().extendMarkRange("link").unsetLink().run()}>
              <Unlink size={13} />
            </ToolbarBtn>
          </BubbleMenu>
          {/* Popup shown when an image is selected — view/edit its alt text */}
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor }) => editor.isActive("image")}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 shadow-lg"
          >
            <span className="max-w-[200px] truncate text-xs text-[var(--text-muted)]" dir="auto">
              {t.getAttributes("image").alt
                ? `alt: ${t.getAttributes("image").alt}`
                : "no alt text — bad for SEO"}
            </span>
            <span className="w-px h-4 bg-[var(--border)]" />
            <ToolbarBtn title="Edit alt text" onClick={editImageAlt}>
              <Pencil size={13} />
            </ToolbarBtn>
          </BubbleMenu>
        </div>
      )}
    </div>
  );
}
