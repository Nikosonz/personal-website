import { notFound } from "next/navigation";
import { getPostById } from "@/lib/server/posts";
import PostForm from "@/components/admin/PostForm";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(Number(id));
  if (!post) notFound();

  return (
    <div>
      <Breadcrumb items={[{ label: "Admin" }, { label: "Posts", href: "/admin/posts" }, { label: "Edit Post" }]} />
      <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-8">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}
