-- Run in the Neon SQL console BEFORE deploying the matching code (local Prisma
-- can't reach Neon). Additive + backward-compatible: existing deployments keep
-- working, so there's no downtime window. All statements are idempotent.

-- WS B: alt text for cover + OG images
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "coverImageAlt" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "ogImageAlt" TEXT;

-- WS A: per-post view counter
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;

-- WS A: page-level view tracking
CREATE TABLE IF NOT EXISTS "PageView" (
  "id"        SERIAL       PRIMARY KEY,
  "path"      TEXT         NOT NULL,
  "locale"    TEXT         NOT NULL,
  "referrer"  TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView" ("createdAt");
CREATE INDEX IF NOT EXISTS "PageView_path_idx"      ON "PageView" ("path");

-- Verify (should return 0 for all)
-- SELECT COUNT(*) FROM "Post"     WHERE "coverImageAlt" IS NOT NULL;
-- SELECT COUNT(*) FROM "Post"     WHERE "viewCount"     != 0;
-- SELECT COUNT(*) FROM "PageView";
