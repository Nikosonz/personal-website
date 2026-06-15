import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface PostMeta {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage?: string;
  readingTime: string;
  draft?: boolean;
}

export interface ProjectMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: "web" | "seo" | "ai" | "consulting";
  tags: string[];
  coverImage?: string;
  year: number;
  featured?: boolean;
  draft?: boolean;
}

function getFiles(dir: string): string[] {
  const fullDir = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullDir)) return [];
  return fs.readdirSync(fullDir).filter((f) => f.endsWith(".mdx"));
}

function parseFile<T>(dir: string, slug: string): { meta: T; content: string } {
  const filePath = path.join(CONTENT_DIR, dir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { meta: data as T, content };
}

// ─── Portfolio ────────────────────────────────────────────

export function getAllProjects(): ProjectMeta[] {
  return getFiles("portfolio")
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const { meta } = parseFile<Omit<ProjectMeta, "slug">>("portfolio", slug);
      return { ...meta, slug };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.year - a.year);
}

export function getProject(slug: string) {
  return parseFile<Omit<ProjectMeta, "slug">>("portfolio", slug);
}
