# Current Feature

<!-- Feature Name and short description-->

**Seed Data** - Rewrite `prisma/seed.ts` to populate the database with sample data for development and demos: a demo user, the system item types, and 5 collections holding 18 items.

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Overwrite the existing `prisma/seed.ts` (currently seeds system item types only). It must stay idempotent — it runs on every fresh environment.
- Seed a demo user: `demo@devstash.io`, "Demo User", password `12345678` hashed with `bcryptjs` at 12 rounds, `emailVerified` set to the current date, on the free plan.
- Seed the 7 system item types (`userId: null`, `isSystem: true`) with the icons and colors in the spec.
- Seed 5 collections with a combined 18 items, all owned by the demo user:

  | Collection | Description | Items |
  | --- | --- | --- |
  | React Patterns | Reusable React patterns and hooks | 3 snippets (TypeScript) — custom hooks, component patterns, utility functions |
  | AI Workflows | AI prompts and workflow automations | 3 prompts — code review, documentation generation, refactoring |
  | DevOps | Infrastructure and deployment resources | 1 snippet (Docker/CI-CD), 1 command (deployment), 2 links |
  | Terminal Commands | Useful shell commands for everyday development | 4 commands — git, docker, process management, package managers |
  | Design Resources | UI/UX resources and references | 4 links — CSS/Tailwind, component libraries, design systems, icon libraries |

- Use real, working URLs for every `link` item.
- Set `language` on TEXT items so syntax highlighting has a hint (`tsx`, `bash`, …).
- Verify with `npm run db:seed` followed by `npm run db:test`, and confirm re-running the seed does not duplicate rows.

## Notes

<!-- Any extra notes -->

- Spec: `context/features/seed-spec.md`
- `bcryptjs` is not installed yet — add it (plus `@types/bcryptjs` if the package ships no types).
- **Conflicts between the spec and the current schema — resolved:**
  - The spec says `isPro: false` on the user. There is no `isPro` field; §5.2 of the project overview replaced it with the `plan` enum, and `src/lib/mock-data.ts` already models the user as `plan: "FREE"`. → **Use `plan: "FREE"`.**
  - The spec's type table gives lowercase singular names (`snippet`) and omits `slug`, `contentType`, `isProOnly` and `sortOrder`. `AppSidebar` renders `type.name` directly as the nav label and routes on `type.slug`. → **Keep capitalised names (`Snippet`) and plural slugs (`snippets`); take icons and colors from the spec's table, which already matches.**
  - The spec orders the types with file/image before link. → **Keep the project-overview order (link, file, image) so the two Pro-only types sort last and the sidebar's locked entries group together.**
- `upsert` cannot target the partial unique index on `("slug") WHERE "userId" IS NULL`, so system types use find-then-write. Items and collections can key off `@@unique([userId, name])` for collections; items have no natural unique key, so decide how the seed stays idempotent for them (clear the demo user's items first, or add a deterministic `id`).
- 5 collections and 18 items exceed the free-tier quota (3 collections, 50 items). That is fine while `BILLING_ENFORCED=false`, but the demo user will be over quota once billing is enforced.
- No `file` or `image` items are seeded, which is consistent — both types are Pro-only and need R2 uploads that do not exist yet.

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Next.js setup** (Completed) - Scaffolded with Create Next App (Next.js 16, React 19, TypeScript, Tailwind CSS v4, ESLint). Removed boilerplate assets and starter page content, and added the `context/` docs (project overview, coding standards, AI interaction, current feature).
- **Dashboard UI Phase 1** (Completed) - Initialized shadcn/ui (`base-nova` preset on Base UI) with `button`, `input` and `kbd` components. Added the `/dashboard` route with a dark-by-default layout, a top bar (logo, search with ⌘K hint, "New collection" and "New item" buttons, display only), and placeholder sidebar and main areas. Fixed the self-referencing `--font-sans` variable from shadcn init to use Geist fonts.
- **Dashboard UI Phase 2** (Completed) - Added the shadcn `sidebar`, `avatar` and `collapsible` components (plus `sheet`, `tooltip`, `separator`, `skeleton`). Built a full-height, collapsible sidebar (icon mode, state persisted in a cookie, `⌘\` shortcut) with the logo, a collapse/expand toggle above Types, item types linking to `/items/[slug]` with item counts and a lock on Pro-only types, a collapsible "Collections" section with starred favorites and the 5 most recent collections (with item counts), and a user avatar area at the bottom. On mobile the sidebar is always a drawer opened from the top bar. Data comes from `src/lib/mock-data.ts` (added `updatedAt` to collections). Rewrote `use-mobile` with `useSyncExternalStore` to satisfy lint.
- **Dashboard UI Phase 3** (Completed) - Added the shadcn `card` and `badge` components. Built the main dashboard area (all server components) with a header, 4 stats cards (items, collections, favorite items, favorite collections), a "Recent collections" grid (up to 8, type-tinted cards with favorite star, type icons and item counts), "Pinned" items and up to 10 "Recent items". Item cards have a left border in the type color, type icon, pin/favorite markers, tags and date. Sections share a header with count badge, "View all" link and empty state. Type colors are applied through a `--type-color` CSS variable. Added `getItemTypeById` to `src/lib/mock-data.ts`.
- **Prisma + Neon PostgreSQL Setup** (Completed) - Installed Prisma `7.10.0` (pinned — npm's `latest` currently points at the `8.0.0-rc` line), `@prisma/adapter-pg`, `dotenv` and `tsx`. Added `prisma.config.ts` (Prisma 7 replacement for schema-level datasource config: schema path, migrations path, seed command, and the `DIRECT_URL` datasource with an optional shadow database). Wrote `prisma/schema.prisma` from §5.1 of the project overview — NextAuth models (`Account`, `Session`, `VerificationToken`), `User` with `Plan` enum and Stripe fields, `ItemType`, `Item`, `Collection`, `ItemCollection` and `Tag`, with user-scoped compound indexes and explicit `onDelete` rules. `searchVector` is deliberately deferred to the search milestone. Created the `20260919073303_init` migration with `--create-only`, hand-added the partial unique index `ItemType_system_slug_key ON "ItemType"("slug") WHERE "userId" IS NULL` (§5.3 — the compound unique cannot constrain system types because Postgres treats every NULL as distinct), then applied it. Added an idempotent `prisma/seed.ts` upserting the 7 system item types via find-then-write (Prisma `upsert` cannot target a partial index). Added the client singleton `src/lib/db.ts` using the required `PrismaPg` driver adapter on the pooled `DATABASE_URL`. Env split: `DATABASE_URL` pooled for runtime, `DIRECT_URL` unpooled for the CLI, documented in a committed `.env.example`. Gitignored `/src/generated`, added a `postinstall: prisma generate` script plus `db:*` scripts, and ESLint-ignored the generated client.
- **Seed Data** (Completed) - Rewrote `prisma/seed.ts` from `context/features/seed-spec.md`. Installed `bcryptjs` (v3 ships its own types, so no `@types/bcryptjs`). Seeds a demo user (`demo@devstash.io` / "Demo User", password `12345678` hashed at 12 rounds, `emailVerified` now, `plan: FREE`), the 7 system item types, and 5 collections holding 18 items: React Patterns (3 TypeScript snippets), AI Workflows (3 prompts), DevOps (1 snippet, 1 command, 2 links), Terminal Commands (4 commands), Design Resources (4 links). All link URLs are real and were checked for a 200. Items carry tags, and a few are pinned or favorited so the dashboard's Pinned and favorites sections are not empty. Resolved three spec/schema conflicts in favour of the existing code: `isPro` → `plan: "FREE"`, capitalised type names with plural slugs (AppSidebar renders `name` and routes on `slug`), and the link-before-file/image sort order so Pro-only types group last. Idempotency: system types use find-then-write (`upsert` cannot target the partial unique index), the user is a true `upsert`, and the demo user's items/collections/tags are cleared then rebuilt since items have no natural unique key — running the seed twice leaves 1 user, 5 collections, 18 items, 29 tags.
