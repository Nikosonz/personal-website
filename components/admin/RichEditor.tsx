"use client";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Underline as UnderlineIcon, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link as LinkIcon, ImageIcon, Minus,
  AlignLeft, AlignRight, Code2,
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

  function insertLink() {
    const url = window.prompt("URL");
    if (!url) return;
    const allowed = /^(https?:\/\/|mailto:|\/)/i;
    if (!allowed.test(url)) {
      alert("Only http, https, mailto, and relative URLs are allowed.");
      return;
    }
    editor!.chain().focus().setLink({ href: url }).run();
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
    editor!.chain().focus().setImage({ src: data.url }).run();
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
        <ToolbarBtn title="Link" active={t.isActive("link")} onClick={insertLink}>
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
        </div>
      )}
    </div>
  );
}
