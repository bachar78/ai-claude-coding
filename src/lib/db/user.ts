import { prisma } from "@/lib/db";

/** Seeded by `prisma/seed.ts`. */
const DEMO_USER_EMAIL = "demo@devstash.io";

/**
 * Stand-in for the session user until NextAuth lands (milestone 1). Every
 * query is user-scoped, so keeping this the single call site makes the swap to
 * `auth()` a one-file change.
 *
 * Returns null on an unseeded database; callers render their empty state.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  return user?.id ?? null;
}
