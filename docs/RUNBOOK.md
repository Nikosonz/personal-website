# Production Runbook — pouyakarimi.ir

Operational playbook for the live site. Deploy is **git push to `master`** →
Vercel auto-builds and promotes (the Vercel CLI is blocked from Iran; never
rely on `vercel --prod`). DB schema changes go through the **Neon SQL console**
(local Prisma can't reach Neon).

---

## Health check

`GET https://pouyakarimi.ir/api/health`

- `200 {"status":"ok"}` — app up, DB reachable.
- `503 {"status":"error"}` — app up but DB unreachable (bad/missing
  `POSTGRES_PRISMA_URL`, Neon down, pool exhausted).
- Connection refused / timeout — deployment itself is down.

Run it right after every deploy as a smoke test:

```bash
curl -fsS https://pouyakarimi.ir/api/health && echo OK
```

---

## Signals that should trigger a rollback

Roll back when, after a deploy, any of these appear and aren't a trivial fix:

- `/api/health` returns non-200 (and env vars are correct).
- Sentry shows a **new** high-frequency issue or an error-rate spike (alert
  fires to email).
- Core pages (home, `/en/blog`, `/admin`) 500 or render the generic error
  screen.
- Contact form or admin login broken (test after deploy).

A bad deploy never needs a hotfix under pressure — **roll back first, debug
after.** Vercel keeps every prior deployment instantly promotable.

---

## Instant rollback (zero downtime)

Vercel deployments are immutable; promoting a previous one is an atomic switch
with no rebuild.

1. Vercel dashboard → project **personal-website** → **Deployments**.
2. Find the last **Ready** deployment from *before* the bad one (check the
   commit SHA against `git log`).
3. **⋯ menu → Promote to Production** (a.k.a. Instant Rollback).
4. Confirm. Traffic moves to it in seconds — no build wait.
5. Verify: `curl -fsS https://pouyakarimi.ir/api/health` + load the site.
6. Then fix forward on a branch; merge to `master` when green.

**Skew Protection** (enabled in Project → Settings → Advanced) keeps in-flight
clients on the asset version they started with during the switch, so no chunk
404s mid-deploy.

> Rolling back **code** does not roll back **DB schema**. All migrations here
> are additive/backward-compatible (see `prisma/migrations-manual/`), so a
> previous build keeps working against the newer schema. Never ship a
> destructive migration (DROP/rename) in the same deploy as the code that
> needs it — split across two deploys.

---

## Identical pre-prod (catch it before master)

Push to the **`staging`** branch → Vercel builds a Preview on the same config
and env. Test there (including `/<preview-url>/api/health`) before merging
`staging` → `master`. The Preview is byte-identical to what production will
run.

---

## Env vars (Vercel → Settings → Environment Variables)

| Var | Purpose | Missing →|
|---|---|---|
| `POSTGRES_PRISMA_URL` | Neon DB (Prisma) | `/api/health` 503, all data pages 500 |
| `SESSION_SECRET` | JWT signing | Admin login/session broken |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob uploads | Image upload returns "Upload failed." |
| `RESEND_API_KEY` | Contact email | Email skipped (non-fatal, still saves msg) |
| `UPSTASH_REDIS_REST_URL` / `_TOKEN` | Distributed rate limiting | Limiters fail open (allow traffic) |
| `NEXT_PUBLIC_SENTRY_DSN` | Error monitoring | No crash reports captured |

After changing an env var, **redeploy** (push an empty commit or use Vercel's
Redeploy) — env changes don't apply to existing deployments.

---

## DB schema change (Neon)

1. Write SQL in `prisma/migrations-manual/YYYY-MM-DD-<name>.sql` (additive only:
   `ADD COLUMN`, backfill, `CREATE INDEX` — no destructive ops in a live deploy).
2. Run it in the **Neon SQL console** first.
3. Update `prisma/schema.prisma` to match, commit, push → Vercel runs
   `prisma generate && next build`.
4. Verify `/api/health` + the affected feature.

---

## Quick reference

| Situation | Action |
|---|---|
| Site 500s after deploy | Instant Rollback → debug on branch |
| `/api/health` 503 | Check `POSTGRES_PRISMA_URL` + Neon status |
| Sentry alert, new issue | Triage; roll back if user-facing + frequent |
| Bad migration | Roll back code won't help — fix forward with additive SQL |
| Need to test a risky change | Push to `staging`, verify Preview first |
