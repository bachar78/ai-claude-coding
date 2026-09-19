import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import type { ContentType } from "../src/generated/prisma/enums";

const DEMO_EMAIL = "demo@devstash.io";
const DEMO_PASSWORD = "12345678";
const BCRYPT_ROUNDS = 12;

interface SystemType {
  slug: string;
  name: string;
  contentType: ContentType;
  icon: string;
  color: string;
  sortOrder: number;
  isProOnly?: boolean;
}

// Icons and colors come from context/features/seed-spec.md. Names stay
// capitalised and slugs plural because AppSidebar renders `name` as the nav
// label and routes on `slug`. Pro-only types sort last.
const SYSTEM_TYPES: SystemType[] = [
  { slug: "snippets", name: "Snippet", contentType: "TEXT", icon: "Code", color: "#3b82f6", sortOrder: 0 },
  { slug: "prompts", name: "Prompt", contentType: "TEXT", icon: "Sparkles", color: "#8b5cf6", sortOrder: 1 },
  { slug: "commands", name: "Command", contentType: "TEXT", icon: "Terminal", color: "#f97316", sortOrder: 2 },
  { slug: "notes", name: "Note", contentType: "TEXT", icon: "StickyNote", color: "#fde047", sortOrder: 3 },
  { slug: "links", name: "Link", contentType: "URL", icon: "Link", color: "#10b981", sortOrder: 4 },
  { slug: "files", name: "File", contentType: "FILE", icon: "File", color: "#6b7280", sortOrder: 5, isProOnly: true },
  { slug: "images", name: "Image", contentType: "FILE", icon: "Image", color: "#ec4899", sortOrder: 6, isProOnly: true },
];

interface SeedItem {
  title: string;
  description: string;
  typeSlug: string;
  content?: string;
  language?: string;
  url?: string;
  tags: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
}

interface SeedCollection {
  name: string;
  description: string;
  defaultTypeSlug: string;
  isFavorite?: boolean;
  items: SeedItem[];
}

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    defaultTypeSlug: "snippets",
    isFavorite: true,
    items: [
      {
        title: "useDebounce",
        description: "Delays a rapidly changing value until it settles.",
        typeSlug: "snippets",
        language: "tsx",
        tags: ["react", "hooks", "typescript"],
        isPinned: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
      },
      {
        title: "useLocalStorage",
        description: "State that persists to localStorage and survives reloads.",
        typeSlug: "snippets",
        language: "tsx",
        tags: ["react", "hooks", "browser"],
        content: `import { useCallback, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [stored, setStored] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStored(value);
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Quota exceeded or storage blocked — keep the in-memory value.
      }
    },
    [key],
  );

  return [stored, setValue] as const;
}`,
      },
      {
        title: "Theme context provider",
        description: "Compound provider + typed hook that throws outside its tree.",
        typeSlug: "snippets",
        language: "tsx",
        tags: ["react", "context", "patterns"],
        isFavorite: true,
        content: `"use client";

import { createContext, useContext, useMemo, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  const value = useMemo(
    () => ({
      theme,
      toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    defaultTypeSlug: "prompts",
    items: [
      {
        title: "Thorough code review",
        description: "Reviews a diff for correctness first, style last.",
        typeSlug: "prompts",
        language: "markdown",
        tags: ["review", "quality"],
        isPinned: true,
        content: `You are reviewing a pull request. Work through it in this order and stop at the first section with nothing to report.

1. **Correctness** — logic errors, off-by-one, unhandled null/undefined, race conditions.
2. **Edge cases** — empty input, very large input, concurrent calls, network failure.
3. **Security** — missing authorization checks, unvalidated input, secrets in code.
4. **Performance** — N+1 queries, unnecessary re-renders, work inside loops.
5. **Style** — naming and formatting, only if it genuinely hurts readability.

For each finding give: the file and line, what breaks, and a concrete input that triggers it. Skip anything you cannot demonstrate. Do not restate what the code does.

Diff:
"""
{{diff}}
"""`,
      },
      {
        title: "Generate API documentation",
        description: "Turns a module into reference docs with runnable examples.",
        typeSlug: "prompts",
        language: "markdown",
        tags: ["docs", "writing"],
        content: `Write reference documentation for the module below.

For every exported function, class and type produce:
- A one-sentence summary of what it does.
- A parameter table: name, type, required, default, meaning.
- The return value and every error it can throw.
- A runnable example using realistic values, not \`foo\`/\`bar\`.

Rules: document only what exists in the source — never invent parameters. Note when a function mutates its arguments or performs I/O. Write for a developer who has not seen this codebase.

Source:
"""
{{source}}
"""`,
      },
      {
        title: "Refactoring assistant",
        description: "Proposes behaviour-preserving refactors, ranked by payoff.",
        typeSlug: "prompts",
        language: "markdown",
        tags: ["refactor", "quality"],
        content: `Propose refactorings for the code below. Behaviour must be preserved exactly — if a change alters observable behaviour, say so explicitly and treat it as a separate suggestion.

Rank each by payoff against effort, and for each give:
- The problem in one sentence (duplication, deep nesting, mixed responsibilities, unclear naming).
- The refactored code.
- What could break, and which test would catch it.

Prefer a few high-value changes to an exhaustive list. If the code is already clear, say so rather than inventing work.

Code:
"""
{{code}}
"""`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    defaultTypeSlug: "snippets",
    items: [
      {
        title: "Multi-stage Dockerfile for Next.js",
        description: "Standalone output, non-root user, minimal runtime layer.",
        typeSlug: "snippets",
        language: "dockerfile",
        tags: ["docker", "nextjs", "deployment"],
        content: `# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        title: "Deploy with migrations",
        description: "Applies pending migrations before starting the app.",
        typeSlug: "commands",
        language: "bash",
        tags: ["deployment", "prisma"],
        content: `set -euo pipefail

npx prisma migrate deploy
npx prisma generate
npm run build
npm run start`,
      },
      {
        title: "Docker documentation",
        description: "Official Docker reference and best practices.",
        typeSlug: "links",
        url: "https://docs.docker.com/",
        tags: ["docker", "reference"],
      },
      {
        title: "GitHub Actions documentation",
        description: "Workflow syntax, triggers and reusable actions.",
        typeSlug: "links",
        url: "https://docs.github.com/en/actions",
        tags: ["ci", "reference"],
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    defaultTypeSlug: "commands",
    isFavorite: true,
    items: [
      {
        title: "Undo the last commit, keep the changes",
        description: "Moves HEAD back one commit and leaves files staged.",
        typeSlug: "commands",
        language: "bash",
        tags: ["git"],
        isFavorite: true,
        content: `# Keep the changes staged
git reset --soft HEAD~1

# Keep the changes, unstaged
git reset HEAD~1

# Discard the changes entirely — cannot be undone
git reset --hard HEAD~1`,
      },
      {
        title: "Reclaim Docker disk space",
        description: "Removes stopped containers, unused images, networks and volumes.",
        typeSlug: "commands",
        language: "bash",
        tags: ["docker", "cleanup"],
        content: `# Show what is actually using space first
docker system df

# Remove stopped containers, dangling images and unused networks
docker system prune

# Also remove unused volumes — this deletes data
docker system prune --all --volumes`,
      },
      {
        title: "Find and kill the process on a port",
        description: "For when a dev server refuses to release port 3000.",
        typeSlug: "commands",
        language: "bash",
        tags: ["process", "macos", "linux"],
        isPinned: true,
        content: `# macOS / Linux — see what is listening
lsof -i :3000

# Kill it by port in one step
kill -9 $(lsof -t -i :3000)

# Linux alternative
fuser -k 3000/tcp`,
      },
      {
        title: "npm dependency housekeeping",
        description: "Audit, prune and find what is out of date.",
        typeSlug: "commands",
        language: "bash",
        tags: ["npm", "dependencies"],
        content: `# What is outdated, and how far behind
npm outdated

# Why is this package installed at all
npm why <package>

# Security advisories, and the safe subset of fixes
npm audit
npm audit fix

# Reproducible install from the lockfile
npm ci`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    defaultTypeSlug: "links",
    items: [
      {
        title: "Tailwind CSS documentation",
        description: "Utility reference and the v4 CSS-first configuration.",
        typeSlug: "links",
        url: "https://tailwindcss.com/docs",
        tags: ["css", "tailwind", "reference"],
        isFavorite: true,
      },
      {
        title: "shadcn/ui",
        description: "Copy-in React components built on Radix and Tailwind.",
        typeSlug: "links",
        url: "https://ui.shadcn.com",
        tags: ["components", "react"],
      },
      {
        title: "Primer design system",
        description: "GitHub's design system — tokens, patterns and guidelines.",
        typeSlug: "links",
        url: "https://primer.style/",
        tags: ["design-system", "reference"],
      },
      {
        title: "Lucide icons",
        description: "The open-source icon set DevStash uses for item types.",
        typeSlug: "links",
        url: "https://lucide.dev/icons/",
        tags: ["icons", "reference"],
      },
    ],
  },
];

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

async function seedSystemTypes() {
  const typeIdsBySlug = new Map<string, string>();

  for (const type of SYSTEM_TYPES) {
    const data = {
      name: type.name,
      contentType: type.contentType,
      icon: type.icon,
      color: type.color,
      sortOrder: type.sortOrder,
      isProOnly: type.isProOnly ?? false,
      isSystem: true,
    };

    // `upsert` can't target the partial unique index on (slug WHERE userId IS
    // NULL), so find-then-write keeps this idempotent across re-runs.
    const existing = await prisma.itemType.findFirst({
      where: { slug: type.slug, userId: null },
      select: { id: true },
    });

    const row = existing
      ? await prisma.itemType.update({ where: { id: existing.id }, data })
      : await prisma.itemType.create({
          data: { ...data, slug: type.slug, userId: null },
        });

    typeIdsBySlug.set(type.slug, row.id);
  }

  return typeIdsBySlug;
}

async function seedDemoUser() {
  const passwordHash = await hash(DEMO_PASSWORD, BCRYPT_ROUNDS);

  return prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: "Demo User", passwordHash, emailVerified: new Date() },
    create: {
      email: DEMO_EMAIL,
      name: "Demo User",
      passwordHash,
      emailVerified: new Date(),
      plan: "FREE",
    },
  });
}

async function seedContent(userId: string, typeIdsBySlug: Map<string, string>) {
  // Items carry no natural unique key, so re-running would duplicate them.
  // Clearing the demo user's content first makes the seed idempotent; the
  // ItemCollection join rows and tag links go with it via onDelete: Cascade.
  await prisma.item.deleteMany({ where: { userId } });
  await prisma.collection.deleteMany({ where: { userId } });
  await prisma.tag.deleteMany({ where: { userId } });

  let itemCount = 0;

  for (const collection of COLLECTIONS) {
    const created = await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite ?? false,
        defaultTypeId: typeIdsBySlug.get(collection.defaultTypeSlug),
        userId,
      },
    });

    for (const item of collection.items) {
      const itemTypeId = typeIdsBySlug.get(item.typeSlug);
      if (!itemTypeId) throw new Error(`Unknown item type: ${item.typeSlug}`);

      await prisma.item.create({
        data: {
          title: item.title,
          description: item.description,
          content: item.content ?? null,
          language: item.language ?? null,
          url: item.url ?? null,
          isPinned: item.isPinned ?? false,
          isFavorite: item.isFavorite ?? false,
          userId,
          itemTypeId,
          collections: { create: { collectionId: created.id } },
          tags: {
            connectOrCreate: item.tags.map((name) => ({
              where: { userId_name: { userId, name } },
              create: { name, userId },
            })),
          },
        },
      });
      itemCount += 1;
    }
  }

  return itemCount;
}

async function main() {
  const typeIdsBySlug = await seedSystemTypes();
  console.log(`system item types  ${typeIdsBySlug.size}`);

  const user = await seedDemoUser();
  console.log(`demo user          ${user.email}`);

  const itemCount = await seedContent(user.id, typeIdsBySlug);
  console.log(`collections        ${COLLECTIONS.length}`);
  console.log(`items              ${itemCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
