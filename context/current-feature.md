# Current Feature

<!-- Feature Name and short description-->

**Prisma + Neon PostgreSQL Setup** - Set up Prisma 7 ORM with a serverless Neon PostgreSQL database and create the initial schema from the data models in `context/project-overview.md`.

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Use Neon PostgreSQL (serverless)
- Install and configure Prisma 7 (`prisma-client` generator with required `output`, `prisma.config.ts`, driver adapter)
- Create the initial schema based on the data models in `context/project-overview.md` (this will evolve)
- Include NextAuth models (`Account`, `Session`, `VerificationToken`)
- Add appropriate indexes and cascade deletes
- Create the initial migration with `prisma migrate dev` (never `db push`)
- Add a Prisma client singleton in `src/lib/db.ts`

## Notes

<!-- Any extra notes -->

- Spec: `context/features/database-spec.md`
- Prisma 7 has breaking changes. Read the upgrade guide before implementing: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Setup guide: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- `DATABASE_URL` points to the Neon development branch; a separate production branch will exist. Always create migrations, never push directly unless specified.
- Prisma 7 does not load env vars automatically (use `dotenv`), and `migrate dev` no longer runs `prisma generate` or seeding automatically.

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Next.js setup** (Completed) - Scaffolded with Create Next App (Next.js 16, React 19, TypeScript, Tailwind CSS v4, ESLint). Removed boilerplate assets and starter page content, and added the `context/` docs (project overview, coding standards, AI interaction, current feature).
- **Dashboard UI Phase 1** (Completed) - Initialized shadcn/ui (`base-nova` preset on Base UI) with `button`, `input` and `kbd` components. Added the `/dashboard` route with a dark-by-default layout, a top bar (logo, search with ⌘K hint, "New collection" and "New item" buttons, display only), and placeholder sidebar and main areas. Fixed the self-referencing `--font-sans` variable from shadcn init to use Geist fonts.
- **Dashboard UI Phase 2** (Completed) - Added the shadcn `sidebar`, `avatar` and `collapsible` components (plus `sheet`, `tooltip`, `separator`, `skeleton`). Built a full-height, collapsible sidebar (icon mode, state persisted in a cookie, `⌘\` shortcut) with the logo, a collapse/expand toggle above Types, item types linking to `/items/[slug]` with item counts and a lock on Pro-only types, a collapsible "Collections" section with starred favorites and the 5 most recent collections (with item counts), and a user avatar area at the bottom. On mobile the sidebar is always a drawer opened from the top bar. Data comes from `src/lib/mock-data.ts` (added `updatedAt` to collections). Rewrote `use-mobile` with `useSyncExternalStore` to satisfy lint.
- **Dashboard UI Phase 3** (Completed) - Added the shadcn `card` and `badge` components. Built the main dashboard area (all server components) with a header, 4 stats cards (items, collections, favorite items, favorite collections), a "Recent collections" grid (up to 8, type-tinted cards with favorite star, type icons and item counts), "Pinned" items and up to 10 "Recent items". Item cards have a left border in the type color, type icon, pin/favorite markers, tags and date. Sections share a header with count badge, "View all" link and empty state. Type colors are applied through a `--type-color` CSS variable. Added `getItemTypeById` to `src/lib/mock-data.ts`.
- **Prisma + Neon PostgreSQL Setup** (Completed) - Installed Prisma `7.10.0` (pinned — npm's `latest` currently points at the `8.0.0-rc` line), `@prisma/adapter-pg`, `dotenv` and `tsx`. Added `prisma.config.ts` (Prisma 7 replacement for schema-level datasource config: schema path, migrations path, seed command, and the `DIRECT_URL` datasource with an optional shadow database). Wrote `prisma/schema.prisma` from §5.1 of the project overview — NextAuth models (`Account`, `Session`, `VerificationToken`), `User` with `Plan` enum and Stripe fields, `ItemType`, `Item`, `Collection`, `ItemCollection` and `Tag`, with user-scoped compound indexes and explicit `onDelete` rules. `searchVector` is deliberately deferred to the search milestone. Created the `20260919073303_init` migration with `--create-only`, hand-added the partial unique index `ItemType_system_slug_key ON "ItemType"("slug") WHERE "userId" IS NULL` (§5.3 — the compound unique cannot constrain system types because Postgres treats every NULL as distinct), then applied it. Added an idempotent `prisma/seed.ts` upserting the 7 system item types via find-then-write (Prisma `upsert` cannot target a partial index). Added the client singleton `src/lib/db.ts` using the required `PrismaPg` driver adapter on the pooled `DATABASE_URL`. Env split: `DATABASE_URL` pooled for runtime, `DIRECT_URL` unpooled for the CLI, documented in a committed `.env.example`. Gitignored `/src/generated`, added a `postinstall: prisma generate` script plus `db:*` scripts, and ESLint-ignored the generated client.
