import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import authConfig from "@/auth.config";
import { prisma } from "@/lib/db";

/**
 * Full NextAuth instance — the adapter half of the split config. Import `auth`
 * from here in server components, route handlers and server actions; the proxy
 * imports `auth.config.ts` directly instead.
 *
 * `strategy: "jwt"` is required, not preference: Prisma's driver adapter cannot
 * run in the proxy, so the session has to be readable from the token alone.
 * The `Session` table stays in the schema for adapter compatibility but is
 * unused (project-overview §11.1).
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
