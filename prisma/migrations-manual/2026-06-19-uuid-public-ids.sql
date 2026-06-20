-- Production hardening WS1 — non-enumerable public IDs + role.
-- Run in the Neon SQL console BEFORE deploying the matching code (local Prisma
-- can't reach Neon). Additive + backward-compatible: existing deployments keep
-- working against these columns, so there's no downtime window.
--
-- gen_random_uuid() is built into Postgres 13+ (Neon). ADD COLUMN ... DEFAULT
-- backfills every existing row in one statement.

-- User: public UUID + role
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "publicId" UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT 'admin';
CREATE UNIQUE INDEX IF NOT EXISTS "User_publicId_key" ON "User"("publicId");

-- Post: public UUID (used in admin edit/API URLs instead of the Int PK)
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "publicId" UUID NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS "Post_publicId_key" ON "Post"("publicId");

-- ContactMessage: public UUID (used by the mark-read action)
ALTER TABLE "ContactMessage" ADD COLUMN IF NOT EXISTS "publicId" UUID NOT NULL DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS "ContactMessage_publicId_key" ON "ContactMessage"("publicId");

-- Verify every row is populated (all three should return 0):
-- SELECT count(*) FROM "User"           WHERE "publicId" IS NULL;
-- SELECT count(*) FROM "Post"           WHERE "publicId" IS NULL;
-- SELECT count(*) FROM "ContactMessage" WHERE "publicId" IS NULL;
