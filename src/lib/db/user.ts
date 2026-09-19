import { cache } from "react";

import { prisma } from "@/lib/db";
import type { CurrentUser } from "@/types/user";

/** Seeded by `prisma/seed.ts`. */
const DEMO_USER_EMAIL = "demo@devstash.io";

/**
 * Stand-in for the session user until NextAuth lands (milestone 1). Every
 * query is user-scoped, so keeping this the single call site makes the swap to
 * `auth()` a one-file change.
 *
 * Cached for the request: the dashboard layout and page both resolve the user,
 * and React dedupes them into one query.
 *
 * Returns null on an unseeded database; callers render their empty state.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true, name: true, email: true, image: true, plan: true },
  });

  return user;
});

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();

  return user?.id ?? null;
}
