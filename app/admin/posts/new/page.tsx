import PostForm from "@/components/admin/PostForm";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function NewPostPage() {
  return (
    <div>
      <Breadcrumb items={[{ label: "Admin" }, { label: "Posts", href: "/admin/posts" }, { label: "New Post" }]} />
      <h1 className="font-heading text-2xl font-bold text-[var(--text-primary)] mb-8">New Post</h1>
      <PostForm />
    </div>
  );
}
