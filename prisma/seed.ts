import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { marked } from "marked";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

async function main() {
  const adminEmail = "pouyakarimibirgani@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is required for seeding.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  console.log(`✓ Admin user seeded: ${adminEmail}`);

  if (!fs.existsSync(POSTS_DIR)) {
    console.log("No content/blog directory — skipping post seed.");
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    // A "-fa" filename (or rtl frontmatter) marks the Farsi translation. Strip the
    // suffix so en & fa share one slug, distinguished by locale.
    const isFa = /-fa\.mdx$/.test(file) || data.dir === "rtl";
    const locale = isFa ? "fa" : "en";
    const dir = isFa ? "rtl" : "ltr";
    const slug = file.replace(/-fa\.mdx$/, "").replace(/\.mdx$/, "");

    const html = await marked.parse(content);

    const publishedAt = data.date ? new Date(data.date) : new Date();

    await prisma.post.upsert({
      where: { slug_locale: { slug, locale } },
      update: {
        title: data.title ?? slug,
        excerpt: data.excerpt ?? "",
        content: html,
        tags: data.tags ?? [],
        dir,
        draft: false,
        publishedAt,
      },
      create: {
        slug,
        locale,
        title: data.title ?? slug,
        excerpt: data.excerpt ?? "",
        content: html,
        tags: data.tags ?? [],
        dir,
        draft: false,
        publishedAt,
      },
    });

    console.log(`✓ Post seeded: ${slug} (${locale})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
