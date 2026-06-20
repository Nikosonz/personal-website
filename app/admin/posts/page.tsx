import Link from "next/link";
import { getAllPosts } from "@/lib/server/posts";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { PlusCircle, Pencil } from "lucide-react";

export const dynamic = "force-dynamic";
import DeletePostButton from "@/components/admin/DeletePostButton";

export default async function AdminPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="max-w-4xl">
      <Breadcrumb items={[{ label: "Admin" }, { label: "Posts" }]} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)]">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors"
        >
          <PlusCircle size={15} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-[var(--text-muted)] text-sm">No posts yet. Create your first one.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{post.title}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {post.draft ? (
                    <span className="text-amber-500">Draft</span>
                  ) : (
                    <span className="text-emerald-500">Published</span>
                  )}
                  {" · "}
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", { dateStyle: "medium" })
                    : new Date(post.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/posts/${post.publicId}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)] transition-colors"
                >
                  <Pencil size={14} />
                </Link>
                <DeletePostButton id={post.publicId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
