import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth()`, `useSession()` and `getSession()`.
   *
   * Every query in the app is user-scoped, so `user.id` has to be on the
   * session — the defaults only carry name, email and image. Intersecting with
   * `DefaultSession["user"]` keeps those, which a bare interface would
   * otherwise overwrite.
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// Augment `@auth/core/jwt`, not `next-auth/jwt`: the latter is a bare
// `export * from "@auth/core/jwt"`, so declaring a module for it defines a new
// ambient module instead of merging into the real `JWT` interface — and since
// `JWT extends Record<string, unknown>`, the mistake is silent, leaving
// `token.id` as `unknown` rather than failing to compile.
declare module "@auth/core/jwt" {
  /** Set by the `jwt` callback in `src/auth.config.ts`. */
  interface JWT {
    id?: string;
  }
}
