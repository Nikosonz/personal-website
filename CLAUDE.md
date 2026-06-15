@AGENTS.md

# Project: Pouya Karimi — Personal Portfolio & CMS

Personal website and freelance portfolio for Pouya Karimi (full-stack developer / UI designer / AI consultant, based in Iran). Live at **pouyakarimi.ir**, deployed on Vercel.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 — App Router, Turbopack |
| Language | TypeScript (strict) |
| UI | React 19, Tailwind CSS v4, Framer Motion, Lucide React |
| Database | Neon PostgreSQL via Prisma 7 + PrismaPg adapter |
| Auth | JWT sessions (jose, HS256, 7-day, httpOnly cookie) |
| i18n | next-intl 4.x — English + Farsi (fa) |
| Email | Resend (free tier, `onboarding@resend.dev` sender) |
| Storage | Vercel Blob (`@vercel/blob`) for image uploads |
| Deployment | Vercel — `vercel --prod` from project root |

---

## Directory Layout

```
app/
  [locale]/          # Public localized pages (en, fa)
  admin/             # CMS — separate root layout, no locale prefix
    layout.tsx       # Renders AdminShell; auth is handled here, NOT per-page
    login/
    posts/           # List, new, [id] edit
    messages/        # Contact form inbox
  api/
    contact/         # POST — saves ContactMessage + sends Resend email
    admin/posts/     # CRUD for blog posts
    admin/upload/    # Vercel Blob image upload
  actions/
    auth.ts          # loginAction, logoutAction (server actions)
    messages.ts      # markMessageRead (server action)

components/
  admin/             # AdminShell, PostForm, RichEditor, DeletePostButton, MarkReadButton
  ui/                # FadeIn, Button, Badge, Breadcrumb, SocialIcons, ThemeProvider…
  sections/          # Homepage sections (Hero, ServicesStrip, BlogPreview, etc.)
  layout/            # Navbar, Footer
  blog/ contact/ portfolio/

lib/
  db.ts              # Re-export shim → lib/server/db (backward compat)
  server/db.ts       # Prisma singleton (PrismaPg adapter) — import from here
  session.ts         # encrypt, decrypt, createSession, deleteSession, verifySession
  utils.ts           # cn(), formatDate(), slugify(), extractHeadings()
  mdx.ts             # MDX processing pipeline
  posts.ts           # Public post reading utilities
  server/posts.ts    # Server-side post fetching
  generated/prisma/  # Auto-generated Prisma client — NEVER edit manually

prisma/
  schema.prisma      # Models: User, Post, ContactMessage
  migrations/        # Applied via prisma migrate dev

content/
  blog/              # .mdx files — gray-matter frontmatter + MDX body
  portfolio/         # .mdx case studies

messages/
  en.json            # English i18n strings
  fa.json            # Farsi i18n strings

i18n/
  routing.ts         # locales: ["en", "fa"], defaultLocale: "en"
  request.ts         # next-intl server config
```

---

## Database (Prisma 7 + Neon)

**Connection**: `POSTGRES_PRISMA_URL` (preferred) or `DATABASE_URL` env var.

**Models**:
```prisma
User             { id, email, passwordHash, createdAt }
Post             { id, slug, title, excerpt, content, coverImageUrl, tags[], draft, publishedAt, createdAt, updatedAt }
ContactMessage   { id, name, email, service, message, read, createdAt }
```

**After any schema change**:
```
npx prisma migrate dev --name <description>
npx prisma generate
```

The build script (`package.json`) runs `prisma generate && next build`, so Vercel always has the latest client. Never import from `lib/generated/prisma/` directly — always use `@/lib/db` or `@/lib/server/db`.

---

## Authentication

- Cookie named `session`, httpOnly, 7-day JWT (HS256), signed with `SESSION_SECRET` env var
- `lib/session.ts` exports: `encrypt`, `decrypt`, `createSession`, `deleteSession`, `verifySession`
- **There is no `getSession` export** — don't try to import it
- **Admin route protection lives in `middleware.ts`** (repo root). It cryptographically verifies the `session` cookie for every `/admin/:path*` route except `/admin/login`, redirecting to login otherwise. This is the real server-side gate. **`AdminShell` is a `"use client"` component and provides NO auth** — it only hides the sidebar on the login route. Admin pages therefore don't repeat the check; the middleware covers them. New admin pages are protected automatically by the matcher.
- API routes under `/api/admin/*` independently call `verifySession()` for defense in depth.
- Login: `POST /admin/login` → `loginAction` → `createSession` → redirect `/admin/posts`
- Logout: `logoutAction` → `deleteSession` → redirect `/admin/login`

---

## Admin Panel Conventions

- `AdminShell` (`components/admin/AdminShell.tsx`) is a `"use client"` component wrapping the entire admin area. It renders the sidebar nav with `NavLink` (active state via `usePathname`) and logout button. **It is UI only — it does not enforce auth; `middleware.ts` does (see Authentication).**
- Add new admin nav links inside `AdminShell` using the `NavLink` component — don't hardcode className strings.
- All admin data pages need `export const dynamic = "force-dynamic"` at the top.
- Interactive admin elements (delete buttons, mark-read, etc.) follow the thin `"use client"` wrapper pattern — see `DeletePostButton`, `MarkReadButton`.
- The admin layout has its own `<html><body>` — it does NOT use the locale layout or Navbar/Footer.

---

## i18n (next-intl 4.x)

- All public pages live under `app/[locale]/` and must validate the locale param:
  ```tsx
  const { locale } = await params;  // params is Promise<{locale: string}>
  if (!hasLocale(routing.locales, locale)) notFound();
  ```
- Translations fetched with `getTranslations({ locale, namespace: "..." })` in server components
- RTL layout for Farsi: `[dir="rtl"]` CSS handles font switching to Vazirmatn automatically
- Add new copy to both `messages/en.json` and `messages/fa.json`

---

## Design System

All colors use CSS custom properties — never hardcode hex values in className:

| Variable | Usage |
|---|---|
| `var(--background)` | Page background |
| `var(--surface)` | Card / sidebar background |
| `var(--border)` | Borders and dividers |
| `var(--text-primary)` | Body text |
| `var(--text-muted)` | Secondary / meta text |
| `var(--accent)` | Teal — primary interactive color |
| `var(--accent-hover)` | Hover state for accent |
| `var(--accent-subtle)` | Teal tint background (badges, hover fills) |

**Fonts** (imported in `globals.css`):
- `font-heading` → Archivo (bold headings)
- `font-body` → Space Grotesk (default body)
- `font-mono` → JetBrains Mono (code)
- `font-farsi` → Vazirmatn (Persian text)

**Tailwind v4 specifics**:
- `@import "tailwindcss"` in globals.css — no `@tailwind` directives
- No `tailwind.config.js` — custom tokens live in `@theme inline {}` in globals.css
- `cn()` from `@/lib/utils` for all conditional className merging (clsx + tailwind-merge)

---

## Key Patterns

**Server actions**: `"use server"` at top of file. Call `revalidatePath()` after mutations.

**Client-side interactivity**: Add `"use client"` only when needed (hooks, event handlers). Keep client components thin — they call server actions, not business logic.

**Async params** (Next.js 16): Route params and `cookies()` are Promises — always await:
```tsx
const { locale } = await params;
const store = await cookies();
```

**Concurrent async ops**: Use `Promise.allSettled` when ops are independent and one failure shouldn't block the other:
```ts
const [dbResult, emailResult] = await Promise.allSettled([dbOp, emailOp]);
if (dbResult.status === "rejected") throw dbResult.reason;
```

**Module-level singletons**: Clients that are expensive to construct (Resend, Prisma) should be module-level, not created per-request.

**formatDate**: Use `formatDate(date)` from `@/lib/utils` — don't inline `toLocaleDateString` calls.

**HTML escaping**: Always escape user input before interpolating into HTML strings (email templates, etc.).

---

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `POSTGRES_PRISMA_URL` | Yes | Neon DB connection (Prisma) |
| `DATABASE_URL` | Fallback | Alternative DB connection string |
| `SESSION_SECRET` | Yes | JWT signing key |
| `RESEND_API_KEY` | Optional | Email notifications for contact form |

Set via Vercel: `echo "value" | vercel env add VAR_NAME production` from inside `d:\Claude Code\Website`.

---

## Deployment

```bash
cd "d:\Claude Code\Website"  # Always run vercel commands from here, not home dir
vercel link                   # First time only — links to pouya-s-projects3/personal-website
vercel --prod                 # Deploy to pouyakarimi.ir
```

**Windows note**: Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once to allow global npm tools (`vercel`, `prisma`, etc.) in PowerShell. Or prefix with `npx`.

**Build process**: `prisma generate && next build` (defined in package.json). TypeScript must pass with 0 errors before deploying — verify with `npx tsc --noEmit`.

---

## Dev Journal

Daily dev logs live in a **separate repo** — never commit them to this website repo.

- **Local clone**: `D:\Journal`
- **Remote**: `https://github.com/Nikosonz/journal` (branch `main`, private)
- **Filename**: `YYYY-MM-DD.md` at the repo root (flat — no subfolders)
- **Format**: `# YYYY-MM-DD — Dev Log` → `## Project:` line → `## Tasks` (numbered `### N. ...`) → `## What I learned` → `## Next steps` (checkboxes). Match the previous day's entry.
- **Workflow**:
  ```bash
  cd "D:\Journal"
  # write YYYY-MM-DD.md
  git add . && git commit -m "YYYY-MM-DD log" && git push
  ```

---

## Content

**Blog posts**: MDX files in `content/blog/`. Gray-matter frontmatter. Syntax highlighting via rehype-pretty-code + shiki.

**Portfolio case studies**: MDX in `content/portfolio/`. Same pipeline.

**Admin CMS**: Blog posts can also be created/edited at `/admin/posts` — stored in the Neon DB (`Post` model), not as files.

---

## Contact Form Flow

1. Client (`ContactForm.tsx`): React Hook Form + Zod validation → `POST /api/contact`
2. API route: validates with Zod → concurrent `Promise.allSettled([prisma.create, resend.send])`
3. DB write is required (failure → 500). Email failure is non-fatal (logged, still returns 200).
4. Admin can view all messages at `/admin/messages`, mark them read.
5. Email sender: `Contact Form <onboarding@resend.dev>` (Resend free tier, no domain verification needed)
6. Recipient: `pouyakarimibirgani@gmail.com`

---

## Installed Claude Code Skills

Skills live in `C:\Users\mart\.claude\skills\` and are available as slash commands in any Claude Code session.

### claude-seo (v2.2.0)
SEO analysis plugin — 25 sub-skills, 18 specialist agents running in parallel.

| Command | Purpose |
|---|---|
| `/seo audit <url>` | Full site audit → `FULL-AUDIT-REPORT.md` (10–15 min) |
| `/seo page <url>` | Deep single-page evaluation |
| `/seo technical <url>` | Core Web Vitals, crawlability, performance |
| `/seo schema <url>` | Schema.org detection, validation, generation |
| `/seo geo <url>` | AI Overviews / GEO readiness |
| `/seo local <url>` | Google Business Profile analysis |
| `/seo content <url>` | E-E-A-T content quality scoring |
| `/seo backlinks <url>` | Link profile examination |
| `/seo google <cmd>` | GSC, PageSpeed, CrUX, GA4 integration |
| `/seo hreflang <url>` | International SEO / hreflang audit |

**Notes**: Playwright browsers not installed (optional) — page fetching uses WebFetch fallback. Install with `python -m playwright install chromium` for visual/SPA analysis. Source: `https://github.com/AgriciDaniel/claude-seo`
