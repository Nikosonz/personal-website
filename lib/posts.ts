// Re-export from lib/server/posts — kept for backward compatibility with any tooling
export type { Post } from "./server/posts";
export {
  getAllPublishedPosts,
  getAllPosts,
  getPostBySlug,
  getPostById,
} from "./server/posts";
