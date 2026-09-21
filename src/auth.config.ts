import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the split config: providers and callbacks only, no adapter.
 *
 * `src/proxy.ts` initialises NextAuth from this file alone so route protection
 * never pulls the Prisma client (and its Node-only driver) into the proxy
 * bundle. The adapter and session strategy live in `src/auth.ts`.
 *
 * @see https://authjs.dev/guides/edge-compatibility
 */
export default {
  // AUTH_GITHUB_ID / AUTH_GITHUB_SECRET are read from the environment
  // automatically — the provider needs no explicit options.
  providers: [GitHub],
  callbacks: {
    // No `authorized` callback on purpose: `src/proxy.ts` uses the wrapped form
    // (`auth(handler)`), and next-auth ignores the callback's return value
    // whenever a handler is supplied. The redirect rule lives in the proxy only.

    /** Carry the user id onto the token at sign-in so the session can expose it. */
    jwt({ token, user }) {
      if (user?.id) token.id = user.id;

      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id;

      return session;
    },
  },
} satisfies NextAuthConfig;
