-- Add per-locale blog posts: a `locale` column + (slug, locale) composite unique.
-- Run this in the Neon SQL console (local Prisma can't reach Neon) BEFORE
-- deploying the code that uses `locale`. It is backward-compatible with the
-- currently-deployed code, so there's no downtime window.

-- 1. Add the column with a safe default so existing rows stay valid.
ALTER TABLE "Post" ADD COLUMN "locale" TEXT NOT NULL DEFAULT 'en';

-- 2. Backfill: existing right-to-left posts are the Farsi ones.
UPDATE "Post" SET "locale" = 'fa' WHERE "dir" = 'rtl';

-- 3. Swap the slug-only unique index for a (slug, locale) composite, so the
--    English and Farsi versions of a post can share one slug.
DROP INDEX "Post_slug_key";
CREATE UNIQUE INDEX "Post_slug_locale_key" ON "Post" ("slug", "locale");
