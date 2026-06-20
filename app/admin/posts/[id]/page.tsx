import { notFound } from "next/navigation";
import { getPostByPublicId } from "@/lib/server/posts";
import PostForm from "@/components/admin/PostForm";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const dynamic = "force-dynamic";

// The segment is a publicId (UUID), not the Int PK. Reject non-UUIDs up front so
// a malformed id 404s cleanly instead of throwing at the @db.Uuid column.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();
  const post = await getPostByPublicId(id);
  if (!post) notFound();

  return (
    <div>
      <Breadcrumb items={[{ label: "Admin" }, { label: "Posts", href: "/admin/posts" }, { label: "Edit Post" }]} />
      <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-8">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
