# Current Feature

<!-- Feature Name and short description-->

## Status

<!-- Not Started|In Progress|Completed -->

Completed

## Goals

<!-- Goals & requirements -->

## Notes

<!-- Any extra notes -->

## History

<!-- Keep this updated. Earliest to latest -->

- **Initial Next.js setup** (Completed) - Scaffolded with Create Next App (Next.js 16, React 19, TypeScript, Tailwind CSS v4, ESLint). Removed boilerplate assets and starter page content, and added the `context/` docs (project overview, coding standards, AI interaction, current feature).
- **Dashboard UI Phase 1** (Completed) - Initialized shadcn/ui (`base-nova` preset on Base UI) with `button`, `input` and `kbd` components. Added the `/dashboard` route with a dark-by-default layout, a top bar (logo, search with ⌘K hint, "New collection" and "New item" buttons, display only), and placeholder sidebar and main areas. Fixed the self-referencing `--font-sans` variable from shadcn init to use Geist fonts.
- **Dashboard UI Phase 2** (Completed) - Added the shadcn `sidebar`, `avatar` and `collapsible` components (plus `sheet`, `tooltip`, `separator`, `skeleton`). Built a full-height, collapsible sidebar (icon mode, state persisted in a cookie, `⌘\` shortcut) with the logo, a collapse/expand toggle above Types, item types linking to `/items/[slug]` with item counts and a lock on Pro-only types, a collapsible "Collections" section with starred favorites and the 5 most recent collections (with item counts), and a user avatar area at the bottom. On mobile the sidebar is always a drawer opened from the top bar. Data comes from `src/lib/mock-data.ts` (added `updatedAt` to collections). Rewrote `use-mobile` with `useSyncExternalStore` to satisfy lint.
- **Dashboard UI Phase 3** (Completed) - Added the shadcn `card` and `badge` components. Built the main dashboard area (all server components) with a header, 4 stats cards (items, collections, favorite items, favorite collections), a "Recent collections" grid (up to 8, type-tinted cards with favorite star, type icons and item counts), "Pinned" items and up to 10 "Recent items". Item cards have a left border in the type color, type icon, pin/favorite markers, tags and date. Sections share a header with count badge, "View all" link and empty state. Type colors are applied through a `--type-color` CSS variable. Added `getItemTypeById` to `src/lib/mock-data.ts`.
