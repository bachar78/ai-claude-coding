export type ContentType = "TEXT" | "URL" | "FILE";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  plan: "FREE" | "PRO";
}

export interface MockItemType {
  id: string;
  name: string;
  slug: string;
  contentType: ContentType;
  icon: string;
  color: string;
  isProOnly: boolean;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  itemCount: number;
  itemTypeIds: string[];
  defaultTypeId: string | null;
  updatedAt: string;
}

export interface MockItem {
  id: string;
  title: string;
  description: string;
  content: string | null;
  language: string | null;
  url: string | null;
  itemTypeId: string;
  collectionIds: string[];
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const currentUser: MockUser = {
  id: "user_1",
  name: "Jordan Doe",
  email: "demo@devstash.io",
  image: null,
  plan: "FREE",
};

export const itemTypes: MockItemType[] = [
  { id: "type_snippet", name: "Snippet", slug: "snippets", contentType: "TEXT", icon: "Code", color: "#3b82f6", isProOnly: false },
  { id: "type_prompt", name: "Prompt", slug: "prompts", contentType: "TEXT", icon: "Sparkles", color: "#8b5cf6", isProOnly: false },
  { id: "type_command", name: "Command", slug: "commands", contentType: "TEXT", icon: "Terminal", color: "#f97316", isProOnly: false },
  { id: "type_note", name: "Note", slug: "notes", contentType: "TEXT", icon: "StickyNote", color: "#fde047", isProOnly: false },
  { id: "type_link", name: "Link", slug: "links", contentType: "URL", icon: "Link", color: "#10b981", isProOnly: false },
  { id: "type_file", name: "File", slug: "files", contentType: "FILE", icon: "File", color: "#6b7280", isProOnly: true },
  { id: "type_image", name: "Image", slug: "images", contentType: "FILE", icon: "Image", color: "#ec4899", isProOnly: true },
];

const itemTypeById = new Map(itemTypes.map((type) => [type.id, type]));

export function getItemTypeById(id: string): MockItemType | undefined {
  return itemTypeById.get(id);
}

export const collections: MockCollection[] = [
  {
    id: "col_react",
    name: "React Patterns",
    description: "Hooks, composition and rendering tricks I reuse constantly.",
    isFavorite: true,
    itemCount: 24,
    itemTypeIds: ["type_snippet", "type_note"],
    defaultTypeId: "type_snippet",
    updatedAt: "2026-09-12T16:20:00.000Z",
  },
  {
    id: "col_ai",
    name: "AI Prompts",
    description: "System messages and prompt scaffolds for coding agents.",
    isFavorite: true,
    itemCount: 18,
    itemTypeIds: ["type_prompt"],
    defaultTypeId: "type_prompt",
    updatedAt: "2026-09-13T08:45:00.000Z",
  },
  {
    id: "col_shell",
    name: "Shell & DevOps",
    description: "Docker, git and one-liners I always forget.",
    isFavorite: false,
    itemCount: 31,
    itemTypeIds: ["type_command"],
    defaultTypeId: "type_command",
    updatedAt: "2026-09-11T19:05:00.000Z",
  },
  {
    id: "col_interview",
    name: "Interview Prep",
    description: "Algorithms, system design notes and talking points.",
    isFavorite: false,
    itemCount: 12,
    itemTypeIds: ["type_note"],
    defaultTypeId: "type_note",
    updatedAt: "2026-08-22T12:30:00.000Z",
  },
  {
    id: "col_reading",
    name: "Reading List",
    description: "Articles, RFCs and docs worth a second pass.",
    isFavorite: false,
    itemCount: 9,
    itemTypeIds: ["type_link"],
    defaultTypeId: "type_link",
    updatedAt: "2026-09-05T10:00:00.000Z",
  },
  {
    id: "col_design",
    name: "Design Assets",
    description: "Logos, references and exported mockups.",
    isFavorite: false,
    itemCount: 7,
    itemTypeIds: ["type_image"],
    defaultTypeId: "type_image",
    updatedAt: "2026-07-30T09:00:00.000Z",
  },
  {
    id: "col_boilerplates",
    name: "Boilerplates",
    description: "Starters and config files for new projects.",
    isFavorite: false,
    itemCount: 15,
    itemTypeIds: ["type_file"],
    defaultTypeId: "type_file",
    updatedAt: "2026-07-15T14:00:00.000Z",
  },
  {
    id: "col_postgres",
    name: "Postgres Notes",
    description: "Query patterns, indexing and full-text search tips.",
    isFavorite: true,
    itemCount: 6,
    itemTypeIds: ["type_note", "type_link"],
    defaultTypeId: "type_note",
    updatedAt: "2026-09-08T15:25:00.000Z",
  },
];

export const items: MockItem[] = [
  {
    id: "item_use_debounce",
    title: "useDebounce hook",
    description: "Debounce any fast-changing value with a configurable delay.",
    content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
    language: "tsx",
    url: null,
    itemTypeId: "type_snippet",
    collectionIds: ["col_react"],
    tags: ["react", "hooks", "performance"],
    isFavorite: true,
    isPinned: true,
    lastUsedAt: "2026-09-12T16:20:00.000Z",
    createdAt: "2026-08-02T10:00:00.000Z",
    updatedAt: "2026-09-10T09:15:00.000Z",
  },
  {
    id: "item_code_reviewer",
    title: "Senior code reviewer",
    description: "System prompt that reviews diffs like a staff engineer.",
    content:
      "You are a senior staff engineer reviewing a pull request. Focus on correctness, security and maintainability. For each issue, cite the line, explain the risk and suggest a concrete fix. Skip nitpicks about formatting.",
    language: null,
    url: null,
    itemTypeId: "type_prompt",
    collectionIds: ["col_ai"],
    tags: ["code-review", "system-prompt"],
    isFavorite: true,
    isPinned: true,
    lastUsedAt: "2026-09-13T08:45:00.000Z",
    createdAt: "2026-07-21T14:30:00.000Z",
    updatedAt: "2026-09-01T11:00:00.000Z",
  },
  {
    id: "item_docker_prune",
    title: "Clean up Docker",
    description: "Remove stopped containers, dangling images and unused volumes.",
    content: "docker system prune -a --volumes",
    language: "bash",
    url: null,
    itemTypeId: "type_command",
    collectionIds: ["col_shell"],
    tags: ["docker", "cleanup"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-09-11T19:05:00.000Z",
    createdAt: "2026-06-14T09:00:00.000Z",
    updatedAt: "2026-06-14T09:00:00.000Z",
  },
  {
    id: "item_git_undo",
    title: "Undo last commit (keep changes)",
    description: "Soft reset the last commit while keeping the working tree.",
    content: "git reset --soft HEAD~1",
    language: "bash",
    url: null,
    itemTypeId: "type_command",
    collectionIds: ["col_shell"],
    tags: ["git"],
    isFavorite: true,
    isPinned: false,
    lastUsedAt: "2026-09-09T13:40:00.000Z",
    createdAt: "2026-05-03T17:20:00.000Z",
    updatedAt: "2026-05-03T17:20:00.000Z",
  },
  {
    id: "item_big_o",
    title: "Big-O cheat sheet",
    description: "Time and space complexity for common data structures.",
    content:
      "## Arrays\n- Access: O(1)\n- Search: O(n)\n- Insert/Delete: O(n)\n\n## Hash maps\n- Access/Insert/Delete: O(1) average\n\n## Binary search tree\n- Search/Insert/Delete: O(log n) balanced, O(n) worst",
    language: "markdown",
    url: null,
    itemTypeId: "type_note",
    collectionIds: ["col_interview"],
    tags: ["algorithms", "interview"],
    isFavorite: false,
    isPinned: false,
    lastUsedAt: "2026-09-07T10:10:00.000Z",
    createdAt: "2026-04-18T08:00:00.000Z",
    updatedAt: "2026-08-22T12:30:00.000Z",
  },
  {
    id: "item_pg_fts",
    title: "Postgres full-text search docs",
    description: "Official guide to tsvector, tsquery and ranking.",
    content: null,
    language: null,
    url: "https://www.postgresql.org/docs/current/textsearch.html",
    itemTypeId: "type_link",
    collectionIds: ["col_postgres", "col_reading"],
    tags: ["postgres", "search"],
    isFavorite: true,
    isPinned: false,
    lastUsedAt: "2026-09-08T15:25:00.000Z",
    createdAt: "2026-08-30T20:00:00.000Z",
    updatedAt: "2026-08-30T20:00:00.000Z",
  },
];
