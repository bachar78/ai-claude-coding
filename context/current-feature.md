# Current Feature

<!-- Feature Name and short description-->

**Dashboard Collections** - Replace the mock "Recent collections" grid in the dashboard main area with real data from Neon via Prisma. Items stay on mock data for now.

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

- Add `src/lib/db/collections.ts` with the data-fetching functions for collections (recent collections + the counts the dashboard needs).
- Fetch collections directly in the `/dashboard` server component (`src/app/dashboard/page.tsx` becomes `async`) — no API route, no client fetching.
- Derive each collection card's accent color from the item type it holds most of, falling back to `defaultType`, then to neutral (`#6b7280`) — matching §6.6 of the project overview.
- Show a small icon badge for every distinct item type in the collection (what `CollectionCard` already renders from `itemTypeIds`).
- Keep the existing design: type-tinted card, left border in the type color, favorite star, icon badges, item count. Reference `context/screenshots/dashboard-ui-main.png`.
- Update the stats display so the collection numbers (Collections, Favorite collections) come from the database.
- Leave the "Pinned" and "Recent items" sections on `src/lib/mock-data.ts` — items come in a later pass.
- Verify in the browser against the seeded demo data, then `npm run build` and `npx tsc --noEmit`.

## Notes

<!-- Any extra notes -->

- Spec: `context/features/dashboard-collections-spec.md`
- **No auth yet.** Every query is user-scoped but there is no session until milestone 1 (NextAuth). Resolve the demo user (`demo@devstash.io`) in one place — a small helper alongside the collection queries — so there is a single call site to swap for `auth()` later. Do not scatter the demo email through components.
- **Avoid the N+1 on dominant type.** Per §6.6, do not run a `groupBy` per card. One `groupBy` over `ItemCollection ⋈ Item` for all of the user's collections, joined in memory, is option (a) and the one to start with. Denormalising `dominantTypeId` onto `Collection` is explicitly deferred.
- **Types.** `CollectionCard` and `TypeIconBadge` are currently typed against `MockCollection` / `MockItemType`. The card needs a DB-shaped type (`src/types/collection.ts`, or exported from the query module) while the sidebar still passes mock collections — so `TypeIconBadge` needs a prop type both shapes satisfy. Keep the change minimal; don't migrate the sidebar in this pass.
- **Card shape mismatch to resolve:** the card reads `collection.description` as a non-null string, but `Collection.description` is nullable in the schema. Handle the null rather than forcing it.
- **Accent color:** the card currently picks `defaultTypeId ?? types[0]`. The spec's "most-used content type" means the dominant *item type*, so the fallback order becomes dominant → `defaultType` → neutral.
- The spec mentions "6 cards"; `RECENT_COLLECTIONS_LIMIT` is 8 and the seed has 5 collections, so all 5 render either way. Keep the limit at 8 unless the grid looks wrong.
- The sidebar's collections list is out of scope — the spec is about the main area on the right.

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Next.js setup** (Completed) - Scaffolded with Create Next App (Next.js 16, React 19, TypeScript, Tailwind CSS v4, ESLint). Removed boilerplate assets and starter page content, and added the `context/` docs (project overview, coding standards, AI interaction, current feature).
- **Dashboard UI Phase 1** (Completed) - Initialized shadcn/ui (`base-nova` preset on Base UI) with `button`, `input` and `kbd` components. Added the `/dashboard` route with a dark-by-default layout, a top bar (logo, search with ⌘K hint, "New collection" and "New item" buttons, display only), and placeholder sidebar and main areas. Fixed the self-referencing `--font-sans` variable from shadcn init to use Geist fonts.
- **Dashboard UI Phase 2** (Completed) - Added the shadcn `sidebar`, `avatar` and `collapsible` components (plus `sheet`, `tooltip`, `separator`, `skeleton`). Built a full-height, collapsible sidebar (icon mode, state persisted in a cookie, `⌘\` shortcut) with the logo, a collapse/expand toggle above Types, item types linking to `/items/[slug]` with item counts and a lock on Pro-only types, a collapsible "Collections" section with starred favorites and the 5 most recent collections (with item counts), and a user avatar area at the bottom. On mobile the sidebar is always a drawer opened from the top bar. Data comes from `src/lib/mock-data.ts` (added `updatedAt` to collections). Rewrote `use-mobile` with `useSyncExternalStore` to satisfy lint.
- **Dashboard UI Phase 3** (Completed) - Added the shadcn `card` and `badge` components. Built the main dashboard area (all server components) with a header, 4 stats cards (items, collections, favorite items, favorite collections), a "Recent collections" grid (up to 8, type-tinted cards with favorite star, type icons and item counts), "Pinned" items and up to 10 "Recent items". Item cards have a left border in the type color, type icon, pin/favorite markers, tags and date. Sections share a header with count badge, "View all" link and empty state. Type colors are applied through a `--type-color` CSS variable. Added `getItemTypeById` to `src/lib/mock-data.ts`.
- **Prisma + Neon PostgreSQL Setup** (Completed) - Installed Prisma `7.10.0` (pinned — npm's `latest` currently points at the `8.0.0-rc` line), `@prisma/adapter-pg`, `dotenv` and `tsx`. Added `prisma.config.ts` (Prisma 7 replacement for schema-level datasource config: schema path, migrations path, seed command, and the `DIRECT_URL` datasource with an optional shadow database). Wrote `prisma/schema.prisma` from §5.1 of the project overview — NextAuth models (`Account`, `Session`, `VerificationToken`), `User` with `Plan` enum and Stripe fields, `ItemType`, `Item`, `Collection`, `ItemCollection` and `Tag`, with user-scoped compound indexes and explicit `onDelete` rules. `searchVector` is deliberately deferred to the search milestone. Created the `20260919073303_init` migration with `--create-only`, hand-added the partial unique index `ItemType_system_slug_key ON "ItemType"("slug") WHERE "userId" IS NULL` (§5.3 — the compound unique cannot constrain system types because Postgres treats every NULL as distinct), then applied it. Added an idempotent `prisma/seed.ts` upserting the 7 system item types via find-then-write (Prisma `upsert` cannot target a partial index). Added the client singleton `src/lib/db.ts` using the required `PrismaPg` driver adapter on the pooled `DATABASE_URL`. Env split: `DATABASE_URL` pooled for runtime, `DIRECT_URL` unpooled for the CLI, documented in a committed `.env.example`. Gitignored `/src/generated`, added a `postinstall: prisma generate` script plus `db:*` scripts, and ESLint-ignored the generated client.
- **Seed Data** (Completed) - Rewrote `prisma/seed.ts` from `context/features/seed-spec.md`. Installed `bcryptjs` (v3 ships its own types, so no `@types/bcryptjs`). Seeds a demo user (`demo@devstash.io` / "Demo User", password `12345678` hashed at 12 rounds, `emailVerified` now, `plan: FREE`), the 7 system item types, and 5 collections holding 18 items: React Patterns (3 TypeScript snippets), AI Workflows (3 prompts), DevOps (1 snippet, 1 command, 2 links), Terminal Commands (4 commands), Design Resources (4 links). All link URLs are real and were checked for a 200. Items carry tags, and a few are pinned or favorited so the dashboard's Pinned and favorites sections are not empty. Resolved three spec/schema conflicts in favour of the existing code: `isPro` → `plan: "FREE"`, capitalised type names with plural slugs (AppSidebar renders `name` and routes on `slug`), and the link-before-file/image sort order so Pro-only types group last. Idempotency: system types use find-then-write (`upsert` cannot target the partial unique index), the user is a true `upsert`, and the demo user's items/collections/tags are cleared then rebuilt since items have no natural unique key — running the seed twice leaves 1 user, 5 collections, 18 items, 29 tags.
- **Dashboard Collections** (Completed) - Replaced the mock collections grid in the dashboard main area with real data from Neon. Added `src/lib/db/collections.ts` (`getRecentCollections`, `getCollectionStats`), `src/lib/db/user.ts` (`getCurrentUserId`, which resolves the seeded demo user by email and is the single call site to swap for `auth()` once NextAuth lands) and `src/types/collection.ts` (`CollectionSummary`, `ItemTypeBadge`, `CollectionStats`). A card's accent color now comes from the item type the collection holds most of, falling back to `defaultType` then neutral, and the icon badges show every distinct type, most-used first. Three queries per render and no N+1 (§6.6): collections, item types, and one raw-SQL `GROUP BY` over `ItemCollection ⋈ Item` covering every card at once — Prisma's `groupBy` cannot join, and the tally doubles as the item count so no separate count query is needed. `CollectionCard` takes `CollectionSummary` and handles the nullable `description`; `TypeIconBadge`'s prop type widened to `ItemTypeBadge` so it still serves the mock-data `ItemCard`. Renamed the section headings to "Collections" and "Items". Items, the sidebar's collections list and the Items/Favorite items stats stay on `src/lib/mock-data.ts` until the items pass. Verified against the seeded data: 5 collections, with DevOps taking emerald from 2 links over 1 snippet + 1 command.
